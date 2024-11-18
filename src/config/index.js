import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/whatsapp-bot';

const CONSTANTS = {
    INTENTS: 2,
    MESSAGES : {
        FAIL:"💢 Por favor elige una opción válida.",
        ERROR_DNI:"🔴 El DNI ingresado no es válido, por favor intenta nuevamente. Recuerde que debe ser númerico y de 8 dígitos.",
        OTP_STRUCTURE:"🔴 El código ingresado no es válido, por favor intenta nuevamente. Recuerde que debe ser númerico y de 8 dígitos.",
        OTP_RESPONSE_ERROR:"🔴 El código ingresado no es correcto, por favor intenta nuevamente.",
    },
    URL_IMAGE_BOT: ["https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/PAPIKO.jpg"
        , "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko7.jpg"
        , "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko5.jpg",
        "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko13.jpg",
        "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko21.jpg"],
    MESSAGE_PRINCIPAL: [
        "📌 *¿Cómo funciona?* Solo dime el nombre del producto que buscas",
        "🥫 Sección de abarrotes: Desde arroz, azúcar, aceites, pastas hasta enlatados, puedo buscar cualquier producto que necesites en esta categoría.",
        "🔍 *Compara fácilmente*: Mi trabajo es ayudarte a comparar precios de productos de abarrotes entre Metro, Tottus y Plaza Vea. " +
        "📝 *¿Qué puedes hacer conmigo?*\n" +
        `╠ 👉🏽 Escribe el producto que necesitas (por ejemplo: “arroz costeño” o “aceite primor”).\n ╠ 👉🏽 Yo buscaré en tiempo real en Metro, Tottus y Plaza Vea.\n╙ 👉🏽 Te daré los resultados con precios, marcas y enlaces para que compres fácilmente.`,
        "📊 ¿Qué te muestro?\n" +
        "Cuando buscas algo, te doy:\n" +
        `╠ 👉🏽 Nombre del producto.\n╠ 👉🏽 Marca.\n╠ 👉🏽 Precio en cada supermercado.\n╙ 👉🏽 Enlace para que lo compres directamente.`
    ]
};

export { CONSTANTS, MONGO_URI };