// Sistema de gráficos de estadísticas
class StatsChart {
    static renderStatsChart(stats, container) {
        const statsNames = {
            hp: 'PS',
            attack: 'Ataque',
            defense: 'Defensa',
            spAttack: 'At. Esp.',
            spDefense: 'Def. Esp.',
            speed: 'Velocidad'
        };

        const statsColors = {
            hp: '#FF5959',
            attack: '#F5AC78',
            defense: '#FAE078',
            spAttack: '#9DB7F5',
            spDefense: '#A7DB8D',
            speed: '#FA92B2'
        };

        let chartHTML = '<div class="stats-chart">';
        
        Object.entries(stats).forEach(([stat, value]) => {
            const percentage = (value / 255) * 100;
            const statName = statsNames[stat] || stat;
            
            chartHTML += `
                <div class="stat-row">
                    <div class="stat-info">
                        <span class="stat-name">${statName}</span>
                        <span class="stat-value">${value}</span>
                    </div>
                    <div class="stat-bar-container">
                        <div class="stat-bar" style="width: ${percentage}%; background: ${statsColors[stat]}">
                            <div class="stat-bar-fill"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Estadística total
        const total = Object.values(stats).reduce((sum, value) => sum + value, 0);
        chartHTML += `
            <div class="stat-total">
                <strong>Total: ${total}</strong>
            </div>
        `;

        chartHTML += '</div>';
        container.innerHTML = chartHTML;
    }

    static renderRadarChart(stats, container) {
        // Implementación simplificada de gráfico radar
        const statsValues = Object.values(stats);
        const maxStat = Math.max(...statsValues);
        
        const chartHTML = `
            <div class="radar-chart">
                <div class="radar-grid">
                    ${Array.from({length: 5}, (_, i) => 
                        `<div class="radar-circle" style="--circle-size: ${(i + 1) * 20}%"></div>`
                    ).join('')}
                </div>
                <div class="radar-stats">
                    ${Object.entries(stats).map(([stat, value], index) => {
                        const angle = (index * 60) * (Math.PI / 180);
                        const percentage = (value / maxStat) * 100;
                        const x = 50 + Math.cos(angle) * percentage / 2;
                        const y = 50 + Math.sin(angle) * percentage / 2;
                        
                        return `
                            <div class="radar-point" style="--x: ${x}%; --y: ${y}%">
                                <div class="radar-label">${statsNames[stat] || stat}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <svg class="radar-polygon" viewBox="0 0 100 100">
                    <polygon points="${Object.entries(stats).map(([_, value], index) => {
                        const angle = (index * 60) * (Math.PI / 180);
                        const percentage = (value / maxStat) * 100;
                        const x = 50 + Math.cos(angle) * percentage / 2;
                        const y = 50 + Math.sin(angle) * percentage / 2;
                        return `${x},${y}`;
                    }).join(' ')}" />
                </svg>
            </div>
        `;
        
        container.innerHTML = chartHTML;
    }
}
