// Estado de la aplicación
let currentFilter = 'all';
let currentSearch = '';
let isLoading = false;
let currentPage = 0;
let hasMorePokemon = true;
const POKEMONS_PER_PAGE = 24;

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
        setupInfiniteScroll();
        console.log('Aplicación iniciada correctamente');
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        renderPokemonCards(backupPokemonData);
    }
}

// Cargar Pokémon iniciales
async function loadInitialPokemon() {
    showLoading(true);
    currentPage = 0;
    hasMorePokemon = true;
    
    // Limpiar contenedor
    elements.pokemonContainer.innerHTML = '';
    
    try {
        await loadMorePokemon();
    } catch (error) {
        console.error('Error cargando Pokémon iniciales:', error);
        renderPokemonCards(backupPokemonData);
    }
    
    showLoading(false);
}

// Cargar más Pokémon
async function loadMorePokemon() {
    if (isLoading || !hasMorePokemon) return;
    
    isLoading = true;
    showLoading(true);
    
    try {
        const pokemonList = await pokeAPI.getPokemonList(
            POKEMONS_PER_PAGE, 
            currentPage * POKEMONS_PER_PAGE
        );
        
        if (pokemonList && pokemonList.results && pokemonList.results.length > 0) {
            console.log(`Cargando página ${currentPage + 1}, Pokémon: ${pokemonList.results.length}`);
            
            const pokemonDetails = [];
            const loadingPromises = [];
            
            // Crear todas las promesas de carga
            for (const pokemon of pokemonList.results) {
                const promise = pokeAPI.getPokemonDetail(pokemon.name)
                    .then(detail => {
                        if (detail) {
                            pokemonDetails.push(detail);
                        }
                    })
                    .catch(error => {
                        console.warn(`Error cargando ${pokemon.name}:`, error);
                    });
                
                loadingPromises.push(promise);
            }
            
            // Esperar a que todas las promesas se resuelvan
            await Promise.all(loadingPromises);
            
            // Ordenar por ID
            pokemonDetails.sort((a, b) => a.id - b.id);
            
            // Renderizar las nuevas tarjetas
            renderPokemonCards(pokemonDetails, false);
            
            currentPage++;
            
            // Verificar si hay más Pokémon
            if (pokemonList.results.length < POKEMONS_PER_PAGE) {
                hasMorePokemon = false;
                showNoMorePokemon();
            }
        } else {
            hasMorePokemon = false;
            showNoMorePokemon();
        }
    } catch (error) {
        console.error('Error cargando más Pokémon:', error);
        
        // Si es la primera página y falla, mostrar datos de respaldo
        if (currentPage === 0) {
            renderPokemonCards(backupPokemonData);
        }
    }
    
    isLoading = false;
    showLoading(false);
}

// Mostrar mensaje de no más Pokémon
function showNoMorePokemon() {
    const noMoreElement = document.createElement('div');
    noMoreElement.className = 'no-more-pokemon';
    noMoreElement.innerHTML = `
        <i class="fas fa-flag-checkered"></i>
        <p>¡Has llegado al final! No hay más Pokémon por cargar.</p>
    `;
    elements.pokemonContainer.appendChild(noMoreElement);
}

// Configurar scroll infinito
function setupInfiniteScroll() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        // Debounce para mejorar rendimiento
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            // Cargar más cuando esté a 200px del final
            if (scrollTop + clientHeight >= scrollHeight - 200 && 
                !isLoading && 
                hasMorePokemon &&
                currentFilter === 'all' && 
                !currentSearch) {
                
                loadMorePokemon();
            }
        }, 100);
    });
}

