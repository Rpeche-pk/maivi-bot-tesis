import {isAudio} from "../utils/validate.util.js"
import {setRandomDelay} from "../utils/delay.util.js";
import {downloadMediaMessage} from "@whiskeysockets/baileys";
import {processAudioToText} from "../service/hugginface.service.js";
import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {log_error} from "../utils/logger.util.js";

const gpt_middleware = async (ctx, {extensions, provider, fallBack, flowDynamic, endFlow}) => {
    try {
        if (isAudio(ctx)) {
            await extensions.utils.typingWithoutDelay(provider, {
                delay1: setRandomDelay(650, 500),
                ctx
            });
            const audioBuffer = await downloadMediaMessage(ctx, "buffer",{});
            const response = await processAudioToText(audioBuffer, ctx?.key?.id + ".ogg");
            if (response.success) {
                ctx.body = response.output.data[0].trim()
            } else {
                await flowDynamic('❌ *Error* al procesar audio intenta de nuevo');
                return fallBack();
            }
            await extensions.utils.wait(500);
            await flowDynamic("✅ Se procesó, *correctamente* tu audio." + "\n" + "🔍 *Consulta:* " + ctx.body);


            await provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
        } else {
            await flowDynamic("Por favor envíame un audio 🎤");
            return fallBack();
        }
        return endFlow();
    } catch (e) {
        await handleErrorAndNotifySlack("ERROR FLUJO gpt_middleware", e);
        log_error("ERROR FLUJO gpt_middleware", e);
    }
};

export {gpt_middleware};
