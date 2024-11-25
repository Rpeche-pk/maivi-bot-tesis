import {CONSTANTS} from "../config/index.js";
import {log_error, log_success} from "../utils/logger.util.js";
import {createOrUpdate, findByPhone} from "../repository/bot.repository.js";
import {getDevice} from "../utils/device.utils.js";
import {createSimpleToken} from "../utils/token.util.js";
import {idleStop} from "../utils/idle.util.js";
import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {start_chat_flow} from "../app/welcome_flow/welcome_flow.js";


const on_middleware = async (ctx, {extensions, provider, gotoFlow, state}) => {
    try {
        const jid = ctx?.key?.remoteJid;
        const key = ctx?.key;
        const phone = ctx?.from;
        const idCtx = ctx?.key?.id;
        const myState = state.getMyState() ?? {};

        await provider.vendor.sendMessage(jid, {react: {key, text: "⏳"}});

        log_success("BOT ENCENDIDO-> ", myState);
        const user = await findByPhone(phone, extensions.db.botModels);

        if (user === null || user === undefined) {
            myState[ctx.from] = {...myState[ctx.from], on: true, intents: CONSTANTS.INTENTS, new: true};
            await state.update(myState);

            await createOrUpdate({
                ctx,
                device: getDevice(idCtx),
                token: createSimpleToken(ctx),
                db: extensions.db.botModels
            });
            idleStop(ctx);
            return gotoFlow(start_chat_flow);
        }
        myState[ctx.from] = {...myState[ctx.from], on: true, intents: CONSTANTS.INTENTS, new: false};
        await state.update(myState);
        log_success("USUARIO ENCONTRADO -> ", JSON.stringify(user));
    } catch (error) {
        idleStop(ctx);
        log_error("ERROR FLUJO onFlow", error);
        await handleErrorAndNotifySlack("ERROR FLUJO onFlow", error)
    }
}

export {on_middleware}
