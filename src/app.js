import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import {helpersInstance as Instance} from './helpers/helpers.class.js'
import Queue from 'queue-promise';
import {ServerHttp} from './http/chatwoot.http.js';
import {ChatwootClass} from './integrations/chatwoot/chatwoot.class.js';
import { HandlerMessage } from './integrations/chatwoot/handler.chatwoot.js';
import { handlerMessage } from './integrations/chatwoot/index.js'
import {black} from './utils/blacklist.class';
import mimeType from 'mime-types';
import * as fs from 'node:fs/promises';
import { convertOggMp3 } from './utils/oggToMp3.util.js';
import { downloadMediaMessage } from '@builderbot/provider-baileys/dist/baileyWrapper.js';
import chalk from 'chalk';


const PORT = process.env.PORT ?? 3008
const PORT_CHATWOOT = process.env.CHATWOOT_PORT ?? 3005
const serverHttp = new ServerHttp(PORT)


const chatwoot = new ChatwootClass({
    account: process.env.CHATWOOT_ACCOUNT_ID,
    token: process.env.CHATWOOT_TOKEN,
    endpoint: process.env.CHATWOOT_ENDPOINT
})

const queue = new Queue({
    concurrent: 1,
    interval: 500
})

const main = async () => {
    const adapterFlow = createFlow([])
    
    const adapterProvider = createProvider(Provider,{
        groupsIgnore: true
    })
    
    const adapterDB = new Database({ filename: 'db.json' })

    const settings = {
        queue: {
            timeout: 16000,
            concurrencyLimit: 15,
        },
        extensions: {
            utils: Instance,
            handler : new HandlerMessage(PORT,PORT_CHATWOOT),
            blacklist: black,
            chatwoot: chatwoot        
        },

        globalState: {
            timer: 300000, //300000 -> 5 minutos
        }

    }

    const { handleCtx, httpServer,provider } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    },settings)

    serverHttp.initialization(provider)

    /**
     * @event message - Event to listen for messages
     * @param {Object} ctx - Context object
     * read the message and send it to the bot
     */
    adapterProvider.on('message', async (ctx) => {
        adapterProvider.vendor.readMessages([ctx.key]);
    })


     // 2° opcion !payload?.message.extendedTextMessage.text
     // ESTO ESCUCHA LOS EVENTOS DE MENSAJES ENTRANTES (CUANDO EL CLIENTE ENVIA UN MENSAJE ---> )
    adapterProvider.on('message', (payload) => {
        queue.enqueue(async () => {
            try {
                const captionFile = payload?.message?.imageMessage?.caption ?? payload?.message?.videoMessage?.caption ?? payload?.message?.documentMessage?.caption ?? payload?.message?.audioMessage?.caption ?? '';
                const attachment = []
                if (payload?.body.includes('_event_')) {
                    const mime = payload?.message?.imageMessage?.mimetype ?? payload?.message?.videoMessage?.mimetype ?? payload?.message?.documentMessage?.mimetype ?? payload?.message?.audioMessage?.mimetype;
                    const extension = mimeType.extension(mime);
            
                    const buffer = await downloadMediaMessage(payload, "buffer");
                    const fileName = `file-${Date.now()}.${extension}`;
                    const pathFile = `${process.cwd()}/public/${fileName}`;
                    await fs.writeFile(pathFile, buffer);
                    if(extension === 'oga'){
                        // todo convirtiendo audio oga en mp3 y guardandolo
                        await convertOggMp3(pathFile,pathFile.replace('.oga','.mp3'));
                        //todo eliminando el archivo oga
                        await fs.unlink(pathFile);
                    }
                    console.log(chalk.green.bold(`[FICHERO ENVIADO CLIENTE WA CREADO]`),chalk.cyan(`📋 http://localhost:${PORT}/${fileName.replace('.oga','.mp3')}`));
                    attachment.push(pathFile.replace('.oga','.mp3'))
                }

                console.log(chalk.green.bold(`>>>>[MENSAJE ENVIADO DESDE WA]`),chalk.cyan(`📋 ${payload.body}`));
                await handlerMessage({
                    phone: payload.from,
                    name: payload.pushName,
                    message: captionFile ? captionFile : payload.body,
                    attachment,
                    mode: 'incoming'
                }, chatwoot)
            } catch (err) {
                console.log('ERROR', err)
            }
        });
    });

    /**
     * Los mensajes salientes (cuando usas el bot (andAnswer) le envia un mensaje al cliente ---> )
     * ESTE EMITE EL EVENTO SEND_MESSAGE Y LO CAPTURAMOS AQUI , QUE SERA EMITIDO POR DEBAJO .emit
     */
    provider.on('send_message', (payload) => {
        queue.enqueue(async () => {
            console.log(chalk.green.bold(`<<<<[MENSAJE ENVIADO DESDE EL BOT CODIGO EN CASA]`),chalk.cyan(`📋 ${payload.answer}`));
            await handlerMessage({
                phone: payload.numberOrId,
                name: payload.pushName,
                message: payload.answer,
                mode: 'outgoing'
            }, chatwoot)
        })
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
