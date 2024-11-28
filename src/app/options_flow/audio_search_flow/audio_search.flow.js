import {addKeyword} from "@builderbot/bot";
import {idleStart} from "../../../utils/idle.util.js";
import {openai_middleware} from "../../../middleware/openai.middleware.js";


const REGEX_INPUT_TEXT = '/Escribir consulta/g';

/*
* THIS FLOW LEADS TO SEARCHING FOR THE PRODUCT MANUALLY.
*/
const search_product_flow = addKeyword(REGEX_INPUT_TEXT, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer("🔍 *Ingrese el producto a buscar:* 📦", null, null)
    .addAction({capture: true}, openai_middleware);

export {search_product_flow};
