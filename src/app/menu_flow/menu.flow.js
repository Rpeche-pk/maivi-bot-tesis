import {addKeyword, EVENTS} from '@builderbot/bot'
import {idleStart} from "../../utils/idle.util.js";
import {setRandomDelay} from "../../utils/delay.util.js";
import {poll_middleware} from "../../middleware/poll.middleware.js";


const menu_flow = addKeyword(EVENTS.ACTION, {})
    .addAction(async (ctx, {gotoFlow, globalState}) => {
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    })
    .addAnswer("📌 Elija una opción del listado, *pulse sobre ella* 👇🏽: ",
        {
            capture: true,
            delay: setRandomDelay(450, 250),
            buttons: [{"body": "*Buscar por producto y marca*"},{"body": "*Buscar por categoría*"}, {"body": "*Ayuda o asesor*"},{"body": "❌Salir del Sistema"}]
        },
        poll_middleware)

export {menu_flow};
