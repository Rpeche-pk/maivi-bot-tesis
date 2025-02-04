import {CONSTANTS} from "../config/index.js";
import {log_warning} from "../utils/logger.util.js";

/**
 * Get products from the API
 * @param nameProduct
 * @param brandProduct
 * @param adapter
 * @returns {Promise<number|*[]>}
 */
export const getProductsApi = async (nameProduct, brandProduct, adapter) => {

    const messages = [];

    const fetchProductsSafely = async (endpoint, params) => {
        try {
            return await adapter.http.getProducts(endpoint, params);
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error.message);
            return [];
        }
    };

    const responses = await Promise.all([
        fetchProductsSafely(CONSTANTS.ENDPOINT_VEA, {nameProduct, brand: brandProduct}),
        fetchProductsSafely(CONSTANTS.ENDPOINT_TOTTUS, {nameProduct, brand: brandProduct}),
        fetchProductsSafely(CONSTANTS.ENDPOINT_METRO, {nameProduct, brand: brandProduct}),
    ]);

    const [veaProducts, tottusProducts, metroProducts] = responses;

    const cheapestPlazaVea = _findCheapestProduct(veaProducts);
    const cheapestTottus = _findCheapestProduct(tottusProducts);
    const cheapestMetro = _findCheapestProduct(metroProducts);

    messages.push(`🔎 *Resultados de la búsqueda: ${nameProduct} ${brandProduct}*\n`);

    messages.push(_generateProductMessage(tottusProducts, "TOTTUS"));
    messages.push(_generateProductMessage(veaProducts, "PLAZA VEA"));
    messages.push(_generateProductMessage(metroProducts, "METRO"));

    let cheapestProductsMessage = "💰 Productos Más Baratos:\n\n";

    if (cheapestPlazaVea != null) {
        cheapestProductsMessage += `🏪 Plaza Vea: ${cheapestPlazaVea.name} - S/ ${cheapestPlazaVea.price}\n`;
    }
    if (cheapestTottus!= null) {
        cheapestProductsMessage += `🏪 Tottus: ${cheapestTottus.name} - S/ ${cheapestTottus.price}\n`;
    }
    if (cheapestMetro!= null) {
        cheapestProductsMessage += `🏪 Metro: ${cheapestMetro.name} - S/ ${cheapestMetro.price}\n`;
    }

    messages.push(cheapestProductsMessage)

    const overallCheapest = [cheapestPlazaVea, cheapestTottus, cheapestMetro]
        .filter(product => product !== null)
        .reduce((cheapest, current) =>
            parseFloat(current.price) < parseFloat(cheapest.price) ? current : cheapest
        );

    if (overallCheapest) {
        const messageCheapest = `🏆 Producto Más Económico: ${overallCheapest.name}\nS/ ${overallCheapest.price}\nLink: ${overallCheapest.url} -(${overallCheapest.supermarket})`;
        messages.push(messageCheapest);
    }

    return messages;
};

/**
 * Get brand category
 * @param adapter
 * @param category
 * @returns {Promise<*>}
 */
export const getBrandCategory = async (adapter, category = []) => {

    if (!Array.isArray(category) || category.length < 3) {
        throw new Error("The 'category' parameter must be an array with at least 3 elements.");
    }

    const fetchProductCategories = async (endpoint, params) => {
        try {
            return await adapter.http.getBrandByCategory(endpoint, params);
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error.message);
            return [];
        }
    };

    const responses = await Promise.all([
        fetchProductCategories(CONSTANTS.ENDPOINT_SEARCH_CATEGORY_TOTTUS.replace("{category}", category[0])),
        fetchProductCategories(CONSTANTS.ENDPOINT_SEARCH_CATEGORY_VEA.replace("{category}", category[1])),
        fetchProductCategories(CONSTANTS.ENDPOINT_SEARCH_CATEGORY_METRO.replace("{category}", category[2]))
    ]);

    /*const [tottusProducts, veaProducts, metroProducts] = responses;
    const upperCaseProducts = metroProducts.map((product) => product.brand.toUpperCase().trim());
    const upperCaseProductsVea = veaProducts.map((product) => product.brand.toUpperCase().trim());
    const upperCaseProductsTottus = tottusProducts.map((product) => product.brand.toUpperCase().trim());*/

    const brandLists = responses
        .map(response => response.map(product => product.brand.toUpperCase().trim()))
        .filter(list => list.length > 0);

    if (brandLists.length === 0) {
        log_warning("[getBrandCategory] No common brands found.");
        return [];
    }

    const commonBrands = brandLists.reduce((intersection, list) => {
        return intersection.filter(brand => list.includes(brand));
    });

    /*const commonBrands = upperCaseProductsVea.filter(brand =>
        upperCaseProducts.includes(brand) && upperCaseProductsTottus.includes(brand)
    )*/
    return commonBrands.sort().slice(0, 12);
};

