import { GSContext,  GSDataSource, GSStatus, logger, PlainObject,} from "@godspeedsystems/core";
import OpenAI from 'openai';

export default class DataSource extends GSDataSource {
protected async initClient(): Promise<object> {
  // initialize your client
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

async execute(ctx: GSContext, args: PlainObject): Promise<any> {
  const client = this.client as OpenAI;
  const { prompt, meta: { fnNameInWorkflow } } = args;
  logger.info("promppppt %s",prompt);
  // Parse method from fnNameInWorkflow
  let method = fnNameInWorkflow?.split(".")[2];

  // Validate that client and method are available
  if (!client) {
    return new GSStatus(false, 500, "ChatGPT client is not initialized");
  }
  if (!method) {
    return new GSStatus(false, 400, "Method name is missing in fnNameInWorkflow");
  }

  // Use destructuring with defaults to get config values
  const {  model= 'gpt-4o',temperature = 1, max_tokens = 500 } = this.config;

    try {
      // execute methods
      if (method === "chat") {
        // Execute ChatGPT completion
        const response = await client.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature,
          max_tokens,
        });
        const responseContent = response.choices[0]?.message?.content ?? "No response generated";
        return new GSStatus(true, 200, "Success", responseContent);
      } else {
        return new GSStatus(false, 400, `Invalid method: ${method}`);
      }
    } catch (error) {
      throw error;
    }
}
}
const SourceType = 'DS';
const Type = "chatgpt"; // this is the loader file of the plugin, So the final loader file will be `types/${Type.js}`
const CONFIG_FILE_NAME = "chatgpt"; // in case of event source, this also works as event identifier, and in case of datasource works as datasource name
const DEFAULT_CONFIG = {};

export {
  DataSource,
  SourceType,
  Type,
  CONFIG_FILE_NAME,
  DEFAULT_CONFIG
}
