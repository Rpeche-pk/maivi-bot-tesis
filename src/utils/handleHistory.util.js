
/**
 * Maneja el historial agregando un nuevo registro.
 * @param {Object} inside - Objeto con rol y contenido.
 * @param _state
 */
const handleHistory = async (inside, _state) => {
    const history = _state.get("history") || [];
    history.push(inside);
    await _state.update({ history });
};

/**
 * Obtiene el historial limitado a k elementos.
 * @param _state
 * @param {number} k - Límite de elementos a obtener.
 * @returns {Array} - Historial limitado.
 */
const getHistory = (_state, k = 15) => {
    const history = _state.get("history") || [];
    return history.slice(-k);
};

/**
 * Obtiene el historial en formato de texto parseado.
 * @param _state
 * @param {number} k - Límite de elementos a obtener.
 * @returns {string} - Historial parseado.
 */
const getHistoryParse = (_state, k = 15) => {
    const history = _state.get("history") || [];
    const limitHistory = history.slice(-k);
    return limitHistory.reduce((prev, current) => {
        const msg = current.role === "user" ? `User: ${current.content}` : `Bot: ${current.content}\n`;
        return prev + msg;
    }, "");
};

/**
 * Limpia el historial del estado del bot.
 */
const clearHistory = async (_state) => {
    _state.clear();
};

export { handleHistory, getHistory, getHistoryParse, clearHistory };
