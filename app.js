const db = firebase.firestore();

function loadAllData() {
  loadMagazzino();
  loadPrestiti();
  loadTrasferimenti();
  renderGrafico();
}

function loadMagazzino() {
  const magazzinoDiv = document.getElementById("lista-magazzino");
  magazzinoDiv.innerHTML = "<p>Caricamento...</p>";

  db.collection("magazzino").get().then((snapshot) => {
    let html = "<ul>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li>${data.nome} - Qt: ${data.quantita} (${data.sede})</li>`;
    });
    html += "</ul>";
    magazzinoDiv.innerHTML = html;
  });
}

document.getElementById("aggiungi-oggetto").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome-oggetto").value;
  const qt = parseInt(document.getElementById("quantita").value);
  const sede = document.getElementById("sede").value;

  db.collection("magazzino").add({
    nome,
    quantita: qt,
    sede,
    categoria: "varie"
  }).then(() => {
    alert("Oggetto aggiunto!");
    document.getElementById("aggiungi-oggetto").reset();
    loadMagazzino();
  });
});

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

function renderGrafico() {
  const ctx = document.getElementById("grafico-oggetti-persi").getContext("2d");

  db.collection("oggetti_persi").get().then((snapshot) => {
    const dati = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      if (dati[data.nome_oggetto]) {
        dati[data.nome_oggetto] += data.qt_persa;
      } else {
        dati[data.nome_oggetto] = data.qt_persa;
      }
    });

    const labels = Object.keys(dati);
    const values = Object.values(dati);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Oggetti persi',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      }
    });
  });
}