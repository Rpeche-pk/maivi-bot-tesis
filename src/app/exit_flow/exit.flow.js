import { addKeyword, EVENTS } from '@builderbot/bot'
import { setRandomDelay } from '../../utils/delay.util.js';
import { handleErrorAndNotifySlack } from '../../http/slack.http.js';
import { CONSTANTS } from '../../config/index.js';
import { log_error, log_warning } from '../../utils/logger.util.js';
import {idleStop} from "../../utils/idle.util.js";
import {welcome_greeting_flow} from "../welcome_back_flow/back.flow.js";
import {randomElement} from "../../utils/random.util.js";

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
            await flowDynamic([{ body: randomElement(CONSTANTS.SURVEY_MESSAGES).replace("[enlace]",CONSTANTS.SURVEY) }]);
            await flowDynamic([{ body: randomElement(CONSTANTS.FAREWELL_MESSAGES) }]);
            await extensions.utils.typingWithoutDelay(provider, { delay1: setRandomDelay(700, 500), delay2: setRandomDelay(950, 580), ctx });

            await extensions.utils.typing(provider, { delay1: setRandomDelay(750, 600), delay2: setRandomDelay(850, 640), ctx });
            const baileys = await provider.vendor.sendMessage(jid, {
                text: "👾 @Author @Rpeche-pk",
            });
            /*await uta.sendMessage(from, { audio : fs.readFileSync('./temp/audio/'+audioName), mimetype : 'audio/mp4',
                contextInfo : {
                    externalAdReply : {
                        title : info.videoDetails.title,
                        body : `UtaMD`,
                        sourceUrl : info.videoDetails.video_url,
                        mediaUrl : info.videoDetails.video_url,
                        thumbnail : fs.readFileSync('./temp/image/'+imageName),
                        mediaType : 2
                    }
                },
            }, { quoted : infos })*/
            await provider.vendor.sendMessage(jid, { react: { key: baileys?.key, text: "👽" } });
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
            await extensions.utils.typing(provider, { delay1: 450, delay2: 1050, ctx })
            await provider.vendor.sendMessage(jid, { text: "❌ Se ha agotado el tiempo de respuesta ❌" });
            await provider.vendor.sendMessage(jid, { text: "*Importante*, ¡Gracias por usar nuestro chatbot!\n" +
                    `¿Nos ayudas a mejorar? Dedica un minuto a llenar esta breve encuesta: ${CONSTANTS.SURVEY}. ⏳`});
            idleStop(ctx);
            return endFlow();
        } catch (e) {
            await handleErrorAndNotifySlack("Error en el flujo timeoutFlow", e);
            log_error("Error en el flujo timeoutFlow", e)
        }
    });

const sessionExpiredFlow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, { extensions, provider, gotoFlow, state }) => {
        try {
            const jid = ctx?.key?.remoteJid;

            await extensions.utils.typing(provider, { delay1: setRandomDelay(500, 450), delay2: setRandomDelay(1250, 1055), ctx })
            await provider.vendor.sendMessage(jid, { text: "❌ *Importante*, tu sesión ha expirado. ⏳"});
            await provider.vendor.sendMessage(jid, { text: "*Hola*, Tu opinión es muy importante. " +
            `Cuéntanos cómo fue tu experiencia con nuestro chatbot en esta encuesta rápida: ${CONSTANTS.SURVEY}. ⏳`});
            await extensions.utils.simulatePausedAndAvailable(provider, ctx);
            const myState = state.getMyState() ?? {};
            myState[ctx.from] = {...myState[ctx.from], on: true, intents: CONSTANTS.INTENTS, new: false};
            await state.update(myState);
            idleStop(ctx);
            await extensions.utils.wait(580, 475);
            return gotoFlow(welcome_greeting_flow);
        } catch (e) {
            await handleErrorAndNotifySlack("Error en el flujo sessionExpiredFlow", e);
            log_error("Error en el flujo sessionExpiredFlow", e)
        }
    });

const ping_flow = addKeyword("#ping", {})
    .addAction(async (ctx, { provider }) => {
        try {
            const jid = ctx?.key?.remoteJid;
            await provider.vendor.sendMessage(jid, { text: "👾 Floyd" });
        } catch (e) {
            await handleErrorAndNotifySlack("Error en el flujo pingFlow", e);
            log_error("Error en el flujo pingFlow", e)
        }
    });
export { logoutFlow,ping_flow, sessionExpiredFlow,timeoutFlow };
