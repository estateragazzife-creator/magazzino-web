(function() {
  // Crea una reservazione
  function creaReservazione(articoloId, quantita, motivo) {
    db.collection("magazzino").doc(articoloId).get().then(doc => {
      const data = doc.data();
      if (data.quantita < quantita) {
        app.showError("Quantità non disponibile per la reservazione");
        return;
      }

      db.collection("reservazioni").add({
        articolo_id: articoloId,
        nome: data.nome,
        quantita,
        motivo, // es. "Ordine cliente #123"
        utente: app.currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        stato: "attiva"
      }).then(() => {
        app.logAzione("Reservazione creata", `${data.nome} (${quantita}) per ${motivo}`);
        app.showSuccess("Reservazione creata!");
      });
    });
  }

  // Mostra reservazioni attive
  function caricaReservazioni() {
    db.collection("reservazioni").where("stato", "==", "attiva").get().then(snapshot => {
      let html = "<h4>Reservazioni attive</h4><ul>";
      snapshot.forEach(doc => {
        const data = doc.data();
        html += `<li>${data.nome} (${data.quantita}) – ${data.motivo} – ${data.utente}</li>`;
      });
      html += "</ul>";
      const container = document.getElementById("lista-reservazioni");
      if(container) {
        container.innerHTML = html;
      } else {
        document.getElementById("tab-stock").innerHTML += html;
      }
    });
  }

  app.creaReservazione = creaReservazione;
  app.caricaReservazioni = caricaReservazioni;
})();