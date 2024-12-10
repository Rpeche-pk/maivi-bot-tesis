import {addKeyword} from "@builderbot/bot";
import {idleStart, idleStop} from "../../../utils/idle.util.js";
import {audio_gpt_middleware} from "../../../middleware/audioAI.middleware.js";

const REGEX_INPUT_AUDIO = '/Dictar por Audio/g';

/*
* THIS FLOW IS TRIGGERED WHEN YOU WANT TO SEARCH FOR THE PRODUCT USING VOICE AUDIO
*/
const search_audio_flow = addKeyword(REGEX_INPUT_AUDIO, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState, flowDynamic}) => {
        idleStop(ctx);
        idleStart(ctx, gotoFlow, globalState.get("timer"));
        await flowDynamic("🎤 *Te escucho, envíame un audio con tu consulta*");
    }).addAction({capture: true}, audio_gpt_middleware);

export {search_audio_flow};

