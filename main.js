
// main.js : navigation et redirection sécurisée

// On suppose que tous les scripts sont chargés dans l'ordre dans le HTML
// et que firebase-config.js expose db et auth sur window
// On expose les fonctions sur window pour usage global

window.renderListsPage = window.renderListsPageImpl || function(){};
window.renderCarsPage = window.renderCarsPageImpl || function(){};
window.renderAddCarPage = window.renderAddCarPageImpl || function(){};
window.renderAccountPage = window.renderAccountPageImpl || function(){};
window.renderCarDetailPage = window.renderCarDetailPageImpl || function(id){};



window.getQueryParam = function(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function requireAuth(redirectTo) {
  window.auth.onAuthStateChanged(function(user) {
    if (!user) {
      window.location.replace('login.html?redirect=' + encodeURIComponent(redirectTo || window.location.pathname));
    } else {
      if (window.applyStoredBg) window.applyStoredBg();
      const carId = window.getQueryParam('id');
      if (carId) window.showPage('car-detail');
      else window.showPage('cars');
    }
  });
}

window.showPage = function(page) {
  // Ne vide pas le contenu si on est déjà sur voitures.html et que la structure existe
  if (!(page === 'cars' && document.getElementById('cars-grid'))) {
    document.getElementById('app-content').innerHTML = '';
  }
  switch(page) {
    case 'lists':
      window.renderListsPage(); break;
    case 'cars':
      window.renderCarsPage(); break;
    case 'add':
      window.renderAddCarPage(); break;
    case 'settings':
      if (window.renderSettingsPage) window.renderSettingsPage(); break;
    case 'account':
      window.renderAccountPage(); break;
    case 'car-detail':
      window.renderCarDetailPage(window.getQueryParam('id')); break;
    default:
      window.renderCarsPage(); break;
  }
}

// Navigation
try {
  const navMap = {
    'nav-lists': 'lists',
    'nav-cars': 'cars',
    'nav-add': 'add',
    'nav-settings': 'settings',
    'nav-account': 'account'
  };
  Object.keys(navMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.onclick = () => {
        window.showPage(navMap[id]);
        document.querySelectorAll('.navbar button').forEach(b => b.classList.remove('selected'));
        el.classList.add('selected');
      };
    }
  });
} catch(e) {}

requireAuth(window.location.pathname);
