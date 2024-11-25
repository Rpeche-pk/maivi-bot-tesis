import {addKeyword} from "@builderbot/bot";
import {getHistoryParse, handleHistory} from "../../utils/handleHistory.util.js";


const openai_flow = addKeyword("#ai", {regex: true})
    .addAction(async (ctx, {flowDynamic, extensions,state}) => {
        await handleHistory({role: "user", content: ctx.body}, state);

        const response = getHistoryParse(state);
        console.log(response)
    });



export {openai_flow}
