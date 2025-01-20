import {addKeyword, EVENTS} from "@builderbot/bot";
import {idleReset, idleStart, idleStop} from "../../utils/idle.util.js";
import {off_flow} from "../off_flow/off.flow.js";
import {on_flow} from "../on_flow/on.flow.js";
import {handleErrorAndNotifySlack} from "../../http/slack.http.js";
import {log_error} from "../../utils/logger.util.js";
import {randomGreeting} from '../../utils/HourlyGreeting.util.js';
import {CONSTANTS} from '../../config/index.js';
import {setRandomDelay} from "../../utils/delay.util.js";
import {randomElement} from "../../utils/random.util.js";

const greeting = randomGreeting();

const welcome_greeting_flow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {globalState, gotoFlow}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer(
        `💬 ${greeting[Math.floor(Math.random() * greeting.length)]} _para_ _iniciar_ _la_ _conversación_ _dentro_ _del_ _sistema_ _*MAIVI BOT*_ \n📲 *Digíte una opción, que sea un número*\n╠ *[1]* 👉🏽 _para empezar_\n╙ *[2]* 👉🏽 _para consultas puntuales_`,
        {
            capture: true,
            delay: setRandomDelay(590, 510),
            media: randomElement(CONSTANTS.IMAGE_SESSION_EXPIRED)
        },
        async (ctx, {state, extensions, globalState, provider, fallBack, flowDynamic, endFlow, gotoFlow}) => {
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
                idleStop(ctx);
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
                log_error("ERROR FLUJO welcomeFlow", error);
                await handleErrorAndNotifySlack("ERROR FLUJO welcomeFlow", error);
                return endFlow(error.message);
            }
        });

export {welcome_greeting_flow};
