import React, { useRef, useState, useEffect, useCallback } from 'react';
import Peer from 'simple-peer';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone, ScreenShare, ScreenShareOff, Monitor, MonitorOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CallManager = ({
  currentUserId,
  remoteUserId,
  isVideo,
  onClose,
  incomingSignal,
  profileImg,
  displayName,
  socket
}) => {
  // State management
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [callState, setCallState] = useState({
    status: 'initializing',
    accepted: false,
    ended: false,
    receiving: false,
    muted: false,
    videoEnabled: isVideo,
    screenSharing: false,
    duration: 0,
    connectionQuality: 'good',
    stats: null
  });
  const [callerSignal, setCallerSignal] = useState(null);
  const [caller, setCaller] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [iceCandidates, setIceCandidates] = useState([]);

  // Refs
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const screenShareVideo = useRef(null);
  const connectionRef = useRef(null);
  const timerRef = useRef(null);
  const statsIntervalRef = useRef(null);
  const peerRef = useRef(null);

  // Debug logs
  useEffect(() => {
    console.log('Call state changed:', callState);
  }, [callState]);

  // In CallManager.jsx, update the setupMediaStream function and its useEffect:

  const setupMediaStream = useCallback(async () => {
    let streamCleanup = () => { }; // Default empty cleanup function

    try {
      setCallState(prev => ({ ...prev, status: 'accessing_media' }));

      const constraints = {
        video: callState.videoEnabled ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 24, max: 30 }
        } : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(currentStream);

      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
        myVideo.current.onloadedmetadata = () => {
          myVideo.current.play().catch(e => console.error('Local video play error:', e));
        };
      }

      setCallState(prev => ({ ...prev, status: 'ready' }));

      // Set the actual cleanup function
      streamCleanup = () => {
        currentStream.getTracks().forEach(track => track.stop());
      };
    } catch (err) {
      console.error('Media device error:', err);
      setCallState(prev => ({ ...prev, status: `error: ${err.message}` }));
      toast.error(`Media Error: ${err.message}`);
    }

    // Always return a cleanup function
    return () => {
      streamCleanup();
    };
  }, [callState.videoEnabled]);

  // Update the useEffect to handle the cleanup properly
  useEffect(() => {
    const cleanupPromise = setupMediaStream();

    return () => {
      // Handle both the cleanup function and any potential Promise
      if (typeof cleanupPromise === 'function') {
        cleanupPromise();
      } else if (cleanupPromise && typeof cleanupPromise.then === 'function') {
        cleanupPromise.then(cleanup => {
          if (typeof cleanup === 'function') {
            cleanup();
          }
        });
      }

      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [setupMediaStream]);

  // Screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (callState.screenSharing) {
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
        setCallState(prev => ({ ...prev, screenSharing: false }));

        if (peerRef.current) {
          peerRef.current.removeStream(screenStream);
          peerRef.current.addStream(stream);
        }
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };

        setScreenStream(screenStream);
        setCallState(prev => ({ ...prev, screenSharing: true }));

        if (screenShareVideo.current) {
          screenShareVideo.current.srcObject = screenStream;
          screenShareVideo.current.onloadedmetadata = () => {
            screenShareVideo.current.play();
          };
        }

        if (peerRef.current) {
          peerRef.current.removeStream(stream);
          peerRef.current.addStream(screenStream);
        }
      }
    } catch (err) {
      console.error('Screen share error:', err);
      toast.error('Failed to share screen');
    }
  }, [callState.screenSharing, stream, screenStream]);

  // Peer connection creation
  const createPeerConnection = useCallback((initiator) => {
    const peer = new Peer({
      initiator,
      stream: callState.screenSharing ? screenStream : stream,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          {
            urls: 'turn:numb.viagenie.ca',
            username: 'webrtc@live.com',
            credential: 'muazkh'
          }
        ]
      },
      sdpTransform: (sdp) => {
        // Bandwidth optimization
        return sdp
          .replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:500\r\n')
          .replace(/a=mid:audio\r\n/g, 'a=mid:audio\r\nb=AS:50\r\n');
      }
    });

    peer.on('signal', (data) => {
      if (data.type === 'offer' || data.type === 'answer') {
        if (initiator) {
          socket.emit('call-user', {
            userToCall: remoteUserId,
            signalData: data,
            from: currentUserId,
            isVideo: callState.videoEnabled
          });
          setCallState(prev => ({ ...prev, status: 'ringing' }));
        } else {
          socket.emit('accept-call', {
            signal: data,
            to: caller,
            isVideo: callState.videoEnabled
          });
        }
      } else if (data.type === 'candidate') {
        // Collect ICE candidates for reconnection
        setIceCandidates(prev => [...prev, data]);
      }
    });

    peer.on('stream', (incomingStream) => {
      setRemoteStream(incomingStream);
      if (userVideo.current) {
        userVideo.current.srcObject = incomingStream;
        userVideo.current.onloadedmetadata = () => {
          userVideo.current.play().catch(e => console.error('Remote video play error:', e));
        };
      }
      setCallState(prev => ({ ...prev, accepted: true, status: 'connected' }));
      startCallTimer();
      startStatsCollection(peer);
    });

    peer.on('connect', () => {
      console.log('Peer connected');
      setCallState(prev => ({ ...prev, connectionQuality: 'good' }));
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
      setCallState(prev => ({ ...prev, status: 'connection_error', connectionQuality: 'poor' }));
      toast.error('Connection error occurred');
      attemptReconnect();
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
      if (!callState.ended) {
        attemptReconnect();
      }
    });

    peerRef.current = peer;
    return peer;
  }, [stream, screenStream, callState.videoEnabled, remoteUserId, currentUserId, caller, socket]);

  // Reconnection logic
  const attemptReconnect = useCallback(() => {
    if (callState.ended) return;

    setCallState(prev => ({ ...prev, status: 'reconnecting' }));
    toast('Connection lost, attempting to reconnect...', { icon: '🔃' });

    setTimeout(() => {
      if (callState.accepted) {
        // As the call was already accepted, we'll reinitialize the connection
        const peer = createPeerConnection(false);
        connectionRef.current = peer;

        // Re-add any ICE candidates
        iceCandidates.forEach(candidate => {
          peer.signal(candidate);
        });
      }
    }, 2000);
  }, [callState.ended, callState.accepted, iceCandidates, createPeerConnection]);

  // Call quality monitoring
  const startStatsCollection = useCallback((peer) => {
    if (!peer || !peer._pc) return;

    statsIntervalRef.current = setInterval(async () => {
      try {
        const stats = await peer._pc.getStats();
        let videoStats = null;
        let audioStats = null;

        stats.forEach(report => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            videoStats = {
              packetsLost: report.packetsLost,
              jitter: report.jitter,
              bitrate: (report.bytesReceived * 8) / (1024 * 1000) // Mbps
            };
          }
          if (report.type === 'inbound-rtp' && report.kind === 'audio') {
            audioStats = {
              packetsLost: report.packetsLost,
              jitter: report.jitter
            };
          }
        });

        const newQuality = determineConnectionQuality(videoStats, audioStats);
        setCallState(prev => ({
          ...prev,
          connectionQuality: newQuality,
          stats: { video: videoStats, audio: audioStats }
        }));
      } catch (err) {
        console.error('Error getting stats:', err);
      }
    }, 5000);
  }, []);

  const determineConnectionQuality = (videoStats, audioStats) => {
    if (!videoStats || !audioStats) return 'unknown';

    const videoPacketLoss = (videoStats.packetsLost / (videoStats.packetsLost + 100)) * 100;
    const audioPacketLoss = (audioStats.packetsLost / (audioStats.packetsLost + 100)) * 100;

    if (videoPacketLoss > 10 || audioPacketLoss > 5) {
      return 'poor';
    } else if (videoPacketLoss > 5 || audioPacketLoss > 2) {
      return 'average';
    }
    return 'good';
  };

  // Call timer
  const startCallTimer = useCallback(() => {
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setCallState(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);
  }, []);

  // Call initiation
  const callUser = useCallback(() => {
    if (!stream) return;

    setCallState(prev => ({ ...prev, status: 'starting_call' }));
    const peer = createPeerConnection(true);
    connectionRef.current = peer;
  }, [stream, createPeerConnection]);

  // Call answering
  const answerCall = useCallback(() => {
    if (!stream || !callerSignal) return;

    setCallState(prev => ({ ...prev, status: 'connecting' }));
    const peer = createPeerConnection(false);
    peer.signal(callerSignal);
    connectionRef.current = peer;
  }, [stream, callerSignal, createPeerConnection]);

  // Call ending
  const leaveCall = useCallback(() => {
    setCallState(prev => ({ ...prev, ended: true }));
    clearInterval(timerRef.current);
    clearInterval(statsIntervalRef.current);

    if (peerRef.current && !peerRef.current.destroyed) {
      peerRef.current.destroy();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }

    socket.emit('end-call', { to: callState.accepted ? remoteUserId : caller });
    onClose();
  }, [peerRef, stream, screenStream, socket, callState.accepted, remoteUserId, caller, onClose]);

  // Toggle media controls
  const toggleMute = useCallback(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setCallState(prev => ({ ...prev, muted: !prev.muted }));
    }
  }, [stream]);

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setCallState(prev => ({ ...prev, videoEnabled: !prev.videoEnabled }));
    }
  }, [stream]);

  // Socket event handling
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      if (callState.accepted || callState.ended) return;

      setCallState(prev => ({ ...prev, receiving: true }));
      setCaller(data.from);
      setCallerSignal(data.signal);
      setCallState(prev => ({
        ...prev,
        status: `incoming_${data.isVideo ? 'video' : 'audio'}_call`,
        videoEnabled: data.isVideo
      }));
    };

    const handleCallAccepted = (data) => {
      if (!peerRef.current || peerRef.current.destroyed) {
        console.warn('No active peer connection to signal');
        return;
      }

      try {
        peerRef.current.signal(data.signal);
      } catch (err) {
        console.error('Error signaling peer:', err);
        setCallState(prev => ({ ...prev, status: 'connection_error' }));
        leaveCall();
      }
    };

    const handleCallEnded = () => {
      leaveCall();
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-ended', handleCallEnded);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-ended', handleCallEnded);
    };
  }, [socket, callState.accepted, callState.ended, leaveCall]);

  // Initialize media stream
  useEffect(() => {
    let cleanupFn = () => { };

    (async () => {
      const maybeCleanup = await setupMediaStream();
      if (typeof maybeCleanup === 'function') {
        cleanupFn = maybeCleanup;
      }
    })();

    return () => {
      cleanupFn();
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [setupMediaStream]);


  // Initialize outgoing call when ready
  useEffect(() => {
    if (remoteUserId && !callState.receiving && !caller && stream && callState.status === 'ready') {
      callUser();
    }
  }, [remoteUserId, callState.receiving, caller, stream, callState.status, callUser]);

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Status messages
  const getStatusMessage = () => {
    switch (callState.status) {
      case 'initializing': return 'Initializing call...';
      case 'accessing_media': return 'Accessing camera/microphone...';
      case 'ready': return 'Ready to call';
      case 'starting_call': return 'Starting call...';
      case 'ringing': return 'Ringing...';
      case 'incoming_video_call': return 'Incoming video call';
      case 'incoming_audio_call': return 'Incoming voice call';
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected';
      case 'reconnecting': return 'Reconnecting...';
      case 'connection_error': return 'Connection error';
      default: return callState.status;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote Video */}
        <div className="absolute inset-0 bg-gray-800">
          <video
            ref={userVideo}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStream && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <img
                  src={profileImg}
                  alt={displayName}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
                />
                <p className="text-xl font-medium">{displayName}</p>
                <p className="text-gray-300">{getStatusMessage()}</p>
                {callState.duration > 0 && (
                  <p className="text-gray-400 mt-2">
                    {formatDuration(callState.duration)}
                  </p>
                )}
                {callState.connectionQuality !== 'good' && (
                  <p className="text-yellow-400 mt-1">
                    Connection quality: {callState.connectionQuality}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Local Video */}
        {callState.videoEnabled && stream && (
          <div className="absolute top-4 right-4 w-40 h-28 md:w-48 md:h-32 rounded-lg overflow-hidden border-2 border-white shadow-lg z-20">
            <video
              ref={myVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain md:object-cover"
            />
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              You
            </div>
          </div>
        )}

        {/* Screen Share Preview */}
        {callState.screenSharing && screenStream && (
          <div className="absolute bottom-4 right-4 w-64 h-48 rounded-lg overflow-hidden border-2 border-white shadow-lg z-20 bg-black">
            <video
              ref={screenShareVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              Screen
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 bg-opacity-70 p-4 flex justify-center items-center space-x-6 flex-wrap">
        {!callState.accepted && callState.receiving ? (
          <>
            <button
              onClick={answerCall}
              className="p-3 bg-green-500 rounded-full text-white hover:bg-green-600 transition"
              title="Accept call"
            >
              <Phone size={24} />
            </button>
            <button
              onClick={leaveCall}
              className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
              title="Decline call"
            >
              <PhoneOff size={24} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${callState.muted ? 'bg-red-500' : 'bg-gray-700'} text-white transition`}
              title={callState.muted ? 'Unmute' : 'Mute'}
            >
              {callState.muted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {isVideo && (
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${!callState.videoEnabled ? 'bg-red-500' : 'bg-gray-700'} text-white transition`}
                title={callState.videoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {callState.videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
            )}

            {callState.accepted && (
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full ${callState.screenSharing ? 'bg-blue-500' : 'bg-gray-700'} text-white transition`}
                title={callState.screenSharing ? 'Stop sharing' : 'Share screen'}
              >
                {callState.screenSharing ? <ScreenShareOff size={24} /> : <ScreenShare size={24} />}
              </button>
            )}

            <button
              onClick={leaveCall}
              className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
              title="End call"
            >
              <PhoneOff size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CallManager;