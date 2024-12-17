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
    "Condimentos" : ["Sal, Condimentos y Aderezos", "Condimentos, Vinagres y Comida Instantánea", "Salsas, Cremas y Condimentos"],
    "Chocolateria": [
        "Chocolatería",
        "Chocolatería"
    ],
    "Snacks y Golosinas": [
        "Galletas, Snacks y Golosinas",
        "Galletas y Golosinas",
        "Snacks y Piqueos"
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
