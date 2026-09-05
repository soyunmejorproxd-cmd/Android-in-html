document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DEL DOM ---
    const form = document.getElementById('address-bar-form');
    const urlInput = document.getElementById('url-input');
    const iframe = document.getElementById('web-viewport');
    const guestPage = document.getElementById('guest-welcome');
    const tabTitle = document.getElementById('tab-title-text');
    const tabIconContainer = document.querySelector('.tab-icon');
    
    const btnReload = document.getElementById('btn-reload');
    const btnNewTab = document.getElementById('new-tab-btn');
    const menuNewTab = document.getElementById('menu-new-tab');

    // Textos de la barra de búsqueda
    const originalPlaceholder = "Pregúntale a Google o escribe una URL";
    const aiPlaceholder = "Presionar Tab y luego Intro para preguntar al Modo IA";

    // --- LÓGICA DE LA BARRA DE DIRECCIONES (Foco y Blur) ---
    urlInput.addEventListener('focus', () => {
        form.classList.add('focused');
        urlInput.placeholder = aiPlaceholder;
    });

    urlInput.addEventListener('blur', () => {
        form.classList.remove('focused');
        urlInput.placeholder = originalPlaceholder;
    });

    // --- LÓGICA DE NAVEGACIÓN (Al presionar Enter) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        let query = urlInput.value.trim();
        if (!query) return;

        let finalUrl = '';

        // Detección simple: ¿Es una URL o una búsqueda?
        // Si tiene un punto y no tiene espacios, asumimos que es una web
        if (query.includes('.') && !query.includes(' ')) {
            if (!query.startsWith('http://') && !query.startsWith('https://')) {
                finalUrl = 'https://' + query;
            } else {
                finalUrl = query;
            }
        } else {
            // Si es una búsqueda, usamos Bing o DuckDuckGo 
            // (Nota: Google bloquea iframes, por lo que fallaría si usamos google.com/search)
            finalUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
        }

        // Navegar:
        cargarPagina(finalUrl);
    });

    // Función para cargar la página en el iframe y cambiar la UI
    function cargarPagina(url) {
        // 1. Mostrar iframe, ocultar página de invitado
        guestPage.style.display = 'none';
        iframe.style.display = 'block';

        // 2. Cargar la URL
        iframe.src = url;

        // 3. Actualizar la barra de direcciones con la URL real
        urlInput.value = url;
        urlInput.blur(); // Quitar el foco de la barra

        // 4. Extraer el dominio para el título y el Favicon (ícono)
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            
            // Cambiar título de pestaña
            tabTitle.textContent = domain;

            // Obtener el Favicon de la web usando el servicio gratuito de Google
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
            tabIconContainer.innerHTML = `<img src="${faviconUrl}" width="16" height="16" style="border-radius: 50%;">`;
        } catch (error) {
            tabTitle.textContent = "Navegando...";
        }
    }

    // --- BOTONES DE HERRAMIENTAS ---

    // Recargar página
    btnReload.addEventListener('click', () => {
        if (iframe.src) {
            iframe.src = iframe.src; 
        }
    });

    // Nueva Pestaña (Reiniciar vista a página de invitado)
    function resetToGuestPage() {
        iframe.style.display = 'none';
        iframe.src = '';
        guestPage.style.display = 'block';
        urlInput.value = '';
        tabTitle.textContent = 'Nueva pestaña';
        
        // Restaurar el SVG original de Chrome
        tabIconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="chrome-logo" id="tab-favicon">
                <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
            </svg>
        `;
    }

    btnNewTab.addEventListener('click', resetToGuestPage);
    menuNewTab.addEventListener('click', () => {
        resetToGuestPage();
        closeAllMenus();
    });


    // --- LÓGICA DE LOS MENÚS DESPLEGABLES ---
    const guestBtn = document.getElementById('guest-toggle');
    const menuBtn = document.getElementById('menu-toggle');
    const guestMenu = document.getElementById('guest-menu');
    const optionsMenu = document.getElementById('options-menu');

    function closeAllMenus() {
        guestMenu.classList.remove('show');
        optionsMenu.classList.remove('show');
    }

    guestBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShowing = guestMenu.classList.contains('show');
        closeAllMenus();
        if (!isShowing) guestMenu.classList.add('show');
    });

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShowing = optionsMenu.classList.contains('show');
        closeAllMenus();
        if (!isShowing) optionsMenu.classList.add('show');
    });

    document.addEventListener('click', (e) => {
        if (!guestMenu.contains(e.target) && !optionsMenu.contains(e.target)) {
            closeAllMenus();
        }
    });

    guestMenu.addEventListener('click', (e) => e.stopPropagation());
    optionsMenu.addEventListener('click', (e) => e.stopPropagation());
});