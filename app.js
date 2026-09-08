// Referencias globales
let allApps = [];
let drawer, homeScreen, searchInput;

// Actualización de reloj y fecha
function updateTime() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date-widget');
    
    if (clockEl) {
        clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (dateEl) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        let dateStr = now.toLocaleDateString('es-ES', options);
        dateEl.innerText = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
}

// Lógica del Cajón de Aplicaciones
function toggleDrawer() {
    if (!drawer || !homeScreen) return;
    
    drawer.classList.toggle('open');
    homeScreen.classList.toggle('dimmed');
    
    if(drawer.classList.contains('open')) {
        if (searchInput) searchInput.focus();
    } else {
        if (searchInput) {
            searchInput.value = '';
            filterApps();
        }
    }
}

// Renderizado dinámico de apps
function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    apps.forEach(game => {
        const appItem = document.createElement('div');
        appItem.className = 'app-item';
        
        // Redirige al puente (game.html) que carga el iframe
        appItem.onclick = () => window.location.href = `game.html?id=${game.id}`;
        
        appItem.innerHTML = `
            <div class="app-icon">
                <span class="material-symbols-outlined">${game.icon}</span>
            </div>
            <span class="app-name">${game.name}</span>
        `;
        container.appendChild(appItem);
    });
}

// Búsqueda en el cajón
function filterApps() {
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    const filtered = allApps.filter(app => app.name.toLowerCase().includes(query));
    renderApps(filtered, 'app-grid');
}

// Petición de datos a games.json
async function loadApps() {
    try {
        const res = await fetch('games.json');
        if (!res.ok) throw new Error('No se pudo cargar games.json');
        allApps = await res.json();
    } catch (e) {
        console.warn('Usando datos de respaldo debido a un error:', e);
        allApps = [
            { "id": "chrome", "name": "Chrome", "url": "./Chrome/index.html", "icon": "language" },
            { "id": "supreme-duelist-stickman", "name": "Supreme Duelist", "url": "./Supreme%20Duelist%20Stickman/v/assets/index.html", "icon": "sports_kabaddi" },
            { "id": "worlds-of-wonders", "name": "Worlds of wonders", "url": "./Worlds%20of%20wonders/v/assets/index.html", "icon": "public" },
            { "id": "block-blast", "name": "Block Blast", "url": "https://pinkdev.d13qic2f6zga3.amplifyapp.com/games/clblockblast.html", "icon": "grid_view" }
        ];
    }

    // Renderizar todas las apps en el cajón principal
    renderApps(allApps, 'app-grid');
    
    // Renderizar las primeras 4 apps en el dock (favoritos)
    renderApps(allApps.slice(0, 4), 'dock-apps');
}

// Inicialización cuando el documento está listo
document.addEventListener('DOMContentLoaded', () => {
    // Capturar elementos del DOM
    drawer = document.getElementById('app-drawer');
    homeScreen = document.getElementById('home-screen');
    searchInput = document.getElementById('app-search');
    
    // Iniciar reloj y cargar datos
    updateTime();
    setInterval(updateTime, 1000);
    loadApps();
});
