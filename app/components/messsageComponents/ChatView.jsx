import React, { useEffect, useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { getCookie } from '../../lib/utils/cookie';
import CallManager from './CallManager';
import { useReactMediaRecorder } from "react-media-recorder";
import {
  ArrowLeft,
  Smile,
  Paperclip,
  X,
  Check,
  Plus,
  Mic,
  Image as ImageIcon,
  Video,
  SendHorizonal,
  CirclePause,
  Phone,
  PhoneOff
} from 'lucide-react';
const ChatView = ({ contact, messages, onSendMessage, isTyping, typingUser, onStopTyping, onStartTyping, userpic, user_id, socket ,onback}) => {
  const [message, setMessage] = useState('');
  const token = getCookie("accessToken");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState(null);
  const startAudioRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    setWaveformData([]);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#3b82f6";
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    const animation = setInterval(draw, 100);
    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.onstop = async () => {
      clearInterval(animation);
      clearInterval(intervalRef.current);
      const blob = new Blob(audioChunks, { type: 'audio/webm' });

      const formData = new FormData();
      formData.append("audio", blob, "voice.webm");

      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setPreviewAudioUrl(url);
      setRecordingTime(0);
    };

    mediaRecorder.start();
    setMediaRecorder(mediaRecorder);
  };
  const stopAudioRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setShowOptions(false);

    const formData = new FormData();
    formData.append('image', file); // even for videos (rename this on server later)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/messages/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,

      });

      const data = await res.json();
      onSendMessage(data.url); // send video/photo as URL
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    if (message) {
      onStartTyping();

      const timeout = setTimeout(() => {
        onStopTyping();
      }, 1000); // or 1500ms

      return () => clearTimeout(timeout);
    } else {
      onStopTyping();
    }
  }, [message]);

  const handleStartCall = (type) => {
    if (activeCall) return;
    setActiveCall(true);
    setIsVideoCall(type === 'video');
    setShowCall(true);
  };

  const answerCall = () => {
    if (activeCall) return;
    setActiveCall(true);
    setShowCall(true);
    setIncomingCall(null);
  };

  const rejectCall = () => {
    setIncomingCall(null);
  };

  const handleCallEnd = () => {
    setShowCall(false);
    setActiveCall(false);
    setIncomingCall(null);
  };

  useEffect(() => {
    if (!socket || activeCall) return;

    const handleIncomingCall = ({ signal, from, isVideo }) => {
      if (from === contact.user_id) {
        setIncomingCall({ signal, from });
        setIsVideoCall(isVideo);
      }
    };
    socket.on('incoming-call', handleIncomingCall);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
    };
  }, [socket, contact.user_id, activeCall]);

  return (
    <div className="flex flex-col lg:h-[100vh] mb-12 md:mb-0 w-full ">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        {/* Left: Profile and name */}
        <div className="flex items-center">
            <ArrowLeft className='mr-2' onClick={onback}/>
          <div className="relative">
            <img
              src={contact.profile_img_url[0]}
              alt={contact.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-800">{contact.firstName}</h3>
            <p className="text-xs text-gray-500">
              {contact.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Right: Call Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStartCall('audio')}
            disabled={activeCall}
            className={`p-2 rounded-full ${activeCall ? 'bg-gray-200' : 'bg-blue-100 hover:bg-blue-200'} text-blue-600 transition`}
            title={activeCall ? 'Call in progress' : 'Voice Call'}
          >
            <Phone size={20} />
          </button>
          <button
            onClick={() => handleStartCall('video')}
            disabled={activeCall}
            className={`p-2 rounded-full ${activeCall ? 'bg-gray-200' : 'bg-blue-100 hover:bg-blue-200'} text-blue-600 transition`}
            title={activeCall ? 'Call in progress' : 'Video Call'}
          >
            <Video size={20} />
          </button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={msg.id || `${msg.sender}-${msg.timestamp}-${index}`}
            className={`flex mb-4 ${msg.sender === contact.user_id ? 'justify-start' : 'justify-end'}`}
          >
            {(msg.sender === contact.user_id) && (<div className="relative">
              <img
                src={contact.profile_img_url[0]}
                alt={contact.firstName}
                className={`w-10 h-10 rounded-full flex mb-4 justify-start`}
              />
            </div>)}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === contact.user_id
                ? 'bg-white border border-gray-200 rounded-tl-none'
                : 'bg-blue-500 text-white rounded-tr-none'
                }`}
            >
              {msg.text.includes('/uploads/') ? (
                msg.text.includes('.webm') || msg.text.includes('.mp3') ? (
                  <audio controls className="max-w-xs">
                    <source src={msg.text} type="audio/webm" />
                    Your browser does not support the audio tag.
                  </audio>
                ) : msg.text.includes('.mp4') ? (
                  <video controls className="max-w-xs rounded">
                    <source src={msg.text} type="video/mp4" />
                  </video>
                ) : (
                  <img src={msg.text} className="rounded-lg max-w-[200px]" />
                )
              ) : (
                <p>{msg.text}</p>
              )}
              <p className={`text-xs mt-1 ${msg.sender === contact.user_id ? 'text-gray-500' : 'text-blue-100'
                }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {!(msg.sender === contact.user_id) && (<div className="relative">
              <img
                src={userpic}
                alt={contact.firstName}
                className={`w-10 h-10 rounded-full flex mb-4`}
              />
            </div>)}
          </div>
        ))}

      </div>
      {isTyping && (
        <div className="px-4 py-2 flex items-center space-x-2 w-min">
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
          </div>
        </div>
      )}
      {/* Message input */}
      <div className="p-4 border-t border-gray-200 bg-white relative">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">

          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-500 hover:text-blue-600"
          >
            <Smile size={22} />
          </button>

          {/* Message Input */}
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Audio Record Button */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startAudioRecording}
                className="text-red-500 hover:text-red-600"
                title="Start Recording"
              >
                <Mic />
              </button>
            ) : (
              <button
                type="button"
                onClick={stopAudioRecording}
                className="text-blue-500 hover:text-blue-600"
                title="Stop Recording"
              >
                <CirclePause />
              </button>
            )}

            {isRecording && (
              <div className="flex flex-col items-start gap-1">
                <span className="text-xs text-gray-500">
                  ⏱ {recordingTime}s
                </span>
                <canvas
                  ref={canvasRef}
                  width={200}
                  height={40}
                  className="border border-gray-300 rounded"
                />
              </div>
            )}
          </div>
          {previewAudioUrl && (
            <div className="flex items-center gap-3 mt-3 p-2 bg-gray-50 border rounded">
              <audio controls src={previewAudioUrl} className="max-w-[200px]" />
              <button
                className="text-green-600 font-medium hover:text-green-700"
                onClick={async () => {
                  const formData = new FormData();
                  formData.append("audio", audioBlob, "voice.webm");

                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/messages/upload-audio`, {
                      method: "POST",
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                      body: formData,
                    });

                    const data = await res.json();
                    onSendMessage(data.url);
                  } catch (err) {
                    console.error("Audio upload failed:", err);
                  } finally {
                    // Clear preview
                    setPreviewAudioUrl(null);
                    setAudioBlob(null);
                  }
                }}
              >
                <Check />
              </button>
              <button
                className="text-red-500 font-medium hover:text-red-600"
                onClick={() => {
                  setPreviewAudioUrl(null);
                  setAudioBlob(null);
                }}
              >
                <X />
              </button>
            </div>
          )}
          {/* Hidden direct image input */}
          <input
            type="file"
            accept="image/*"
            hidden
            id="imageUpload"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              setUploading(true);
              const formData = new FormData();
              formData.append('image', file);

              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/messages/upload-image`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: formData,
                });
                const data = await res.json();
                onSendMessage(data.url);
              } catch (err) {
                console.error('Image upload failed', err);
              } finally {
                setUploading(false);
              }
            }}
          />

          {/* Direct Image Upload Button */}
          <label htmlFor="imageUpload" className="cursor-pointer text-gray-500 hover:text-blue-600">
            <ImageIcon size={22} />
          </label>

          {/* Plus Icon with Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOptions((prev) => !prev)}
              className="text-gray-500 hover:text-blue-600"
            >
              <Plus size={22} />
            </button>

            {showOptions && (
              <div className="absolute bottom-10 right-8 bg-white border rounded-lg shadow p-2 space-y-2 z-10 w-32">
                {/* Photo Upload */}
                <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 hover:text-blue-600">
                  <ImageIcon size={18} />
                  Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleUpload(e.target.files[0])}
                  />
                </label>

                {/* Video Upload */}
                <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 hover:text-blue-600">
                  <Video size={18} />
                  Video
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    hidden
                    onChange={(e) => handleUpload(e.target.files[0])}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            <SendHorizonal size={18} />
          </button>
        </form>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-14 left-2 z-10">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setMessage((prev) => prev + emojiData.emoji);
                inputRef.current?.focus();
              }}
              theme="light"
            />
          </div>
        )}
      </div>
      {showCall && (
        <CallManager
          currentUserId={user_id}
          remoteUserId={contact.user_id}
          isVideo={isVideoCall}
          incomingSignal={incomingCall?.signal}
          onClose={handleCallEnd}
          socket={socket}
        />
      )}
      {incomingCall && !activeCall && (
        <div className="fixed bottom-10 right-10 bg-white rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Video size={20} />
              Incoming {isVideoCall ? 'Video' : 'Voice'} Call
            </h3>
            <p className="text-sm opacity-90">From: {contact.firstName}</p>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={contact.profile_img_url[0]}
                alt={contact.firstName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">Incoming Call</p>
                <p className="text-xs text-gray-500">WebRTC Connection</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={answerCall}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              >
                <Phone size={20} />
              </button>
              <button
                onClick={rejectCall}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatView;