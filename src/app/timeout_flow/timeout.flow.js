import { addKeyword, EVENTS } from "@builderbot/bot";
import chalk from "chalk";
import {handleErrorAndNotifySlack} from "../../http/slack.http";



const timeoutFlow= addKeyword(EVENTS.ACTION,{})
    .addAction(async (ctx, {extensions,provider,endFlow}) => {
        try {
            const jid = ctx?.key?.remoteJid;
            await extensions.utils.typing(provider, {delay1: 650, delay2: 1000, ctx})
            await provider.vendor.sendMessage(jid, {text: "❌ Se ha agotado el tiempo de respuesta ❌"});
            await provider.vendor.sendPresenceUpdate("paused", jid);
            return endFlow();
        } catch (e) {
            await handleErrorAndNotifySlack({
                text: `Error en el FLOW timeoutFlow: ${e.message}`,
                error: e
            });
            console.error(chalk.red.bold("Error en el flujo timeoutFlow"), e.message)
        }
    });

export {timeoutFlow}