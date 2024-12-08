import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {log_error, log_success} from "../utils/logger.util.js";
import {formatText} from "../utils/cleantext.util.js";
import {CONSTANTS} from "../config/index.js";
import {idleReset} from "../utils/idle.util.js";
import {setRandomDelay} from "../utils/delay.util.js";
import {getProductsApi} from "../service/api.service.js";

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

        const responseAI = await extensions.ai.determineChatFn(body, userState[phone]?.history);
        log_success("PREDICTION", responseAI);

        if (responseAI.prediction.toLowerCase().includes('unknown')) {
            await extensions.utils.tryAgain({
                ctx,
                state,
                fallBack,
                provider,
                flowDynamic,
                endFlow
            }, CONSTANTS.MESSAGES.FAIL_PREDICTION);
            return;
        }

        await flowDynamic("⏱ *Consultando... ⏱*");
        const myState = state?.getMyState();
        const responseAi = await extensions.ai.startChatAI(body, myState[phone]?.history);

        const arrayParams = String(responseAi).split("+");
        const nameProduct = arrayParams[0].trim();
        const brandProduct = arrayParams[1].trim();

        const responseApi = await getProductsApi(nameProduct, brandProduct, extensions);

        userState[phone] = {...userState[phone], history: [{role: "assistant", content: responseAi}]};
        await state.update(userState);


        for (let i = 0; i < responseApi.length; i++) {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(490, 410),
                delay2: setRandomDelay(1250, 1090),
                ctx
            });
            await flowDynamic([{body: responseApi[i]}]);
        }

    } catch (e) {
        await handleErrorAndNotifySlack("ERROR FLUJO openai_middleware", e);
        log_error("ERROR FLUJO openai_middleware", e);
    }
};



export {openai_middleware};
