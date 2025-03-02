import {botEmitter} from "./emitter.class.js";
import fs from "fs";

class Bot {
    constructor() {
        this.interactions = new Map();
        this.inactivityTimeout = 2 * 60 * 1000;
    }

    startInteraction(phoneNumber) {
        const logDate = this._formatLogDate();
        if (this.interactions.has(phoneNumber)) {
            console.log(logDate, `[EVENT-EMITTER] ⚠️ Interacción ya iniciada para ${phoneNumber}.`);
            return;
        }
        const startTime = Date.now();
        console.log(logDate, `[EVENT-EMITTER] ⏳ Conversación iniciada para ${phoneNumber}.`);
        this.interactions.set(phoneNumber, {
            startTime,
            timeout: null
        });
    }

    askQuestion(phoneNumber, message) {
        const logDate = this._formatLogDate();
        console.log(logDate, `[EVENT-EMITTER] 📩 Bot a ${phoneNumber}: ${message}`);
        const interaction = this.interactions.get(phoneNumber);

        if (!interaction) {
            console.warn(logDate, `[EVENT-EMITTER] ⚠️ No se encontró interacción activa para ${phoneNumber}.`);
            return;
        }

        // Cancelar cualquier timeout previo
        if (interaction.timeout) {
            clearTimeout(interaction.timeout);
        }

        // Configurar timeout de inactividad
        interaction.timeout = setTimeout(() => {
            this.finalizeInteraction(phoneNumber, true);
        }, this.inactivityTimeout);
    }

    /*userResponse(phoneNumber, response) {
        const interaction = this.interactions.get(phoneNumber);
        const logDate = this._formatLogDate();

        if (!interaction) {
            console.warn(logDate, `[EVENT-EMITTER] ⚠️ Respuesta de ${phoneNumber} ignorada (sin interacción activa).`);
            return;
        }

        if (interaction.timeout) {
            clearTimeout(interaction.timeout);
        }

        const currentTime = Date.now();
        let elapsed = ((currentTime - interaction.startTime) / 1000).toFixed(2);

        if (response.toLowerCase() === 'no') {
            console.log(logDate, `[EVENT-EMITTER] ❌ Usuario ${phoneNumber} no desea continuar.`);
            this.finalizeInteraction(phoneNumber, false);
        } else if (response.toLowerCase() === 'sí') {
            console.log(logDate, `[EVENT-EMITTER] ✅ Usuario ${phoneNumber} desea continuar.`);
            this._saveInteractionDuration(phoneNumber, elapsed);
            this.askQuestion(phoneNumber, 'Por favor, responde "Sí" o "No".');
        } else {
            console.log(logDate, `[EVENT-EMITTER] 📥 Usuario ${phoneNumber}: ${response}`);
            this.askQuestion(phoneNumber, '¿Desea continuar? (Sí/No)');
        }
    }*/
    userResponse(phoneNumber, response) {
        const interaction = this.interactions.get(phoneNumber);
        const logDate = this._formatLogDate();

        if (!interaction) {
            console.warn(logDate, `[EVENT-EMITTER] ⚠️ Respuesta de ${phoneNumber} ignorada (sin interacción activa).`);
            return;
        }

        if (interaction.timeout) {
            clearTimeout(interaction.timeout);
        }

        const currentTime = Date.now();
        let elapsed = ((currentTime - interaction.startTime) / 1000).toFixed(2);

        if (response.toLowerCase() === 'no') {
            console.log(logDate, `[EVENT-EMITTER] ❌ Usuario ${phoneNumber} no desea continuar.`);
            this.finalizeInteraction(phoneNumber, false);
        } else if (response.toLowerCase() === 'sí' || response.toLowerCase() === 'si') {
            console.log(logDate, `[EVENT-EMITTER] ✅ Usuario ${phoneNumber} desea continuar.`);
            // Guardar el tiempo actual antes de continuar
            this._saveInteractionDuration(phoneNumber, elapsed);

            // Configurar nuevo timeout de inactividad
            interaction.timeout = setTimeout(() => {
                this.finalizeInteraction(phoneNumber, true);
            }, this.inactivityTimeout);

            // Actualizar el tiempo de inicio para la siguiente pregunta
            interaction.startTime = Date.now();

            // Continuar con otra pregunta
            this.askQuestion(phoneNumber, 'Por favor, responde a la siguiente pregunta (Sí/No).');
        } else {
            console.log(logDate, `[EVENT-EMITTER] 📥 Usuario ${phoneNumber}: ${response}`);
            this.askQuestion(phoneNumber, '¿Desea continuar? (Sí/No)');
        }
    }

    finalizeInteraction(phoneNumber, isTimeout) {
        const interaction = this.interactions.get(phoneNumber);
        const logDate = this._formatLogDate();

        if (!interaction) return;

        const endTime = Date.now();
        let duration = ((endTime - interaction.startTime)/1000).toFixed(2);

        if (isTimeout) {
            console.log(logDate, `[EVENT-EMITTER] ⏰ Tiempo agotado para ${phoneNumber}. Duración: ${duration} segundos.`);
            botEmitter.emit('timeout', {phoneNumber, duration});
        } else {
            console.log(logDate, `[EVENT-EMITTER] ✔️ Interacción finalizada para ${phoneNumber}. Duración: ${duration} segundos.`);
            botEmitter.emit('completed', {phoneNumber, duration});
        }
        this._saveInteractionDuration(phoneNumber, duration);
        this.interactions.delete(phoneNumber);
    }

    _saveInteractionDuration(phoneNumber, duration) {
        const logDate = this._formatLogDate();
        const filePath = 'user-list-time-v2.json';
        console.log(`${logDate} [EVENT-EMITTER] 💾 Guardando tiempo de interacción para ${phoneNumber}: ${duration} segundos.`);
        let content = {};

        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            content = JSON.parse(fileData || '{}');
        }

        if (!content[phoneNumber]) {
            content[phoneNumber] = [];
        }

        content[phoneNumber].push(duration);

        // Mantener solo los últimos 5 registros por número
        if (content[phoneNumber].length > 5) {
            content[phoneNumber] = content[phoneNumber].slice(-5);
        }

        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    }

    _formatLogDate() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}:${String(now.getMilliseconds()).padStart(3, '0')}`;
    }

}

const bot = new Bot();
Object.freeze(bot);
export {bot, botEmitter};

