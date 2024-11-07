import { GSContext, GSDataSource, GSStatus } from "@godspeedsystems/core";
export default async function (ctx: GSContext, args: any) {
    const { inputs: {data: { body } }, }= ctx;
    const prompt = body.prompt;    
    const ds: GSDataSource = ctx.datasources.chatgpt;
    
    const response = await ds.execute(ctx, {
        prompt,
        meta: {fnNameInWorkflow: 'datasource.chatgpt.chat'}
    });
    return response;
}





