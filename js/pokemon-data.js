// Datos de Pokémon - Versión simplificada para empezar
const pokemonData = [
    {
        id: 1,
        name: "Bulbasaur",
        types: ["grass", "poison"],
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        stats: {
            hp: 45,
            attack: 49,
            defense: 49,
            spAttack: 65,
            spDefense: 65,
            speed: 45
        },
        height: "0.7 m",
        weight: "6.9 kg",
        description: "Bulbasaur puede verse tomando el sol. La semilla en su lomo crece al absorber nutrientes y luz solar.",
        abilities: ["Espesura", "Clorofila"],
        evolution: [1, 2, 3]
    },
    {
        id: 4,
        name: "Charmander",
        types: ["fire"],
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
        stats: {
            hp: 39,
            attack: 52,
            defense: 43,
            spAttack: 60,
            spDefense: 50,
            speed: 65
        },
        height: "0.6 m",
        weight: "8.5 kg",
        description: "La llama en la punta de su cola arde según sus emociones. Llamea vivamente cuando está disfrutando de una batalla.",
        abilities: ["Mar Llamas", "Poder Solar"],
        evolution: [4, 5, 6]
    },
    {
        id: 7,
        name: "Squirtle",
        types: ["water"],
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
        stats: {
            hp: 44,
            attack: 48,
            defense: 65,
            spAttack: 50,
            spDefense: 64,
            speed: 43
        },
        height: "0.5 m",
        weight: "9.0 kg",
        description: "Cuando retrae su largo cuello en el caparazón, dispara agua a una presión increíble.",
        abilities: ["Torrente", "Cura Lluvia"],
        evolution: [7, 8, 9]
    }
];

// Tipos de Pokémon para los filtros
// Tipos de Pokémon para los filtros
const pokemonTypes = [
    "all", "normal", "fire", "water", "grass", "electric", 
    "ice", "fighting", "poison", "ground", "flying", "psychic", 
    "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"
];

// Datos de respaldo en caso de que la API falle
const backupPokemonData = [
    {
        id: 1,
        name: "bulbasaur",
        types: ["grass", "poison"],
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        stats: {
            hp: 45,
            attack: 49,
            defense: 49,
            spAttack: 65,
            spDefense: 65,
            speed: 45
        },
        height: "0.7 m",
        weight: "6.9 kg",
        description: "Bulbasaur puede verse tomando el sol. La semilla en su lomo crece al absorber nutrientes y luz solar.",
        abilities: ["overgrow", "chlorophyll"],
        evolution: [1, 2, 3]
    }
    // ... mantener los otros Pokémon de respaldo
];