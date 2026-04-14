export function renderSettingsPage() {
  document.getElementById('app-content').innerHTML = `
    <h2>Réglages</h2>
    <label>Couleur du fond :</label>
    <input type="color" id="set-bg-color" onchange="saveBg(this.value)">
    <br><br>
    <label>Image du fond (URL) :</label>
    <input type="text" id="set-bg-img" placeholder="https://..." onchange="saveBg(this.value)">
    <button onclick="saveBg(null);">Réinitialiser</button>
  `;
}

// Rendre saveBg global pour qu'il puisse être appelé depuis le HTML inline
window.saveBg = (val) => {
  if (val === null) localStorage.removeItem('cs-bg');
  else localStorage.setItem('cs-bg', val);
  location.reload();
};