import { addKeyword, EVENTS } from '@builderbot/bot'
import { setRandomDelay } from '../../utils/delay.util.js';
import { handleErrorAndNotifySlack } from '../../http/slack.http.js';
import { CONSTANTS } from '../../config/index.js';
import { log_error, log_warning } from '../../utils/logger.util.js';
import {idleStop} from "../../utils/idle.util.js";

const REGEX_EXIT = '/❌Salir del Sistema/g';

const logoutFlow = addKeyword(REGEX_EXIT, { regex: true })
    .addAction(async (ctx, { extensions, provider, flowDynamic, state, endFlow }) => {
        try {
            const from = ctx?.from;
            const jid = ctx?.key?.remoteJid;
            const myState = state.getMyState();

            myState[from] = { ...myState[from], on: false, intents: CONSTANTS.INTENTS };
            log_warning("BOT APAGADO desde flujo LogoutFlow-> ", myState);
            await extensions.utils.typing(provider, { delay1: setRandomDelay(750, 550), delay2: setRandomDelay(1750, 1480), ctx });
            await flowDynamic([{ body: "Gracias por usar nuestros servicios, hasta pronto 👋🏽\n _Recuerda que puedes volver a iniciar el bot escribiendo_ *#empezar*" }]);
            await extensions.utils.typingWithoutDelay(provider, { delay1: setRandomDelay(700, 500), delay2: setRandomDelay(950, 580), ctx });
            await flowDynamic([{ body: "👾 @Author @Rpeche-pk" }]);
            await extensions.utils.typing(provider, { delay1: setRandomDelay(650, 500), delay2: setRandomDelay(750, 540), ctx });
            const baileys = await provider.vendor.sendMessage(jid, {
                text: "https://github.com/Rpeche-pk",
            });
            await provider.vendor.sendMessage(jid, { react: { key: baileys?.key, text: "👾" } });
            await provider.vendor.sendPresenceUpdate("paused", jid);
            idleStop(ctx)
            state.clear();
            return endFlow();
        } catch (error) {
            idleStop(ctx)
            state.clear();
            await handleErrorAndNotifySlack("ERROR FLUJO offFlow", error);
            log_error("ERROR FLUJO offFlow", error);
        }
    });

const timeoutFlow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, { extensions, provider, endFlow }) => {
        try {
            const jid = ctx?.key?.remoteJid;
            await extensions.utils.typing(provider, { delay1: 650, delay2: 1000, ctx })
            await provider.vendor.sendMessage(jid, { text: "❌ Se ha agotado el tiempo de respuesta ❌" });
            return endFlow();
        } catch (e) {
            await handleErrorAndNotifySlack("Error en el flujo timeoutFlow", e);
            log_error("Error en el flujo timeoutFlow", e)
        }
    });

const sessionExpiredFlow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, { extensions, provider, endFlow }) => {
        try {
            const jid = ctx?.key?.remoteJid;
            await extensions.utils.typing(provider, { delay1: setRandomDelay(750, 550), delay2: setRandomDelay(1750, 1555), ctx })
            await provider.vendor.sendMessage(jid, { text: "❌ Su sesión dentro del sistema ha expirado ❌ , *vuelva a iniciar el bot escribiendo* 👉🏽 *#empezar*" });
            return endFlow();
        } catch (e) {
            await handleErrorAndNotifySlack("Error en el flujo sessionExpiredFlow", e);
            log_error("Error en el flujo sessionExpiredFlow", e)
        }
    });

export { logoutFlow, sessionExpiredFlow,timeoutFlow };