import { addKeyword, EVENTS } from '@builderbot/bot'
import chalk from "chalk";
import { handleErrorAndNotifySlack } from "../../http/slack.http.js";

import { idleStart, idleStop, idleReset } from "../../utils/idle.util.js";
import { log_success, log_error, log_warning } from '../../utils/logger.util.js';
import { advisorFlow } from '../advisor_flow/advisor.flow.js';
import { setRandomDelay } from '../../utils/delay.util.js';
import { randomGreeting } from '../../utils/HourlyGreeting.js';
import { CONSTANTS } from '../../config/index.js';
import { createOrUpdate, findByPhone } from '../../repository/bot.repository.js';
import { getDevice } from '../../utils/device.utils.js';
import { createSimpleToken } from '../../utils/token.util.js';
import { greetingUtil} from '../../utils/greeting.util.js'
import { tokenMiddleware } from '../../middleware/token.middleware.js';

const REGEX_ADVISOR = "/^#(asesor)$/g";
const REGEX_KEYWORD = "/^#(empezar)$/g";
const greetingUtils = greetingUtil();

const greeting = randomGreeting();

const offFlow = addKeyword(REGEX_ADVISOR, { regex: true })
    .addAction(async (ctx, {
        extensions,
        state,
        provider,
        gotoFlow
    }) => {
        try {
            const jid = ctx?.key?.remoteJid;
            const myState = state.getMyState() ?? {};
            myState[ctx.from] = { ...myState[ctx.from], on: false };
            await state.update(myState);
            console.log(chalk.bgCyan("BOT APAGADO -> "), chalk.cyan(JSON.stringify(myState)));
            await provider.vendor.sendMessage(jid, { react: { key: ctx?.key, text: "✅" } });
            await extensions.utils.wait(850, 550);
            await extensions.utils.typing(provider, { delay1: 850, delay2: 950, ctx });
            await provider.vendor.sendMessage(jid, { text: "En unos instantes el asesor se comunicará con usted..." }, { quoted: ctx });
            return gotoFlow(advisorFlow);
        } catch (error) {
            await handleErrorAndNotifySlack(`[ERROR FLUJO offFlow:]` ,error )
            log_error("ERROR FLUJO offFlow", error);
        }
    });

const onFlow = addKeyword(REGEX_KEYWORD, { regex: true })
    .addAction(async (ctx, { extensions, provider, gotoFlow, state }) => {
        try {
            const jid = ctx?.key?.remoteJid;
            const key = ctx?.key;
            const phone = ctx?.from;
            const idCtx = ctx?.key?.id;
            const myState = state.getMyState() ?? {};
            myState[ctx.from] = { ...myState[ctx.from], on: true, intents: CONSTANTS.INTENTS };
            await state.update(myState);

            await provider.vendor.sendMessage(jid, { react: { key, text: "⏳" } });

            log_success("BOT ENCENDIDO-> ", chalk.cyan(JSON.stringify(myState)));
            const user = await findByPhone(phone, extensions.db.botModels);

            if (user === null) {
                await createOrUpdate({ ctx, device: getDevice(idCtx), token: createSimpleToken(ctx), db: extensions.db.botModels });
                return gotoFlow(startChat);
            }

        } catch (error) {
            log_error("ERROR FLUJO onFlow", error);
            await handleErrorAndNotifySlack("ERROR FLUJO onFlow", error)
        }
    }).addAction(tokenMiddleware)
    .addAction(async (ctx, { flowDynamic, extensions, provider }) => {
        await extensions.utils.typing(provider, { delay1: setRandomDelay(800, 550), delay2: setRandomDelay(1500, 1200), ctx });
        await flowDynamic([{ body: `${greeting[Math.floor(Math.random() * greeting.length)]}, bienvenido(a) nuevamente 💁🏻‍♀️` }]);
        await provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
        console.log(chalk.bgCyan("ESTOY A PUNTO DE ENTRAR AL FLUJO PRINCIPAL BUSQUEDA"));
        //return gotoFlow(essaludFlow);
    });


