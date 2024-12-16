import {CONSTANTS} from "../config/index.js";

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
        fetchProductsSafely(CONSTANTS.ENDPOINT_VEA, { nameProduct, brand: brandProduct }),
        fetchProductsSafely(CONSTANTS.ENDPOINT_TOTTUS, { nameProduct, brand: brandProduct }),
        fetchProductsSafely(CONSTANTS.ENDPOINT_METRO, { nameProduct, brand: brandProduct }),
    ]);

    if (!responses.some(response => response && response.length > 0)) {
        return messages.push(`❌ No se encontraron productos para "${nameProduct}" con la marca "${brandProduct}".`);
    }

    const [veaProducts, tottusProducts, metroProducts] = responses;

    const generateProductMessage = (products, supermarketName) => {
        if (!products || products.length === 0) {
            return `🏪 ${supermarketName}: No se encontraron productos\n\n`;
        }

        const top8 = products.slice(0, 8);

        return `🏪 ${supermarketName}:\n\n` +
            top8.map((product, index) =>
                `🔹 #${index + 1}\n` +
                `🛒 Producto: ${product.name}\n` +
                `💲 Precio: S/ ${product.price}\n` +
                `📦 Categoría: ${product.category}\n` +
                `🏷️ Marca: ${product.brand}\n` +
                `🔗 Link de compra: ${product.url}`
            ).join("\n\n");
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

    messages.push(`🔎 *Resultados de la búsqueda: ${nameProduct} ${brandProduct}*\n`);

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
};

export const getBrandCategory = async (adapter, category= []) => {

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
        fetchProductCategories(CONSTANTS.ENDPOINT_SEARCH_CATEGORY.replace("{category}",category[0])),
        fetchProductCategories(CONSTANTS.ENDPOINT_SEARCH_CATEGORY_VEA.replace("{category}",category[1])),
        fetchProductCategories(CONSTANTS.ENDPOINT_SEARCH_CATEGORY_METRO.replace("{category}",category[2]))
    ]);

    const [tottusProducts, veaProducts, metroProducts] = responses;
    const upperCaseProducts =metroProducts.map((product) => product.brand.toUpperCase());
    const upperCaseProductsVea =veaProducts.map((product) => product.brand.toUpperCase());
    const upperCaseProductsTottus =tottusProducts.map((product) => product.brand.toUpperCase());

    // Encontrar intersección de marcas
    const commonBrands = upperCaseProducts.filter(brand =>
        upperCaseProductsVea.includes(brand) && upperCaseProductsTottus.includes(brand)
    )

    return commonBrands.sort().slice(0, 12);
};
