import {addKeyword} from "@builderbot/bot";
import {schedule} from "node-cron";
import {randomElement} from "../../utils/random.util.js";
import {CONSTANTS} from "../../config/index.js";
import {getPhoneNumbers} from "../../repository/bot.repository.js";
import {createMessageQueue} from "../../utils/queue.util.js";


const queueConfig = { gapMilliseconds: 3000 };
const enqueueMessage = createMessageQueue(queueConfig);

const cron_flow = addKeyword("#cron", {})
    .addAction(async (ctx, {provider,extensions}) => {

        console.log('Cron job started 🚀');
        //0 0 23 */2 * * -> Every 2 days at 11:00 PM
        schedule('0 0 23 */2 * *', async () => {
            await provider.vendor.sendMessage('status@broadcast', {
                text: randomElement(CONSTANTS.MESSAGE_MAINTENANCE)
            }, {
                backgroundColor: randomElement(CONSTANTS.PALETTES_COLOR),
                font: 1,
                statusJidList: await getPhoneNumbers(extensions.db.botModels)
            });
        });
    }).addAnswer("Ingrese varias palabras",{capture:true},async (ctx, {provider,flowDynamic}) => {
        enqueueMessage(ctx, async (result, from) => {
            await provider.vendor.sendMessage(from, { text: result });
        });

        enqueueMessage(ctx, async (body) => {
            console.log('Processed messages:', body, ctx.from);
            await flowDynamic(`Received messages: ${body}`);
        });
    });

const process_exit = addKeyword("#exit", {})
    .addAction(async (ctx, {provider}) => {
        const jid = ctx?.key?.remoteJid;
        await provider.vendor.sendMessage(jid, {text: "Bye bye!"});
        process.exit(0);
    });


export {cron_flow,process_exit};
