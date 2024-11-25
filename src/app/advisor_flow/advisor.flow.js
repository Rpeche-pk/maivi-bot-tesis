import { addKeyword} from '@builderbot/bot'
import {setRandomDelay} from "../../utils/delay.util.js";
import {randomGreeting} from "../../utils/HourlyGreeting.util.js";
import chalk from "chalk";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {log_error} from "../../utils/logger.util.js";
import {idleStop} from "../../utils/idle.util.js";
const REGEX_ADVISOR= '/#asesor/g';


const advisorFlow = addKeyword(REGEX_ADVISOR,{})
    .addAction(async (ctx) => {
      idleStop(ctx);
    })
    .addAction(async (ctx, {extensions,provider, state}) => {
        try {
            const myState = state.getMyState() ?? {};
            const greeting = randomGreeting();
            const jid = ctx?.key?.remoteJid;
            myState[ctx.from] = {...myState[ctx.from], on: false};
            console.log(chalk.bgCyan("BOT APAGADO -> "), chalk.cyan(JSON.stringify(myState)));
            //await provider.vendor.readMessages([ctx?.key]);
            await provider.vendor.presenceSubscribe(jid);
            await extensions.utils.wait(setRandomDelay(750,550));
            await provider.vendor.sendPresenceUpdate("composing", jid);
            await extensions.utils.wait(setRandomDelay(1250,850));
            await provider.vendor.sendMessage(jid, {text: `${greeting[Math.floor(Math.random() * greeting.length)]} 💁🏻‍♀️ Digame en que puedo ayudarle`});
            await provider.vendor.sendPresenceUpdate("paused", jid);
        } catch (e) {
            await handleErrorAndNotifySlack("Error en el flujo timeoutFlow",e);
            log_error("Error en el flujo timeoutFlow",e);
        }
    });


export {advisorFlow};