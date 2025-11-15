function loadPrestiti() {
  const prestitiDiv = document.getElementById("lista-prestiti");
  const oggettoSelect = document.getElementById("oggetto-da-prestare");

  db.collection("magazzino").get().then((snapshot) => {
    oggettoSelect.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      oggettoSelect.innerHTML += `<option value="${doc.id}">${data.nome} (${data.quantita})</option>`;
    });
  });

  db.collection("prestiti").where("stato", "==", "in_uso").get().then((snapshot) => {
    let html = "<ul>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li>${data.nome_oggetto} - Qt: ${data.qt_uscita} | ${data.sede_richiedente}</li>`;
    });
    html += "</ul>";
    prestitiDiv.innerHTML = html;
  });
}

document.getElementById("prestito-oggetto").addEventListener("submit", (e) => {
  e.preventDefault();
  const oggettoId = document.getElementById("oggetto-da-prestare").value;
  const qt = parseInt(document.getElementById("qt-prestito").value);

  db.collection("magazzino").doc(oggettoId).get().then(doc => {
    const oggetto = doc.data();
    if (oggetto.quantita < qt) {
      alert("Quantità insufficiente in magazzino.");
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
        alert("Prestito registrato!");
        loadMagazzino();
        loadPrestiti();
      });
    });
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
    }

    db.collection("prestiti").doc(prestitoId).update({ stato: "rientrato" });

    db.collection("magazzino").doc(prestito.id_oggetto).update({
      quantita: firebase.firestore.FieldValue.increment(qtRientrata)
    });

    alert("Rientro confermato!");
    loadAllData();
  });
});