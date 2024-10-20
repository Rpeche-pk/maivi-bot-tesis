import {downloadMediaMessage} from "@whiskeysockets/baileys";
import mimetype from "mime-types";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import path from "path";
import {writeFile} from "fs/promises";
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * funcion para descargar un recurso multimedia (imagen)
 * @param ctx {Object}
 * @returns {Promise<{mime: (boolean|string), base64: string}>} retorna la ruta del archivo descargado
 */
const downloadImage = async (ctx) => {
    return await downloadResource(ctx, formatArchive(ctx),"image");
}

/**
 * funcion para descargar un recurso multimedia (video)
 * @param ctx {Object}
 * @returns {Promise<{mime: (boolean|string), base64: string}>} retorna la ruta del archivo descargado
 */
const downloadVideo = async (ctx) => {
    return await downloadResource(ctx, formatArchive(ctx),"video");
}
/**
 * funcion para descargar un recurso multimedia (audio)
 * @param ctx {Object}
 * @returns {Promise<{mime: (boolean|string), base64: string}>} retorna la ruta del archivo descargado
 */
const downloadAudio = async (ctx) => {
    return await downloadResource(ctx, formatArchive(ctx),"audio");
}
/**
 * funcion para descargar un recurso multimedia (documento)
 * @param ctx {Object}
 * @returns {Promise<{mime: (boolean|string), base64: string}>} retorna la ruta del archivo descargado
 */
const downloadDocument = async (ctx) => {
    return await downloadResource(ctx, formatArchive(ctx),"document");
}

/**
 * funcion para descargar un recurso multimedia (imagen, video, audio, documento) y guardar en local
 * @param ctx {Object}
 * @param fileName {string} nombre del archivo
 * @param typeMedia {string} tipo de recurso multimedia (image, video, audio, document)
 * @returns {Promise<{mime: (boolean|string), base64: string}>} retorna la ruta del archivo descargado
 */
async function downloadResource(ctx, fileName, typeMedia) {
    //todo validar si el mensaje es un mensaje de tipo multimedia (imagen, video, audio, documento)
    const content = ctx.message?.[`${typeMedia}Message`] || ctx.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[`${typeMedia}Message`];
    if(!content) return null

    //todo descargar el contenido del mensaje, funcion de la libreria baileys
    const buffer = await downloadMediaMessage(ctx, "buffer");
    //todo obtener la extension del archivo a partir del tipo de contenido del mensaje -👇🏼
    const filePath = path.resolve("src/assets/",`${fileName}.`+ mimetype.extension(content.mimetype));

    await writeFile(filePath, buffer);

    return {
        mime: mimetype.lookup(filePath),
        buffer: buffer
    };
}


//todo funciones utils para obtener el contenido de un mensaje multimedia, y generar un nombre unico para el archivo
const formatArchive = (ctx) =>{
    const peruTimezone = 'America/Lima';
    const formattedDate = dayjs().tz(peruTimezone).format('DD/MM/YYYY HH:mm:ss');
    let [date, hour] = formattedDate.split(" ");
    date = date.replaceAll("/", "-");
    hour = hour.replaceAll(":", "-");
    return ctx?.from+"_"+date + "_" + hour;
}

export {
    downloadVideo,
    downloadAudio,
    downloadDocument,
    downloadImage
};