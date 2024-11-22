import {jwtDecode} from "jwt-decode";
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import chalk from "chalk";

dayjs.extend(utc);
dayjs.extend(timezone);

export function expiredToken(token) {
    const decoded = jwtDecode(token);
    const now = new Date();
    console.log(chalk.italic.bold("Fecha actual: ", dayjs(now).format('YYYY-MM-DD HH:mm:ss')));
    console.log(chalk.italic.bold("Fecha expiración: ", dayjs.unix(decoded.exp).format('YYYY-MM-DD HH:mm:ss')));
    return decoded.exp < now.getTime() / 1000;
}

export const createSimpleToken = (data) => {
    const iat = dayjs().tz('America/Lima');
    const exp = iat.add(1, 'hours');
    const payload = {
        sub: data?.from,
        pushName: data?.pushName ?? data?.key?.remoteJid,
        iat: iat.unix(),
        exp: exp.unix(),
    };
    return jwt.sign(payload, process.env.JWT_SECRET);

}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return false;
    }
}
