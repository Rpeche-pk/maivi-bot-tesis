import {addKeyword, EVENTS} from '@builderbot/bot'
import {idleReset, idleStart} from "../../utils/idle.util.js";
import {setRandomDelay, typingTime} from "../../utils/delay.util.js";
import {CONSTANTS} from "../../config/index.js";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {log_error} from "../../utils/logger.util.js";
import {handleRiceSearch} from "./test.data.js";
import {poll_middleware} from "../../middleware/poll.middleware.js";
import {gpt_middleware} from "../../middleware/audioAI.middleware.js";

const REGEX_SEARCH_PRODUCT = '/Buscar por producto más marca/g';
const REGEX_INPUT_TEXT = '/Escribir consulta/g';
const REGEX_INPUT_AUDIO = '/Decir por audio/g';

const search_product_flow = addKeyword(REGEX_INPUT_TEXT, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer("🔍 *Ingrese el producto a buscar:* 📦", {delay: setRandomDelay(850, 750), capture: true},
        async (ctx, {extensions, provider}) => {
            const answer = ctx?.body?.trim().toLowerCase();
            const response = handleRiceSearch(answer);

            for (const message of response) {
                await extensions.utils.typing(provider, {
                    delay1: setRandomDelay(750, 550),
                    delay2: typingTime(message),
                    ctx
                });
                await provider.vendor.sendMessage(ctx?.key?.remoteJid, {text: message});
                await provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
            }
        });


const search_audio_flow = addKeyword(REGEX_INPUT_AUDIO, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState, flowDynamic}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
        await flowDynamic("🎤 *Te escucho, envíame un audio con tu consulta*");
    }).addAction({capture:true},gpt_middleware);


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
                    delay1: setRandomDelay(800, 550),
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

export {search_product_flow,
    search_explanation_flow,
    choose_input_method_flow,
    search_audio_flow};
