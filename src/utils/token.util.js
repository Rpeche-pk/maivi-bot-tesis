import { jwtDecode } from "jwt-decode";
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export function expiredToken(token) {
    const decoded = jwtDecode(token);
    const now = new Date();
    console.log("Fecha actual: ", now.getTime() / 1000);
    console.log("Fecha expiración: ", decoded.exp);
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

export const createToken = (user) => {
    const iat = dayjs().tz('America/Lima');
    const exp = iat.add(8, 'hours');
    const payload = {
        sub: user?.numDoc,
        name: user?.priNombre,
        lastname: `${user?.apePaterno} ${user?.apeMaterno}`,
        birthdate: user?.fecNacimiento,
        data: {
            hospital: user?.desCentro,
            address: user?.dirCentro
        },
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