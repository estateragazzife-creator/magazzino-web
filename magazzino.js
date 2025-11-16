(function() {
  function loadMagazzino(filtro = {}) {
    const magazzinoDiv = document.getElementById("lista-magazzino");
    app.setLoading(magazzinoDiv, true);

    let query = db.collection("magazzino").orderBy("nome");

    if (filtro.nome) {
      // Nota: Firestore non supporta ricerche parziali con `where` su testo libero.
      // Per ora, filtriamo in memoria. Per grandi quantità, usa una funzione Cloud.
    }
    if (filtro.sede && filtro.sede !== "") {
      query = query.where("sede", "==", filtro.sede);
    }

    query.get().then((snapshot) => {
      let html = "<ul>";
      let items = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data
        });
      });

      // Filtra per nome in memoria
      if (filtro.nome) {
        items = items.filter(item => item.nome.toLowerCase().includes(filtro.nome.toLowerCase()));
      }

      items.forEach(item => {
        html += `<li><strong>${item.nome}</strong> - Qt: ${item.quantita} (${item.sede})</li>`;
      });

      html += "</ul>";
      magazzinoDiv.innerHTML = html;
    }).catch(error => {
      app.showError("Errore caricamento magazzino: " + error.message);
    });
  }

  // Eventi per ricerca
  document.getElementById("filtro-nome").addEventListener("input", () => {
    const nome = document.getElementById("filtro-nome").value;
    const sede = document.getElementById("filtro-sede").value;
    loadMagazzino({ nome, sede });
  });

  document.getElementById("filtro-sede").addEventListener("change", () => {
    const nome = document.getElementById("filtro-nome").value;
    const sede = document.getElementById("filtro-sede").value;
    loadMagazzino({ nome, sede });
  });

  document.getElementById("aggiungi-oggetto").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome-oggetto").value;
    const qt = parseInt(document.getElementById("quantita").value);
    const sede = document.getElementById("sede").value;

    if (!nome || qt <= 0) {
      app.showError("Nome e quantità sono obbligatori.");
      return;
    }

    db.collection("magazzino").add({
      nome,
      quantita: qt,
      sede,
      categoria: "varie",
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      app.showSuccess("Oggetto aggiunto!");
      app.logAzione("Aggiunto oggetto", `${nome} (${qt}) in ${sede}`);
      document.getElementById("aggiungi-oggetto").reset();
      loadMagazzino();
    }).catch(error => {
      app.showError("Errore aggiunta oggetto: " + error.message);
    });
  });

  app.loadMagazzino = loadMagazzino;
})();