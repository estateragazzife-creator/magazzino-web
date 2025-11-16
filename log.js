(function() {
  function logAzione(azione, dettagli) {
    if (!app.currentUser) return;

    db.collection("log_attivita").add({
      utente: app.currentUser.displayName || app.currentUser.email,
      azione,
      dettagli,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  function loadLog() {
    const logDiv = document.getElementById("log-attivita");
    app.setLoading(logDiv, true);

    db.collection("log_attivita").orderBy("timestamp", "desc").limit(100).get().then((snapshot) => {
      let html = "<ul>";
      snapshot.forEach(doc => {
        const data = doc.data();
        html += `<li>[${data.timestamp.toDate().toLocaleString()}] <strong>${data.utente}</strong> - ${data.azione} (${data.dettagli})</li>`;
      });
      html += "</ul>";
      logDiv.innerHTML = html;
    }).catch(error => {
      app.showError("Errore caricamento log: " + error.message);
    });
  }

  app.logAzione = logAzione;
  app.loadLog = loadLog;
})();