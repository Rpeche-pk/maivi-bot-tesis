import { createFlow } from "@builderbot/bot";
import {welcome_flow, start_chat_flow} from "./welcome_flow/welcome_flow.js";
import {advisorFlow} from "./advisor_flow/advisor.flow.js";
import {timeoutFlow,} from "./timeout_flow/timeout.flow.js";
import {menu_flow} from './menu_flow/menu.flow.js';
import {logoutFlow, ping_flow, sessionExpiredFlow, timeoutFlow as timeOut} from "./exit_flow/exit.flow.js";
import {choose_input_method_flow, search_explanation_flow,} from "./options_flow/search-product.flow.js";
import {off_flow} from "./off_flow/off.flow.js";
import {on_flow} from "./on_flow/on.flow.js";
import {welcome_greeting_flow} from "./welcome_back_flow/back.flow.js";
import {audioAIFlow, audioProcessFlow, flowBotAudio} from "./audio_flow/audio.flow.js";
import {search_audio_flow} from "./options_flow/audio_search_flow/audio_search.flow.js";
import {new_search_flow, search_product_flow} from "./options_flow/manual_search_flow/manual_search.flow.js";
import {cron_flow, process_exit} from "./cron_flow/cron.flow.js";
import {search_categories_flow} from "./options_flow/category_search_flow/category_search.flow.js";

export default createFlow([
    on_flow,
    off_flow,
    welcome_flow,
    ping_flow,
    menu_flow,
    welcome_greeting_flow,
    search_product_flow,
    search_explanation_flow,
    new_search_flow,
    advisorFlow,
    start_chat_flow,
    timeoutFlow,
    logoutFlow,
    timeOut,
    sessionExpiredFlow,
    flowBotAudio, audioAIFlow, audioProcessFlow,
    search_categories_flow,
    choose_input_method_flow,
    search_audio_flow,
    cron_flow,
    process_exit
]);
