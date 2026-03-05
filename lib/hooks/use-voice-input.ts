"use client";

import { useRef, useState } from "react";

export type VoiceInputStatus = "idle" | "recording" | "transcribing" | "error";

export function useVoiceInput() {
  const [status, setStatus] = useState<VoiceInputStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setStatus("recording");
    } catch {
      setError("Microphone access denied");
      setStatus("error");
    }
  };

  const stopRecording = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        reject(new Error("No active recording"));
        return;
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release the mic
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());

        setStatus("transcribing");
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("audio", blob, "recording.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Transcription failed");

          const json = await res.json();
          setStatus("idle");
          resolve(json.text as string);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Transcription failed";
          setError(message);
          setStatus("error");
          reject(err);
        }
      };

      mediaRecorder.stop();
    });
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  return { status, error, startRecording, stopRecording, reset };
}
