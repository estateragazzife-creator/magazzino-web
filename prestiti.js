(function() {
  async function registraPrestito(e) {
    e.preventDefault();
    const oggettoId = document.getElementById("oggetto-da-prestare").value;
    const qt = parseInt(document.getElementById("qt-prestito").value);

    try {
      const doc = await db.collection("magazzino").doc(oggettoId).get();
      const oggetto = doc.data();

      if (oggetto.quantita < qt) {
        app.showError("Quantità insufficiente in magazzino.");
        return;
      }

      await db.collection("magazzino").doc(oggettoId).update({
        quantita: oggetto.quantita - qt
      });

      await db.collection("prestiti").add({
        id_oggetto: oggettoId,
        nome_oggetto: oggetto.nome,
        qt_uscita: qt,
        data_uscita: new Date(),
        stato: "in_uso"
      });

      app.showSuccess("Prestito registrato!");
      app.logAzione("Oggetto prestato", `${oggetto.nome} (${qt})`);
      app.loadMagazzino();
      loadPrestiti();
    } catch (error) {
      app.showError("Errore registrazione prestito: " + error.message);
    }
  }

  async function confermaRientro() {
    const prestitoId = document.getElementById("prestito-da-rientrare").value;
    const qtRientrata = parseInt(document.getElementById("qt-rientrata").value);

    try {
      const doc = await db.collection("prestiti").doc(prestitoId).get();
      const prestito = doc.data();
      const qtUscita = prestito.qt_uscita;
      const qtPersa = qtUscita - qtRientrata;

      if (qtPersa > 0) {
        await db.collection("oggetti_persi").add({
          id_prestito: prestitoId,
          nome_oggetto: prestito.nome_oggetto,
          qt_persa: qtPersa,
          qt_rientrata: qtRientrata
        });
        app.logAzione("Oggetto rientrato con perdita", `${prestito.nome_oggetto}, ${qtPersa} persi`);
      } else {
        app.logAzione("Oggetto rientrato completamente", `${prestito.nome_oggetto}`);
      }

      await db.collection("prestiti").doc(prestitoId).update({ stato: "rientrato" });

      await db.collection("magazzino").doc(prestito.id_oggetto).update({
        quantita: firebase.firestore.FieldValue.increment(qtRientrata)
      });

      app.showSuccess("Rientro confermato!");
      app.loadMagazzino();
      loadPrestiti();
    } catch (error) {
      app.showError("Errore conferma rientro: " + error.message);
    }
  }
  
  function loadPrestiti() {
    const prestitiDiv = document.getElementById("lista-prestiti");
    const prestitiSelect = document.getElementById("prestito-da-rientrare");

    db.collection("prestiti").orderBy("stato").get().then(snapshot => {
      let html = "<ul>";
      let selectHtml = '<option value="">Seleziona prestito da rientrare</option>';
      snapshot.forEach(doc => {
        const data = doc.data();
        html += `<li>${data.nome_oggetto} - ${data.qt_uscita} - ${data.stato}</li>`;
        if (data.stato === 'in_uso') {
          selectHtml += `<option value="${doc.id}">${data.nome_oggetto}</option>`;
        }
      });
      html += "</ul>";
      prestitiDiv.innerHTML = html;
      prestitiSelect.innerHTML = selectHtml;
    });
  }

  document.getElementById("prestito-oggetto").addEventListener("submit", registraPrestito);
  document.getElementById("conferma-rientro").addEventListener("click", confermaRientro);

  app.loadPrestiti = loadPrestiti;
})();