
/**
 * funcion para calcular el tiempo de escritura de un texto
 * @param text
 * @returns {number|*}
 */
const typingTime=(text) => {
    const typingSpeed = 0.125; // caracteres por segundo
    const textLength = text.length;
    const typingTime = textLength * typingSpeed* 500;
    if (textLength >= 50) {
        return setRandomDelay(1590, 1280);
    }
    return typingTime;
}

/**
 * funcion para generar un delay aleatorio entre un rango de numeros
 * @param max
 * @param min
 * @returns {*}
 */
const setRandomDelay = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const calculateTypingTime = (text) => {
    // Configuración de velocidades (caracteres por segundo)
    const config = {
        baseSpeed: 5, // Velocidad base de escritura (5 caracteres por segundo)
        speedVariation: 0.8, // Variación aleatoria de velocidad (20%)
        pauseWordsThreshold: 3, // Cantidad de palabras antes de añadir pausa
        shortPause: [300, 800], // Rango de pausa corta en ms
        longPause: [900, 1850], // Rango de pausa larga en ms
        // Factores que afectan la velocidad
        complexityFactors: {
            numbers: 1.2, // 20% más lento para números
            symbols: 1.3, // 30% más lento para símbolos
            uppercase: 1.1, // 10% más lento para mayúsculas
            emoji: 1.5 // 50% más lento para emojis
        }
    };

    // Si el texto está vacío, retorna 0
    if (!text || text.length === 0) return 0;

    // Análisis del texto
    const textAnalysis = {
        length: text.length,
        words: text.split(' ').length,
        numbers: (text.match(/\d/g) || []).length,
        symbols: (text.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length,
        uppercase: (text.match(/[A-Z]/g) || []).length,
        emoji: (text.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || []).length
    };

    // Cálculo del tiempo base
    let baseTime = textAnalysis.length / config.baseSpeed * 1000;

    // Ajuste por complejidad
    let complexityMultiplier = 1;
    if (textAnalysis.numbers > 0) {
        complexityMultiplier *= config.complexityFactors.numbers;
    }
    if (textAnalysis.symbols > 0) {
        complexityMultiplier *= config.complexityFactors.symbols;
    }
    if (textAnalysis.uppercase > 0) {
        complexityMultiplier *= config.complexityFactors.uppercase;
    }
    if (textAnalysis.emoji > 0) {
        complexityMultiplier *= config.complexityFactors.emoji;
    }

    // Aplicar multiplicador de complejidad
    baseTime *= complexityMultiplier;

    // Añadir variación aleatoria a la velocidad base
    const variation = 1 + (Math.random() * config.speedVariation * 2 - config.speedVariation);
    baseTime *= variation;

    // Añadir pausas basadas en la cantidad de palabras
    const numberOfPauses = Math.floor(textAnalysis.words / config.pauseWordsThreshold);
    let pauseTime = 0;

    for (let i = 0; i < numberOfPauses; i++) {
        // Alternar entre pausas cortas y largas
        const isPauseLong = Math.random() > 0.7; // 30% de probabilidad de pausa larga
        const pauseRange = isPauseLong ? config.longPause : config.shortPause;
        pauseTime += setRandomDelay(pauseRange[0], pauseRange[1]);
    }

    // Tiempo total
    const totalTime = Math.round(baseTime + pauseTime);

    // Límites de tiempo
    const minTime = 500; // Mínimo medio segundo
    const maxTime = 15000; // Máximo 15 segundos

    return Math.min(Math.max(totalTime, minTime), maxTime);
};


/**
 * funcion para generar un pequeño delay dado el tiempo en ms
 * @param ms {number}
 * @returns {Promise<unknown>}
 */
const wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};
export { typingTime, setRandomDelay,wait,calculateTypingTime}
