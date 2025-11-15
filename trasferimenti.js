function loadTrasferimenti() {
  const trasferimentiDiv = document.getElementById("lista-trasferimenti");
  const oggettoSelect = document.getElementById("oggetto-trasferimento");

  db.collection("magazzino").get().then((snapshot) => {
    oggettoSelect.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      oggettoSelect.innerHTML += `<option value="${doc.id}">${data.nome} (${data.quantita})</option>`;
    });
  });

  db.collection("trasferimenti").get().then((snapshot) => {
    let html = "<ul>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li>${data.nome_oggetto} - Qt: ${data.qt_trasferita} → ${data.sede_destinataria} | Stato: ${data.stato}</li>`;
    });
    html += "</ul>";
    trasferimentiDiv.innerHTML = html;
  });
}

document.getElementById("richiesta-trasferimento").addEventListener("submit", (e) => {
  e.preventDefault();
  const oggettoId = document.getElementById("oggetto-trasferimento").value;
  const qt = parseInt(document.getElementById("qt-trasferimento").value);
  const sede = document.getElementById("sede-destinataria").value;

  db.collection("magazzino").doc(oggettoId).get().then(doc => {
    const oggetto = doc.data();
    if (oggetto.quantita < qt) {
      alert("Quantità insufficiente in magazzino.");
      return;
    }

    db.collection("trasferimenti").add({
      id_oggetto: oggettoId,
      nome_oggetto: oggetto.nome,
      qt_trasferita: qt,
      sede_destinataria: sede,
      stato: "in_attesa"
    }).then(() => {
      alert("Richiesta di trasferimento inviata!");
      loadTrasferimenti();
    });
  });
});