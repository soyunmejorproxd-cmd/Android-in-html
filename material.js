document.addEventListener('DOMContentLoaded', () => {
    initRippleEffect();
    initSwipeGestures();
});

// 1. Efecto Ripple (Onda expansiva al tocar)
function initRippleEffect() {
    document.body.addEventListener('pointerdown', function(e) {
        // Busca si el elemento tocado es un ícono o la barra de búsqueda
        const target = e.target.closest('.app-icon') || e.target.closest('.search-widget');
        if (!target) return;

        // Crea el elemento de la onda
        const circle = document.createElement('span');
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;
        const rect = target.getBoundingClientRect();

        // Calcula la posición exacta del toque
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        // Elimina ondas anteriores para no saturar el DOM
        const existingRipple = target.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        target.appendChild(circle);
    });
}

// 2. Gestos de Deslizamiento (Swipe Up / Swipe Down)
function initSwipeGestures() {
    let startY = 0;
    let currentY = 0;
    const drawer = document.getElementById('app-drawer');
    const handle = document.querySelector('.drawer-handle-container');
    const navBar = document.querySelector('.nav-bar');

    // Deslizar hacia arriba desde la barra de navegación (Gestos) para abrir
    if (navBar) {
        navBar.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
        }, { passive: true });

        navBar.addEventListener('touchmove', e => {
            currentY = e.touches[0].clientY;
            // Si el dedo sube más de 40px, abre el cajón
            if (startY - currentY > 40) { 
                if (!drawer.classList.contains('open')) toggleDrawer();
            }
        }, { passive: true });
    }

    // Deslizar hacia abajo desde la parte superior del cajón para cerrarlo
    if (handle) {
        handle.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
        }, { passive: true });

        handle.addEventListener('touchmove', e => {
            currentY = e.touches[0].clientY;
            // Si el dedo baja más de 40px, cierra el cajón
            if (currentY - startY > 40) { 
                if (drawer.classList.contains('open')) toggleDrawer();
            }
        }, { passive: true });
    }
}
