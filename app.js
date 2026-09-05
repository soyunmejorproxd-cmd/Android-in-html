const state = {
  games: [],
  filter: 'Todo',
  query: '',
  ascending: true
};

const grid = document.querySelector('#grid');
const empty = document.querySelector('#empty');
const search = document.querySelector('#search');
const root = document.documentElement;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
}

function icon(name) {
  return `<md-icon>${escapeHTML(name)}</md-icon>`;
}

function render() {
  let list = state.games.filter(game => {
    const categoryOK = state.filter === 'Todo' || game.category === state.filter;
    const searchOK = game.name.toLowerCase().includes(state.query.toLowerCase());
    return categoryOK && searchOK;
  });

  list.sort((a, b) => state.ascending
    ? a.name.localeCompare(b.name, 'es', {sensitivity: 'base'})
    : b.name.localeCompare(a.name, 'es', {sensitivity: 'base'}));

  grid.innerHTML = list.map(game => `
    <article class="experience-card">
      <div class="experience-card__top">
        <div class="experience-card__icon" aria-hidden="true">${icon(game.icon)}</div>
        <span class="category-pill">${escapeHTML(game.category)}</span>
      </div>
      <div class="experience-card__body">
        <h3>${escapeHTML(game.name)}</h3>
        <p>${escapeHTML(game.description)}</p>
      </div>
      <div class="experience-card__actions">
        <md-filled-button data-game="${escapeHTML(game.id)}">
          <md-icon slot="icon">play_arrow</md-icon>
          Abrir
        </md-filled-button>
      </div>
    </article>
  `).join('');

  grid.hidden = list.length === 0;
  empty.hidden = list.length !== 0;
  document.querySelector('#count').textContent = state.games.length;
  document.querySelector('#resultText').textContent = `${list.length} ${list.length === 1 ? 'disponible' : 'disponibles'}`;
  document.querySelector('#libraryTitle').textContent = state.filter === 'Todo' ? 'Todas las experiencias' : state.filter;

  document.querySelectorAll('[data-game]').forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = `game.html?game=${encodeURIComponent(button.dataset.game)}`;
    });
  });
}

function setFilter(filter) {
  state.filter = filter;
  document.querySelector('#allChip').selected = filter === 'Todo';
  document.querySelector('#gamesChip').selected = filter === 'Juegos';
  document.querySelector('#appsChip').selected = filter === 'Apps';
  render();
}

document.querySelector('#allChip').addEventListener('click', () => setFilter('Todo'));
document.querySelector('#gamesChip').addEventListener('click', () => setFilter('Juegos'));
document.querySelector('#appsChip').addEventListener('click', () => setFilter('Apps'));
search.addEventListener('input', () => {
  state.query = search.value;
  render();
});

document.querySelector('#sortBtn').addEventListener('click', () => {
  state.ascending = !state.ascending;
  render();
});

document.querySelector('#resetBtn').addEventListener('click', () => {
  search.value = '';
  state.query = '';
  setFilter('Todo');
});

document.querySelector('#aboutBtn').addEventListener('click', () => {
  document.querySelector('#aboutDialog').show();
});
document.querySelector('#closeAbout').addEventListener('click', () => {
  document.querySelector('#aboutDialog').close();
});

function setTheme(dark) {
  root.classList.toggle('dark', dark);
  localStorage.setItem('aih-theme', dark ? 'dark' : 'light');
  document.querySelector('#themeIcon').textContent = dark ? 'light_mode' : 'dark_mode';
}

setTheme(localStorage.getItem('aih-theme') === 'dark');

const appBar = document.querySelector('#appBar');
const syncAppBar = () => appBar.classList.toggle('is-scrolled', window.scrollY > 4);
window.addEventListener('scroll', syncAppBar, {passive: true});
syncAppBar();

document.querySelector('#themeBtn').addEventListener('click', () => {
  setTheme(!root.classList.contains('dark'));
});

fetch('games.json', {cache: 'no-store'})
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(games => {
    state.games = Array.isArray(games) ? games : [];
    render();
  })
  .catch(error => {
    console.error('Android In Html:', error);
    state.games = [];
    document.querySelector('#resultText').textContent = 'No se pudo cargar el catálogo';
    grid.hidden = true;
    empty.hidden = false;
  });
