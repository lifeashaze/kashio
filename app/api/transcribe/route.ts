import Groq from "groq-sdk";
import { requireRouteAuth, withServerErrorBoundary } from "@/lib/api/route-helpers";
import { success, badRequest } from "@/lib/api/responses";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  return withServerErrorBoundary("transcribe audio", async () => {
    const authPromise = requireRouteAuth();
    const formDataPromise = req.formData();

    const auth = await authPromise;
    if (!auth.ok) return auth.response;

    const formData = await formDataPromise;
    const audio = formData.get("audio");

    if (!audio || !(audio instanceof File)) {
      return badRequest("No audio file provided");
    }

    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (Groq limit)
    if (audio.size > MAX_FILE_SIZE) {
      return badRequest("File too large (max 25MB)");
    }

    const ALLOWED_TYPES = [
      "audio/webm",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/flac",
      "audio/mp4",
      "audio/m4a",
      "audio/x-m4a",
    ];
    if (audio.type && !ALLOWED_TYPES.includes(audio.type)) {
      return badRequest("Invalid audio format");
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3-turbo",
    });

    return success({ text: transcription.text });
  });
}
