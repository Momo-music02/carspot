// Gestion de la page compte utilisateur
function fillAccountForm(user) {
  if (!user) return;
  const [nom, prenom] = (user.displayName || ' ').split(' ');
  document.getElementById('account-nom').value = nom || '';
  document.getElementById('account-prenom').value = prenom || '';
  document.getElementById('account-email').value = user.email || '';
  document.getElementById('account-form').style.display = 'block';
}

function updateAccount() {
  const user = firebase.auth().currentUser;
  const nom = document.getElementById('account-nom').value;
  const prenom = document.getElementById('account-prenom').value;
  user.updateProfile({
    displayName: nom + ' ' + prenom
  }).then(() => {
    document.getElementById('account-message').innerText = 'Modifications enregistrées !';
  }).catch((error) => {
    document.getElementById('account-message').innerText = error.message;
  });
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = 'login.html';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      fillAccountForm(user);
    } else {
      window.location.replace('login.html');
    }
  });
});
