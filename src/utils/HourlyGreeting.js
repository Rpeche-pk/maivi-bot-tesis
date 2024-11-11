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
    // Crea un objeto con las variantes de hora y saludos
    const saludos = {
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

    const horaActual = getLocalTime();
    let saludo;

    for (let clave in saludos) {
        let rangoHorario = clave.split("-");
        let horaInicio = dayjs(rangoHorario[0], 'HH:mm');
        let horaFin = dayjs(rangoHorario[1], 'HH:mm');
        if (horaActual.isBetween(horaInicio, horaFin)) {
            saludo = saludos[clave];
            break;
        }
    }
    console.log(saludo);
    return saludo;
};