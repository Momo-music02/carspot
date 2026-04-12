import './firebase-config.js'; // Assure que Firebase est initialisé

export const db = firebase.firestore();
export const storage = firebase.storage();