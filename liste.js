window.onload = () => {
  auth.onAuthStateChanged(user => {
    console.log('auth.currentUser:', user);
    if(!user) return;
    db.collection('lists').where('uid', '==', user.uid).onSnapshot(snap => {
      const container = document.getElementById('lists-container');
      container.innerHTML = '';
      snap.forEach(doc => {
        container.innerHTML += `<div class=\"list-item\"><strong>${doc.data().name}</strong><p>${doc.data().desc}</p></div>`;
      });
    });
  });

  document.getElementById('add-list-form').onsubmit = (e) => {
    e.preventDefault();
    console.log('auth.currentUser (submit):', auth.currentUser);
    db.collection('lists').add({
      uid: auth.currentUser.uid,
      name: document.getElementById('l-name').value,
      desc: document.getElementById('l-desc').value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => e.target.reset());
  };
};
