import OpenAI from "openai";
import {generatePromptDetermine, generatePromptSupermarket} from "./prompt.js";
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
            temperature: 0.5,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        return response.choices[0].message?.content || 'unknown';
    };

    /**
     * Ejecuta una determinación basada en el historial de conversación
     * @param {Array} history - Historial de mensajes previos
     * @param query
     * @returns {Promise<string>} Resultado de la determinación o 'unknown'
     */
    runDetermine = async (history, query) => {
        const prompt = generatePromptDetermine(query);
        const response = await this.openai.chat.completions.create({
            model: CONSTANTS.MODEL_AI,
            messages: [
                {
                    "role": "system",
                    "content": prompt
                },
                ...history
            ],
            temperature: 0.5,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return response.choices.length > 0 && response.choices[0].message.role === 'user' ? response.choices[0].message.content : 'unknown';
    };

    determineChatFn = async (query, history)=> {
        const prompt = generatePromptDetermine(query);
        try {
            const completion = await this.openai.chat.completions.create({
                model: CONSTANTS.MODEL_AI,
                temperature: 0,
                messages: [
                    {
                        "role": "system",
                        "content": prompt
                    },
                    ...history
                ],
                functions: [
                    {
                        name: "fn_get_prediction_intent",
                        description: "Predict the user intention for a given conversation",
                        parameters: {
                            type: "object",
                            properties: {
                                prediction: {
                                    type: "string",
                                    description: "The predicted user intention.",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "supermarket",
                                            "unknown",
                                        ]
                                    },
                                },

                            },
                            required: ["prediction"]
                        }
                    }
                ],
                function_call: {
                    name: "fn_get_prediction_intent",
                }
            });
            return JSON.parse(completion.choices[0].message.function_call.arguments);
        } catch (err) {
            console.error(err);
            return {
                prediction: '',
            }
        }
    }
}
export default AIClass;
