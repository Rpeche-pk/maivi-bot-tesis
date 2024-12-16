import {log_error} from "../utils/logger.util.js";
import {handleErrorAndNotifySlack} from "./slack.http.js";

class ApiClient {

    constructor(baseUrl,url) {
        this.baseUrl = baseUrl;
        this.url = url;
    }

    /**
     * Handle the response of the fetch request.
     * @param response
     */
    async #handleResponse(response) {
        if (!response.ok) {
            const errorBody = await response.text();
            log_error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
        }

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (error) {
            return text;
        }
    }

    /**
     * Get products from the API.
     * @param endPoint
     * @param filters
     * @returns {Promise<any>}
     */
    async getProducts(endPoint, filters) {
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`${this.baseUrl}/${endPoint}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return this.#handleResponse(response);
        } catch (error) {
            log_error('Error Get products from the API:', error);
            await handleErrorAndNotifySlack('Error Get products from the API:', error);
        }
    }

    async getBrandByCategory(endPoint) {
        try {
            const response = await fetch(`${this.url}/${endPoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return this.#handleResponse(response);
        } catch (error) {
            log_error('[getBrandByCategory] Error Get products from the API:', error);
            await handleErrorAndNotifySlack('[getBrandByCategory] Error Get products from the API:', error);
        }
    }


    /**
     * Sync mongo data to Elasticsearch
     * @param endPoint
     * @returns {Promise<any>}
     */
    async syncData(endPoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endPoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return this.#handleResponse(response);
        } catch (error) {
            log_error('Error Sync mongo data to Elastic Search:', error);
            await handleErrorAndNotifySlack('Error Sync mongo data to Elastic Search:', error);
        }
    }
}

export {ApiClient};
