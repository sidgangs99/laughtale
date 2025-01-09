import fs from "fs";
import Groq from "groq-sdk";
import { Transcription } from "groq-sdk/resources/audio/transcriptions.mjs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

class AudioProcessor {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Convert Buffer to File-like object
   */
  private bufferToFile(audioBuffer: Buffer): string {
    const tempDir = os.tmpdir(); // Get OS temp directory
    const tempFilePath = path.join(tempDir, `${uuidv4()}.m4a`);

    // Write buffer to temp file
    fs.writeFileSync(tempFilePath, audioBuffer);
    return tempFilePath;
  }

  /**
   * Processes an audio file and returns the transcribed text
   * @param audioBuffer - The audio file buffer to process
   * @param options - Configuration options for transcription
   * @returns Promise<string> - The transcribed text
   */
  async processAudio(
    audioBuffer: Buffer,
    options: {
      language?: string;
      model?: string;
      prompt?: string;
    } = {}
  ): Promise<Transcription> {
    try {
      // Convert Buffer to a temporary file path
      const audioFilePath = this.bufferToFile(audioBuffer);

      // Create a readable stream from the file
      const audioFileStream = fs.createReadStream(audioFilePath);

      // Create the request parameters for Groq API
      const transcriptionRequest = {
        file: audioFileStream,
        model: options.model || "whisper-large-v3-turbo",
        language: options.language || "hi",
        prompt: options.prompt || "",
        response_format: "text",
      };

      // Send request to Groq API
      const response: Transcription =
        await this.groq.audio.transcriptions.create(transcriptionRequest);

      // Cleanup temporary file
      fs.unlinkSync(audioFilePath);

      return response;
    } catch (error) {
      console.error("Error processing audio:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to process audio file: ${error.message}`
          : "Failed to process audio file"
      );
    }
  }

  /**
   * Process multiple audio files in batch
   * @param audioBuffers - Array of audio file buffers
   * @param options - Configuration options for transcription
   * @returns Promise<string[]> - Array of transcribed texts
   */
  async processBatchAudio(
    audioBuffers: Buffer[],
    options: {
      language?: string;
      model?: string;
      prompt?: string;
    } = {}
  ): Promise<string[]> {
    try {
      const transcriptionPromises = audioBuffers.map((buffer) =>
        this.processAudio(buffer, options)
      );

      return await Promise.all(transcriptionPromises);
    } catch (error) {
      console.error("Error processing audio batch:", error);
      throw new Error("Failed to process audio batch");
    }
  }
}

export default AudioProcessor;
