document.getElementById("richiesta-trasferimento").addEventListener("submit", (e) => {
  e.preventDefault();
  const oggettoId = document.getElementById("oggetto-trasferimento").value;
  const qt = parseInt(document.getElementById("qt-trasferimento").value);
  const sede = document.getElementById("sede-destinataria").value;

  db.collection("magazzino").doc(oggettoId).get().then(doc => {
    const oggetto = doc.data();
    if (oggetto.quantita < qt) {
      showError("Quantità insufficiente in magazzino.");
      return;
    }

    db.collection("trasferimenti").add({
      id_oggetto: oggettoId,
      nome_oggetto: oggetto.nome,
      qt_trasferita: qt,
      sede_destinataria: sede,
      stato: "in_attesa"
    }).then(() => {
      showSuccess("Richiesta di trasferimento inviata!");
      logAzione("Richiesta trasferimento", `${oggetto.nome} (${qt}) → ${sede}`);
      loadTrasferimenti();
    });
  }).catch(error => {
    showError("Errore richiesta trasferimento: " + error.message);
  });
});