/**
 * Get products by brand
 * @param adapter
 * @param brand
 * @param category
 * @returns {Promise<*[]>}
 */
export const getProductsByBrand = async (adapter, brand, category=[]) => {

    const messages = [];
    const fetchProductsByBrand = async (endpoint, params) => {
        try {
            return await adapter.http.getProductsByBrand(endpoint, params);
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error.message);
            return [];
        }
    };

    const URL1 = CONSTANTS.ENDPOINT_SEARCH_PRODUCT.replace("{brand}", brand).replace("{category}", category[0]);
    const URL2 = CONSTANTS.ENDPOINT_SEARCH_PRODUCT.replace("{brand}", brand).replace("{category}", category[1]);
    const URL3 = CONSTANTS.ENDPOINT_SEARCH_PRODUCT.replace("{brand}", brand).replace("{category}", category[2]);

    const responses = await Promise.all([
        fetchProductsByBrand(URL1, {market: CONSTANTS.MARKET_TOTTUS}),
        fetchProductsByBrand(URL2, {market: CONSTANTS.MARKET_VEA}),
        fetchProductsByBrand(URL3, {market: CONSTANTS.MARKET_METRO})
    ]);

    const [tottusProducts, veaProducts, metroProducts] = responses;

    const cheapestPlazaVea = _findCheapestProduct(veaProducts);
    const cheapestTottus = _findCheapestProduct(tottusProducts);
    const cheapestMetro = _findCheapestProduct(metroProducts);

    messages.push(`🔎 *Resultados de la búsqueda: ${brand}*\n`);

    messages.push(_generateProductMessage(tottusProducts, "TOTTUS"));
    messages.push(_generateProductMessage(veaProducts, "PLAZA VEA"));
    messages.push(_generateProductMessage(metroProducts, "METRO"));

    let cheapestProductsMessage = "💰 *Productos Más Baratos*:\n\n";

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

    const overallCheapest = [cheapestPlazaVea, cheapestTottus, cheapestMetro]
        .filter(product => product !== null)
        .reduce((cheapest, current) =>
            parseFloat(current.price) < parseFloat(cheapest.price) ? current : cheapest
        );

    if (overallCheapest) {
        const messageCheapest = `🏆 *Producto Más Económico*: ${overallCheapest?.name} - S/ ${overallCheapest?.price} - link: ${overallCheapest.url}*(${overallCheapest?.supermarket})*`;
        messages.push(messageCheapest);
    }

    return messages;
}



const _findCheapestProduct = (products) => {
    if (!products || products.length === 0) return null;
    return products.reduce((cheapest, current) =>
        parseFloat(current.price) < parseFloat(cheapest.price) ? current : cheapest
    );
};

const _generateProductMessage = (products, supermarketName) => {
    if (!products || products.length === 0) {
        return `🏪 ${supermarketName}: No se encontraron productos`;
    }

    const top8 = products.slice(0, 10);

    return `🏪 ${supermarketName}:\n` +
        top8.map((product, index) =>
            `🔹 #${supermarketName.slice(0,3)}-${index + 1}\n` +
            `🛒 Producto: ${product.name}\n` +
            `💲 Precio: S/ ${product.price}\n` +
            `🏷️ Marca: ${product.brand}\n` +
            `🏪 Supermercado: ${product?.supermarket}\n`+
            `📦 Categoría: ${product.category}\n` +
            `🔗 Link de compra: ${product.url}`
        ).join("\n\n");
};
