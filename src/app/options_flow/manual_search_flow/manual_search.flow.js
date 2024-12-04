import {addKeyword} from "@builderbot/bot";
import {idleReset, idleStart, idleStop} from "../../../utils/idle.util.js";
import {openai_middleware} from "../../../middleware/openai.middleware.js";
import {logoutFlow} from "../../exit_flow/exit.flow.js";
import {CONSTANTS} from "../../../config/index.js";
import {setRandomDelay} from "../../../utils/delay.util.js";


const REGEX_INPUT_TEXT = '/Escribir consulta/g';

/*
* THIS FLOW LEADS TO SEARCHING FOR THE PRODUCT MANUALLY.
*/
const search_product_flow = addKeyword(REGEX_INPUT_TEXT, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStop(ctx);
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer("🔍 *Ingrese el producto a buscar:* 📦", {capture:true}, null)
    .addAction(openai_middleware)
    .addAnswer("🔍 *Usted; ¿Deseas realizar otra consulta?*",
        {
            capture: true,
            buttons: [{"body": "SI"}, {"body": "NO"}],
            delay: setRandomDelay(750, 550)
        }, async (ctx, {endFlow, gotoFlow, flowDynamic, extensions,state,fallBack,provider, globalState}) => {
            idleReset(ctx, gotoFlow, globalState.get("timer"));
            const body = ctx?.body.toLowerCase();
            const jid = ctx?.key?.remoteJid;

            await provider.vendor.sendMessage(jid, {delete: ctx?.key})

            if (body === 'no') return gotoFlow(logoutFlow);
            if (body === 'si') return gotoFlow(search_product_flow);

            await extensions.utils.tryAgain({
                ctx,
                state,
                fallBack,
                provider,
                flowDynamic,
                endFlow
            }, CONSTANTS.MESSAGES.FAIL);
        });

export {search_product_flow};
