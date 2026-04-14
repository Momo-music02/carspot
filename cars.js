// Utilisation navigateur classique : db et auth sont sur window
const db = window.db;
const auth = window.auth;

window.renderCarsPageImpl = function renderCarsPage() {
  // Ne réécrit le HTML que si la structure n'est pas déjà présente
  const appContent = document.getElementById('app-content');
  if (!document.getElementById('cars-grid')) {
    appContent.innerHTML = `
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
  }
  if (window.applyStoredBg) window.applyStoredBg(); // Applique le fond et couleurs à chaque affichage
  let allCars = [];
  let filteredCars = [];
  function renderGrid(errorMsg) {
    const container = document.getElementById('cars-grid');
    container.innerHTML = '';
    if (errorMsg) {
      container.innerHTML = `<p style='color:red;'>${errorMsg}</p>`;
      return;
    }
    if (filteredCars.length === 0) {
      container.innerHTML = '<p style="color:#888;">Aucune voiture trouvée.</p>';
      return;
    }
    filteredCars.forEach(carObj => {
      const { doc, car } = carObj;
        const div = document.createElement('div');
        div.className = 'car-inline-container';
        div.innerHTML = `
          <div class="car-inline-content">
            <img src="${car.photoURL || car.miniature || (car.photos && car.photos[0]) || ''}" class="car-inline-photo">
            <span class="car-inline-model">${car.model || ''}</span>
            <button class="move-car-btn" data-id="${doc.id}" style="margin-left:8px;background:#007aff;color:#fff;border:none;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:1em;cursor:pointer;box-shadow:0 2px 8px #0001;transition:background 0.2s;">⇄</button>
            <button class="delete-car-btn" data-id="${doc.id}" style="margin-left:8px;background:#ff4444;color:#fff;border:none;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:1em;cursor:pointer;box-shadow:0 2px 8px #0001;transition:background 0.2s;">🗑️</button>
          </div>
        `;
      // Suppression voiture
        div.querySelector('.delete-car-btn').onclick = (e) => {
        e.stopPropagation();
        if (confirm('Supprimer cette voiture ?')) {
          db.collection('cars').doc(doc.id).delete();
        }
      };
      // Déplacement voiture
        div.querySelector('.move-car-btn').onclick = (e) => {
        e.stopPropagation();
        db.collection('lists').where('uid', '==', car.uid).get().then(snap => {
          let options = '';
          snap.forEach(listDoc => {
            options += `<option value="${listDoc.id}">${listDoc.data().name}</option>`;
          });
          const newList = prompt('ID de la nouvelle liste (ou sélectionne dans la liste):\n' + options);
          if (newList) {
            db.collection('cars').doc(doc.id).update({ listId: newList });
          }
        });
      };
        div.onclick = (e) => {
          if (e.target.classList.contains('delete-car-btn') || e.target.classList.contains('move-car-btn')) return;
          window.location.href = `?id=${doc.id}`;
        };
        container.appendChild(div);
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
  auth.onAuthStateChanged(user => { // Utilise auth importé
    if (!user) {
      const grid = document.getElementById('cars-grid');
      if (grid) grid.innerHTML = "<p style='color:red;'>Connecte-toi pour voir tes voitures.</p>";
      return;
    }
    try {
      db.collection('cars').where('uid', '==', user.uid).orderBy('createdAt', 'desc').onSnapshot(snap => {
        const tempCars = [];
        snap.forEach(doc => {
          const car = doc.data();
          // Affiche toutes les voitures, même sans model/photo
          tempCars.push({ doc, car });
        });
        allCars = tempCars;
        applyFilters();
      }, err => {
        console.error('Erreur Firestore:', err);
        renderGrid('Erreur Firestore : ' + err.message);
      });
    } catch (e) {
      console.error('Erreur JS:', e);
      renderGrid('Erreur JS : ' + e.message);
    }
  });
  document.addEventListener('input', e => {
    if (e.target && (e.target.id === 'search-car' || e.target.id === 'sort-car')) {
      applyFilters();
    }
  });
}