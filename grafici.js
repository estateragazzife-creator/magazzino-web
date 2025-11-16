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
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }).catch(error => {
    showError("Errore caricamento grafico: " + error.message);
  });
}

function loadAllData() {
  loadMagazzino();
  loadPrestiti();
  loadTrasferimenti();
  renderGrafico();
  loadLog();
}