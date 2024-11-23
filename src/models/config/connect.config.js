import mongoose from 'mongoose';

import chalk from "chalk";
import {MONGO_URI} from "../../config/index.js";


export const dbConnect = async () => {
    await mongoose.connect(`${MONGO_URI}`)
        .then(() => console.log(chalk.green.bold('>>>>> DB is connected !!! <<<<<')))
        .catch(err => console.error(chalk.red.bold('>>>>> Error connecting to DB:'), err));
}

