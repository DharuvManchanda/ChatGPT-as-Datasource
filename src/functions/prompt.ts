
import { GSContext, GSDataSource, GSStatus } from "@godspeedsystems/core";
export default async function (ctx: GSContext, args: any) {
    const {
                    inputs: {
                          data: {
                             body
                          }
                      }, 
                      }= ctx;
                    const prompt = body.prompt;    
    const ds: GSDataSource = ctx.datasources.chatgpt;
    
    const response = await ds.execute(ctx, {
        prompt,
        //Along with args, pass meta object
        // meta can contain {entityName, method}
        // meta: {method: 'create'},
        //Or meta can contain {fnNameInWorkflow} which is same as 
        //the 'fn' that we write when invoking datasource from yaml workflow
        //For example, this will also work
        meta: {fnNameInWorkflow: 'datasource.chatgpt.chat'}
    });
    return response;
}






// import { GSContext, GSDataSource, GSStatus, logger, PlainObject } from "@godspeedsystems/core";
// export default async function (ctx: GSContext, args: PlainObject) {
//     const {
//       inputs: {
//           data: {
//              body
//           }
//       }, 
//       }= ctx;
//     const prompt = body.prompt;
//     const ds: GSDataSource = ctx.datasources.chatgpt;
//     console.log('args', args);
//     const response = await ds.execute(ctx, {
//        data:{prompt: prompt},
//         // Metadata to indicate the specific entity and method to be used
//         meta: { fnNameInWorkflow: 'datasource.chatgpt.create' }
//     })
//     // Return the response from the datasource execution
//     return new GSStatus(true, 200, undefined, response, undefined);
// }
