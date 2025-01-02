import {addKeyword, EVENTS} from '@builderbot/bot'
import chalk from "chalk";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {config} from 'dotenv';
import {idleStart, idleStop} from "../../utils/idle.util.js";
import {log_error, log_success, log_warning} from '../../utils/logger.util.js';
import {setRandomDelay} from '../../utils/delay.util.js';
import {randomGreeting} from '../../utils/HourlyGreeting.util.js';
import {CONSTANTS} from '../../config/index.js';
import {greetingUtil} from '../../utils/greeting.util.js'
import {tokenMiddleware} from '../../middleware/token.middleware.js';
import {menu_flow} from "../menu_flow/menu.flow.js";
import {on_middleware} from "../../middleware/on.middleware.js";
import {randomElement} from "../../utils/random.util.js";

config()

const greetingUtils = greetingUtil();
const greeting = randomGreeting();

const start_chat_flow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {globalState, gotoFlow}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAction(async (ctx, {extensions, provider, flowDynamic, gotoFlow}) => {
        try {
            const randomImage = randomElement(CONSTANTS.URL_IMAGE_BOT);
            await extensions.utils.typingWithoutDelay(provider, {
                delay1: setRandomDelay(520, 450),
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
                    delay1: setRandomDelay(490, 410),
                    delay2: setRandomDelay(600, 550),
                    ctx
                });
                await flowDynamic([{body: explanations[i]}]);
            }

            await provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
            await extensions.utils.wait(550, 500);
            idleStop(ctx);
            return gotoFlow(menu_flow);
        } catch (error) {
            idleStop(ctx);
            await handleErrorAndNotifySlack("ERROR FLUJO startChat", error);
            log_error("ERROR FLUJO startChat", error);
        }
    });

const welcome_flow = addKeyword(EVENTS.WELCOME, {})
    .addAction(async (ctx, ctxFn) => {
        try {
            const myState = ctxFn.state.getMyState() ?? {};
            const phoneNumber = ctx?.from;

            idleStart(ctx, ctxFn.gotoFlow, ctxFn.globalState.get("timer"));

            log_success(`\nRevisando si ${phoneNumber} está encendido...`);

            log_success("1° Estado del telefono", myState[phoneNumber]);

            if (typeof myState[phoneNumber] === "undefined") {
                myState[phoneNumber] = {...myState[phoneNumber], on: true, intents: CONSTANTS.INTENTS, new: true};
                await ctxFn.state.update(myState);
                log_success("Estado del telefono", myState);
            }

            if (!myState[phoneNumber]?.on) {
                log_warning("BOT APAGADO desde welcomeFlow -> ", chalk.blue.bold(JSON.stringify(myState)));
                idleStop(ctx);
                return ctxFn.endFlow();
            }

        } catch (error) {
            idleStop(ctx);
            log_error("ERROR FLUJO welcomeFlow", error);
            await handleErrorAndNotifySlack("ERROR FLUJO welcomeFlow", error)
        }
    })
    .addAction(on_middleware)
    .addAction(tokenMiddleware)
    .addAction(async (ctx, {provider, state, gotoFlow, flowDynamic, extensions}) => {
        const myState = state.getMyState() ?? {};
        const numberPhone = ctx?.from;
        if (myState[numberPhone]?.new === false) {
            log_success("Usuario recurrente, desde welcomeFlow -> ", myState);

            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(520, 450),
                delay2: setRandomDelay(600, 550),
                ctx
            });

            await flowDynamic([{
                body: `${greeting[Math.floor(Math.random() * greeting.length)]}, ${randomElement(CONSTANTS.MESSAGE_WELCOME_BACK)}`,
                media: randomElement(CONSTANTS.URL_IMAGE_BOT)
            }])
            await provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);

            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(600, 500),
                delay2: setRandomDelay(1100, 1050),
                ctx
            });
            await flowDynamic(CONSTANTS.MESSAGE_BACK_USER);
            await extensions.utils.simulatePausedAndAvailable(provider, ctx);
            idleStop(ctx);
            return gotoFlow(menu_flow);
        }
    });

export {welcome_flow, start_chat_flow};
