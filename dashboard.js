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
              <button class="btn-delete" onclick="apriModaleElimina('${item.id}', '${item.nome}')">Elimina</button>
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

function apriModaleElimina(id, nome) {
  document.getElementById("nome-oggetto-elimina").textContent = nome;
  document.getElementById("oggetto-id-elimina").value = id;
  document.getElementById("modal-elimina").style.display = "block";
}

document.getElementById("close-elimina").addEventListener("click", () => {
  document.getElementById("modal-elimina").style.display = "none";
});

document.getElementById("conferma-elimina").addEventListener("click", () => {
  const id = document.getElementById("oggetto-id-elimina").value;
  const motivo = document.getElementById("motivo-eliminazione").value;

  db.collection("magazzino").doc(id).delete().then(() => {
    showSuccess("Oggetto eliminato!");
    logAzione("Oggetto eliminato", `${document.getElementById("nome-oggetto-elimina").textContent} (${motivo || 'nessun motivo'})`);
    document.getElementById("modal-elimina").style.display = "none";
    loadMagazzino();
  }).catch(error => {
    showError("Errore eliminazione: " + error.message);
  });
});

window.onclick = (e) => {
  if (e.target === document.getElementById("modal-elimina")) {
    document.getElementById("modal-elimina").style.display = "none";
  }
};