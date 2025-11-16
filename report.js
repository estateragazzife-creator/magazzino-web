(function() {
  function loadReport() {
    const ctx = document.getElementById("grafico-giacenze").getContext("2d");

    db.collection("magazzino").get().then((snapshot) => {
      const sedi = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        if (sedi[data.sede]) {
          sedi[data.sede] += data.quantita;
        } else {
          sedi[data.sede] = data.quantita;
        }
      });

      const labels = Object.keys(sedi);
      const values = Object.values(sedi);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Quantità per sede',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
    });
  }

  app.loadReport = loadReport;
})();