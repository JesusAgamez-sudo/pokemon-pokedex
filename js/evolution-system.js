// Sistema de visualización de evoluciones
class EvolutionSystem {
    static async renderEvolutionChain(pokemonId, container) {
        try {
            const evolutionChain = await pokeAPI.getEvolutionChain(pokemonId);
            
            if (evolutionChain.length <= 1) {
                container.innerHTML = `
                    <div class="evolution-chain">
                        <div class="no-evolution">
                            <i class="fas fa-ban"></i>
                            <p>Este Pokémon no evoluciona</p>
                        </div>
                    </div>
                `;
                return;
            }

            let evolutionHTML = '<div class="evolution-chain">';
            
            evolutionChain.forEach((stage, index) => {
                evolutionHTML += `
                    <div class="evolution-stage" data-pokemon-id="${stage.id}">
                        <div class="evolution-image">
                            <img src="${stage.image}" alt="${stage.name}" loading="lazy">
                        </div>
                        <div class="evolution-name">${stage.name}</div>
                        <div class="evolution-id">#${stage.id.toString().padStart(3, '0')}</div>
                    </div>
                `;
                
                // Agregar flecha entre evoluciones
                if (index < evolutionChain.length - 1) {
                    evolutionHTML += `
                        <div class="evolution-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    `;
                }
            });
            
            evolutionHTML += '</div>';
            container.innerHTML = evolutionHTML;

            // Agregar event listeners a las etapas de evolución
            this.addEvolutionEventListeners();
        } catch (error) {
            console.error('Error rendering evolution chain:', error);
            container.innerHTML = '<p>Error al cargar la cadena de evolución</p>';
        }
    }

    static addEvolutionEventListeners() {
        document.querySelectorAll('.evolution-stage').forEach(stage => {
            stage.addEventListener('click', async () => {
                const pokemonId = stage.getAttribute('data-pokemon-id');
                const pokemonData = await pokeAPI.getPokemonDetail(pokemonId);
                
                if (pokemonData) {
                    // Cerrar modal actual y abrir nuevo
                    const modal = document.getElementById('pokemon-modal');
                    modal.style.display = 'none';
                    
                    // Mostrar detalles del nuevo Pokémon
                    setTimeout(() => {
                        showPokemonDetail(pokemonData);
                    }, 300);
                }
            });
        });
    }
}
