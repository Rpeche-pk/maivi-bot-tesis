// logger.js
import chalk from 'chalk';

/**
 * Registra un mensaje de éxito.
 * @param {string} message - El mensaje principal.
 * @param {Object} [details] - Detalles adicionales opcionales.
 */
export function log_success(message, details = {}) {
    console.log(chalk.green('✔ ÉXITO:'), chalk.green.bold(message));
    if (Object.keys(details).length > 0) {
        console.log(chalk.green('  Detalles:'));
        Object.entries(details).forEach(([key, value]) => {
            console.log(chalk.green(`    ${key}:`), chalk.white(value));
        });
    }
}

/**
 * Registra un mensaje de error.
 * @param {string} message - El mensaje principal de error.
 * @param {Error|Object} [error] - El objeto de error o detalles adicionales.
 */
export function log_error(message, error = {}) {
    console.log(chalk.red('✖ ERROR:'), chalk.red.bold(message));
    if (error instanceof Error) {
        console.log(chalk.red('  Detalles del error:'));
        console.log(chalk.red(`    Nombre: ${error.name}`));
        console.log(chalk.red(`    Mensaje: ${error.message}`));
        if (error.stack) {
            console.log(chalk.red('  Stack:'));
            console.log(chalk.red(error.stack.split('\n').map(line => `    ${line}`).join('\n')));
        }
    } else if (Object.keys(error).length > 0) {
        console.log(chalk.red('  Detalles adicionales:'));
        Object.entries(error).forEach(([key, value]) => {
            console.log(chalk.red(`    ${key}:`), chalk.white(value));
        });
    }
}

/**
 * Registra un mensaje de advertencia.
 * @param {string} message - El mensaje principal de advertencia.
 * @param {Object} [details] - Detalles adicionales opcionales.
 */
export function log_warning(message, details = {}) {
    console.log(chalk.yellow('⚠ ADVERTENCIA:'), chalk.yellow.bold(message));
    if (Object.keys(details).length > 0) {
        console.log(chalk.yellow('  Detalles:'));
        Object.entries(details).forEach(([key, value]) => {
            console.log(chalk.yellow(`    ${key}:`), chalk.white(value));
        });
    }
}