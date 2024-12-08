import {isAudio} from "../utils/validate.util.js"
import {setRandomDelay} from "../utils/delay.util.js";
import {downloadMediaMessage} from "@whiskeysockets/baileys";
import {processAudioToText} from "../service/hugginface.service.js";
import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {log_error, log_success} from "../utils/logger.util.js";
import {formatText} from "../utils/cleantext.util.js";
import {CONSTANTS} from "../config/index.js";
import {getProductsApi} from "../service/api.service.js";

const audio_gpt_middleware = async (ctx, {extensions, provider, fallBack, flowDynamic, endFlow, state}) => {
    try {
        const userState = state?.getMyState();
        const phone = ctx?.from;

        if (!isAudio(ctx)) {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(580, 500),
                delay2: setRandomDelay(1010, 900),
                ctx
            });
            await flowDynamic("Por favor envíame un audio 🎤");
            return fallBack();
        }

        await extensions.utils.typingWithoutDelay(provider, {
            delay1: setRandomDelay(650, 500),
            ctx
        });
        const audioBuffer = await downloadMediaMessage(ctx, "buffer", {});
        const response = await processAudioToText(audioBuffer, ctx?.key?.id + ".ogg");

        if (!response.success) {
            await flowDynamic('❌ *Error* al procesar audio intenta de nuevo');
            return fallBack();
        }

        ctx.body = response.output.data[0].trim()
        const body = formatText(ctx?.body);
        userState[phone] = {...userState[phone], history: [{role: "user", content: body}]};
        const responseAI = await extensions.ai.determineChatFn(body, userState[phone]?.history);
        await state.update(userState);
        log_success("[PREDICTION AUDIO GTP] =>", responseAI);

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

        await flowDynamic("✅ Se procesó, *correctamente* tu audio." + "\n" + "🔍 *Consulta:* " + ctx.body);

        const myState = state?.getMyState();
        const responseAi = await extensions.ai.startChatAI(body, myState[phone]?.history);

        const arrayParams = String(responseAi).split("+");
        const nameProduct = arrayParams[0].trim();
        const brandProduct = arrayParams[1].trim();


        const responseApi = await getProductsApi(nameProduct, brandProduct, extensions);

        userState[phone] = {...userState[phone], history: [{role: "assistant", content: responseAi}]};
        await state.update(userState);

        for (let element of responseApi) {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(590, 500),
                delay2: setRandomDelay(1120, 1010),
                ctx
            });
            await flowDynamic([{body: element}]);
            await extensions.utils.simulatePausedAndAvailable(provider, ctx);
        }
        return endFlow();
    } catch (e) {
        await handleErrorAndNotifySlack("[ERROR FLOW] audio_gpt_middleware", e);
        log_error("[ERROR FLOW] audio_gpt_middleware", e);
    }
};

export {audio_gpt_middleware};
