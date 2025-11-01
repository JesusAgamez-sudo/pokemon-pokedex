// Crear botones de filtro
function createFilterButtons() {
    console.log('Creando botones de filtro...');
    
    // Limpiar contenedor primero
    elements.filtersContainer.innerHTML = '';
    
    pokemonTypes.forEach(type => {
        const button = document.createElement('button');
        button.className = `filter-btn ${type === 'all' ? 'active' : ''}`;
        button.setAttribute('data-type', type);
        button.textContent = getTypeNameInSpanish(type);
        elements.filtersContainer.appendChild(button);
    });
}

// Obtener nombre del tipo en español
function getTypeNameInSpanish(type) {
    const typeNames = {
        'all': 'Todos',
        'normal': 'Normal',
        'fire': 'Fuego',
        'water': 'Agua',
        'grass': 'Planta',
        'electric': 'Eléctrico',
        'ice': 'Hielo',
        'fighting': 'Lucha',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'flying': 'Volador',
        'psychic': 'Psíquico',
        'bug': 'Bicho',
        'rock': 'Roca',
        'ghost': 'Fantasma',
        'dark': 'Siniestro',
        'dragon': 'Dragón',
        'steel': 'Acero',
        'fairy': 'Hada'
    };
    
    return typeNames[type] || type;
}

// Renderizar tarjetas de Pokémon
function renderPokemonCards(pokemonList, clearContainer = true) {
    console.log('Renderizando', pokemonList.length, 'pokémon');
    
    if (clearContainer) {
        elements.pokemonContainer.innerHTML = '';
    }
    
    if (pokemonList.length === 0) {
        elements.pokemonContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron Pokémon</h3>
                <p>Intenta con otros términos de búsqueda o filtros</p>
            </div>
        `;
        return;
    }
    
    pokemonList.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        elements.pokemonContainer.appendChild(card);
    });
}

// Crear tarjeta individual de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.setAttribute('data-id', pokemon.id);
    
    const typesHTML = pokemon.types.map(type => 
        `<span class="type" style="background: var(--${type})">${getTypeNameInSpanish(type)}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
        <div class="pokemon-image">
            <img src="${pokemon.image}" alt="${pokemon.name}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/120x120/666666/FFFFFF?text=?'">
        </div>
        <div class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</div>
        <div class="pokemon-types">
            ${typesHTML}
        </div>
        <div class="pokemon-stats">
            <span><i class="fas fa-heart"></i> ${pokemon.stats.hp}</span>
            <span><i class="fas fa-bolt"></i> ${pokemon.stats.attack}</span>
        </div>
    `;
    
    card.addEventListener('click', () => showPokemonDetail(pokemon));
    return card;
}

// Capitalizar primera letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Mostrar detalles del Pokémon (versión simplificada)
async function showPokemonDetail(pokemon) {
    console.log('Mostrando detalles de:', pokemon.name);
    
    // Mostrar loader
    elements.pokemonDetail.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando información de ${capitalizeFirstLetter(pokemon.name)}...</p>
        </div>
    `;
    elements.modal.style.display = 'block';

    try {
        // Usar datos existentes o cargar de la API
        let pokemonData = pokemon;
        
        // Si el Pokémon no tiene descripción, intentar cargar de la API
        if (!pokemon.description) {
            const apiData = await pokeAPI.getPokemonDetail(pokemon.id);
            if (apiData) {
                pokemonData = apiData;
                // Agregar descripción por defecto si no viene de la API
                if (!pokemonData.description) {
                    pokemonData.description = `¡Este es ${capitalizeFirstLetter(pokemonData.name)}, un Pokémon ${pokemonData.types.join('/')}!`;
                }
            }
        }
        
        renderPokemonDetail(pokemonData);
    } catch (error) {
        console.error('Error cargando detalles:', error);
        renderPokemonDetail(pokemon); // Usar datos básicos
    }
}

// Renderizar detalles del Pokémon
function renderPokemonDetail(pokemon) {
    const typesHTML = pokemon.types.map(type => 
        `<span class="type" style="background: var(--${type})">${getTypeNameInSpanish(type)}</span>`
    ).join('');
    
    const abilitiesHTML = pokemon.abilities ? pokemon.abilities.map(ability => 
        `<span class="ability">${capitalizeFirstLetter(ability.replace('-', ' '))}</span>`
    ).join('') : '<span class="ability">No disponible</span>';

    elements.pokemonDetail.innerHTML = `
        <div class="detail-header">
            <div class="detail-image">
                <img src="${pokemon.image}" alt="${pokemon.name}" 
                     onerror="this.src='https://via.placeholder.com/200x200/666666/FFFFFF?text=?'">
            </div>
            <div class="detail-info">
                <div class="detail-name">${capitalizeFirstLetter(pokemon.name)}</div>
                <div class="detail-id">#${pokemon.id.toString().padStart(3, '0')}</div>
                <div class="detail-types">
                    ${typesHTML}
                </div>
                <p class="pokemon-description">${pokemon.description || `Información sobre ${pokemon.name}`}</p>
            </div>
        </div>
        
        <div class="detail-body">
            <div class="detail-section">
                <div class="section-title">Estadísticas</div>
                <div class="stats-simple">
                    <div class="stat-item">
                        <span>PS:</span>
                        <span>${pokemon.stats.hp}</span>
                    </div>
                    <div class="stat-item">
                        <span>Ataque:</span>
                        <span>${pokemon.stats.attack}</span>
                    </div>
                    <div class="stat-item">
                        <span>Defensa:</span>
                        <span>${pokemon.stats.defense}</span>
                    </div>
                    <div class="stat-item">
                        <span>Velocidad:</span>
                        <span>${pokemon.stats.speed}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <div class="section-title">Información</div>
                <div class="info-simple">
                    <div class="info-item">
                        <strong>Altura:</strong>
                        <span>${pokemon.height}</span>
                    </div>
                    <div class="info-item">
                        <strong>Peso:</strong>
                        <span>${pokemon.weight}</span>
                    </div>
                    <div class="info-item">
                        <strong>Habilidades:</strong>
                        <div class="abilities">${abilitiesHTML}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
