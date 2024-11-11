import mongoose from 'mongoose';

import chalk from "chalk";
import dotenv from 'dotenv';

// Configurar dotenv para cargar las variables de entorno
dotenv.config();
const URI= process.env.MONGO_URI;
export const dbConnect = async () => {
    await mongoose.connect(`${URI}`)
        .then(() => console.log(chalk.green.bold('>>>>> DB is connected !!! <<<<<')))
        .catch(err => console.error(err));
}

