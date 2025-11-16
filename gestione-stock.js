function loadODT() {
  db.collection("odt").orderBy("timestamp", "desc").get().then((snapshot) => {
    let html = "<ul>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li>${data.articolo} - Qt: ${data.qt} | ${data.sede_origine} → ${data.sede_destinazione} | Stato: ${data.stato} <button onclick="stampaODT('${doc.id}', '${data.articolo}', ${data.qt}, '${data.sede_origine}', '${data.sede_destinazione}')">Stampa</button></li>`;
    });
    html += "</ul>";
    document.getElementById("lista-odt").innerHTML = html;
  });
}

function stampaODT(id, articolo, qt, origine, destinazione) {
  generaPDFODT({ id, articolo, qt, sede_origine: origine, sede_destinazione: destinazione });
}

document.getElementById("aggiungi-odt").addEventListener("submit", (e) => {
  e.preventDefault();
  const articoloId = document.getElementById("articolo-odt").value;
  const qt = parseInt(document.getElementById("qt-odt").value);
  const origine = document.getElementById("sede-origine-odt").value;
  const destinazione = document.getElementById("sede-destinazione-odt").value;

  db.collection("magazzino").doc(articoloId).get().then(doc => {
    const oggetto = doc.data();
    if (oggetto.quantita < qt) {
      showError("Quantità insufficiente in magazzino.");
      return;
    }

    db.collection("odt").add({
      articolo_id: articoloId,
      articolo: oggetto.nome,
      qt,
      sede_origine: origine,
      sede_destinazione: destinazione,
      stato: "creato",
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      showSuccess("ODT creato!");
      logAzione("ODT creato", `${oggetto.nome} (${qt}) da ${origine} a ${destinazione}`);
      document.getElementById("aggiungi-odt").reset();
      loadODT();
    });
  });
});