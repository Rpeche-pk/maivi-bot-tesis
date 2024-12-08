import {addKeyword, EVENTS} from '@builderbot/bot'
import {setRandomDelay} from "../../utils/delay.util.js";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {log_error} from "../../utils/logger.util.js";
import {audio_gpt_middleware} from "../../middleware/audioAI.middleware.js";

const flowBotAudio = addKeyword(EVENTS.VOICE_NOTE)
    .addAction(async (_, {gotoFlow}) => {
    return gotoFlow(audioProcessFlow)
})

const audioAIFlow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {extensions, provider, flowDynamic}) => {
        try {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(750, 550),
                delay2: setRandomDelay(1500, 1250),
                ctx
            });
            await flowDynamic("Te escucho, ¿en qué puedo ayudarte? 🎤");
        } catch (e) {
            await handleErrorAndNotifySlack("ERROR FLUJO audioAIFlow", e);
            log_error("ERROR FLUJO welcomeFlow", e);
        }
    })
    .addAction({capture: true}, audio_gpt_middleware);


const audioProcessFlow = addKeyword(EVENTS.ACTION, {})
    .addAction(audio_gpt_middleware)

export {flowBotAudio, audioAIFlow, audioProcessFlow}
