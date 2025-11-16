(function() {
  document.getElementById("aggiungi-oggetto").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome-oggetto").value;
    const qt = parseInt(document.getElementById("quantita").value);
    const sede = document.getElementById("sede").value;
    const categoria = document.getElementById("categoria").value;

    if (!nome || qt <= 0 || !categoria) {
      app.showError("Nome, quantità e categoria sono obbligatori.");
      return;
    }

    db.collection("magazzino").add({
      nome,
      quantita: qt,
      sede,
      categoria,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      app.showSuccess("Oggetto aggiunto!");
      app.logAzione("Oggetto aggiunto", `${nome} (${qt})`);
      document.getElementById("aggiungi-oggetto").reset();
      app.loadMagazzino(); // Ricarica la dashboard
    }).catch(error => {
      app.showError("Errore aggiunta oggetto: " + error.message);
    });
  });
})();