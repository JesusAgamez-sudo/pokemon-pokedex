// Estado de la aplicación
let currentFilter = 'all';
let currentSearch = '';

// Inicializar la aplicación
function initApp() {
    createFilterButtons();
    renderPokemonCards(pokemonData);
    setupEventListeners();
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Filtros
    elements.filtersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            handleFilterClick(e.target);
        }
    });

    // Modal
    elements.closeModal.addEventListener('click', () => {
        elements.modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            elements.modal.style.display = 'none';
        }
    });
}

// Manejar búsqueda
function handleSearch() {
    currentSearch = elements.searchInput.value.toLowerCase();
    filterAndRenderPokemon();
}

// Manejar clic en filtro
function handleFilterClick(button) {
    // Remover clase active de todos los botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Agregar clase active al botón clickeado
    button.classList.add('active');
    
    // Actualizar filtro actual
    currentFilter = button.getAttribute('data-type');
    filterAndRenderPokemon();
}

// Filtrar y renderizar Pokémon
function filterAndRenderPokemon() {
    let filteredPokemon = pokemonData;

    // Aplicar filtro de tipo
    if (currentFilter !== 'all') {
        filteredPokemon = filteredPokemon.filter(pokemon => 
            pokemon.types.includes(currentFilter)
        );
    }

    // Aplicar búsqueda
    if (currentSearch) {
        filteredPokemon = filteredPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(currentSearch) || 
            pokemon.id.toString().includes(currentSearch)
        );
    }

    renderPokemonCards(filteredPokemon);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
