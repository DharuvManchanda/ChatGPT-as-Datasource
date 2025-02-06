import { GSContext, GSDataSource, GSStatus } from "@godspeedsystems/core";
export default async function (ctx: GSContext, args: any) {
    // Destructuring the `body` object from the context inputs
    const { inputs: { data: { body } }, datasources, logger } = ctx;
    const prompt = body.prompt;
    // In Godspeed, the GSContext object ctx provides all the necessary data for the function, including inputs, datasources, and configurations.
    // ctx.datasources contains all the configured datasources.
    const ds: GSDataSource = ctx.datasources.chatgpt;
    const model = "gpt-4o";
    const temperature = 1;
    const max_tokens = 500;
    const res = await datasources.chatgpt.client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens,
    });
    logger.info('response %o', res.choices[0]?.message?.content);
    // The code calls ds.execute, passing the ctx and an argument object.
    // The args object passed to execute has two parts:
    // prompt: The input text for the ChatGPT model, extracted from body.
    const response = await ds.execute(ctx, {
        prompt,
        meta: { method: 'chat' }
    });
    return res.choices[0]?.message?.content;
}





