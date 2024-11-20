import { createFlow } from "@builderbot/bot";
import { offFlow, onFlow,welcomeFlow,startChat } from "./welcome_flow/welcome.flow.js";
import {advisorFlow} from "./advisor_flow/advisor.flow.js";
import {timeoutFlow,} from "./timeout_flow/timeout.flow.js";
import {menu_flow} from './menu_flow/menu.flow.js';
import {logoutFlow,sessionExpiredFlow,timeoutFlow as timeOut} from "./exit_flow/exit.flow.js";
import {search_product_flow} from "./options_flow/search-product.flow.js";

export default createFlow([
    welcomeFlow,
    offFlow,
    menu_flow,
    search_product_flow,
    advisorFlow,
    onFlow,
    startChat,
    timeoutFlow,
    logoutFlow,
    timeOut,
    sessionExpiredFlow
]);