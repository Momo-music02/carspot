export function renderSettingsPage() {
  document.getElementById('app-content').innerHTML = `
    <h2>Réglages</h2>
    <label>Couleur du fond :</label>
    <input type="color" id="set-bg-color" onchange="window.saveBg(this.value)">
    <br><br>
    <label>Image du fond (URL) :</label>
    <input type="text" id="set-bg-img" placeholder="https://..." onchange="window.saveBg(this.value)">
    <button onclick="localStorage.removeItem('cs-bg'); location.reload();">Réinitialiser</button>
  `;
}

// Rendre saveBg global pour qu'il puisse être appelé depuis le HTML inline
window.saveBg = (val) => {
  localStorage.setItem('cs-bg', val);
  location.reload();
};