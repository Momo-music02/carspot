import firebase, { auth } from './firebase-config.js'; // Importe firebase et auth depuis firebase-config.js

export function renderAccountPage() {
  const user = auth.currentUser; // Utilise auth importé
  const [nom, prenom] = (user.displayName || ' ').split(' ');
  document.getElementById('app-content').innerHTML = `
    <h2>Mon compte</h2>
    <form id="edit-profile">
      <input type="text" id="acc-nom" value="${nom}" placeholder="Nom" />
      <input type="text" id="acc-prenom" value="${prenom}" placeholder="Prénom" />
      <p>Email: ${user.email}</p>
      <button type="submit">Sauvegarder</button>
      <button type="button" onclick="auth.signOut().then(() => location.reload())" style="background:red;">Déconnexion</button>
    </form>
    <div id="acc-msg"></div>
  `;
  document.getElementById('edit-profile').onsubmit = (e) => {
    e.preventDefault();
    const n = document.getElementById('acc-nom').value;
    const p = document.getElementById('acc-prenom').value;
    user.updateProfile({ displayName: n + ' ' + p }).then(() => {
      document.getElementById('acc-msg').innerText = "Profil mis à jour !";
    }).catch(error => {
      document.getElementById('acc-msg').innerText = "Erreur: " + error.message;
    });
  };
}