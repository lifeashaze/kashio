import Groq from "groq-sdk";
import { requireRouteAuth, withServerErrorBoundary } from "@/lib/api/route-helpers";
import { success, badRequest } from "@/lib/api/responses";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  return withServerErrorBoundary("transcribe audio", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!audio || !(audio instanceof File)) {
      return badRequest("No audio file provided");
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3-turbo",
    });

    return success({ text: transcription.text });
  });
}
