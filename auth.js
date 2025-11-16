(function() {
  app.currentUser = null;

  // Evento login
  document.getElementById("login-btn").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      app.currentUser = result.user;
      document.getElementById("login").style.display = "none";
      document.getElementById("app").style.display = "block";
      document.getElementById("user-info").textContent = `Benvenuto, ${app.currentUser.displayName || app.currentUser.email}`;
      app.loadMagazzino(); // Carica solo i dati della dashboard
    }).catch((error) => {
      console.error("Errore login:", error);
      alert("Errore login: " + error.message);
    });
  });

  // Evento logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
      app.currentUser = null;
      document.getElementById("app").style.display = "none";
      document.getElementById("login").style.display = "block";
    });
  });

  // Controllo stato utente
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      app.currentUser = user;
      document.getElementById("login").style.display = "none";
      document.getElementById("app").style.display = "block";
      document.getElementById("user-info").textContent = `Benvenuto, ${user.displayName || user.email}`;
      app.loadMagazzino(); // Carica solo i dati della dashboard
      app.controllaStockBasso();
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
          app.loadMagazzino();
          break;
        case 'anagrafiche':
          app.loadSedi();
          app.loadArticoli();
          app.loadApparati();
          break;
        case 'stock':
          app.loadODT();
          app.loadStockManagementUI();
          app.caricaReservazioni();
          break;
        case 'apparati':
          app.loadStoricoApparati();
          break;
        case 'report':
          app.loadReport();
          break;
        case 'log':
          app.loadLog();
          break;
      }
    });
  });
})();