// Servicio para interactuar con PokeAPI
class PokeAPIService {
    constructor() {
        this.baseURL = 'https://pokeapi.co/api/v2';
        this.cache = new Map();
        this.requestQueue = [];
        this.processingQueue = false;
    }

    // Obtener lista de Pokémon con límites y offset
    async getPokemonList(limit = 24, offset = 0) {
        const cacheKey = `list-${limit}-${offset}`;
        
        // Verificar cache primero
        if (this.cache.has(cacheKey)) {
            console.log(`Cache hit for list: ${cacheKey}`);
            return this.cache.get(cacheKey);
        }

        try {
            // Validar parámetros
            const validLimit = Math.min(limit, 100); // API limita a 100 por request
            const validOffset = Math.max(0, offset);
            
            console.log(`Fetching Pokémon list: limit=${validLimit}, offset=${validOffset}`);
            
            const response = await fetch(
                `${this.baseURL}/pokemon?limit=${validLimit}&offset=${validOffset}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Enriquecer datos con información básica
            const enrichedData = {
                ...data,
                results: data.results.map(pokemon => ({
                    ...pokemon,
                    id: this.extractPokemonId(pokemon.url)
                }))
            };
            
            // Guardar en cache
            this.cache.set(cacheKey, enrichedData);
            console.log(`Cached list: ${cacheKey}, count: ${enrichedData.results.length}`);
            
            return enrichedData;
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            return null;
        }
    }

    // Obtener datos completos de un Pokémon
    async getPokemonDetail(idOrName) {
        const cacheKey = `pokemon-${idOrName}`.toLowerCase();
        
        // Verificar cache primero
        if (this.cache.has(cacheKey)) {
            console.log(`Cache hit for Pokémon: ${cacheKey}`);
            return this.cache.get(cacheKey);
        }

        try {
            console.log(`Fetching Pokémon detail: ${idOrName}`);
            
            const response = await fetch(`${this.baseURL}/pokemon/${idOrName}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Pokémon not found: ${idOrName}`);
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Formatear datos para nuestra aplicación
            const formattedData = this.formatPokemonData(data);
            
            // Guardar en cache
            this.cache.set(cacheKey, formattedData);
            console.log(`Cached Pokémon: ${cacheKey}`);
            
            return formattedData;
        } catch (error) {
            console.error(`Error fetching Pokémon detail for ${idOrName}:`, error);
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
            console.log(`Fetching evolution chain for Pokémon ID: ${id}`);
            
            // Primero obtener species
            const speciesResponse = await fetch(`${this.baseURL}/pokemon-species/${id}`);
            
            if (!speciesResponse.ok) {
                throw new Error(`HTTP error! status: ${speciesResponse.status}`);
            }
            
            const speciesData = await speciesResponse.json();
            
            // Verificar si tiene cadena de evolución
            if (!speciesData.evolution_chain || !speciesData.evolution_chain.url) {
                console.log(`No evolution chain for Pokémon ID: ${id}`);
                return [];
            }
            
            // Luego obtener chain de evolución
            const chainResponse = await fetch(speciesData.evolution_chain.url);
            
            if (!chainResponse.ok) {
                throw new Error(`HTTP error! status: ${chainResponse.status}`);
            }
            
            const chainData = await chainResponse.json();
            
            const evolutionChain = await this.parseEvolutionChain(chainData.chain);
            
            // Guardar en cache
            this.cache.set(cacheKey, evolutionChain);
            
            return evolutionChain;
        } catch (error) {
            console.error('Error fetching evolution chain:', error);
            return [];
        }
    }

    // Extraer ID de Pokémon desde la URL
    extractPokemonId(url) {
        const matches = url.match(/\/(\d+)\/$/);
        return matches ? parseInt(matches[1]) : null;
    }

    // Formatear datos del Pokémon
    formatPokemonData(apiData) {
        // Determinar la mejor imagen disponible
        const image = apiData.sprites.other?.['official-artwork']?.front_default ||
                     apiData.sprites.other?.home?.front_default ||
                     apiData.sprites.front_default ||
                     'https://via.placeholder.com/200x200/666666/FFFFFF?text=?';
        
        // Formatear estadísticas
        const stats = {};
        apiData.stats.forEach(stat => {
            const statName = this.mapStatName(stat.stat.name);
            stats[statName] = stat.base_stat;
        });

        // Asegurar que todas las estadísticas existan
        const defaultStats = {
            hp: 0,
            attack: 0,
            defense: 0,
            spAttack: 0,
            spDefense: 0,
            speed: 0
        };

        return {
            id: apiData.id,
            name: apiData.name,
            types: apiData.types.map(type => type.type.name),
            image: image,
            stats: { ...defaultStats, ...stats },
            height: (apiData.height / 10).toFixed(1) + ' m',
            weight: (apiData.weight / 10).toFixed(1) + ' kg',
            abilities: apiData.abilities.map(ability => ability.ability.name),
            moves: apiData.moves.slice(0, 10).map(move => move.move.name),
            species: apiData.species?.name || apiData.name
        };
    }

    // Mapear nombres de estadísticas
    mapStatName(apiStatName) {
        const statMap = {
            'hp': 'hp',
            'attack': 'attack',
            'defense': 'defense',
            'special-attack': 'spAttack',
            'special-defense': 'spDefense',
            'speed': 'speed'
        };
        
        return statMap[apiStatName] || apiStatName;
    }

    // Parsear cadena de evolución
    async parseEvolutionChain(chain) {
        const evolutionChain = [];
        
        const traverseChain = async (node) => {
            const pokemonId = this.extractPokemonId(node.species.url);
            
            if (!pokemonId) {
                console.warn('Invalid Pokémon ID in evolution chain:', node.species.url);
                return;
            }
            
            try {
                const pokemonData = await this.getPokemonDetail(pokemonId);
                
                if (pokemonData) {
                    evolutionChain.push({
                        id: pokemonId,
                        name: node.species.name,
                        image: pokemonData.image,
                        level: node.evolution_details?.[0]?.min_level || null,
                        trigger: node.evolution_details?.[0]?.trigger?.name || null
                    });
                }
            } catch (error) {
                console.error(`Error loading evolution Pokémon ${pokemonId}:`, error);
            }

            // Recorrer evoluciones siguientes
            if (node.evolves_to && node.evolves_to.length > 0) {
                for (const evolution of node.evolves_to) {
                    await traverseChain(evolution);
                }
            }
        };

        await traverseChain(chain);
        
        // Ordenar por ID para mantener consistencia
        evolutionChain.sort((a, b) => a.id - b.id);
        
        return evolutionChain;
    }

    // Obtener descripción del Pokémon
    async getPokemonDescription(pokemonId) {
        const cacheKey = `description-${pokemonId}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseURL}/pokemon-species/${pokemonId}`);
            
            if (!response.ok) {
                return null;
            }
            
            const speciesData = await response.json();
            
            // Buscar descripción en español
            const spanishEntry = speciesData.flavor_text_entries.find(entry => 
                entry.language.name === 'es'
            );
            
            // Si no hay en español, usar inglés
            const description = spanishEntry?.flavor_text || 
                               speciesData.flavor_text_entries[0]?.flavor_text || 
                               'Descripción no disponible.';
            
            // Limpiar texto (remover caracteres especiales)
            const cleanDescription = description.replace(/\n/g, ' ').replace(/\f/g, ' ');
            
            this.cache.set(cacheKey, cleanDescription);
            return cleanDescription;
        } catch (error) {
            console.error('Error fetching Pokémon description:', error);
            return null;
        }
    }

    // Limpiar cache (útil para desarrollo)
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    }

    // Obtener estadísticas de cache (útil para debugging)
    getCacheStats() {
        return {
            totalEntries: this.cache.size,
            listEntries: Array.from(this.cache.keys()).filter(key => key.startsWith('list-')).length,
            pokemonEntries: Array.from(this.cache.keys()).filter(key => key.startsWith('pokemon-')).length,
            evolutionEntries: Array.from(this.cache.keys()).filter(key => key.startsWith('evolution-')).length
        };
    }
}

// Instancia global del servicio
const pokeAPI = new PokeAPIService();

// Función global para debugging (solo en desarrollo)
if (typeof window !== 'undefined') {
    window.pokeAPI = pokeAPI;
    window.getCacheStats = () => pokeAPI.getCacheStats();
    window.clearPokeCache = () => pokeAPI.clearCache();
}