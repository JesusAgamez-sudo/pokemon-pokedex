// Elementos DOM
const elements = {
    pokemonContainer: document.getElementById('pokemon-container'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    filtersContainer: document.querySelector('.filters'),
    modal: document.getElementById('pokemon-modal'),
    closeModal: document.getElementById('close-modal'),
    pokemonDetail: document.getElementById('pokemon-detail')
};

// Crear botones de filtro
function createFilterButtons() {
    pokemonTypes.forEach(type => {
        const button = document.createElement('button');
        button.className = `filter-btn ${type === 'all' ? 'active' : ''}`;
        button.setAttribute('data-type', type);
        button.textContent = type === 'all' ? 'Todos' : 
                            type === 'fire' ? 'Fuego' :
                            type === 'water' ? 'Agua' :
                            type === 'grass' ? 'Planta' :
                            type === 'electric' ? 'Eléctrico' :
                            type === 'psychic' ? 'Psíquico' :
                            type === 'ice' ? 'Hielo' :
                            type === 'dragon' ? 'Dragón' :
                            type === 'ghost' ? 'Fantasma' :
                            type === 'fighting' ? 'Lucha' :
                            type === 'normal' ? 'Normal' :
                            type === 'flying' ? 'Volador' : type;
        
        elements.filtersContainer.appendChild(button);
    });
}

// Renderizar tarjetas de Pokémon
function renderPokemonCards(pokemonList) {
    elements.pokemonContainer.innerHTML = '';
    
    pokemonList.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.setAttribute('data-id', pokemon.id);
        
        const typesHTML = pokemon.types.map(type => 
            `<span class="type" style="background: var(--${type})">${type}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
            <div class="pokemon-image">
                <img src="${pokemon.image}" alt="${pokemon.name}" loading="lazy">
            </div>
            <div class="pokemon-name">${pokemon.name}</div>
            <div class="pokemon-types">
                ${typesHTML}
            </div>
            <div class="pokemon-stats">
                <span><i class="fas fa-heart"></i> ${pokemon.stats.hp}</span>
                <span><i class="fas fa-bolt"></i> ${pokemon.stats.attack}</span>
            </div>
        `;
        
        card.addEventListener('click', () => showPokemonDetail(pokemon));
        elements.pokemonContainer.appendChild(card);
    });
}

// Mostrar detalles del Pokémon
function showPokemonDetail(pokemon) {
    const typesHTML = pokemon.types.map(type => 
        `<span class="type" style="background: var(--${type})">${type}</span>`
    ).join('');
    
    const abilitiesHTML = pokemon.abilities.map(ability => 
        `<span class="type" style="background: var(--normal)">${ability}</span>`
    ).join('');
    
    elements.pokemonDetail.innerHTML = `
        <div class="detail-header">
            <div class="detail-image">
                <img src="${pokemon.image}" alt="${pokemon.name}">
            </div>
            <div class="detail-info">
                <div class="detail-name">${pokemon.name}</div>
                <div class="detail-id">#${pokemon.id.toString().padStart(3, '0')}</div>
                <div class="detail-types">
                    ${typesHTML}
                </div>
                <p>${pokemon.description}</p>
            </div>
        </div>
        <div class="detail-body">
            <div class="detail-section">
                <div class="section-title">Estadísticas</div>
                <p><strong>PS:</strong> ${pokemon.stats.hp}</p>
                <p><strong>Ataque:</strong> ${pokemon.stats.attack}</p>
                <p><strong>Defensa:</strong> ${pokemon.stats.defense}</p>
            </div>
            <div class="detail-section">
                <div class="section-title">Información</div>
                <p><strong>Altura:</strong> ${pokemon.height}</p>
                <p><strong>Peso:</strong> ${pokemon.weight}</p>
                <p><strong>Habilidades:</strong></p>
                <div style="margin-top: 10px;">${abilitiesHTML}</div>
            </div>
        </div>
    `;
    
    elements.modal.style.display = 'block';
}
