let currentUser = null;

document.getElementById("login-btn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    currentUser = result.user;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadAllData();
  }).catch((error) => {
    alert("Errore login: " + error.message);
  });
});

document.getElementById("logout-btn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    currentUser = null;
    document.getElementById("app").style.display = "none";
    document.getElementById("login").style.display = "block";
  });
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadAllData();
  } else {
    document.getElementById("app").style.display = "none";
    document.getElementById("login").style.display = "block";
  }
});