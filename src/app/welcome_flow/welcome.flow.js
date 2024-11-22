import {addKeyword, EVENTS} from '@builderbot/bot'
import chalk from "chalk";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {config} from 'dotenv';
import {idleReset, idleStart, idleStop} from "../../utils/idle.util.js";
import {log_error, log_success, log_warning} from '../../utils/logger.util.js';
import {setRandomDelay} from '../../utils/delay.util.js';
import {randomGreeting} from '../../utils/HourlyGreeting.js';
import {CONSTANTS} from '../../config/index.js';
import {greetingUtil} from '../../utils/greeting.util.js'
import {token_middleware} from '../../middleware/token_middleware.js';
import {menu_flow} from "../menu_flow/menu.flow.js";
import {on_middleware} from "../../middleware/on.middleware.js";
import {on_flow} from "../on_flow/on.flow.js";
import {off_flow} from "../off_flow/off.flow.js";
import {randomElement} from "../../utils/random.util.js";

config()

const greetingUtils = greetingUtil();
const greeting = randomGreeting();

const start_chat_flow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {extensions, provider, flowDynamic, gotoFlow}) => {
        try {
            const randomImage = randomElement(CONSTANTS.URL_IMAGE_BOT);
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

            const explanations = CONSTANTS.MESSAGE_PRINCIPAL;

            for (let i = 0; i < explanations.length; i++) {
                await extensions.utils.typing(provider, {
                    delay1: setRandomDelay(800, 550),
                    delay2: setRandomDelay(2850, 2200),
                    ctx
                });
                await flowDynamic([{body: explanations[i]}]);
            }

            await provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
            await extensions.utils.wait(750, 600);
            return gotoFlow(menu_flow);
        } catch (error) {
            idleStop(ctx);
            await handleErrorAndNotifySlack("ERROR FLUJO startChat", error);
            log_error("ERROR FLUJO startChat", error);
        }
    });

const welcome_greeting_flow = addKeyword(EVENTS.ACTION, {})
    .addAnswer(
        `💬 ${greeting[Math.floor(Math.random() * greeting.length)]} _para_ _iniciar_ _la_ _conversación_ _dentro_ _del_ _sistema_ _*MAIVI BOT*_ \n📲 *Digíte una opción, que sea un número*\n╠ *[1]* 👉🏽_para empezar_\n╙ *[2]* 👉🏽_para consultas puntuales_`,
        {capture: true, ref: "welcome_greeting_flow_executed"}
    ).addAction(async (ctx, {state, extensions, globalState, provider, fallBack, flowDynamic, endFlow, gotoFlow}) => {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
        const answer = ctx?.body.trim().toLowerCase();
        const numberOptions = new RegExp(/^[12]$/);
        try {
            if (numberOptions.test(answer)) {
                switch (answer) {
                    case "2":
                        idleStop(ctx);
                        return gotoFlow(off_flow);
                    case "1":
                        idleStop(ctx);
                        return gotoFlow(on_flow);
                    default:
                        break;
                }
            }
            await extensions.utils.tryAgain({
                ctx,
                state,
                fallBack,
                provider,
                flowDynamic,
                endFlow
            }, CONSTANTS.MESSAGES.FAIL);
        } catch (error) {
            idleStop(ctx);
            await handleErrorAndNotifySlack("ERROR FLUJO welcomeFlow", error);
            log_error("ERROR FLUJO welcomeFlow", error);
        }

    });


const welcomeFlow = addKeyword(EVENTS.WELCOME, {})
    .addAction(on_middleware)
    .addAction(token_middleware)
    .addAction(async (ctx, {provider,state, gotoFlow, flowDynamic, extensions}) => {
        const myState = state.getMyState() ?? {};
        const numberPhone = ctx?.from;
        if (myState[numberPhone]?.new === false) {
            log_success("Usuario recurrente, desde welcomeFlow -> ", myState);

            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(800, 550),
                delay2: setRandomDelay(2850, 1980),
                ctx
            });

            await flowDynamic([{
                body: `${greeting[Math.floor(Math.random() * greeting.length)]}, ${randomElement(CONSTANTS.MESSAGE_WELCOME_BACK)}`,
                media: randomElement(CONSTANTS.URL_IMAGE_BOT)
            }])

            await extensions.utils.simulatePausedAndAvailable(provider, ctx);
            await extensions.utils.wait(650, 550);
            return gotoFlow(menu_flow);
        }
    })
    .addAction(async (ctx, ctxFn) => {
        try {
            const myState = ctxFn.state.getMyState() ?? {};
            const phoneNumber = ctx?.from;
            log_success(`\nRevisando si ${phoneNumber} está encendido...`);

            log_success("1° Estado del telefono", myState[phoneNumber]);

            if (typeof myState[phoneNumber] === "undefined") {
                myState[phoneNumber] = {...myState[phoneNumber], on: true, intents: CONSTANTS.INTENTS, new: true};
                await ctxFn.state.update(myState);
                log_success("Estado del telefono", myState);
            }

            if (!myState[phoneNumber]?.on) {
                log_warning("BOT APAGADO desde welcomeFlow -> ", chalk.blue.bold(JSON.stringify(myState)));
                return ctxFn.endFlow();
            }
            await ctxFn.extensions.utils.typing(ctxFn.provider, {
                delay1: setRandomDelay(800, 550),
                delay2: setRandomDelay(2850, 1980),
                ctx
            });

        } catch (error) {
            log_error("ERROR FLUJO welcomeFlow", error);
            await handleErrorAndNotifySlack("ERROR FLUJO welcomeFlow", error)
        }
    })
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
        return gotoFlow(welcome_greeting_flow);
    });


export {welcomeFlow, start_chat_flow, welcome_greeting_flow};
