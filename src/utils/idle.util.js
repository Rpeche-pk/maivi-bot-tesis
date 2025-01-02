import {timeoutFlow} from "../app/exit_flow/exit.flow.js";
import {log_warning} from "./logger.util.js";

let timers = {};
let activeTimers = new Set();
//OPTION 1
/*export function idleStart(ctx, gotoFlow, time) {
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
}*/

//OPTION 2
export function idleStart(ctx, gotoFlow, time) {
    const userId = ctx.from;

    if (activeTimers.has(userId)) {
        return;
    }

    log_warning(`[STARTED - IDLESTART] cuenta atrás para el usuario ${userId}!`);

    activeTimers.add(userId);
    timers[userId] = setTimeout(() => {
        if (activeTimers.has(userId)) {
            log_warning(`¡Tiempo agotado para el usuario ${userId}!`);
            activeTimers.delete(userId);
            delete timers[userId];
            return gotoFlow(timeoutFlow);
        }
    }, time);
}

export function idleReset(ctx, gotoFlow, time) {
    const userId = ctx.from;
    idleStop(ctx);
    if (timers[userId]) {
        log_warning(`[RESTART - IDLERESET] cuenta atrás para el usuario ${userId}!`);
        clearTimeout(timers[userId]);
        delete timers[userId];
    }

    idleStart(ctx, gotoFlow, time);
}

export function idleStop(ctx) {
    const userId = ctx.from;
    log_warning(`[STOP - IDLESTOP] cuenta atrás para el usuario ${userId}!`);

    if (timers[userId]) {
        clearTimeout(timers[userId]);
        delete timers[userId];
    }
    activeTimers.delete(userId);
}

// Función para limpiar timers huérfanos (opcional, puede llamarse periódicamente)
export function cleanupTimers() {
    for (const userId in timers) {
        clearTimeout(timers[userId]);
        delete timers[userId];
    }
    activeTimers.clear();
}
