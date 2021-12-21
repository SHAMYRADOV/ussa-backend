const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

const firebaseConfig = {
  apiKey: "AIzaSyCuVaT-2SmyFkyzWNbmNj3PGr5SqXz9qwY",
  authDomain: "ussa-project.firebaseapp.com",
  projectId: "ussa-project",
  storageBucket: "ussa-project.appspot.com",
  messagingSenderId: "957434234801",
  appId: "1:957434234801:web:b3ab665940b1e460019f90",
  measurementId: "G-NZCTN8JN9V",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