// Mostrar/ocultar loading
function showLoading(show) {
    if (elements.loadingIndicator) {
        elements.loadingIndicator.style.display = show ? 'block' : 'none';
        
        if (show) {
            elements.loadingIndicator.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i> 
                Cargando Pokémon ${currentPage > 0 ? 'adicionales...' : '...'}
            `;
        }
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
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    
    if (searchTerm !== currentSearch) {
        currentSearch = searchTerm;
        performSearchAndFilter();
    }
}

// Manejar clic en filtro
function handleFilterClick(button) {
    const filterType = button.getAttribute('data-type');
    
    if (filterType !== currentFilter) {
        // Remover clase active de todos los botones
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        // Actualizar filtro actual
        currentFilter = filterType;
        performSearchAndFilter();
    }
}

// Realizar búsqueda y filtrado
async function performSearchAndFilter() {
    showLoading(true);
    
    // Resetear paginación para búsquedas/filtros
    currentPage = 0;
    hasMorePokemon = true;
    
    // Limpiar contenedor
    elements.pokemonContainer.innerHTML = '';
    
    try {
        if (currentFilter === 'all' && !currentSearch) {
            // Volver a carga normal con scroll infinito
            await loadMorePokemon();
        } else {
            // Para búsquedas y filtros, cargar más Pokémon y filtrar
            const allPokemon = await loadAllPokemonForSearch();
            filterAndDisplayPokemon(allPokemon);
        }
    } catch (error) {
        console.error('Error en búsqueda/filtro:', error);
        // Usar datos de respaldo para búsqueda
        const filteredBackup = backupPokemonData.filter(pokemon => 
            matchesSearchAndFilter(pokemon)
        );
        renderPokemonCards(filteredBackup);
    }
    
    showLoading(false);
}

// Cargar todos los Pokémon para búsqueda (limitado a 150 para no sobrecargar)
async function loadAllPokemonForSearch() {
    const searchLimit = 150;
    let allPokemon = [];
    let page = 0;
    let hasMore = true;
    
    while (hasMore && allPokemon.length < searchLimit) {
        const pokemonList = await pokeAPI.getPokemonList(POKEMONS_PER_PAGE, page * POKEMONS_PER_PAGE);
        
        if (pokemonList && pokemonList.results && pokemonList.results.length > 0) {
            const pokemonDetails = [];
            
            for (const pokemon of pokemonList.results) {
                if (allPokemon.length + pokemonDetails.length >= searchLimit) break;
                
                const detail = await pokeAPI.getPokemonDetail(pokemon.name);
                if (detail) {
                    pokemonDetails.push(detail);
                }
            }
            
            allPokemon = [...allPokemon, ...pokemonDetails];
            page++;
            
            if (pokemonList.results.length < POKEMONS_PER_PAGE) {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }
    
    return allPokemon;
}

// Filtrar y mostrar Pokémon
function filterAndDisplayPokemon(pokemonList) {
    const filteredPokemon = pokemonList.filter(pokemon => 
        matchesSearchAndFilter(pokemon)
    );
    
    renderPokemonCards(filteredPokemon);
    
    // Mostrar mensaje si no hay resultados
    if (filteredPokemon.length === 0) {
        elements.pokemonContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron Pokémon</h3>
                <p>Intenta con otros términos de búsqueda o filtros</p>
                <button class="retry-btn" onclick="resetSearch()">Mostrar Todos</button>
            </div>
        `;
    }
}

// Verificar si Pokémon coincide con búsqueda y filtro
function matchesSearchAndFilter(pokemon) {
    const matchesFilter = currentFilter === 'all' || 
                         pokemon.types.includes(currentFilter);
    
    const matchesSearch = !currentSearch || 
                         pokemon.name.toLowerCase().includes(currentSearch) ||
                         pokemon.id.toString().includes(currentSearch);
    
    return matchesFilter && matchesSearch;
}

// Resetear búsqueda
function resetSearch() {
    elements.searchInput.value = '';
    currentSearch = '';
    currentFilter = 'all';
    
    // Resetear botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === 'all') {
            btn.classList.add('active');
        }
    });
    
    loadInitialPokemon();
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