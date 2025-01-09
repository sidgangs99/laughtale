import AudioProcessor from "@/lib/llm/audioToText";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes timeout
export const dynamic = "force-dynamic";

/**
 * Validates the uploaded file
 */
function validateAudioFile(file: File) {
  const maxSize = 25 * 1024 * 1024; // 25MB
  const allowedTypes = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/ogg"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only WAV, MP3, and OGG files are allowed."
    );
  }

  if (file.size > maxSize) {
    throw new Error("File size exceeds 25MB limit.");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if GROQ API key is configured
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ API key not configured" },
        { status: 500 }
      );
    }

    // Get form data from request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const language = (formData.get("language") as string) || "en";
    const prompt = (formData.get("prompt") as string) || "";

    // Validate audio file
    if (!audioFile) {
      return Response.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Validate file type and size
    try {
      validateAudioFile(audioFile);
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Invalid file" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize audio processor
    const processor = new AudioProcessor();

    // Process the audio
    const transcription = await processor.processAudio(buffer, {
      language: "hi",
      prompt: "Transcribe text in hindi language",
      model: "whisper-large-v3-turbo", // You can make this configurable if needed
    });

    // Return the transcription
    return Response.json({
      success: true,
      transcription,
      metadata: {
        fileName: audioFile.name,
        fileSize: audioFile.size,
        fileType: audioFile.type,
        language,
      },
    });
  } catch (error) {
    console.error("Error processing audio:", error);

    return Response.json(
      {
        error: "Failed to process audio file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
