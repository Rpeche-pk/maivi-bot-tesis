import {addKeyword} from "@builderbot/bot";
import {idleReset, idleStart, idleStop} from "../../../utils/idle.util.js";
import {audio_gpt_middleware} from "../../../middleware/audioAI.middleware.js";
import {setRandomDelay} from "../../../utils/delay.util.js";
import {logoutFlow} from "../../exit_flow/exit.flow.js";
import {CONSTANTS} from "../../../config/index.js";
import {log_error} from "../../../utils/logger.util.js";
import {handleErrorAndNotifySlack} from "../../../http/slack.http.js";

const REGEX_INPUT_AUDIO = '/Dictar por Audio/g';

/*
* THIS FLOW IS TRIGGERED WHEN YOU WANT TO SEARCH FOR THE PRODUCT USING VOICE AUDIO
*/
const search_audio_flow = addKeyword(REGEX_INPUT_AUDIO, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState, flowDynamic}) => {
        idleStop(ctx);
        idleStart(ctx, gotoFlow, globalState.get("timer"));
        await flowDynamic("🎤 *Te escucho, envíame un audio con tu consulta*");
    }).addAction({capture: true}, audio_gpt_middleware)
    .addAnswer("🔍 Estimada(o) usuario *¿Deseas realizar otra consulta?*",
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
            if (body === 'si') return gotoFlow(search_audio_flow);

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

export {search_audio_flow};

