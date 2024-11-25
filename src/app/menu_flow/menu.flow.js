import {addKeyword, EVENTS} from '@builderbot/bot'
import {idleStart} from "../../utils/idle.util.js";
import {setRandomDelay} from "../../utils/delay.util.js";
import {poll_middleware} from "../../middleware/poll.middleware.js";
import {CONSTANTS} from "../../config/index.js";


const menu_flow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer(CONSTANTS.MESSAGE_BACK_USER,
        {delay: setRandomDelay(950, 850)},null)
    .addAnswer("📌 Elija una opción del listado, *pulse sobre ella* 👇🏽: ",
        {
            capture: true,
            delay: setRandomDelay(950, 850),
            buttons: [{"body": "*Buscar por categoría*"}, {"body": "*Buscar por producto más marca*"}, {"body": "*Ayuda o asesor*"},{"body": "❌Salir del Sistema"}]
        },
        poll_middleware)

export {menu_flow};