import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

/** 
* @param {string} inputStream - The path of the input file
* @param {string} outStream - The path of the output file
*/
export const convertOggMp3 = async (inputStream, outStream) => {
    return new Promise((resolve) => {
        ffmpeg(inputStream)
            .audioQuality(96)
            .toFormat("mp3")
            .save(outStream)
            .on("progress", () => null)
            .on("end", () => {
                resolve(true);
            });
    });
};