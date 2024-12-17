import {addKeyword} from "@builderbot/bot";
import {schedule} from "node-cron";
import {randomElement} from "../../utils/random.util.js";
import {CONSTANTS} from "../../config/index.js";
import {getPhoneNumbers} from "../../repository/bot.repository.js";


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
    });

export {cron_flow};
