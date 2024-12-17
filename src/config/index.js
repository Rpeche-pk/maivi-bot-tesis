import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/whatsapp-bot';

const CONSTANTS = {
    MODEL_AI: "gpt-4o-mini",
    NAME_COLLECTION: "marketUser",
    URL_BACKEND: "http://127.0.0.1:9698/v1/api/elastic-data",
    URL_BACK_PRODUCTS: "http://127.0.0.1:9698/v1/api/products",
    ENDPOINT_VEA: "plazavea",
    ENDPOINT_TOTTUS: "tottus",
    ENDPOINT_METRO: "metro",
    ENDPOINT_SYNC_DATA :"/sync",
    ENDPOINT_SEARCH_CATEGORY_TOTTUS: "brand/TOTTUS/{category}",
    ENDPOINT_SEARCH_CATEGORY_VEA: "brand/PLAZAVEA/{category}",
    ENDPOINT_SEARCH_CATEGORY_METRO: "brand/METRO/{category}",
    ENDPOINT_SEARCH_PRODUCT: "brand-category/{brand}/{category}",
    MARKET_VEA: "Plaza Vea",
    MARKET_TOTTUS: "Tottus",
    MARKET_METRO: "Metro",
    INTENTS: 2,
    MESSAGES : {
        FAIL_PREDICTION: "🙇🏽‍♀️ Disculpa, pero no entiendo lo que necesitas. ¿Puedes reformular tu consulta?",
        FAIL:"💢 Por favor elige una opción válida.",
        ERROR_DNI:"🔴 El DNI ingresado no es válido, por favor intenta nuevamente. Recuerde que debe ser númerico y de 8 dígitos.",
        OTP_STRUCTURE:"🔴 El código ingresado no es válido, por favor intenta nuevamente. Recuerde que debe ser númerico y de 8 dígitos.",
        OTP_RESPONSE_ERROR:"🔴 El código ingresado no es correcto, por favor intenta nuevamente.",
    },
    URL_IMAGE_BOT: ["https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/PAPIKO.jpg",
        "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko17.jpg"
        , "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko7.jpg"
        , "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko5.jpg",
        "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko13.jpg",
        "https://ik.imagekit.io/ljpa/zephyr-cygnus/imgBot/Papiko21.jpg"],
    MESSAGE_PRINCIPAL: [
        "📌 *¿Cómo funciona?* \nSolo dime el nombre del producto que buscas",
        "🥫 *Sección de abarrotes*: \nDesde arroz, azúcar, aceites, pastas, etc.",
        "🔍 *Compara fácilmente*: Te ayudo a comparar precios" +
        "\n\n📝 *¿Qué puedes hacer conmigo?*\n" +
        `╠ 👉🏽 Escribe el producto que necesitas.\n╙ 👉🏽 Te daré los resultados con precios, marcas y enlaces para que compres fácilmente.`,
        "📊 *¿Qué te muestro?*\n" +
        "\nCuando buscas algo, te doy:\n" +
        `╠ 👉🏽 Nombre del producto.\n╠ 👉🏽 Marca.\n╠ 👉🏽 Precio en cada supermercado.\n╙ 👉🏽 Enlace para que lo compres directamente.`
    ],
    MESSAGE_SEARCH_PRODUCTS: [
        `🔍 Esta funcionalidad te permite buscar un _producto específico_ ,ingresando el *nombre del producto* junto con la *marca*.\n\n*Por ejemplo:*\n👉 *Producto:* Leche\n👉 *Marca:* Gloria\n\n*Formato:* producto + marca\n\n*Ejemplos correctos:*\n\n * Leche Gloria\n * Aceite Primor\n * Azúcar Bell's\n * Fideo Vittorio`,
        `📌 *Supermercados incluidos:*\n╠ 🏪 Tottus\n╠ 🏪 Plaza Vea\n╙ 🏪 Metro`
    ],
    MESSAGE_WELCOME_BACK: [
        `¡Hola de nuevo! 👋 Es un gusto tenerte aquí otra vez.`,
        `¡Bienvenido(a) de vuelta! 💁🏻‍♀ ¿En qué puedo ayudarte hoy?`,
        `¡Es genial verte otra vez! 😄 ¿Cómo puedo ayudarte?`,
        `¡Qué alegría verte otra vez! 🤗 ¿Cómo puedo apoyarte hoy?`,
        `¡Encantado(a) de verte de nuevo! 🥳 ¿Cómo puedo ayudarte?`
        ],
    MESSAGE_BACK_USER :[
        "¡RECUERDA! 🛒\n" +
        "*MaiviBot*; Tu asistente para encontrar los mejores precios de alimentos en _supermercados online_. Compara _precios_ y conoce las características de los productos al instante. ¡Ahorra en cada compra! 💰 "
    ],
    MESSAGE_MAINTENANCE: [
        "🛠️ *Mantenimiento Programado*\n\n" +
        "Estimado cliente, estamos realizando mejoras en nuestro sistema. " +
        "El servicio estará temporalmente interrumpido.\n\n" +
        "*Tiempo estimado:* 10-15 minutos\n" +
        "Gracias por su comprensión.",

        "🔧 *Servicio Temporalmente Suspendido*\n\n" +
        "Nuestro equipo técnico está optimizando la plataforma para brindarte un mejor servicio. " +
        "Estaremos de vuelta muy pronto.\n\n" +
        "Disculpa las molestias ocasionadas.",

        "⏳ *Actualización en Progreso*\n\n" +
        "Estamos realizando una actualización importante en nuestros sistemas. " +
        "El servicio se encontrará disponible en breve.\n\n" +
        "Agradecemos tu paciencia.",

        "🚧 *Intervalo de Mantenimiento*\n\n" +
        "Nos encontramos mejorando nuestra infraestructura tecnológica. " +
        "El servicio estará limitado temporalmente.\n\n" +
        "*Tiempo aproximado:* 15 minutos\n" +
        "Gracias por tu comprensión.",

        "🔬 *Optimización de Sistemas*\n\n" +
        "Estamos implementando mejoras para ofrecerte un servicio más rápido y eficiente. " +
        "Volveremos en unos momentos.\n\n" +
        "Disculpa las molestias.",

        "💻 *Actualización Técnica*\n\n" +
        "Nuestro equipo está trabajando para optimizar los sistemas. " +
        "El servicio se encontrará disponible próximamente.\n\n" +
        "Gracias por tu paciencia y comprensión."
    ]
};

export { CONSTANTS, MONGO_URI };
