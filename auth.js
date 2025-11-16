let currentUser = null;

document.getElementById("login-btn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    currentUser = result.user;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("user-info").textContent = `Benvenuto, ${currentUser.displayName || currentUser.email}`;
    loadAllData();
  }).catch((error) => {
    console.error("Errore login:", error);
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
    document.getElementById("user-info").textContent = `Benvenuto, ${user.displayName || user.email}`;
    loadAllData();
  } else {
    document.getElementById("app").style.display = "none";
    document.getElementById("login").style.display = "block";
  }
});