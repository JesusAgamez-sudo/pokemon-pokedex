// Estado de la aplicación
let currentFilter = 'all';
let currentSearch = '';
let isLoading = false;

// Elementos DOM
const elements = {
    pokemonContainer: document.getElementById('pokemon-container'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    filtersContainer: document.querySelector('.filters'),
    modal: document.getElementById('pokemon-modal'),
    closeModal: document.getElementById('close-modal'),
    pokemonDetail: document.getElementById('pokemon-detail'),
    loadingIndicator: document.getElementById('loading-indicator')
};

// Inicializar la aplicación
async function initApp() {
    console.log('Iniciando aplicación...');
    
    try {
        createFilterButtons();
        await loadInitialPokemon();
        setupEventListeners();
        console.log('Aplicación iniciada correctamente');
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        // Mostrar datos de respaldo
        renderPokemonCards(backupPokemonData);
    }
}

// Cargar Pokémon iniciales
async function loadInitialPokemon() {
    showLoading(true);
    
    try {
        // Intentar cargar de la API
        const pokemonList = await pokeAPI.getPokemonList(12, 0);
        
        if (pokemonList && pokemonList.results) {
            console.log('Pokémon cargados de API:', pokemonList.results.length);
            
            // Cargar detalles de cada Pokémon
            const pokemonDetails = [];
            for (const pokemon of pokemonList.results.slice(0, 12)) {
                const detail = await pokeAPI.getPokemonDetail(pokemon.name);
                if (detail) {
                    pokemonDetails.push(detail);
                }
            }
            
            renderPokemonCards(pokemonDetails);
        } else {
            throw new Error('No se pudieron cargar los Pokémon de la API');
        }
    } catch (error) {
        console.error('Error cargando de API, usando datos de respaldo:', error);
        // Usar datos de respaldo
        renderPokemonCards(backupPokemonData);
    }
    
    showLoading(false);
}

// Mostrar/ocultar loading
function showLoading(show) {
    if (elements.loadingIndicator) {
        elements.loadingIndicator.style.display = show ? 'block' : 'none';
    }
    isLoading = show;
}

// Configurar event listeners
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
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

    // Tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Manejar búsqueda
function handleSearch() {
    currentSearch = elements.searchInput.value.toLowerCase().trim();
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
async function filterAndRenderPokemon() {
    showLoading(true);
    
    try {
        let pokemonToShow = [];
        
        if (currentFilter === 'all' && !currentSearch) {
            // Mostrar todos los Pokémon iniciales
            const pokemonList = await pokeAPI.getPokemonList(50, 0);
            if (pokemonList && pokemonList.results) {
                for (const pokemon of pokemonList.results.slice(0, 12)) {
                    const detail = await pokeAPI.getPokemonDetail(pokemon.name);
                    if (detail) pokemonToShow.push(detail);
                }
            }
        } else {
            // Usar datos de respaldo para filtros y búsqueda (simplificado)
            pokemonToShow = backupPokemonData.filter(pokemon => {
                const matchesFilter = currentFilter === 'all' || 
                                    pokemon.types.includes(currentFilter);
                const matchesSearch = !currentSearch || 
                                    pokemon.name.toLowerCase().includes(currentSearch) ||
                                    pokemon.id.toString().includes(currentSearch);
                return matchesFilter && matchesSearch;
            });
        }
        
        renderPokemonCards(pokemonToShow);
    } catch (error) {
        console.error('Error en filtros:', error);
        // Usar datos de respaldo
        const filteredBackup = backupPokemonData.filter(pokemon => {
            const matchesFilter = currentFilter === 'all' || 
                                pokemon.types.includes(currentFilter);
            const matchesSearch = !currentSearch || 
                                pokemon.name.toLowerCase().includes(currentSearch) ||
                                pokemon.id.toString().includes(currentSearch);
            return matchesFilter && matchesSearch;
        });
        renderPokemonCards(filteredBackup);
    }
    
    showLoading(false);
}

// Función simple para cambiar tema
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-mode');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    }
}

// Cargar tema guardado
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('light-mode');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando app...');
    loadSavedTheme();
    initApp();
});