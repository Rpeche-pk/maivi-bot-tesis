// Función para formatear resultados de búsqueda
class RiceSearchResults {
    constructor() {
        this.results = [
            {
                brand: 'costeño',
                emoji: '🌾',
                prices: {
                    Tottus: {
                        price: 5.90,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Tottus',
                        link: 'https://www.tottus.com/arroz-costeno',
                        image: 'https://via.placeholder.com/150?text=Arroz+Coste%C3%B1o+Tottus'
                    },
                    'Plaza Vea': {
                        price: 6.20,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Plaza Vea',
                        link: 'https://www.plazavea.com/arroz-costeno',
                        image: 'https://via.placeholder.com/150?text=Arroz+Coste%C3%B1o+Plaza+Vea'
                    },
                    Metro: {
                        price: 5.70,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Metro',
                        link: 'https://www.metro.com.pe/arroz-costeno',
                        image: 'https://via.placeholder.com/150?text=Arroz+Coste%C3%B1o+Metro'
                    }
                }
            },
            {
                brand: 'paisana',
                emoji: '🍚',
                prices: {
                    Tottus: {
                        price: 4.50,
                        presentation: '750g',
                        available: true,
                        supermarket: 'Tottus',
                        link: 'https://www.tottus.com/arroz-paisana',
                        image: 'https://via.placeholder.com/150?text=Arroz+Paisana+Tottus'
                    },
                    'Plaza Vea': {
                        price: 4.80,
                        presentation: '750g',
                        available: true,
                        supermarket: 'Plaza Vea',
                        link: 'https://www.plazavea.com/arroz-paisana',
                        image: 'https://via.placeholder.com/150?text=Arroz+Paisana+Plaza+Vea'
                    },
                    Metro: {
                        price: 4.40,
                        presentation: '750g',
                        available: true,
                        supermarket: 'Metro',
                        link: 'https://www.metro.com.pe/arroz-paisana',
                        image: 'https://via.placeholder.com/150?text=Arroz+Paisana+Metro'
                    }
                }
            },
            {
                brand: 'extra',
                emoji: '🌿',
                prices: {
                    Tottus: {
                        price: 6.50,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Tottus',
                        link: 'https://www.tottus.com/arroz-extra',
                        image: 'https://via.placeholder.com/150?text=Arroz+Extra+Tottus'
                    },
                    'Plaza Vea': {
                        price: 6.90,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Plaza Vea',
                        link: 'https://www.plazavea.com/arroz-extra',
                        image: 'https://via.placeholder.com/150?text=Arroz+Extra+Plaza+Vea'
                    },
                    Metro: {
                        price: 6.30,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Metro',
                        link: 'https://www.metro.com.pe/arroz-extra',
                        image: 'https://via.placeholder.com/150?text=Arroz+Extra+Metro'
                    }
                }
            },
            {
                brand: 'mañana',
                emoji: '🌄',
                prices: {
                    Tottus: {
                        price: 5.20,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Tottus',
                        link: 'https://www.tottus.com/arroz-manana',
                        image: 'https://via.placeholder.com/150?text=Arroz+Mañana+Tottus'
                    },
                    'Plaza Vea': {
                        price: 5.50,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Plaza Vea',
                        link: 'https://www.plazavea.com/arroz-manana',
                        image: 'https://via.placeholder.com/150?text=Arroz+Mañana+Plaza+Vea'
                    },
                    Metro: {
                        price: 5.00,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Metro',
                        link: 'https://www.metro.com.pe/arroz-manana',
                        image: 'https://via.placeholder.com/150?text=Arroz+Mañana+Metro'
                    }
                }
            },
            {
                brand: 'faraón',
                emoji: '👑',
                prices: {
                    Tottus: {
                        price: 7.20,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Tottus',
                        link: 'https://www.tottus.com/arroz-faraon',
                        image: 'https://via.placeholder.com/150?text=Arroz+Faraon+Tottus'
                    },
                    'Plaza Vea': {
                        price: 7.50,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Plaza Vea',
                        link: 'https://www.plazavea.com/arroz-faraon',
                        image: 'https://via.placeholder.com/150?text=Arroz+Faraon+Plaza+Vea'
                    },
                    Metro: {
                        price: 6.90,
                        presentation: '1 kg',
                        available: true,
                        supermarket: 'Metro',
                        link: 'https://www.metro.com.pe/arroz-faraon',
                        image: 'https://via.placeholder.com/150?text=Arroz+Faraon+Metro'
                    }
                }
            }
        ];

    }

    // Método para encontrar el mejor precio
    findBestPrice(prices) {
        return Object.entries(prices).reduce((best, [store, data]) =>
                (!best || data.price < best.price) ? { store, ...data } : best
            , null);
    }

    // Formatear mensaje de resultados
    formatSearchResult(riceData) {
        const bestPrice = this.findBestPrice(riceData.prices);

        let message = `*🏪 Precios Comparados - Arroz ${riceData.brand}* ${riceData.emoji}\n\n`;

        // Detalles de cada supermercado
        Object.entries(riceData.prices).forEach(([store, data]) => {
            message += `*${store}:*\n`;
            message += `• Precio: S/ ${data.price.toFixed(2)}\n`;
            message += `• Presentación: ${data.presentation}\n`;
            message += `• Disponibilidad: ${data.available ? '✅ En stock' : '❌ Sin stock'}\n`;
            message += `• Supermercado: ${data.supermarket}\n`;
            message += `• [Ver producto](${data.link})\n`;
            message += `• Imagen: ![Imagen del producto](${data.image})\n\n`;
        });

        // Mejor precio y ahorro
        message += `*💰 Mejor Precio:* ${bestPrice.store} S/ ${bestPrice.price.toFixed(2)}\n`;

        const maxPrice = Math.max(...Object.values(riceData.prices).map(p => p.price));
        const savings = maxPrice - bestPrice.price;

        message += `*💵 Ahorro:* Hasta S/ ${savings.toFixed(2)}`;

        return message;
    }

    // Buscar por marca de arroz
    searchRiceBrand(brand) {
        const result = this.results.find(rice =>
            rice.brand.toLowerCase() === brand.toLowerCase()
        );

        return result
            ? this.formatSearchResult(result)
            : '❌ Marca de arroz no encontrada';
    }


}

export const handleRiceSearch = (message) => {
    const riceSearch = new RiceSearchResults();
    const brand = message.split(' ')[1]; // Asume "arroz Costeño"

    return riceSearch.searchRiceBrand(brand);
};
