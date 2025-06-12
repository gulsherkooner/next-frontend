import React, { useRef, useState, useEffect, useCallback } from 'react';
import Peer from 'simple-peer';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone } from 'lucide-react';

const CallManager = ({
  currentUserId,
  remoteUserId,
  isVideo,
  onClose,
  incomingSignal,
  socket
}) => {
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [caller, setCaller] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [remoteStream, setRemoteStream] = useState(null);

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);
  const timerRef = useRef(null);

  // Debug logs for stream states
  useEffect(() => {
    if (stream && myVideo.current) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteStream && userVideo.current) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // 1. Setup media stream
  useEffect(() => {
    let streamCleanup = () => { };

    const setupStream = async () => {
      try {
        setCallStatus('Accessing media devices...');
        const constraints = {
          video: isVideo ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          } : false,
          audio: true
        };

        const currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
          myVideo.current.onloadedmetadata = () => {
            myVideo.current.play().catch(e => console.error('Local video play error:', e));
          };
        }

        streamCleanup = () => {
          currentStream.getTracks().forEach(track => track.stop());
        };

        setCallStatus('Ready to call');
      } catch (err) {
        console.error('Media device error:', err);
        setCallStatus(`Error: ${err.message}`);
      }
    };

    setupStream();
    return () => {
      streamCleanup();
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, [isVideo]);

  // 2. Handle socket events
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      if (callAccepted || callEnded) return;

      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setCallStatus(`Incoming ${data.isVideo ? 'Video' : 'Audio'} Call`);
    };

    const handleCallAccepted = (data) => {
      if (!peerConnection || peerConnection.destroyed) {
        console.warn('No active peer connection to signal');
        return;
      }

      try {
        peerConnection.signal(data.signal);
      } catch (err) {
        console.error('Error signaling peer:', err);
        setCallStatus('Connection error');
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
  }, [socket, callAccepted, callEnded, peerConnection]);

  // 3. Initialize outgoing call when ready
  useEffect(() => {
    if (remoteUserId && !receivingCall && !caller && stream && callStatus === 'Ready to call') {
      callUser();
    }
  }, [remoteUserId, receivingCall, caller, stream, callStatus]);

  // 4. Create peer connection
  const createPeer = useCallback((initiator) => {
    const peer = new Peer({
      initiator,
      stream: stream,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (data) => {
      if (initiator) {
        socket.emit('call-user', {
          userToCall: remoteUserId,
          signalData: data,
          from: currentUserId,
          isVideo
        });
        setCallStatus('Ringing...');
      } else {
        socket.emit('accept-call', {
          signal: data,
          to: caller,
          isVideo
        });
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
      setCallAccepted(true);
      setCallStatus('Connected');
      startCallTimer();
    });

    

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
      setCallStatus('Connection failed');
      leaveCall();
    });

   

    setPeerConnection(peer);
    return peer;
  }, [stream, socket, remoteUserId, currentUserId, caller, isVideo]);

  // 5. Initiate call
  const callUser = useCallback(() => {
    if (!stream) {
      return;
    }

    setCallStatus('Starting call...');
    const peer = createPeer(true);
    connectionRef.current = peer;
  }, [stream, remoteUserId, createPeer]);

  // 6. Answer call
  const answerCall = useCallback(() => {
    if (!stream || !callerSignal) {
      return;
    }

    setCallStatus('Connecting...');
    const peer = createPeer(false);
    peer.signal(callerSignal);
    connectionRef.current = peer;
  }, [stream, callerSignal, caller, createPeer]);

  // 7. End call
  const leaveCall = useCallback(() => {
    setCallEnded(true);
    clearInterval(timerRef.current);

    if (peerConnection && !peerConnection.destroyed) {
      peerConnection.destroy();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    socket.emit('end-call', { to: callAccepted ? remoteUserId : caller });
    onClose();
  }, [peerConnection, stream, socket, callAccepted, remoteUserId, caller, onClose]);

  // Timer functions
  const startCallTimer = () => {
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle mute
  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote Video - Always render the video element */}
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
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <p className="text-xl font-medium">
                  {receivingCall ? caller : remoteUserId}
                </p>
                <p className="text-gray-300">{callStatus}</p>
                {callDuration > 0 && (
                  <p className="text-gray-400 mt-2">
                    {formatDuration(callDuration)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Local Video */}
        {isVideo && stream && (
          <div className="absolute top-4 right-4 w-48 h-32 rounded-lg overflow-hidden border-2 border-white shadow-lg z-20">
            <video
              ref={myVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              You
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 bg-opacity-70 p-4 flex justify-center items-center space-x-6">
        {!callAccepted && receivingCall ? (
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
              className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} text-white transition`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
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