import './firebase-config.js'; // Assure que Firebase est initialisé
import { db } from './firebase-exports.js';
import { showPage } from './main.js'; // Importe showPage depuis main.js

export function renderCarsPage() {
  document.getElementById('app-content').innerHTML = `
    <h2>Mes voitures</h2>
    <div style="margin-bottom:10px;">
      <input id="search-car" type="text" placeholder="Rechercher un modèle..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #ccc;">
    </div>
    <div style="margin-bottom:16px;">
      <select id="sort-car" style="width:100%;padding:10px;border-radius:8px;">
        <option value="date-desc">Plus récentes</option>
        <option value="date-asc">Plus anciennes</option>
        <option value="alpha-asc">A → Z</option>
        <option value="alpha-desc">Z → A</option>
      </select>
    </div>
    <div id="cars-grid" class="grid"></div>
  `;
  let allCars = [];
  let filteredCars = [];
  function renderGrid() {
    const container = document.getElementById('cars-grid');
    container.innerHTML = '';
    if (filteredCars.length === 0) {
      container.innerHTML = '<p style="color:#888;">Aucune voiture trouvée.</p>';
      return;
    }
    filteredCars.forEach(carObj => {
      const { doc, car } = carObj;
      const card = document.createElement('div');
      card.className = 'car-card';
      card.innerHTML = `
        <img src="${car.miniature || car.photoURL || (car.photos && car.photos[0]) || ''}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
        <div class="info">
          <strong>${car.model || ''}</strong>
        </div>
      `;
      card.onclick = () => window.location.href = `?id=${doc.id}`;
      container.appendChild(card);
    });
  }
  function applyFilters() {
    const search = document.getElementById('search-car').value.toLowerCase();
    const sort = document.getElementById('sort-car').value;
    filteredCars = allCars.filter(({car}) => (car.model||'').toLowerCase().includes(search));
    if (sort === 'date-desc') filteredCars.sort((a,b) => (b.car.createdAt?.seconds||0)-(a.car.createdAt?.seconds||0));
    if (sort === 'date-asc') filteredCars.sort((a,b) => (a.car.createdAt?.seconds||0)-(b.car.createdAt?.seconds||0));
    if (sort === 'alpha-asc') filteredCars.sort((a,b) => (a.car.model||'').localeCompare(b.car.model||''));
    if (sort === 'alpha-desc') filteredCars.sort((a,b) => (b.car.model||'').localeCompare(a.car.model||''));
    renderGrid();
  }
  firebase.auth().onAuthStateChanged(user => {
    if (!user) return;
    db.collection('cars').where('uid', '==', user.uid).onSnapshot(snap => {
      allCars = [];
      snap.forEach(doc => {
        const car = doc.data();
        if ((car.model && car.model.trim() !== '') || car.photoURL || (car.photos && car.photos.length > 0)) {
          allCars.push({ doc, car });
        }
      });
      applyFilters();
    });
  });
  document.addEventListener('input', e => {
    if (e.target && (e.target.id === 'search-car' || e.target.id === 'sort-car')) {
      applyFilters();
    }
  });
}