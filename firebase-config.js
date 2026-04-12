const firebaseConfig = {
  apiKey: "AIzaSyBR_uHqxZhdIIHzhWyFNQaAQZ8uHyXf20c",
  authDomain: "carspot-d6ff9.firebaseapp.com",
  projectId: "carspot-d6ff9",
  storageBucket: "carspot-d6ff9.appspot.com",
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

// Appliquer le fond d'écran
const bg = localStorage.getItem('cs-bg');
if (bg) {
  if (bg.startsWith('#')) document.body.style.backgroundColor = bg;
  else document.body.style.backgroundImage = `url(${bg})`;
}