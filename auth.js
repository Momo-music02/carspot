// Authentification Firebase

function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = 'index.html';
    })
    .catch((error) => {
      document.getElementById('login-error-message').innerText = error.message;
    });
}


function register() {
  const nom = document.getElementById('register-nom').value;
  const prenom = document.getElementById('register-prenom').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Mettre à jour le profil utilisateur avec nom et prénom
      return userCredential.user.updateProfile({
        displayName: nom + ' ' + prenom
      });
    })
    .then(() => {
      window.location.href = 'account.html';
    })
    .catch((error) => {
      document.getElementById('register-error-message').innerText = error.message;
    });
}

function logout() {
  firebase.auth().signOut().then(() => {
    showLogin();
  });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    showUser(user);
  } else {
    showLogin();
  }
});

// Les fonctions showUser, showLogin, showError ne sont plus utilisées ici
