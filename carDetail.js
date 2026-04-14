import { db } from './firebase-config.js'; // Importe db depuis firebase-config.js
import { showPage, getQueryParam } from './main.js'; // Importe showPage et getQueryParam depuis main.js

export function renderCarDetailPage(id) {
  if (!id) {
    showPage('cars');
    return;
  }
  document.getElementById('app-content').innerHTML = 'Chargement du détail...';
  db.collection('cars').doc(id).get().then(doc => {
    if (!doc.exists) {
      showPage('cars');
      return;
    }
    const car = doc.data();
    document.getElementById('app-content').innerHTML = `
      <button onclick="window.location.href='index.html'">← Retour</button>
      <div class="car-detail">
        <img src="${car.photoURL}" style="width:100%; border-radius:12px;">
        <h1>${car.title}</h1>
        <p><strong>Modèle:</strong> ${car.model}</p>
        <p>${car.desc}</p>
        <hr>
        <button id="del-car" style="background:#ff4444;">Supprimer</button>
      </div>
    `;
    document.getElementById('del-car').onclick = () => {
      if (confirm('Supprimer cette voiture ?')) {
        db.collection('cars').doc(id).delete().then(() => window.location.href = 'index.html');
      }
    };
  });
}