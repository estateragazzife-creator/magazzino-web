function loadMagazzino(filtro = {}) {
  const magazzinoDiv = document.getElementById("lista-magazzino");
  setLoading(magazzinoDiv, true);

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
        <div class="social-card">
          <div class="card-header">
            <div class="card-title">${item.nome}</div>
            <div class="actions">
              <button class="btn-edit" onclick="apriModale('${item.id}', '${item.nome}', ${item.quantita}, '${item.sede}', '${item.categoria}')">Modifica</button>
              <button class="btn-delete" onclick="eliminaOggetto('${item.id}', '${item.nome}')">Elimina</button>
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
    showError("Errore caricamento magazzino: " + error.message);
  });
}

function apriModale(id, nome, qt, sede, categoria) {
  document.getElementById("oggetto-id").value = id;
  document.getElementById("mod-nome").value = nome;
  document.getElementById("mod-quantita").value = qt;
  document.getElementById("mod-sede").value = sede;
  document.getElementById("mod-categoria").value = categoria;

  document.getElementById("modal-modifica").style.display = "block";
}

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("modal-modifica").style.display = "none";
});

document.getElementById("form-modifica").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("oggetto-id").value;
  const nome = document.getElementById("mod-nome").value;
  const qt = parseInt(document.getElementById("mod-quantita").value);
  const sede = document.getElementById("mod-sede").value;
  const categoria = document.getElementById("mod-categoria").value;

  db.collection("magazzino").doc(id).update({
    nome,
    quantita: qt,
    sede,
    categoria
  }).then(() => {
    showSuccess("Oggetto modificato!");
    logAzione("Oggetto modificato", `${nome}`);
    document.getElementById("modal-modifica").style.display = "none";
    loadMagazzino();
  }).catch(error => {
    showError("Errore modifica: " + error.message);
  });
});

window.onclick = (e) => {
  const modal = document.getElementById("modal-modifica");
  if (e.target === modal) {
    modal.style.display = "none";
  }
};