import {idleReset,idleStop} from "../utils/idle.util.js";
import {setRandomDelay} from "../utils/delay.util.js";
import chalk from "chalk";
import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {log_error} from "../utils/logger.util.js";
import {randomElement} from "../utils/random.util.js";
import {CONSTANTS} from "../config/index.js";


const poll_middleware =async (ctx, {gotoFlow, provider, globalState, extensions, endFlow, state}) => {
    const myState = state.getMyState();
    try {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
        const jid = ctx?.key?.remoteJid;
        console.log(chalk.italic.blue(`ESTADO DEL FLUJO ${poll_middleware.name}`, JSON.stringify(myState)));
        if (ctx?.type !== 'poll') {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(800, 560),
                delay2: setRandomDelay(1000, 900),
                ctx
            });
            idleStop(ctx);
            await provider.vendor.sendMessage(jid, {delete: ctx?.key})
            return endFlow("💢 Debe elegir una de las opciones válidas, se cierra sesión por seguridad 🤨");
        }
        await extensions.utils.wait(350, 200);
        await provider.vendor.sendMessage(jid, {delete: ctx?.key});
        idleStop(ctx);
        await extensions.utils.wait(250, 150);
    } catch (error) {
        idleStop(ctx);
        log_error(`[PASO POLL ${poll_middleware.name}:]`, error);
        await handleErrorAndNotifySlack(`[PASO POLL ${poll_middleware.name}:]`, error);
        await endFlow(randomElement(CONSTANTS.GENERAL_MESSAGES_FAILURES));
    }
}

export {poll_middleware}
