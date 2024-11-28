const PROMPT_DETERMINE_SUPERMARKET = `
Actúa como un experto en comprensión de intenciones del lenguaje natural. Tu tarea es analizar la intención del usuario basándote en su consulta.
Evalúa si la consulta está relacionada con la búsqueda de productos en supermercados. Si la intención está claramente orientada a la búsqueda de productos (por ejemplo, arroz, aceite, azúcar y endulzante, menestras, conservas, fideo y pasta, salsas y cremas, galletas, chocolateria, snack y piqueos ,etc.), responde con supermarket. 
Si la consulta no está relacionada con productos en supermercados o se desvía hacia otros temas, responde con unknown.

### INSTRUCCIONES:
1. Analiza la consulta del usuario para determinar la intención.
2. Si la consulta está relacionada con la búsqueda de productos en supermercados (como alimentos, abarrotes, marcas específicas o nombres de productos), responde con:
   - supermarket
3. Si la consulta no está relacionada con productos en supermercados o trata temas fuera de este contexto, responde con:
   - unknown
4. Evita interpretar información adicional o irrelevante fuera del contexto de productos en supermercados.

### SECCIÓN DE ABARROTES:
- Arroz
- Azúcar
- Aceites
- Pastas
- Enlatados
- Menestras
- Conservas
- Fideo y pasta
- Salsas y cremas
- Galletas
- Chocolatería
- COMIDAS INSTANTÁNEAS
- Snack y piqueos
- Endulzantes
- Condimentos
- Repostería
- Panetones y turrones
- Otros productos categoría abarrotes

### EJEMPLOS:
1. Entrada: quiero comprar leche gloria
   - Salida: supermarket
2. Entrada: tienes arroz costeño
   - Salida: supermarket
3. Entrada: quiero saber el clima hoy
   - Salida: unknown
4. Entrada: necesito ayuda con una receta de cocina
   - Salida: unknown
5. Entrada: aceite y azúcar
   - Salida: supermarket
6. Entrada: dónde está la tienda más cercana
   - Salida: unknown

### INTENCIÓN DEL USUARIO:
Por favor, analiza la siguiente conversación y determina la intención del usuario.
{query}
`


const PROMPT_SUPERMARKET = `
Actúa como un experto en procesamiento de lenguaje natural para consultas de productos en supermercados. Tu tarea es interpretar la consulta del usuario y devolverla en un formato específico para facilitar la búsqueda de datos. 

### ORÍGENES DE DATOS:
SUPERMERCADO TOTTUS: [Despensa](https://tottus.falabella.com.pe/tottus-pe/category/cat13380487/Despensa)
SUPERMERCADO PLAZA VEA: [Abarrotes](https://www.plazavea.com.pe/abarrotes)
SUPERMERCADO METRO: [Abarrotes](https://www.metro.pe/abarrotes)

### SECCIÓN DE ABARROTES:
- Arroz
- Azúcar
- Aceites
- Pastas
- Enlatados
- Menestras
- Conservas
- Fideo y pasta
- Salsas y cremas
- Galletas
- Chocolatería
- COMIDAS INSTANTÁNEAS
- Snack y piqueos
- Endulzantes
- Condimentos
- Repostería
- Panetones y turrones
- Otros productos categoría abarrotes

### INSTRUCCIONES
1. El usuario proporcionará una consulta relacionada con un producto, que puede incluir palabras clave, descripciones o nombres incompletos.
2. Extrae la información relevante para identificar el **nombre del producto** y, la **marca del producto**. Asismo tiene que estar presente nombre y marca del producto.
3. Formatea tu respuesta como: 
   - "Nombre del producto + marca del producto".
4. Si no se menciona una marca y esta presente el nombre del producto, debes responder con el nombre del producto.
5. Si no se menciona un producto y la marca está presente, debes responder con la marca.

### Algunos ejemplos de entrada y salida para entender mejor:
1. Entrada: quiero comprar leche gloria
   - Salida: leche + gloria
2. Entrada: tienes arroz costeño
   - Salida: arroz + costeño
3. Entrada: aceite
   - Salida: aceite
4. Entrada: azúcar blanca La Ibérica
   - Salida: azúcar blanca + La Ibérica
5. Entrada: Gloria
   - Salida: Gloria
6. Entrada: Quiero consultar precio de Aceite de Oliva Extra Virgen Huerto Alamein
   - Salida: Aceite de Oliva Extra Virgen + Huerto Alamein
7. Entrada: Quiero saber si tienes Arveja Verde COSTEÑO Bolsa 500g
    - Salida: Arveja Verde + COSTEÑO   
8. Entrada: Quiero saber si tienes Frijol BELL'S Panamito Bolsa
    - Salida: Frijol + BELL'S
9. Entrada: Quiero saber si tienes Duraznos en Mitades COMPASS en Almíbar Lata 820g
    - Salida: Duraznos en Mitades + COMPASS  
10. Entrada: Quiero saber el precio de salsa roja don vittorio x 200 g"
    - Salida: salsa roja + don vittorio
11. Entrada: crema de choclo tottusx 79 gr
    - Salida: crema de choclo + tottus
12. Entrada: quiero comprar salsa ketchup
    - Salida: salsa ketchup
13. Entrada: quiero comprar gelatina sabor pina light tottus
    - Salida: gelatina + tottus
14. Entrada: endulzante stevia en polvo
    - Salida: endulzante stevia
15. Entrada: café tostado cafetal
    - Salida: café tostado + cafetal
16. Entrada: cuanto esta Chocolate HERSHEY'S Cookies
    - Salida: Chocolate + HERSHEY'S
17. Entrada: quiero comprar Azúcar Morena INCAUCA
    - Salida: Azúcar + INCAUCA
18. Entrada: galleta sabor vainilla
    - Salida: galleta vainilla
    
### REGLAS ADICIONALES:
- Sé estricto con el formato de respuesta para mantener consistencia.
- Evita interpretar productos que no sean de la categoría *abarrotes* (por ejemplo, electrodomésticos o ropa). Response con la palabra unknown.
- Asegúrate de que la salida sea clara, concisa y cumpla con el formato especificado.

Tu tarea es mantener el formato estricto de salida y procesar consultas similares.

### CONSULTA DEL USUARIO: {query}`;


const generatePromptSupermarket = (query) => {
    return PROMPT_SUPERMARKET.replace('{query}', query)
}

/**
 *
 * @returns
 */
const generatePromptDetermine = (query) => {
    return PROMPT_DETERMINE_SUPERMARKET.replace('{query}', query)
}


export {generatePromptDetermine, generatePromptSupermarket}
