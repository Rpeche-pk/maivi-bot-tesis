const categories = {
    //TOTTUS  -  PLAZA VEA - METRO
    "Aceite": ["Aceites", "Aceite", "Aceites"],
    "Arroz": ["Arroz", "Arroz", "Arroz"],
    "Pastas y Salsas": [
        "Pastas y Salsas",
        "Fideos, Pastas y Salsas",
        "Fideos, Pastas y Salsas"
    ],
    "Conservas": ["Conservas", "Alimentos en Conserva", "Conservas"],
    "Menestras": ["Menestras", "Menestras", "Menestras"],
    "Condimentos" : ["Sal, Condimentos y Aderezos", "Salsas, Cremas y Condimentos","Condimentos, Vinagres y Comida Instantánea"],
    "Chocolateria": [
        "Chocolates",
        "Chocolatería",
        "Chocolatería"
    ],
    "Snacks y Golosinas": [
        "Cocktail y Snack",
        "Snacks y Piqueos",
        "Galletas, Snacks y Golosinas"
    ]
};

export const getValues = (category) => {
    return Array.from(categories[category]);
}

export const generateCategoryButtons= () => {
    return Object.keys(categories).map((category) => ({
        body: `*${category}*`
    }));
}
