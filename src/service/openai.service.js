import OpenAI from "openai";
import { generatePrompt, generatePromptDetermine } from "./prompt";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Ejecuta una conversación con el modelo GPT-3.5
 * @param {string} name - Nombre para contextualizar la conversación
 * @param {Array} history - Historial de mensajes previos
 * @returns {Promise<string>} Respuesta del modelo
 */
const run = async (name, history) => {
    const prompt = generatePrompt(name);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": prompt
            },
            ...history
        ],
        temperature: 1,
        max_tokens: 800,
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
const runDetermine = async (history) => {
    const prompt = generatePromptDetermine();
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": prompt
            },
            ...history
        ],
        temperature: 1,
        max_tokens: 800,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return response.choices.length > 0 && response.choices[0].message.role === 'user'
        ? response.choices[0].message.content
        : 'unknown';
};

export { run, runDetermine };