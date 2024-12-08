import {EventEmitterClass} from "@builderbot/bot";

class BotEventEmitter extends EventEmitterClass {}

const botEmitter = new BotEventEmitter();

export {botEmitter};
