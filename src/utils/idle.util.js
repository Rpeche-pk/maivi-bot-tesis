import {timeoutFlow} from "../app/exit_flow/exit.flow";
import chalk from "chalk";
let timers = {};

export function idleStart(ctx, gotoFlow, time) {
    console.log(chalk.green.bold(`[INICIAMOS] cuenta atrás para el usuario ${ctx.from}!`));
    timers[ctx.from] = setTimeout(() => {
        console.log(chalk.yellow(`¡Tiempo agotado para el usuario ${ctx.from}!`));
        return gotoFlow(timeoutFlow);
    }, time);
}

export function idleReset(ctx, gotoFlow, time) {
    idleStop(ctx);
    if (timers[ctx.from]) {
        console.log(chalk.cyan.bold(`[REINICIAMOS] cuenta atrás para el usuario ${ctx.from}!`));
        clearTimeout(timers[ctx.from]);
        //delete timers[ctx.from];
    }
    idleStart(ctx, gotoFlow, time);
}

export function idleStop(ctx) {
    console.log(chalk.red.bold(`[DETENEMOS] cuenta atrás para el usuario ${ctx.from}!`));
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
        //delete timers[ctx.from];
    }
}
