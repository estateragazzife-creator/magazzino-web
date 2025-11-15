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