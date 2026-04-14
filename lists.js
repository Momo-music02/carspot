import firebase, { db, auth } from './firebase-config.js'; // Importe firebase, db, auth depuis firebase-config.js

export function renderListsPage() {
  const user = auth.currentUser; // Utilise auth importé
  if (!user) return;

  document.getElementById('app-content').innerHTML = `
    <button onclick="window.location.href='index.html'">← Retour</button>
    <h2>Mes listes</h2>
    <form id="add-list-form">
      <input type="text" id="list-name" placeholder="Nom de la liste" required />
      <input type="text" id="list-desc" placeholder="Description" required />
      <button type="submit">Ajouter la liste</button>
      <div id="add-list-message"></div>
    </form>
    <div id="lists-container"></div>
  `;

  db.collection('lists').where('uid', '==', user.uid).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    const container = document.getElementById('lists-container');
    if (!container) return;
    container.innerHTML = '';
    if (snapshot.empty) {
      container.innerHTML = '<p style="color:#888;">Aucune liste pour le moment.</p>';
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = `<strong>${data.name}</strong><br><span style="color:#888;">${data.desc}</span>`;
      container.appendChild(div);
    });
  });

  document.getElementById('add-list-form').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('list-name').value;
    const desc = document.getElementById('list-desc').value;
    db.collection('lists').add({
      uid: user.uid,
      name,
      desc,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() // Utilise firebase importé
    }).then(() => {
      document.getElementById('add-list-message').innerText = 'Liste ajoutée !';
      document.getElementById('add-list-form').reset();
    }).catch(err => {
      document.getElementById('add-list-message').innerText = err.message;
    });
  };
}