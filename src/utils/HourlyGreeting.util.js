import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export const randomGreeting = () => {
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
};