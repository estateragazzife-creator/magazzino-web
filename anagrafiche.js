// Sedi
function loadSedi() {
  db.collection("sedi").get().then((snapshot) => {
    let html = "<ul>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li>${data.nome} - ${data.indirizzo} (${data.responsabile})</li>`;
    });
    html += "</ul>";
    document.getElementById("lista-sedi").innerHTML = html;
  });
}

document.getElementById("aggiungi-sede").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome-sede").value;
  const indirizzo = document.getElementById("indirizzo-sede").value;
  const responsabile = document.getElementById("responsabile-sede").value;

  db.collection("sedi").add({ nome, indirizzo, responsabile }).then(() => {
    showSuccess("Sede aggiunta!");
    logAzione("Sede aggiunta", nome);
    document.getElementById("aggiungi-sede").reset();
    loadSedi();
  });
});

// Articoli
function loadArticoli() {
  db.collection("articoli").get().then((snapshot) => {
    let html = "<ul>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li>${data.codice} - ${data.descrizione} (${data.categoria})</li>`;
    });
    html += "</ul>";
    document.getElementById("lista-articoli").innerHTML = html;
  });
}

document.getElementById("aggiungi-articolo").addEventListener("submit", (e) => {
  e.preventDefault();
  const codice = document.getElementById("codice-articolo").value;
  const descrizione = document.getElementById("descrizione-articolo").value;
  const categoria = document.getElementById("categoria-articolo").value;
  const um = document.getElementById("um-articolo").value;
  const foto = document.getElementById("foto-articolo").value;

  db.collection("articoli").add({ codice, descrizione, categoria, um, foto }).then(() => {
    showSuccess("Articolo aggiunto!");
    logAzione("Articolo aggiunto", `${codice} - ${descrizione}`);
    document.getElementById("aggiungi-articolo").reset();
    loadArticoli();
  });
});

// Apparati
function loadApparati() {
  db.collection("apparati").get().then((snapshot) => {
    let html = "<ul>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li>${data.matricola} - ${data.tipo} (${data.stato}) - Sede: ${data.sede_corrente}</li>`;
    });
    html += "</ul>";
    document.getElementById("lista-apparati").innerHTML = html;
  });
}

document.getElementById("aggiungi-apparato").addEventListener("submit", (e) => {
  e.preventDefault();
  const matricola = document.getElementById("matricola-apparato").value;
  const tipo = document.getElementById("tipo-apparato").value;
  const sede = document.getElementById("sede-apparato").value;
  const stato = document.getElementById("stato-apparato").value;

  db.collection("apparati").add({ matricola, tipo, sede_corrente: sede, stato }).then(() => {
    showSuccess("Apparato aggiunto!");
    logAzione("Apparato aggiunto", `${matricola} - ${tipo}`);
    document.getElementById("aggiungi-apparato").reset();
    loadApparati();
  });
});