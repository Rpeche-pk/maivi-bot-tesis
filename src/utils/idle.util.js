import {timeoutFlow} from "../app/exit_flow/exit.flow.js";
import {log_warning} from "./logger.util.js";

let timers = {};

export function idleStart(ctx, gotoFlow, time) {
    log_warning(`[STARTED - IDLESTART] cuenta atrás para el usuario ${ctx.from}!`);
    timers[ctx.from] = setTimeout(() => {
        log_warning(`¡Tiempo agotado para el usuario ${ctx.from}!`);
        return gotoFlow(timeoutFlow);
    }, time);
}

export function idleReset(ctx, gotoFlow, time) {
    idleStop(ctx);
    if (timers[ctx.from]) {
        log_warning(`[RESTART - IDLERESET] cuenta atrás para el usuario ${ctx.from}!`);
        clearTimeout(timers[ctx.from]);
    }
    idleStart(ctx, gotoFlow, time);
}

export function idleStop(ctx) {
    log_warning(`[STOP - IDLESTOP] cuenta atrás para el usuario ${ctx.from}!`);
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
    }
}
