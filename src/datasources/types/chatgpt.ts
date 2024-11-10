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
    const { meta: { fnNameInWorkflow, method } } = args;
    
    // Get the method name
    let workflow = method || fnNameInWorkflow?.split(".")[2];

    // Validate client and method
    if (!client) {
      return new GSStatus(false, 500, "ChatGPT client is not initialized");
    }
    if (!workflow) {
      return new GSStatus(false, 400, "Method name is missing in fnNameInWorkflow");
    }

    // Load global and method-specific configurations from YAML
    const methodConfig = this.config.methods?.[workflow] || {};

    try {
      switch (workflow) {
        case "chat": {
          const { prompt } = args;
          const model = methodConfig.model || "gpt-4o";
          const temperature = methodConfig.temperature || 1;
          const max_tokens = methodConfig.max_tokens || 500;

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
          const { input } = args;
          const model = methodConfig.model || "tts-1";
          const voice = methodConfig.voice || "alloy";

          const speechFile = path.resolve(`./generated_audio_${Date.now()}.mp3`);

          const mp3 = await client.audio.speech.create({
            model,
            voice,
            input,
          });

          const buffer = Buffer.from(await mp3.arrayBuffer());
          await fs.promises.writeFile(speechFile, buffer);

          return new GSStatus(true, 200, "Success", { message: "Audio file generated", filePath: speechFile });
        }

        case "textToImage": {
          const { input } = args;
          const model = methodConfig.model || "dall-e-3";
          const size = methodConfig.size || "1024x1024";

          const response = await client.images.generate({
            model,
            prompt: input,
            n: 1,
            size,
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
const Type = "chatgpt";  // Loader type for the plugin
const CONFIG_FILE_NAME = "chatgpt";  // Configuration file name for the datasource
const DEFAULT_CONFIG = {
  
};


export {
  DataSource,
  SourceType,
  Type,
  CONFIG_FILE_NAME,
  DEFAULT_CONFIG
};
