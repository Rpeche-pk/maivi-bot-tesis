import { createFlow } from "@builderbot/bot";
import {welcomeFlow, start_chat_flow, welcome_greeting_flow} from "./welcome_flow/welcome.flow.js";
import {advisorFlow} from "./advisor_flow/advisor.flow.js";
import {timeoutFlow,} from "./timeout_flow/timeout.flow.js";
import {menu_flow} from './menu_flow/menu.flow.js';
import {logoutFlow,sessionExpiredFlow,timeoutFlow as timeOut} from "./exit_flow/exit.flow.js";
import {search_explanation_flow, search_product_flow} from "./options_flow/search-product.flow.js";
import {off_flow} from "./off_flow/off.flow.js";
import {on_flow} from "./on_flow/on.flow.js";

export default createFlow([
    on_flow,
    off_flow,
    welcomeFlow,
    menu_flow,
    welcome_greeting_flow,
    search_product_flow,
    search_explanation_flow,
    advisorFlow,
    start_chat_flow,
    timeoutFlow,
    logoutFlow,
    timeOut,
    sessionExpiredFlow
]);
