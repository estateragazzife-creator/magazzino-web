let currentUser = null;

// Evento login
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

// Evento logout
document.getElementById("logout-btn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    currentUser = null;
    document.getElementById("app").style.display = "none";
    document.getElementById("login").style.display = "block";
  });
});

// Controllo stato utente
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

// Cambio tab
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = e.target.getAttribute('data-tab');

    // Rimuovi active
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));

    // Aggiungi active
    document.getElementById(`tab-${tab}`).classList.add('active');
    e.target.classList.add('active');

    // Carica dati specifici per tab
    switch (tab) {
      case 'dashboard':
        loadMagazzino();
        break;
      case 'anagrafiche':
        loadSedi();
        loadArticoli();
        loadApparati();
        break;
      case 'stock':
        loadODT();
        caricaReservazioni();
        break;
      case 'apparati':
        loadStoricoApparati();
        break;
      case 'report':
        loadReport();
        break;
      case 'log':
        loadLog();
        break;
    }
  });
});

// Carica tutti i dati iniziali
function loadAllData() {
  loadMagazzino();
  loadSedi();
  loadArticoli();
  loadApparati();
  loadODT();
  loadStoricoApparati();
  loadReport();
  loadLog();
  controllaStockBasso();
}