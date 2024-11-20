import {addKeyword, EVENTS} from '@builderbot/bot'
import {idleReset, idleStart} from "../../utils/idle.util.js";
import {setRandomDelay, typingTime} from "../../utils/delay.util.js";
import {CONSTANTS} from "../../config/index.js";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {log_error} from "../../utils/logger.util.js";
import {handleRiceSearch} from "./test.data.js";

const REGEX_SEARCH_PRODUCT = '/Buscar por producto más marca/g';

const search_product_flow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer("🔍 *Ingrese el producto a buscar:* 📦", {delay: setRandomDelay(950, 850), capture: true},
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

const search_explanation_flow = addKeyword(REGEX_SEARCH_PRODUCT, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAction(async (ctx, {extensions, provider, gotoFlow, state}) => {
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
            return gotoFlow(search_product_flow);
        } catch (error) {
            await handleErrorAndNotifySlack(`[ERROR FLUJO searchProductFlow:]`, error);
            log_error("ERROR FLUJO searchProductFlow", error);
        }
    });

export {search_product_flow, search_explanation_flow};
