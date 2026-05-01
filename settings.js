export function renderSettingsPage() {
  document.getElementById('app-content').innerHTML = `
    <h2>Réglages</h2>
    <label>Couleur de la barre du navigateur (Safari MacOS) :</label>
    <input type="color" id="theme-color-picker" style="vertical-align:middle;" />
    <button id="apply-theme-color" style="margin-left:8px;">Appliquer</button>
    <button id="reset-theme-color" style="margin-left:8px;">Réinitialiser</button>
    <br><br>
    <label>Couleur du fond :</label>
    <input type="color" id="set-bg-color" onchange="saveBg(this.value)">
    <br><br>
    <label>Image du fond (URL) :</label>
    <input type="text" id="set-bg-img" placeholder="https://..." onchange="saveBg(this.value)">
    <button onclick="saveBg(null);">Réinitialiser</button>
  `;

  // Initialiser le color picker avec la valeur stockée
  const picker = document.getElementById('theme-color-picker');
  const resetBtn = document.getElementById('reset-theme-color');
  let stored = localStorage.getItem('cs-theme-color');
  if (!stored && window.auth && window.auth.currentUser) {
    window.db.collection('users').doc(window.auth.currentUser.uid).get().then(doc => {
      if (doc.exists && doc.data().themeColor) {
        stored = doc.data().themeColor;
        picker.value = stored;
      }
    });
  } else if (stored) {
    picker.value = stored;
  }

  const applyBtn = document.getElementById('apply-theme-color');
  applyBtn.addEventListener('click', async function() {
    const color = picker.value;
    localStorage.setItem('cs-theme-color', color);
    if (window.auth && window.auth.currentUser) {
      await window.db.collection('users').doc(window.auth.currentUser.uid).set({ themeColor: color }, { merge: true });
    }
    window.applyThemeColor(color);
  });
  resetBtn.addEventListener('click', async function() {
    localStorage.removeItem('cs-theme-color');
    if (window.auth && window.auth.currentUser) {
      await window.db.collection('users').doc(window.auth.currentUser.uid).update({ themeColor: window.firebase.firestore.FieldValue.delete() });
    }
    window.applyThemeColor('#007aff');
    picker.value = '#007aff';
  });
}

// Rendre saveBg global pour qu'il puisse être appelé depuis le HTML inline
window.saveBg = async (val) => {
  const user = window.auth && window.auth.currentUser;
  if (user) {
    // Enregistre dans Firestore (collection 'users', doc = uid)
    const userRef = window.db.collection('users').doc(user.uid);
    if (val === null) {
      await userRef.update({ bg: window.firebase.firestore.FieldValue.delete() });
      localStorage.removeItem('cs-bg');
    } else {
      await userRef.set({ bg: val }, { merge: true });
      localStorage.setItem('cs-bg', val);
    }
  } else {
    // Fallback localStorage si pas connecté
    if (val === null) localStorage.removeItem('cs-bg');
    else localStorage.setItem('cs-bg', val);
  }
  location.reload();
};