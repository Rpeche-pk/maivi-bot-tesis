import {addKeyword} from "@builderbot/bot";
import {idleStart, idleStop} from "../../utils/idle.util.js";
import {on_middleware} from "../../middleware/on.middleware.js";
import {tokenMiddleware} from "../../middleware/token.middleware.js";
import {setRandomDelay} from "../../utils/delay.util.js";
import {CONSTANTS} from "../../config/index.js";
import chalk from "chalk";
import {menu_flow} from "../menu_flow/menu.flow.js";
import {randomGreeting} from "../../utils/HourlyGreeting.util.js";
import {randomElement} from "../../utils/random.util.js";

const REGEX_KEYWORD = "/^#(empezar)$/"; //"/^#(empezar)$/g";
const greeting = randomGreeting();

const on_flow = addKeyword(REGEX_KEYWORD, {regex: true})
    .addAction(async (ctx, {globalState, gotoFlow}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAction(on_middleware)
    .addAction(tokenMiddleware)
    .addAction(async (ctx, {flowDynamic, extensions, gotoFlow, provider}) => {
        const randomMessage = randomElement(CONSTANTS.MESSAGE_WELCOME_BACK);
        const randomImage = randomElement(CONSTANTS.URL_INTRO_BOT);
        await extensions.utils.typingWithoutDelay(provider, {
            delay1: setRandomDelay(350, 250),
            ctx
        });
        await flowDynamic([
            {
                body:
                    `${greeting[Math.floor(Math.random() * greeting.length)]}, ${randomMessage}`,
                media: randomElement(CONSTANTS.URL_IMAGE_BOT)
            },
        ]);
        await extensions.utils.simulatePausedAndAvailable(provider, ctx);

        await extensions.utils.typingWithoutDelay(provider, {
            delay1: setRandomDelay(450, 250),
            ctx
        });

        await flowDynamic([
            {
                media: `${randomImage}`,
            },
        ]);

        await extensions.utils.simulatePausedAndAvailable(provider, ctx);
        console.log(chalk.blue("ESTOY A PUNTO DE ENTRAR AL FLUJO PRINCIPAL BUSQUEDA"));
        idleStop(ctx);
        return gotoFlow(menu_flow);
    });


export {on_flow}
