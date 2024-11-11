import { createFlow } from "@builderbot/bot";
import { offFlow, onFlow,welcomeFlow,startChat } from "./welcome_flow/welcome.flow.js";
import {advisorFlow} from "./advisor_flow/advisor.flow.js";
import {timeoutFlow,} from "./timeout_flow/timeout.flow.js";
import {logoutFlow,sessionExpiredFlow,timeoutFlow as timeOut} from "./exit_flow/exit.flow.js";

export default createFlow([
    welcomeFlow,
    offFlow,
    advisorFlow,
    onFlow,
    startChat,
    timeoutFlow,
    logoutFlow,
    timeOut,
    sessionExpiredFlow
]);