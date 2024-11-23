import {expiredToken, createSimpleToken} from '../utils/token.util.js';
import {getDevice} from "../utils/device.utils.js";
import {createOrUpdate, findByPhone} from '../repository/bot.repository.js';
import { log_error } from '../utils/logger.util.js';
import {sessionExpiredFlow} from "../app/exit_flow/exit.flow.js";
import {postSlack} from '../http/slack.http.js';
import {idleStop} from "../utils/idle.util.js";


const token_middleware = async (ctx, {gotoFlow, extensions}) => {
    try {
        const user = await findByPhone(ctx?.from, extensions.db.botModels);
        if (expiredToken(user?.token)) {
            const token = createSimpleToken(ctx);
            const device = getDevice(ctx?.key?.id);
            const db = await extensions.db.botModels;
            await createOrUpdate({ctx, device, token, db});
            return gotoFlow(sessionExpiredFlow);
        }
    }catch (e) {
        idleStop(ctx);
        await postSlack({text: `[ERROR FLUJO tokenMiddleware:]` + e.message})
        log_error("ERROR FLUJO tokenMiddleware", e);
    }
};

export {token_middleware};
