document.getElementById("prestito-oggetto").addEventListener("submit", (e) => {
  e.preventDefault();
  const oggettoId = document.getElementById("oggetto-da-prestare").value;
  const qt = parseInt(document.getElementById("qt-prestito").value);

  db.collection("magazzino").doc(oggettoId).get().then(doc => {
    const oggetto = doc.data();
    if (oggetto.quantita < qt) {
      showError("Quantità insufficiente in magazzino.");
      return;
    }

    db.collection("magazzino").doc(oggettoId).update({
      quantita: oggetto.quantita - qt
    }).then(() => {
      db.collection("prestiti").add({
        id_oggetto: oggettoId,
        nome_oggetto: oggetto.nome,
        qt_uscita: qt,
        data_uscita: new Date(),
        stato: "in_uso"
      }).then(() => {
        showSuccess("Prestito registrato!");
        logAzione("Oggetto prestato", `${oggetto.nome} (${qt})`);
        loadMagazzino();
        loadPrestiti();
      });
    });
  }).catch(error => {
    showError("Errore registrazione prestito: " + error.message);
  });
});

document.getElementById("conferma-rientro").addEventListener("click", () => {
  const prestitoId = document.getElementById("prestito-da-rientrare").value;
  const qtRientrata = parseInt(document.getElementById("qt-rientrata").value);

  db.collection("prestiti").doc(prestitoId).get().then(doc => {
    const prestito = doc.data();
    const qtUscita = prestito.qt_uscita;
    const qtPersa = qtUscita - qtRientrata;

    if (qtPersa > 0) {
      db.collection("oggetti_persi").add({
        id_prestito: prestitoId,
        nome_oggetto: prestito.nome_oggetto,
        qt_persa: qtPersa,
        qt_rientrata: qtRientrata
      });
      logAzione("Oggetto rientrato con perdita", `${prestito.nome_oggetto}, ${qtPersa} persi`);
    } else {
      logAzione("Oggetto rientrato completamente", `${prestito.nome_oggetto}`);
    }

    db.collection("prestiti").doc(prestitoId).update({ stato: "rientrato" });

    db.collection("magazzino").doc(prestito.id_oggetto).update({
      quantita: firebase.firestore.FieldValue.increment(qtRientrata)
    });

    showSuccess("Rientro confermato!");
    loadAllData();
  }).catch(error => {
    showError("Errore conferma rientro: " + error.message);
  });
});