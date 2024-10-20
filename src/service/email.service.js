import { Resend } from 'resend';
import {htmlTemplateEmail} from '../service/email.template.js';
import chalk from 'chalk';

const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail = async (code) => {
    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: [process.env.RESEND_TO],
        subject: 'Código de Emparejamiento',
        html: htmlTemplateEmail(code),
    });

    if (error) {
        return console.error({ error });
    }

    console.log(chalk.green(`Email enviado correctamente`,{ data }));
};

export {sendEmail}