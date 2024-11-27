import {addKeyword} from "@builderbot/bot";
import {handleHistory} from "../../utils/handleHistory.util.js";


const openai_flow = addKeyword("#ai", {})
    .addAnswer("🤖 *Ingrese su pregunta:*", {capture: true}, null)
    .addAction(async (ctx, { extensions,state}) => {
        const history = state.getMyState()?.history ?? [];

        //OPTION 1
        history.push({
            role: 'user',
            content: ctx.body
        })

        //OPTION 2
        await handleHistory({role: "user", content: ctx.body}, state);

        //RESPONDE EL OPENAI
        const largeResponse = await extensions.ai.runDetermine(history, ctx?.body.trim());

        //GUARDO EL HISTORIAL QUE EL ASISTENTE ES LA RESPUESTA DE OPENAI
        history.push({
            role: 'assistant',
            content: largeResponse
        })

        console.log('history', history)

        //actualizo el historial
        await state.update({history})
    });



export {openai_flow}
