import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {log_error, log_success} from "../utils/logger.util.js";
import {formatText} from "../utils/cleantext.util.js";
import {CONSTANTS} from "../config/index.js";
import {idleReset, idleStop} from "../utils/idle.util.js";
import {setRandomDelay} from "../utils/delay.util.js";
import {getProductsApi} from "../service/api.service.js";
import {randomElement} from "../utils/random.util.js";
import {new_search_flow} from "../app/options_flow/manual_search_flow/manual_search.flow.js";

const openai_middleware = async (ctx, {
    extensions,
    provider,
    state,
    flowDynamic,
    fallBack,
    endFlow,
    gotoFlow,
    globalState
}) => {
    try {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
        const body = formatText(ctx?.body);
        const userState = state?.getMyState();
        const phone = ctx?.from;
        userState[phone] = {...userState[phone], history: [{role: "user", content: body}]};

        await flowDynamic("⏱ *Espere un momento por favor, mientras se consulta la data... ⏱*");

        const responseAI = await extensions.ai.determineChatFn(body, userState[phone]?.history);
        log_success("[PREDICTION]", responseAI);

        if (responseAI.prediction.toLowerCase().includes('unknown')) {
            await extensions.utils.tryAgain({
                ctx,
                state,
                fallBack,
                provider,
                flowDynamic,
                endFlow
            }, CONSTANTS.MESSAGES.FAIL_PREDICTION);
            idleStop(ctx);
            return;
        }

        await flowDynamic("⏱ *Consultando... ⏱*");
        const myState = state?.getMyState();
        const responseAi = await extensions.ai.startChatAI(body, myState[phone]?.history);
        console.log("responseAi [details]", responseAi);
        let nameProduct = "";
        let brandProduct = "";

        if (String(responseAi).includes("+")) {
            const arrayParams = String(responseAi).split("+");
            nameProduct = arrayParams[0].trim();
            brandProduct = arrayParams[1].trim();
        } else {
            await extensions.utils.tryAgain({
                ctx,
                state,
                fallBack,
                provider,
                flowDynamic,
                endFlow
            }, responseAi);
            idleStop(ctx);
            return;
        }
        log_success("[PREDICTION AI]", responseAi);

        await extensions.utils.typingWithoutDelay(provider, {delay1: setRandomDelay(380, 300), ctx});
        const responseApi = await getProductsApi(nameProduct, brandProduct, extensions);
        await extensions.utils.simulatePausedAndAvailable(provider, ctx);

        log_success("[openai_middleware] - Request API Correctly");
        userState[phone] = {...userState[phone], history: [{role: "assistant", content: responseAi}]};
        await state.update(userState);

        for (let i = 0; i < responseApi.length; i++) {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(490, 410),
                delay2: setRandomDelay(1000, 950),
                ctx
            });

            await provider.vendor.sendMessage(ctx?.key?.remoteJid, {text: responseApi[i]});

        }

        return gotoFlow(new_search_flow);
    } catch (e) {
        idleStop(ctx)
        log_error("ERROR FLUJO openai_middleware", e);
        await handleErrorAndNotifySlack("ERROR FLUJO openai_middleware", e);
        await fallBack(randomElement(CONSTANTS.SYSTEM_DROP_MESSAGES));
    }
};


export {openai_middleware};
