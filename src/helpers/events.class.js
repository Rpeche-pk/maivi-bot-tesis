import {botEmitter} from "./emitter.class.js";

class Bot {
    constructor() {
        this.interactions = new Map(); // Rastreo de interacciones de usuarios
        this.inactivityTimeout = 300000; // Tiempo de espera por inactividad (3 segundos)
    }

    startInteraction(phoneNumber) {
        const startTime = Date.now();
        const logDate = this.formatLogDate();
        console.log(logDate`[EVENT-EMITTER] ⏳ Conversación iniciada para ${phoneNumber}.`);

        this.interactions.set(phoneNumber, {
            startTime,
            timeout: null,
        });
    }

    askQuestion(phoneNumber, message) {
        const logDate = this.formatLogDate();
        console.log(logDate,`[EVENT-EMITTER] 📩 Bot a ${phoneNumber}: ${message}`);
        const interaction = this.interactions.get(phoneNumber);

        if (!interaction) {
            console.warn(logDate,`[EVENT-EMITTER] ⚠️ No se encontró interacción activa para ${phoneNumber}.`);
            return;
        }

        // Cancelar cualquier timeout previo
        if (interaction.timeout) {
            clearTimeout(interaction.timeout);
        }

        // Configurar timeout de inactividad
        interaction.timeout = setTimeout(() => {
            this.finalizeInteraction(phoneNumber, true); // Finalización por inactividad
        }, this.inactivityTimeout);
    }

    userResponse(phoneNumber, response) {
        const interaction = this.interactions.get(phoneNumber);
        const logDate = this.formatLogDate();

        if (!interaction) {
            console.warn(logDate,`[EVENT-EMITTER] ⚠️ Respuesta de ${phoneNumber} ignorada (sin interacción activa).`);
            return;
        }

        if (interaction.timeout) {
            clearTimeout(interaction.timeout); // Detener timeout
        }

        if (response.toLowerCase() === 'no') {
            console.log(logDate,`[EVENT-EMITTER] ❌ Usuario ${phoneNumber} no desea continuar.`);
            this.finalizeInteraction(phoneNumber, false);
        } else if (response.toLowerCase() === 'sí') {
            console.log(logDate,`[EVENT-EMITTER] ✅ Usuario ${phoneNumber} desea continuar.`);
        } else {
            console.log(logDate,`[EVENT-EMITTER] ⚠️ Respuesta de ${phoneNumber} no reconocida: ${response}`);
            this.askQuestion(phoneNumber, 'Por favor, responde "Sí" o "No".');
        }
    }

    finalizeInteraction(phoneNumber, isTimeout) {
        const interaction = this.interactions.get(phoneNumber);
        const logDate = this.formatLogDate();

        if (!interaction) return;

        const endTime = Date.now();
        const duration = (endTime - interaction.startTime) / 1000; // Duración en segundos

        if (isTimeout) {
            console.log(logDate,`[EVENT-EMITTER] ⏰ Tiempo agotado para ${phoneNumber}. Duración: ${duration} segundos.`);
            botEmitter.emit('timeout', { phoneNumber, duration });
        } else {
            console.log(logDate,`[EVENT-EMITTER] ✔️ Interacción finalizada para ${phoneNumber}. Duración: ${duration} segundos.`);
            botEmitter.emit('completed', { phoneNumber, duration });
        }

        this.interactions.delete(phoneNumber); // Limpieza de la interacción
    }

     formatLogDate () {
        return new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDay()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds() +":"+new Date().getMilliseconds();
    }

}

const bot = new Bot();
Object.freeze(bot);
export { bot, botEmitter };

