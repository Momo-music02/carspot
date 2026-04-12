import './firebase-config.js'; // Assure que Firebase est initialisé
import { db } from './firebase-exports.js';
import { showPage } from './main.js'; // Importe showPage depuis main.js

export function renderCarsPage() {
  document.getElementById('app-content').innerHTML = '<h2>Mes voitures</h2><div id="cars-list" class="grid-list">Chargement...</div>';
  firebase.auth().onAuthStateChanged(user => {
    if (!user) return;
    db.collection('cars').where('uid', '==', user.uid).orderBy('createdAt', 'desc').onSnapshot(snap => {
      const container = document.getElementById('cars-list');
      container.innerHTML = '';
      if (snap.empty) container.innerHTML = 'Aucune voiture spotée.';
      snap.forEach(doc => {
        const car = doc.data();
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
          <img src="${car.photoURL}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
          <div class="info">
            <strong>${car.title}</strong><br>
            <small>${car.model}</small>
          </div>
        `;
        // Utilise window.location.href pour naviguer vers la page de détail de la voiture, que main.js gérera
        card.onclick = () => window.location.href = `?id=${doc.id}`;
        container.appendChild(card);
      });
    });
  });
}