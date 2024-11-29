import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {log_error, log_success} from "../utils/logger.util.js";
import {formatText} from "../utils/cleantext.util.js";
import {CONSTANTS} from "../config/index.js";
import {idleReset} from "../utils/idle.util.js";

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
        const userState = state.getMyState();
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

        return flowDynamic(responseAi);

    } catch (e) {
        await handleErrorAndNotifySlack("ERROR FLUJO openai_middleware", e);
        log_error("ERROR FLUJO openai_middleware", e);
    }
};

export {openai_middleware};