const startChat = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, { extensions, provider, flowDynamic }) => {
        try {
            const randomImage = randomImages(CONSTANTS.URL_IMAGE_BOT);
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(800, 550),
                delay2: setRandomDelay(1500, 1200),
                ctx
            });
            await flowDynamic([
                {
                    body:
                        greeting[Math.floor(Math.random() * greeting.length)] + " " + greetingUtils[Math.floor(Math.random() * greeting.length)],
                    media: `${randomImage}`,
                },
            ]);

            await provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
            await extensions.utils.wait(750,600);
            //return gotoFlow(acceptClauses);
        } catch (error) {
            await handleErrorAndNotifySlack("ERROR FLUJO startChat", error);
            log_error("ERROR FLUJO startChat", error);
        }
    });


const welcomeFlow = addKeyword(EVENTS.WELCOME, {})
    .addAction(async (ctx, ctxFn) => {
        try {
            const myState = ctxFn.state.getMyState() ?? {};
            const phoneNumber = ctx?.from;
            log_success(`\nRevisando si ${phoneNumber} está encendido...`);

            log_success("1° Estado del telefono", myState[phoneNumber]);

            if (typeof myState[phoneNumber] === "undefined") {
                myState[phoneNumber] = { ...myState[phoneNumber], on: true, intents: 2 };
                await ctxFn.state.update(myState);
                log_success("Estado del telefono", myState);
            }

            if (!myState[phoneNumber]?.on) {
                log_warning("BOT APAGADO desde welcomeFlow -> ", chalk.blue.bold(JSON.stringify(myState)));
                return ctxFn.endFlow();
            }
            await ctxFn.extensions.utils.typing(ctxFn.provider, {
                delay1: setRandomDelay(800, 550),
                delay2: setRandomDelay(1200, 1000),
                ctx
            });

        } catch (error) {
            log_error("ERROR FLUJO welcomeFlow", error);
            await handleErrorAndNotifySlack("ERROR FLUJO welcomeFlow", error)
        }
    })
    .addAction(async (ctx, { gotoFlow, globalState }) => {
        idleStart(ctx, gotoFlow, globalState.getMyState().timer);
    })
    .addAnswer(
        `💬 ${greeting[Math.floor(Math.random() * greeting.length)]} _para_ _iniciar_ _la_ _conversación_ _dentro_ _del_ _sistema_ _*MAIVI BOT*_ \n📲 *Digíte una opción que inicie* *#*\n╠ 👉🏽 *#empezar* 👈🏽 _para iniciar_\n╙ 👉🏽 *#asesor* 👈🏽 _para consultas puntuales_`,
        { capture: true, ref: "welcomeFlow ejecutado" }
    ).addAction(async (ctx, { extensions, globalState, state, provider, fallBack, flowDynamic, endFlow, gotoFlow }) => {
        idleReset(ctx, gotoFlow, globalState.getMyState().timer);
        const answer = ctx?.body.trim();

        try {
            if (["#empezar", "#asesor", "#youtube"].includes(answer)) {
                switch (answer) {
                    case "#asesor":
                        idleStop(ctx);
                        return gotoFlow(offFlow);
                    case "#empezar":
                        idleStop(ctx);
                        return gotoFlow(onFlow);
                    default:
                        break;
                }
            }
            await extensions.utils.tryAgain({ ctx, state, fallBack, provider, flowDynamic, endFlow }, CONSTANTS.MESSAGES.FAIL);
        } catch (error) {
            await handleErrorAndNotifySlack("ERROR FLUJO welcomeFlow", error);
            log_error("ERROR FLUJO welcomeFlow", error);
        }

    });

function randomImages(URL_IMAGE) {
    return URL_IMAGE[Math.floor(Math.random() * URL_IMAGE.length)];
}

export { offFlow, welcomeFlow, onFlow,startChat };