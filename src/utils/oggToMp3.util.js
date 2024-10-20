import ffmpeg from "fluent-ffmpeg";
import {join} from "path";
import {tmpdir} from "os";
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

/** 
* @param {string} inputStream - The path of the input file
* @param {string} outStream - The path of the output file
*/
const convertOggMp3 = async (inputStream, outStream) => {
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

/**
 * Return mp3 path
 * @param {string} pathOgg - The path of the input file
 */
export const processAudio =  async (pathOgg) => {
    const pathTmpMp3 = join(tmpdir(),`voice-note-${Date.now()}.mp3`);
    await convertOggMp3(pathOgg, pathTmpMp3);
    return pathTmpMp3
}