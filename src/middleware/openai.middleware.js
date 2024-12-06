import {handleErrorAndNotifySlack} from "../http/slack.http.js";
import {log_error, log_success} from "../utils/logger.util.js";
import {formatText} from "../utils/cleantext.util.js";
import {CONSTANTS} from "../config/index.js";
import {idleReset} from "../utils/idle.util.js";
import {setRandomDelay} from "../utils/delay.util.js";

const openai_middleware = async (ctx, {
    extensions,
    provider,
    state,
    flowDynamic,
    fallBack,
    endFlow,
    gotoFlow,
    globalState
}) => {
    try {
        idleReset(ctx, gotoFlow, globalState.get("timer"));
        const body = formatText(ctx?.body);
        const userState = state?.getMyState();
        const phone = ctx?.from;
        userState[phone] = {...userState[phone], history: [{role: "user", content: body}]};

        const responseAI = await extensions.ai.determineChatFn(body, userState[phone]?.history);
        log_success("PREDICTION", responseAI);

        if (responseAI.prediction.toLowerCase().includes('unknown')) {
            await extensions.utils.tryAgain({
                ctx,
                state,
                fallBack,
                provider,
                flowDynamic,
                endFlow
            }, CONSTANTS.MESSAGES.FAIL_PREDICTION);
            return;
        }

        await flowDynamic("⏱ *Consultando... ⏱*");
        const myState = state?.getMyState();
        const responseAi = await extensions.ai.startChatAI(body, myState[phone]?.history);

        //PROCESAR LA RESPUESTA DE LA AI Y PASARLA COMO CONSULTA ALA BACKEND CON ELASTIC SEARCH

        const arrayParams = String(responseAi).split("+");
        const nameProduct = arrayParams[0].trim();
        const brandProduct = arrayParams[1].trim();

        const responseApi = await getProductsApi(nameProduct, brandProduct, extensions);

        userState[phone] = {...userState[phone], history: [{role: "assistant", content: responseAi}]};
        await state.update(userState);


        for (let i = 0; i < responseApi.length; i++) {
            await extensions.utils.typing(provider, {
                delay1: setRandomDelay(490, 410),
                delay2: setRandomDelay(1250, 1090),
                ctx
            });
            await flowDynamic([{body: responseApi[i]}]);
        }

    } catch (e) {
        await handleErrorAndNotifySlack("ERROR FLUJO openai_middleware", e);
        log_error("ERROR FLUJO openai_middleware", e);
    }
};

const getProductsApi = async (nameProduct, brandProduct, adapter) => {

    // Mensajes separados
    const messages = [];

    const responses = await Promise.all([
        await adapter.http.getProducts(CONSTANTS.ENDPOINT_VEA, {nameProduct, brand: brandProduct}),
        await adapter.http.getProducts(CONSTANTS.ENDPOINT_TOTTUS, {nameProduct, brand: brandProduct}),
        await adapter.http.getProducts(CONSTANTS.ENDPOINT_METRO, {nameProduct, brand: brandProduct})
    ])


    if (!responses.some(response => response && response.length > 0)) {
        return `❌ No se encontraron productos para "${nameProduct}" con la marca "${brandProduct}".`;
    }

    const [veaProducts, tottusProducts, metroProducts] = responses;

    const generateProductMessage = (products, supermarketName) => {
        if (!products || products.length === 0) {
            return `🏪 ${supermarketName}: No se encontraron productos\n\n`;
        }

        const top8 = products.slice(0, 8);

        return `🏪 ${supermarketName}:\n\n` +
            top8.map((product, index) =>
                `🔹 #${index + 1}\n`+
                `🛒 Producto: ${product.name}\n`+
                `💲 Precio: S/ ${product.price}\n`+
                `📦 Categoría: ${product.category}\n`+
                `🏷️ Marca: ${product.brand}\n`+
                `🔗 Link de compra: ${product.url}`
            ).join("\n\n") + "\n\n";
    };


    const findCheapestProduct = (products) => {
        if (!products || products.length === 0) return null;
        return products.reduce((cheapest, current) =>
            parseFloat(current.price) < parseFloat(cheapest.price) ? current : cheapest
        );
    };

    const cheapestPlazaVea = findCheapestProduct(veaProducts);
    const cheapestTottus = findCheapestProduct(tottusProducts);
    const cheapestMetro = findCheapestProduct(metroProducts);

    let message = `🔎 *Resultados de la búsqueda: ${nameProduct} ${brandProduct}*\n\n`;

    // Add products by supermarket
    messages.push(generateProductMessage(tottusProducts, "TOTTUS"));
    messages.push(generateProductMessage(veaProducts, "PLAZA VEA"));
    messages.push(generateProductMessage(metroProducts, "METRO"));


    let cheapestProductsMessage = "💰 Productos Más Baratos:\n\n";

    if (cheapestPlazaVea) {
        cheapestProductsMessage += `🏪 Plaza Vea: ${cheapestPlazaVea.name} - S/ ${cheapestPlazaVea.price}\n`;
    }
    if (cheapestTottus) {
        cheapestProductsMessage += `🏪 Tottus: ${cheapestTottus.name} - S/ ${cheapestTottus.price}\n`;
    }
    if (cheapestMetro) {
        cheapestProductsMessage += `🏪 Metro: ${cheapestMetro.name} - S/ ${cheapestMetro.price}\n`;
    }

    messages.push(cheapestProductsMessage)
    // Overall cheapest product
    const overallCheapest = [cheapestPlazaVea, cheapestTottus, cheapestMetro]
        .filter(product => product !== null)
        .reduce((cheapest, current) =>
            parseFloat(current.price) < parseFloat(cheapest.price) ? current : cheapest
        );

    if (overallCheapest) {
        const messageCheapest = `🏆 Producto Más Económico: ${overallCheapest.name} - S/ ${overallCheapest.price} (${overallCheapest.supermarket})`;
        messages.push(messageCheapest);
    }

    return messages;

}

export {openai_middleware};
