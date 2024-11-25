import OpenAI from "openai";
import { generatePromptSupermarket, generatePromptDetermine } from "./prompt.js";
import {CONSTANTS} from "../config/index.js";

class AIClass {
    openai;
    model;

    constructor(apiKey, _model) {
        this.openai = new OpenAI({ apiKey, timeout: 15 * 1000 });
        if (!apiKey || apiKey.length === 0) {
            throw new Error("OPENAI_KEY is missing");
        }
        this.model = _model
    }

    /**
     * Ejecuta una conversación con el modelo GPT-3.5
     * @param {string} query - Nombre para contextualizar la conversación
     * @param {Array} history - Historial de mensajes previos
     * @returns {Promise<string>} Respuesta del modelo
     */
    startChatAI = async (query, history) => {
        const prompt = generatePromptSupermarket(query);
        const response = await this.openai.chat.completions.create({
            model: CONSTANTS.MODEL_AI,
            messages: [
                {
                    "role": "system",
                    "content": prompt
                },
                ...history
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        return response.choices[0].message.content;
    };

    /**
     * Ejecuta una determinación basada en el historial de conversación
     * @param {Array} history - Historial de mensajes previos
     * @returns {Promise<string>} Resultado de la determinación o 'unknown'
     */
    runDetermine = async (history) => {
        const prompt = generatePromptDetermine();
        const response = await this.openai.chat.completions.create({
            model: CONSTANTS.MODEL_AI,
            messages: [
                {
                    "role": "system",
                    "content": prompt
                },
                ...history
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return response.choices.length > 0 && response.choices[0].message.role === 'user' ? response.choices[0].message.content : 'unknown';
    };
}
export default AIClass;
