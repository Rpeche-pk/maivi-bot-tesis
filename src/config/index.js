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
        `¡Encantado(a) de verte de nuevo! 🥳 ¿Cómo puedo ayudarte?`,
        "¡Es un placer saludarte otra vez! 🙌 ¿En qué puedo asistirte?"
        ],
    MESSAGE_BACK_USER :[
        "¡RECUERDA! 🛒\n" +
        "*MaiviBot*; Tu asistente para encontrar los mejores precios de alimentos en _supermercados online_. Compara _precios_ y conoce las características de los productos al instante. *¡Ahorra en cada compra!* 💰 "
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
    ],
    PALETTES_COLOR: [
        '#7EA1FF',
        '#641E16',
        '#7EAA92',
        '#213555',
        '#FF5733',
        '#FFC312',
        '#6A669D',
    ],
    FAREWELL_MESSAGES:[
        "*¡Gracias por tu visita!* 🌟\nPara volver a buscar productos escribe *empezar*",
        "*¡Hasta la próxima!* 🛒\nRecuerda que puedes buscar más productos con _empezar_",
        "¡Hasta luego! 👋🏽 Estamos aquí para ti. \nEscribe *empezar* para buscar más productos.",
        "*Esperamos haberte ayudado* 💡. Recuerda: escribe _empezar_ para reiniciar el bot.",
        "*Ha sido un gusto ayudarte* 😊. Vuelve a escribir _empezar_ cuando lo necesites."
    ],
    SYSTEM_DROP_MESSAGES:[
        "😰 *¡Ups!*\n" +
        "Lamentamos el inconveniente 🙁, parece que algo salió mal al procesar tu consulta. Por favor, intenta nuevamente más tarde.",
        "😱 *¡Error!*\n" +
        "¡Ups! Ocurrió un error inesperado 🤖. Estamos trabajando para solucionarlo. Intenta tu consulta de nuevo o contáctanos si el problema persiste.",
        "🥶 *¡Error!*\n" +
        "Lo sentimos mucho, algo no salió como esperábamos 😔. Por favor, verifica tu consulta y vuelve a intentarlo. Gracias por tu paciencia.",
        "😨 *¡Error!*\n" +
        "Disculpa las molestias 😅, estamos teniendo un pequeño inconveniente con tu consulta. Inténtalo otra vez y si el problema persiste, háznoslo saber.",
        "😴 *¡Vaya!*\n" +
        "Estamos teniendo problemas técnicos con tu búsqueda 🛠️. Pedimos disculpas y te invitamos a intentarlo nuevamente en unos momentos."
    ],
    GENERAL_MESSAGES_FAILURES:[
        "😲 *¡Ups!*\n" +
        "Estamos experimentando un problema técnico temporal 🛠️. Nuestro equipo ya está trabajando para solucionarlo. Agradecemos tu comprensión y paciencia.",
        "🥶 *¡Vaya!*\n" +
        "¡Gracias por tu paciencia! Estamos enfrentando un inconveniente técnico en este momento, pero estamos haciendo todo lo posible para resolverlo lo antes posible.",
        "😳 *¡Error!*\n" +
        "Actualmente estamos resolviendo un problema con nuestro sistema 🤖. Te pedimos disculpas por cualquier inconveniente y te aseguramos que pronto estará funcionando normalmente.",
        "😰 *¡Error!*\n" +
        "Sabemos que esto puede ser frustrante 😔. Nuestro sistema está en mantenimiento debido a un problema técnico. Te mantendremos informado sobre cualquier actualización.",
        "🤕 *¡Vaya!*\n" +
        "Estamos trabajando para restaurar el servicio lo más rápido posible 🚀. Gracias por tu paciencia mientras resolvemos este inconveniente."
    ]
};

export { CONSTANTS, MONGO_URI };
