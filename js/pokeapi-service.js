// Servicio para interactuar con PokeAPI
class PokeAPIService {
    constructor() {
        this.baseURL = 'https://pokeapi.co/api/v2';
        this.cache = new Map();
    }

    // Obtener lista de Pokémon
    async getPokemonList(limit = 50, offset = 0) {
        const cacheKey = `list-${limit}-${offset}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseURL}/pokemon?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            return null;
        }
    }

    // Obtener datos completos de un Pokémon
    async getPokemonDetail(idOrName) {
        const cacheKey = `pokemon-${idOrName}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseURL}/pokemon/${idOrName}`);
            const data = await response.json();
            
            // Formatear datos para nuestra aplicación
            const formattedData = this.formatPokemonData(data);
            this.cache.set(cacheKey, formattedData);
            return formattedData;
        } catch (error) {
            console.error('Error fetching Pokémon detail:', error);
            return null;
        }
    }

    // Obtener cadena de evolución
    async getEvolutionChain(id) {
        const cacheKey = `evolution-${id}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // Primero obtener species
            const speciesResponse = await fetch(`${this.baseURL}/pokemon-species/${id}`);
            const speciesData = await speciesResponse.json();
            
            // Luego obtener chain de evolución
            const chainResponse = await fetch(speciesData.evolution_chain.url);
            const chainData = await chainResponse.json();
            
            const evolutionChain = await this.parseEvolutionChain(chainData.chain);
            this.cache.set(cacheKey, evolutionChain);
            return evolutionChain;
        } catch (error) {
            console.error('Error fetching evolution chain:', error);
            return [];
        }
    }

    // Formatear datos del Pokémon
    formatPokemonData(apiData) {
        return {
            id: apiData.id,
            name: apiData.name,
            types: apiData.types.map(type => type.type.name),
            image: apiData.sprites.other['official-artwork'].front_default || apiData.sprites.front_default,
            stats: {
                hp: apiData.stats[0].base_stat,
                attack: apiData.stats[1].base_stat,
                defense: apiData.stats[2].base_stat,
                spAttack: apiData.stats[3].base_stat,
                spDefense: apiData.stats[4].base_stat,
                speed: apiData.stats[5].base_stat
            },
            height: (apiData.height / 10).toFixed(1) + ' m',
            weight: (apiData.weight / 10).toFixed(1) + ' kg',
            abilities: apiData.abilities.map(ability => ability.ability.name),
            moves: apiData.moves.slice(0, 5).map(move => move.move.name)
        };
    }

    // Parsear cadena de evolución
    async parseEvolutionChain(chain) {
        const evolutionChain = [];
        
        const traverseChain = async (node) => {
            const pokemonId = node.species.url.split('/').slice(-2, -1)[0];
            const pokemonData = await this.getPokemonDetail(pokemonId);
            
            evolutionChain.push({
                id: parseInt(pokemonId),
                name: node.species.name,
                image: pokemonData.image
            });

            if (node.evolves_to.length > 0) {
                for (const evolution of node.evolves_to) {
                    await traverseChain(evolution);
                }
            }
        };

        await traverseChain(chain);
        return evolutionChain;
    }
}

// Instancia global del servicio
const pokeAPI = new PokeAPIService();