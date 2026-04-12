// main.js : navigation et redirection sécurisée
import { renderListsPage } from './lists.js';
import { renderCarsPage } from './cars.js';
import { renderAddCarPage } from './addCar.js';
import { renderAccountPage } from './account.js';
import { renderCarDetailPage } from './carDetail.js';

export function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function requireAuth(redirectTo) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      window.location.replace('login.html?redirect=' + encodeURIComponent(redirectTo || window.location.pathname));
    } else {
      // Appliquer les réglages au chargement
      const bg = localStorage.getItem('cs-bg');
      if (bg) {
        if (bg.startsWith('#')) document.body.style.backgroundColor = bg;
        else document.body.style.backgroundImage = `url(${bg})`;
      }
      // Afficher la navbar une fois connecté
      document.getElementById('main-nav').style.display = 'flex';
      // Navigation initiale
      const carId = getQueryParam('id');
      if (carId) showPage('car-detail');
      else showPage('cars');
    }
  });
}

export function showPage(page) {
  document.getElementById('app-content').innerHTML = '';
  // Charge la page demandée
  switch(page) {
    case 'lists':
      renderListsPage(); break;
    case 'cars':
      renderCarsPage(); break;
    case 'add':
      renderAddCarPage(); break;
    case 'settings':
      renderSettingsPage(); break;
    case 'account':
      renderAccountPage(); break;
    case 'car-detail':
      renderCarDetailPage(getQueryParam('id')); break;
    default:
      renderCarsPage(); break;
  }
}

// Navigation
const navMap = {
  'nav-lists': 'lists',
  'nav-cars': 'cars',
  'nav-add': 'add',
  'nav-settings': 'settings',
  'nav-account': 'account'
};
Object.keys(navMap).forEach(id => {
  document.getElementById(id).onclick = () => {
    showPage(navMap[id]);
    document.querySelectorAll('.navbar button').forEach(b => b.classList.remove('selected'));
    document.getElementById(id).classList.add('selected');
  };
});

export function renderSettingsPage() {
  document.getElementById('app-content').innerHTML = `
    <h2>Réglages</h2>
    <label>Couleur du fond :</label>
    <input type="color" onchange="saveBg(this.value)">
    <br><br>
    <label>Image du fond (URL) :</label>
    <input type="text" id="set-bg-url" placeholder="URL de l'image" onchange="saveBg(this.value)">
  `;
}

window.saveBg = (val) => {
  localStorage.setItem('cs-bg', val);
  location.reload();
};

requireAuth(window.location.pathname);
