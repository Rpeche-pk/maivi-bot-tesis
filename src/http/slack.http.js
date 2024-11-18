import {SlackNotificationException} from "../exceptions/handler.class.js";
import {log_error, log_success} from "../utils/logger.util.js";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config()
/**
 * Envía una notificación a Slack
 * @param {Object} data - Datos a enviar a Slack
 * @returns {Promise<Object>} - Respuesta de Slack
 * @throws {SlackNotificationException} - Si hay un error al enviar la notificación
 */
const postSlack = async (data) => {
    try {
        const response = await fetch(process.env.SLACK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        console.log(chalk.italic.green('Slack response:'), chalk.green(JSON.stringify(response)));
    } catch (error) {
        log_error('Error al enviar notificación a Slack:', error);
        throw new SlackNotificationException('No se pudo enviar la notificación a Slack');
    }
};

/**
 * Formatea un error para ser enviado a Slack
 * @param message
 * @param {{}} error - Error a formatear
 * @returns {Object} - Objeto formateado para Slack
 */
const formatErrorForSlack = (message, error={}) => {
    return {
        text: `*Error Notification*\n${message}`,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:warning: *Error en la aplicación* :warning:`
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Tipo de error:*\n${error.name}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Mensaje:*\n${error.text}`
                    }
                ]
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Stack trace:*\n\`\`\`${error.message}\`\`\``
                }
            }
        ]
    };
};

/**
 * Maneja un error y lo envía a Slack
 * @param message
 * @param {Error} error - Error a manejar
 */
const handleErrorAndNotifySlack = async (message,error) => {
    const formattedError = formatErrorForSlack(message,error);
    try {
        await postSlack(formattedError);
        log_success('Notificación de error enviada a Slack');
    } catch (slackError) {
        log_error('No se pudo enviar la notificación a Slack:', slackError);
    }
};

export {
    handleErrorAndNotifySlack,
    postSlack
};