# 🎮 Pokédex Interactiva con Scroll Infinito

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg)](https://developer.mozilla.org/es/docs/Web/CSS)
[![API](https://img.shields.io/badge/API-PokeAPI-red.svg)](https://pokeapi.co/)
[![Responsive](https://img.shields.io/badge/Design-Responsive-green.svg)](https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Responsive_Design)

Una Pokédex web moderna e interactiva que permite explorar todos los Pokémon con scroll infinito, búsqueda en tiempo real y filtros avanzados.

![Pokédex Preview](https://via.placeholder.com/800x400/1a2a6c/ffffff?text=Pokédex+Interactiva+🚀)

## ✨ Características Principales

### 🚀 **Funcionalidades Avanzadas**
- **Scroll Infinito** - Carga progresiva de Pokémon mientras navegas
- **Búsqueda Inteligente** - Por nombre o número de Pokémon
- **Filtros por Tipo** - 18 tipos diferentes de Pokémon
- **Diseño Responsive** - Adaptable a todos los dispositivos
- **Modo Claro/Oscuro** - Tema personalizable
- **Cache Inteligente** - Optimización de rendimiento

### 🎯 **Experiencia de Usuario**
- **Interfaz Moderna** - Diseño limpio y atractivo
- **Carga Rápida** - Optimizada con lazy loading
- **Animaciones Suaves** - Transiciones y efectos visuales
- **Accesibilidad** - Navegación por teclado y ARIA labels
- **Manejo de Errores** - Fallbacks elegantes

### 📊 **Información Detallada**
- **Estadísticas Completas** - PS, Ataque, Defensa, Velocidad, etc.
- **Imágenes HD** - Arte oficial de Pokémon
- **Sistema de Evolución** - Cadenas evolutivas visuales
- **Detalles Completos** - Altura, peso, habilidades y más

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **HTML5** | Estructura semántica |
| **CSS3** | Estilos y animaciones |
| **JavaScript ES6+** | Lógica de aplicación |
| **PokeAPI** | Datos de Pokémon |
| **Font Awesome** | Iconografía |
| **CSS Grid & Flexbox** | Layout moderno |

## 🎨 Características Técnicas

### Arquitectura del Proyecto
pokemon-pokedex/
├── index.html # Página principal
├── css/
│ ├── style.css # Estilos principales
│ └── responsive.css # Media queries
├── js/
│ ├── app.js # Lógica principal
│ ├── ui.js # Manipulación de DOM
│ ├── pokeapi-service.js # Servicio de API
│ ├── pokemon-data.js # Datos locales
│ ├── evolution-system.js # Sistema de evoluciones
│ ├── stats-chart.js # Gráficos de stats
│ └── theme-manager.js # Gestor de temas
└── README.md

### Sistema de Módulos
- **pokeapi-service.js**: Clase para manejar todas las llamadas a la API
- **Cache Integrado**: Reduce peticiones redundantes
- **Manejo de Errores**: Fallback a datos locales
- **Scroll Infinito**: Paginación automática

## 🚀 Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para datos de PokeAPI)

### Instalación Local
1. **Clona o descarga el proyecto:**
   ```bash
   git clone https://github.com/JesusAgamez-sudo/pokemon-pokedex

2. Abre el proyecto:

    cd pokemon-pokedex

3. Ejecuta la aplicación:

    Abre index.html en tu navegador

