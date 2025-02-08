import {addKeyword} from "@builderbot/bot";
import chalk from "chalk";
import {advisorFlow} from "../advisor_flow/advisor.flow.js";
import {idleStop} from "../../utils/idle.util.js";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {log_error} from "../../utils/logger.util.js";

const REGEX_ADVISOR = "/^#(asesor)$/g";
const off_flow = addKeyword(REGEX_ADVISOR, {regex: true})
    .addAction(async (ctx, {
        extensions,
        state,
        provider,
        gotoFlow
    }) => {
        try {
            const jid = ctx?.key?.remoteJid;
            const myState = state.getMyState() ?? {};
            myState[ctx.from] = {...myState[ctx.from], on: false};
            await state.update(myState);
            console.log(chalk.bgCyan("BOT APAGADO -> "), chalk.cyan(JSON.stringify(myState)));
            await provider.vendor.sendMessage(jid, {react: {key: ctx?.key, text: "✅"}});
            await extensions.utils.wait(500, 450);
            await extensions.utils.typing(provider, {delay1: 850, delay2: 950, ctx});
            await provider.vendor.sendMessage(jid, {text: "En unos instantes el asesor se comunicará con usted..."}, {quoted: ctx});
            return gotoFlow(advisorFlow);
        } catch (error) {
            idleStop(ctx);
            await handleErrorAndNotifySlack(`[ERROR FLUJO offFlow:]`, error)
            log_error("ERROR FLUJO offFlow", error);
        }
    });

export {off_flow}
