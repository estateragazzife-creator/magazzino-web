(function() {
  function loadMagazzino(filtro = {}) {
    const magazzinoDiv = document.getElementById("lista-magazzino");
    app.setLoading(magazzinoDiv, true);

    let query = db.collection("magazzino").orderBy("nome");

    if (filtro.sede && filtro.sede !== "") {
      query = query.where("sede", "==", filtro.sede);
    }

    query.get().then((snapshot) => {
      let html = "";
      let items = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data
        });
      });

      if (filtro.nome) {
        items = items.filter(item => item.nome.toLowerCase().includes(filtro.nome.toLowerCase()));
      }

      items.forEach(item => {
        const data = item.timestamp ? item.timestamp.toDate().toLocaleString() : "N/A";
        html += `
          <div class="social-card" data-id="${item.id}" data-nome="${item.nome}" data-quantita="${item.quantita}" data-sede="${item.sede}" data-categoria="${item.categoria}">
            <div class="card-header">
              <div class="card-title">${item.nome}</div>
              <div class="actions">
                <button class="btn-edit">Modifica</button>
                <button class="btn-delete">Elimina</button>
              </div>
            </div>
            <div class="card-info">
              <p>Quantità: <strong>${item.quantita}</strong></p>
              <p>Sede: <strong>${item.sede}</strong></p>
              <p>Categoria: <strong>${item.categoria}</strong></p>
              <p>Data: ${data}</p>
            </div>
          </div>
        `;
      });

      magazzinoDiv.innerHTML = html;
    }).catch(error => {
      app.showError("Errore caricamento magazzino: " + error.message);
    });
  }

  function apriModale(id, nome, quantita, sede, categoria) {
    document.getElementById("oggetto-id").value = id;
    document.getElementById("mod-nome").value = nome;
    document.getElementById("mod-quantita").value = quantita;
    document.getElementById("mod-sede").value = sede;
    document.getElementById("mod-categoria").value = categoria;
    document.getElementById("modal-modifica").style.display = "block";
  }

  function apriModaleElimina(id, nome) {
    document.getElementById("nome-oggetto-elimina").textContent = nome;
    document.getElementById("oggetto-id-elimina").value = id;
    document.getElementById("modal-elimina").style.display = "block";
  }

  document.getElementById("lista-magazzino").addEventListener("click", (e) => {
    const target = e.target;
    const card = target.closest(".social-card");
    if (!card) return;

    const id = card.dataset.id;
    const nome = card.dataset.nome;

    if (target.classList.contains("btn-edit")) {
      const quantita = card.dataset.quantita;
      const sede = card.dataset.sede;
      const categoria = card.dataset.categoria;
      apriModale(id, nome, quantita, sede, categoria); 
    } else if (target.classList.contains("btn-delete")) {
      apriModaleElimina(id, nome);
    }
  });

  document.getElementById("close-elimina").addEventListener("click", () => {
    document.getElementById("modal-elimina").style.display = "none";
  });
  
  document.querySelector("#modal-modifica .close").addEventListener("click", () => {
    document.getElementById("modal-modifica").style.display = "none";
  });

  document.getElementById("form-modifica").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("oggetto-id").value;
    const nome = document.getElementById("mod-nome").value;
    const quantita = parseInt(document.getElementById("mod-quantita").value);
    const sede = document.getElementById("mod-sede").value;
    const categoria = document.getElementById("mod-categoria").value;

    db.collection("magazzino").doc(id).update({
      nome,
      quantita,
      sede,
      categoria
    }).then(() => {
      app.showSuccess("Oggetto modificato con successo!");
      document.getElementById("modal-modifica").style.display = "none";
      loadMagazzino();
    }).catch(error => {
      app.showError("Errore durante la modifica: " + error.message);
    });
  });

  document.getElementById("conferma-elimina").addEventListener("click", () => {
    const id = document.getElementById("oggetto-id-elimina").value;
    const motivo = document.getElementById("motivo-eliminazione").value;

    db.collection("magazzino").doc(id).delete().then(() => {
      app.showSuccess("Oggetto eliminato!");
      app.logAzione("Oggetto eliminato", `${document.getElementById("nome-oggetto-elimina").textContent} (${motivo || 'nessun motivo'})`);
      document.getElementById("modal-elimina").style.display = "none";
      loadMagazzino();
    }).catch(error => {
      app.showError("Errore eliminazione: " + error.message);
    });
  });

  window.onclick = (e) => {
    if (e.target === document.getElementById("modal-elimina") || e.target === document.getElementById("modal-modifica")) {
      document.getElementById("modal-elimina").style.display = "none";
      document.getElementById("modal-modifica").style.display = "none";
    }
  };

  app.loadMagazzino = loadMagazzino;
  app.apriModale = apriModale;
  app.apriModaleElimina = apriModaleElimina;
})();