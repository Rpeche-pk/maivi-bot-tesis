import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import {log_error} from "./logger.util.js";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const TIME_ZONE = 'America/Lima';

const TIME_RANGES = {
    EARLY_MORNING: {
        start: '00:00',
        end: '06:00',
        greetings: [
            "*El que madruga Dios lo ayuda* ✨",
            "*Buena Amanecida* ☕",
            "*¡Buen amanecer!* 🌅"
        ]
    },
    MORNING: {
        start: '06:00',
        end: '12:00',
        greetings: [
            "*Buenos Días* 🌤",
            "*¡Hola, buen día!* 🌞",
            "*Saludos matutinos* ☀️",
            "*¡Que tengas un excelente día!* 🌅"
        ]
    },
    AFTERNOON: {
        start: '12:00',
        end: '18:00',
        greetings: [
            "*Saludos vespertinos* 🌅",
            "*Buenas Tardes* ⛅",
            "*¡Hola, buenas tardes!* 🌤",
            "*Saludos de la tarde* 🌞"
        ]
    },
    EVENING: {
        start: '18:00',
        end: '23:59',
        greetings: [
            "*¡Buenas Noches!* 🌌",
            "*Buenas Noches* 🌚",
            "*¡Buenas noches!* 🌙",
            "*Que tengas una excelente noche* ✨"
        ]
    }
};

export const randomGreeting = () => {
    try {
        const currentTime = dayjs().tz(TIME_ZONE);

        const currentRange = Object.values(TIME_RANGES).find(range => {
            const start = dayjs(`${currentTime.format('YYYY-MM-DD')} ${range.start}`);
            const end = dayjs(`${currentTime.format('YYYY-MM-DD')} ${range.end}`);
            return currentTime.isBetween(start, end, null, '[]');
        });

        if (!currentRange) {
            return "*¡Hola!* 👋";
        }

        return currentRange.greetings

    } catch (error) {
        log_error('Error al generar saludo:', error);
        return "*¡Hola!* 👋";
    }
};

/*export const randomGreeting = () => {
    // Crea un objeto con las variantes de hora y greetings
    const greetings = {
        "06:00-12:00": ["*Buenos Días*", "*Buenos Días* 🌤","*¡Hola, buen día!* 🌞","*Saludos matutinos* ☀️"],
        "12:00-18:00": ["*Saludos vespertinos* 🌅","*Buenas Tardes*", "*Buenas Tardes* ⛅"],
        "18:00-23:59": ["*Hora de relajarse*, *¡Buenas Noches!* 🌌","*Buenas Noches*", "*Buenas Noches* 🌚","*¡Buenas noches!* 🌙"],
        "00:00-06:00": ["*El que madruga Dios lo ayuda*", "*Buena Amanecida* ☕"],
    };

    // Función para obtener la hora local del sistema o la hora peruana
    const getLocalTime = () => {
        const systemTime = dayjs.utc();
        if (systemTime.isValid()) {
            return systemTime.tz('America/Lima');
        } else {
            return dayjs().tz('America/Lima');
        }
    };

    const currentTime = getLocalTime();
    let greeting;

    for (let key in greetings) {
        let timeRange = key.split("-");
        let startTime = dayjs(timeRange[0], 'HH:mm');
        let endTime = dayjs(timeRange[1], 'HH:mm');
        if (currentTime.isBetween(startTime, endTime)) {
            greeting = greetings[key];
            break;
        }
    }

    return greeting;
};*/
