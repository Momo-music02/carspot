const firebaseConfig = {
  apiKey: "AIzaSyBR_uHqxZhdIIHzhWyFNQaAQZ8uHyXf20c",
  authDomain: "carspot-d6ff9.firebaseapp.com",
  projectId: "carspot-d6ff9",
  storageBucket: "carspot-d6ff9.firebasestorage.app",
  messagingSenderId: "1020332551922",
  appId: "1:1020332551922:web:7ab8a7bbd808f674d52a6b",
  measurementId: "G-YCVWCRSW91"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Protection des pages : Redirige vers login si non connecté
auth.onAuthStateChanged(user => {
  if (!user && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
  }
});

// Appliquer le fond d'écran ou le dégradé sur toutes les pages
const grad = localStorage.getItem('cs-gradient');
const bg = localStorage.getItem('cs-bg');
if (grad) {
  const [c1, c2] = grad.split(',');
  if (c2 && c2 !== '') {
    document.body.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  } else {
    document.body.style.background = c1;
  }
} else if (bg) {
  if (bg.startsWith('#')) document.body.style.backgroundColor = bg;
  else document.body.style.backgroundImage = `url(${bg})`;
}