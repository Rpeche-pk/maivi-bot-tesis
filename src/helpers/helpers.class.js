import chalk from "chalk";
import {wait} from "../utils/delay.util.js";

class HelpersClass {
    constructor() {
        if (!HelpersClass.instance) {
            HelpersClass.instance = this;
        }
        return HelpersClass.instance;
    }

    /**
     * funcion para simular la escritura de un mensaje
     * @param provider
     * @param options
     * @returns {Promise<void>}
     */
    typing = async (provider, options) => {
        const {delay1, delay2, ctx} = options;
        const $id = ctx?.key?.remoteJid;

        await provider.vendor.presenceSubscribe($id);
        await wait(delay1);

        await provider.vendor.sendPresenceUpdate("composing", $id);
        await wait(delay2);
    }

    typingWithoutDelay= async(provider, options)=>{
        const {delay1, ctx} = options;
        const $id = ctx?.key?.remoteJid;

        await provider.vendor.presenceSubscribe($id);
        await wait(delay1);

        await provider.vendor.sendPresenceUpdate("composing", $id);
    }

    /**
     * funcion para simular la grabacion de un mensaje de voz
     * @param provider
     * @param options
     * @returns {Promise<void>}
     */
    simulateRecording = async (provider, options) => {
        const {delay1, ctx} = options;
        const $id = ctx?.key?.remoteJid;

        await provider.vendor.presenceSubscribe($id);
        await wait(delay1);
        await provider.vendor.sendPresenceUpdate("recording", $id);
    }

    simulatePausedAndAvailable = async (provider, ctx) => {
        const $id = ctx?.key?.remoteJid;

        await provider.vendor.presenceSubscribe($id);
        await provider.vendor.sendPresenceUpdate("paused", $id);
        await provider.vendor.sendPresenceUpdate("available", $id);
    }

    /**
     *
     * @param options
     * @param message
     * @returns {Promise<*>}
     */
    tryAgain = async (options,message="") => {
        const {ctx, state,provider, fallBack,endFlow} = options;
        const myState = state.getMyState() ?? {};
        let flag = myState[ctx.from]?.intents ?? 2;
        const phone = ctx?.from;
        const jid = ctx?.key?.remoteJid;

        console.log(chalk.green("intentos"), myState[ctx.from]?.intents);
        if (flag >= 0) {
            let msgIntents = flag === 1 ? "Tienes 1 intento." : `Tienes ${flag} intentos.\n${message}`;
            flag--;
            await state.update({...myState, [phone]: {...myState[phone], intents: flag}});
            await this.wait(650, 550);
            return fallBack(msgIntents);
        } else {
            myState[phone] = {...myState[phone], on: false};
            await this.wait(650, 550);
            await provider.vendor.sendMessage(jid, {text: "❌ Sus oportunidades se han terminado. Intente nuevamente ❌"});
            await state.update({...myState, [phone]: {...myState[phone], intents: 2, new: true}});
            return endFlow();
        }
    }

    wait = (max, min) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, Math.floor(Math.random() * (max - min + 1)) + min);
        });
    };

    randomMs = (max, min) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

}

const helpersInstance = new HelpersClass();

export {helpersInstance};
