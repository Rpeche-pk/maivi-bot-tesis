import {addKeyword} from "@builderbot/bot";
import {idleStart, idleStop} from "../../utils/idle.util.js";
import {on_middleware} from "../../middleware/on.middleware.js";
import {tokenMiddleware} from "../../middleware/token.middleware.js";
import {setRandomDelay} from "../../utils/delay.util.js";
import {CONSTANTS} from "../../config/index.js";
import chalk from "chalk";
import {menu_flow} from "../menu_flow/menu.flow.js";
import {randomGreeting} from "../../utils/HourlyGreeting.js";
import {randomElement} from "../../utils/random.util.js";

const REGEX_KEYWORD = "/^empezar$/"; //"/^#(empezar)$/g";
const greeting = randomGreeting();

const on_flow = addKeyword(REGEX_KEYWORD, {regex: true})
    .addAction(async (ctx, {globalState, gotoFlow}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAction(on_middleware)
    .addAction(tokenMiddleware)
    .addAction(async (ctx, {flowDynamic, extensions, gotoFlow, provider}) => {
        await extensions.utils.typing(provider, {
            delay1: setRandomDelay(800, 550),
            delay2: setRandomDelay(2500, 1950),
            ctx
        });
        const randomMessage = randomElement(CONSTANTS.MESSAGE_WELCOME_BACK);
        await flowDynamic([
            {
                body:
                    `${greeting[Math.floor(Math.random() * greeting.length)]}, ${randomMessage}`,
                media: randomElement(CONSTANTS.URL_IMAGE_BOT)
            },
        ]);
        for (let i = 0; i < CONSTANTS.MESSAGE_PRINCIPAL.length; i++) {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(800, 550),
                delay2: setRandomDelay(2850, 2200),
                ctx
            });
            await flowDynamic([{body: CONSTANTS.MESSAGE_PRINCIPAL[i]}]);
        }

        await extensions.utils.simulatePausedAndAvailable(provider, ctx);
        console.log(chalk.bgCyan("ESTOY A PUNTO DE ENTRAR AL FLUJO PRINCIPAL BUSQUEDA"));
        idleStop(ctx);
        return gotoFlow(menu_flow);
    });


export {on_flow}
