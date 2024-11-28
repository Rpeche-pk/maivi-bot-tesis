import {addKeyword, EVENTS} from '@builderbot/bot'
import {idleReset} from "../../utils/idle.util.js";
import {setRandomDelay, typingTime} from "../../utils/delay.util.js";
import {CONSTANTS} from "../../config/index.js";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {log_error} from "../../utils/logger.util.js";
import {poll_middleware} from "../../middleware/poll.middleware.js";


const REGEX_SEARCH_PRODUCT = '/Buscar por producto más marca/g';

const choose_input_method_flow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer("🔍 *¿Cómo deseas ingresar tu consulta?*",
        {
            capture: true,
            delay: setRandomDelay(750, 550),
            buttons: [{"body": "*Escribir consulta*"}, {"body": "*Decir por audio*"}, {"body": "❌Salir del Sistema"}]
        },
        poll_middleware)


const search_explanation_flow = addKeyword(REGEX_SEARCH_PRODUCT, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAction(async (ctx, {extensions, provider, gotoFlow}) => {
        try {
            for (let i = 0; i < CONSTANTS.MESSAGE_SEARCH_PRODUCTS.length; i++) {
                await extensions.utils.typing(provider, {
                    delay1: setRandomDelay(600, 500),
                    delay2: typingTime(CONSTANTS.MESSAGE_SEARCH_PRODUCTS[i]),
                    ctx
                });
                await provider.vendor.sendMessage(ctx?.key?.remoteJid, {text: CONSTANTS.MESSAGE_SEARCH_PRODUCTS[i]});
                await extensions.utils.simulatePausedAndAvailable(provider, ctx);
            }
            return gotoFlow(choose_input_method_flow);
        } catch (error) {
            await handleErrorAndNotifySlack(`[ERROR FLUJO searchProductFlow:]`, error);
            log_error("ERROR FLUJO searchProductFlow", error);
        }
    });

export {
    search_explanation_flow,
    choose_input_method_flow,
};
