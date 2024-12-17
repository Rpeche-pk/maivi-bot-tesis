import {addKeyword} from "@builderbot/bot";
import {idleReset, idleStart, idleStop} from "../../../utils/idle.util.js";
import {generateCategoryButtons, getValues} from "../../../utils/btn.util.js";
import {getBrandCategory, getProductsByBrand} from "../../../service/api.service.js";
import {setRandomDelay} from "../../../utils/delay.util.js";
import {log_error} from "../../../utils/logger.util.js";
import {handleErrorAndNotifySlack} from "../../../http/slack.http.js";
import {logoutFlow} from "../../exit_flow/exit.flow.js";
import {CONSTANTS} from "../../../config/index.js";

const REGEX_INPUT_CATEGORY = '/Buscar por categoría/g';

const search_categories_flow = addKeyword(REGEX_INPUT_CATEGORY, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStop(ctx);
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    }).addAnswer("🔍 *Elige una categoría a consultar:* 📦",
        {
            capture: true,
            buttons: generateCategoryButtons(),
            delay: setRandomDelay(520, 490)
        }, async (ctx, {gotoFlow, globalState, extensions, state, provider}) => {

            try {
                idleReset(ctx, gotoFlow, globalState.get("timer"));
                const body = ctx?.body.replace("*", "").replace("*", "").trim();
                const phone = ctx?.from;
                const jid = ctx?.key?.remoteJid;
                const myState = state.getMyState() ?? {};
                const categories = getValues(body);
                myState[phone] = {...myState[phone], category: categories};

                await state.update(myState);

                const brandByCategories = await getBrandCategory(extensions, categories)

                await provider.vendor.sendMessage(jid, {delete: ctx?.key});
                await extensions.utils.wait(510, 490);

                await provider.vendor.sendMessage(
                    jid, {
                        poll:
                            {
                                "name": "👉🏽 *Elige una marca a consultar:* 😊",
                                "values": brandByCategories,
                                "selectableCount": 1,
                            }
                    }
                );
            } catch (e) {
                idleStop(ctx);
                log_error("ERROR FLUJO search_categories_flow", e);
                await handleErrorAndNotifySlack("ERROR FLUJO search_categories_flow", e)
            }
        })
    .addAction({capture: true}, async (ctx, {extensions, provider, state, gotoFlow, globalState}) => {
        try {
            idleReset(ctx, gotoFlow, globalState.get("timer"));
            const brand = ctx?.body;
            const phone = ctx?.from;
            const jid = ctx?.key?.remoteJid;
            const myState = state.getMyState() ?? {};
            const categories = myState[phone]?.category;

            await provider.vendor.sendMessage(jid, {delete: ctx?.key});
            await extensions.utils.wait(530, 490);

            const messages = await getProductsByBrand(extensions, brand, categories);

            for (let message of messages) {
                await extensions.utils.typing(provider, {
                    delay1: setRandomDelay(510, 400),
                    delay2: setRandomDelay(1100, 1010),
                    ctx
                });
                await provider.vendor.sendMessage(jid, {text: message});
                await extensions.utils.simulatePausedAndAvailable(provider, ctx);
            }

        } catch (e) {
            idleStop(ctx);
            log_error("[ERROR FLOW] search_categories_flow", e);
            await handleErrorAndNotifySlack("[ERROR FLOW] search_categories_flow", e)
        }
    }).addAnswer("🔍 Estimada(o) usuario *¿Deseas realizar otra consulta?*",
        {
            capture: true,
            buttons: [{"body": "SI"}, {"body": "NO"}],
            delay: setRandomDelay(650, 550)
        }, async (ctx, {endFlow, gotoFlow, flowDynamic, extensions, state, fallBack, provider, globalState}) => {
            try {
                idleReset(ctx, gotoFlow, globalState.get("timer"));
                const body = ctx?.body.toLowerCase();
                const jid = ctx?.key?.remoteJid;

                await provider.vendor.sendMessage(jid, {delete: ctx?.key})

                if (body === 'no') return gotoFlow(logoutFlow);
                if (body === 'si') return gotoFlow(search_categories_flow);

                await extensions.utils.tryAgain({
                    ctx,
                    state,
                    fallBack,
                    provider,
                    flowDynamic,
                    endFlow
                }, CONSTANTS.MESSAGES.FAIL);
            }catch (e){
                idleStop(ctx);
                log_error("[ERROR FLOW] search_categories_flow", e);
                await handleErrorAndNotifySlack("[ERROR FLOW] search_categories_flow", e)
            }
        });


export {search_categories_flow};
