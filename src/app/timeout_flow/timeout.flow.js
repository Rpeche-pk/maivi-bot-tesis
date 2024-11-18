import { addKeyword, EVENTS } from "@builderbot/bot";
import chalk from "chalk";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";



const timeoutFlow= addKeyword(EVENTS.ACTION,{})
    .addAction(async (ctx, {extensions,provider,endFlow}) => {
        try {
            const jid = ctx?.key?.remoteJid;
            await extensions.utils.typing(provider, {delay1: 650, delay2: 1000, ctx})
            await provider.vendor.sendMessage(jid, {text: "❌ Se ha agotado el tiempo de respuesta ❌"});
            await extensions.utils.simulatePausedAndAvailable(provider, ctx);
            return endFlow();
        } catch (e) {
            await handleErrorAndNotifySlack(`Error en el FLOW timeoutFlow`,e);
            console.error(chalk.red.bold("Error en el flujo timeoutFlow"), e.message)
        }
    });

export {timeoutFlow}