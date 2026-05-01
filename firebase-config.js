const firebaseConfig = {
  apiKey: "AIzaSyBR_uHqxZhdIIHzhWyFNQaAQZ8uHyXf20c",
  authDomain: "carspot-d6ff9.firebaseapp.com",
  projectId: "carspot-d6ff9",
  storageBucket: "carspot-d6ff9.firebasestorage.app",  messagingSenderId: "1020332551922",
  appId: "1:1020332551922:web:7ab8a7bbd808f674d52a6b",
  measurementId: "G-YCVWCRSW91"
};

firebase.initializeApp(firebaseConfig);


window.db = firebase.firestore();
window.storage = firebase.storage();
window.auth = firebase.auth();



// Appliquer le fond d'écran ou le dégradé sur toutes les pages (avec animation si demandé)
let gradientAnimationInterval = null;
function setGradientBg(c1, c2, animate=false) {
  if (gradientAnimationInterval) {
    clearInterval(gradientAnimationInterval);
    gradientAnimationInterval = null;
  }
  if (animate && c2 && c2 !== '') {
    let angle = 0;
    gradientAnimationInterval = setInterval(() => {
      angle = (angle + 1) % 360;
      document.body.style.background = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
    }, 50);
  } else if (c2 && c2 !== '') {
    document.body.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  } else {
    document.body.style.background = c1;
  }
}

window.applyStoredBg = async function() {
  // S'assure que le DOM est prêt
  if (!document.body) {
    window.addEventListener('DOMContentLoaded', window.applyStoredBg);
    return;
  }
  let grad = localStorage.getItem('cs-gradient');
  let bg = localStorage.getItem('cs-bg');
  const animate = localStorage.getItem('cs-animate-gradient') === 'true';
  // Si connecté, tente de charger le fond Firestore
  if (window.auth && window.auth.currentUser) {
    try {
      const userDoc = await window.db.collection('users').doc(window.auth.currentUser.uid).get();
      if (userDoc.exists && userDoc.data().bg) {
        bg = userDoc.data().bg;
        localStorage.setItem('cs-bg', bg); // Sync local pour usage offline
      }
    } catch (e) { /* ignore erreur réseau */ }
  }
  if (grad) {
    const [c1, c2] = grad.split(',');
    setGradientBg(c1, c2, animate);
  } else if (bg) {
    if (bg.startsWith('#')) document.body.style.backgroundColor = bg;
    else document.body.style.backgroundImage = `url(${bg})`;
  }
  // Couleurs texte/titres/boutons
  const textColor = localStorage.getItem('cs-text-color');
  const titleColor = localStorage.getItem('cs-title-color');
  const btnColor = localStorage.getItem('cs-btn-color');
  const btnTextColor = localStorage.getItem('cs-btn-text-color');
  if (textColor) document.body.style.color = textColor;
  if (titleColor) document.querySelectorAll('h1,h2,h3').forEach(t => t.style.color = titleColor);
  if (btnColor) document.querySelectorAll('button').forEach(b => b.style.background = btnColor);
  if (btnTextColor) document.querySelectorAll('button').forEach(b => b.style.color = btnTextColor);
};

window.applyStoredBg();