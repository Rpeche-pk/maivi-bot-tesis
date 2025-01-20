import {addKeyword, EVENTS} from '@builderbot/bot'
import {idleReset, idleStart, idleStop} from "../../utils/idle.util.js";
import {setRandomDelay} from "../../utils/delay.util.js";
import {CONSTANTS} from "../../config/index.js";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {log_error} from "../../utils/logger.util.js";
import {poll_middleware} from "../../middleware/poll.middleware.js";
import {randomElement} from "../../utils/random.util.js";


const REGEX_SEARCH_PRODUCT = '/Buscar por producto y marca/g';

const choose_input_method_flow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer("🔍 *¿Cómo deseas ingresar tu consulta?*",
        {
            capture: true,
            delay: setRandomDelay(650, 550),
            buttons: [{"body": "*Escribir consulta*"}, {"body": "*Dictar por Audio*"}, {"body": "❌Salir del Sistema"}]
        },
        poll_middleware)


const search_explanation_flow = addKeyword(REGEX_SEARCH_PRODUCT, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAction(async (ctx, {flowDynamic, extensions, provider, gotoFlow}) => {
        try {
            const randomImage = randomElement(CONSTANTS.IMAGE_EXPLAIN);
            await extensions.utils.typingWithoutDelay(provider, {
                delay1: setRandomDelay(450, 350),
                ctx
            });

            await flowDynamic([
                {
                    body: CONSTANTS.AVAILABLE_CATEGORIES,
                    media: `${randomImage}`,
                },
            ]);

            await extensions.utils.simulatePausedAndAvailable(provider, ctx);
            return gotoFlow(choose_input_method_flow);
        } catch (error) {
            idleStop(ctx);
            log_error("ERROR FLUJO searchProductFlow", error);
            await handleErrorAndNotifySlack(`[ERROR FLUJO searchProductFlow:]`, error);
        }
    });

export {
    search_explanation_flow,
    choose_input_method_flow,
};
