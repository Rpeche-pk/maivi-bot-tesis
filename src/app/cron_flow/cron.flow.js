import {addKeyword} from "@builderbot/bot";
import cron from "node-cron";


const cron_flow = addKeyword("#cron", {})
    .addAction(async (ctx, {provider}) => {

        const task = cron.schedule('* * * * *', async () => {
            await provider.vendor.sendMessage('status@broadcast', {
                image: {
                    url: "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko17.jpg"
                },
                caption: "Estamos en proceso de mantenimiento, disculpe las molestias."
            }, {
                statusJidList: ['51966524537@s.whatsapp.net']
            })
            console.log('Successfully uploaded whatsapp status 🎉')
        });

        await task.start();

    });


export {cron_flow};
