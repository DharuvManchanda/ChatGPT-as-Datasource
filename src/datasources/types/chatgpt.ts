import { GSContext, GSDataSource, GSStatus, PlainObject } from "@godspeedsystems/core";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export default class DataSource extends GSDataSource {
  protected async initClient(): Promise<object> {
    // Initialize the OpenAI client with the API key from environment variables
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return client;
  }

  async execute(ctx: GSContext, args: PlainObject): Promise<any> {
    const client = this.client as OpenAI;
    const { prompt, meta: { fnNameInWorkflow , method } } = args;

    // Parse method from fnNameInWorkflow
    let method1 = method || fnNameInWorkflow?.split(".")[2];

    // Validate that client and method are available
    if (!client) {
      return new GSStatus(false, 500, "ChatGPT client is not initialized");
    }
    if (!method1) {
      return new GSStatus(false, 400, "Method name is missing in fnNameInWorkflow");
    }

    // Use destructuring with defaults to get config values
    const { model = "gpt-4o", temperature = 1, max_tokens = 500 } = this.config;

    try {
      switch (method1) {
        case "chat": {
          // Chat completion
          const response = await client.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_tokens,
          });
          const responseContent = response.choices[0]?.message?.content ?? "No response generated";
          return new GSStatus(true, 200, "Success", responseContent);
        }

        case "textToSpeech": {
          // Text-to-speech generation
          const { input = "Hello, this is a sample speech text!" } = args;
          
          // Define the file path to save the output audio file
          const speechFile = path.resolve(`./generated_audio_${Date.now()}.mp3`);

          const mp3 = await client.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input,
          });
          
          // Convert the audio data to a buffer and save to a file
          const buffer = Buffer.from(await mp3.arrayBuffer());
          await fs.promises.writeFile(speechFile, buffer);

          return new GSStatus(true, 200, "Success", { message: "Audio file generated", filePath: speechFile });
        }

        case "textToImage": {
          // Text-to-image generation
          const { input } = args;
          
          const response = await client.images.generate({
            model: "dall-e-3",
            prompt: input,
            n: 1,
            size: "1024x1024",
          });

          const imageUrl = response.data[0]?.url;
          if (imageUrl) {
            return new GSStatus(true, 200, "Success", { message: "Image generated", imageUrl });
          } else {
            return new GSStatus(false, 500, "Failed to generate image");
          }
        }

        default: {
          return new GSStatus(false, 400, `Invalid method: ${method}`);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

const SourceType = 'DS';
const Type = "chatgpt"; // Loader type for the plugin
const CONFIG_FILE_NAME = "chatgpt"; // Configuration file name for the datasource
const DEFAULT_CONFIG = {};

export {
  DataSource,
  SourceType,
  Type,
  CONFIG_FILE_NAME,
  DEFAULT_CONFIG
};
