import React, { useState, useRef, useEffect } from "react";
import "./Recording.css";

const RecordingComponent = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  

  const startRecording = async () => {
    try {
      setError(null);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setAudioBlob(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        setPermissionDenied(true);
        setError("יש לאפשר גישה למיקרופון כדי להשתמש בתכונה זו.");
      } else {
        setError(`שגיאה: ${error.message}`);
      }
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const deleteRecording = () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את ההקלטה?")) {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setAudioBlob(null);
    }
  };

  return (
    <div className="recording-section">
      <button
        className={`record-button ${isRecording ? "recording" : ""}`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "עצור" : "הקלט"}
        {isRecording && <div className="pulsing-circles"></div>}
      </button>

      {isRecording && <div className="recording-time">{recordingTime}s</div>}

      {error && <div className="error-message">{error}</div>}

      {audioUrl && (
        <div className="playback-controls">
          <audio controls src={audioUrl} />
          <button className="delete-button" onClick={deleteRecording}>
            🗑️ מחק הקלטה
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordingComponent;
