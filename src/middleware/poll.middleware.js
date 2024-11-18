import {idleReset,idleStop} from "../utils/idle.util.js";
import {setRandomDelay} from "../utils/delay.util.js";
import chalk from "chalk";
import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {log_error} from "../utils/logger.util.js";


const poll_middleware =async (ctx, {gotoFlow, provider, globalState, extensions, endFlow, state}) => {
    try {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
        const jid = ctx?.key?.remoteJid;
        const myState = state.getMyState();
        console.log(chalk.italic.blue(`ESTADO DEL FLUJO ${poll_middleware.name}`, myState));
        if (ctx?.type !== 'poll') {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(800, 560),
                delay2: setRandomDelay(1500, 1300),
                ctx
            });
            idleStop(ctx);
            return endFlow("💢 Debe elegir una de las opciones válidas, se cierra sesión");
        }
        idleStop(ctx);
        await extensions.utils.wait(850, 760);
        await provider.vendor.sendMessage(jid, {delete: ctx?.key})
        await extensions.utils.wait(800, 560);
    } catch (error) {
        idleStop(ctx);
        await handleErrorAndNotifySlack(`[PASO POLL ${poll_middleware.name}:]`, error);
        log_error(`[PASO POLL ${poll_middleware.name}:]`, error);
    }
}

export {poll_middleware}