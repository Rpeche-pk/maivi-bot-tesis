import {addKeyword} from "@builderbot/bot";
import {schedule} from "node-cron";
import {randomElement} from "../../utils/random.util.js";
import {CONSTANTS} from "../../config/index.js";


const cron_flow = addKeyword("#cron", {})
    .addAction(async (ctx, {provider}) => {

        console.log('Cron job started 🚀');

        schedule('0 0 23 */4 * ?', async () => {
            await provider.vendor.sendMessage('status@broadcast', {
                text: randomElement(CONSTANTS.MESSAGE_MAINTENANCE)
            }, {
                backgroundColor: '#641E16',
                font: 1,
                statusJidList: ['51966524537@s.whatsapp.net']
            });
        });

    });

export {cron_flow};
