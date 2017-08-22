if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
firebase.initializeApp({
  "apiKey": "AIzaSyBYK7fX6p50ne023Ak4YibktQcxsaUPU0M",
  "databaseURL": "https://audiostream-89853.firebaseio.com",
  "storageBucket": "audiostream-89853.appspot.com",
  "authDomain": "audiostream-89853.firebaseapp.com",
  "messagingSenderId": "445284454461",
  "projectId": "audiostream-89853"
});