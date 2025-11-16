(function() {
  function createListItem(data, type) {
    switch (type) {
      case 'sedi':
        return `<li>${data.nome} - ${data.indirizzo} (${data.responsabile})</li>`;
      case 'articoli':
        return `<li>${data.codice} - ${data.descrizione} (${data.categoria})</li>`;
      case 'apparati':
        return `<li>${data.matricola} - ${data.tipo} (${data.stato}) - Sede: ${data.sede_corrente}</li>`;
      default:
        return '';
    }
  }

  function loadAnagrafica(collectionName, listElementId) {
    db.collection(collectionName).get().then((snapshot) => {
      let html = "<ul>";
      snapshot.forEach(doc => {
        html += createListItem(doc.data(), collectionName);
      });
      html += "</ul>";
      document.getElementById(listElementId).innerHTML = html;
    });
  }

  function loadSedi() {
    loadAnagrafica("sedi", "lista-sedi");
  }

  function loadArticoli() {
    loadAnagrafica("articoli", "lista-articoli");
  }

  function loadApparati() {
    loadAnagrafica("apparati", "lista-apparati");
  }

  function setupFormListener(formId, collectionName, getFormData, getLogDetails) {
    document.getElementById(formId).addEventListener("submit", (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data) return;

      db.collection(collectionName).add(data).then(() => {
        app.showSuccess(`${collectionName.slice(0, -1)} aggiunto/a!`);
        app.logAzione(`${collectionName.slice(0, -1)} aggiunto/a`, getLogDetails(data));
        document.getElementById(formId).reset();
        // Ricarica la lista specifica
        window.app[`load${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`]();
      }).catch(err => app.showError(err.message));
    });
  }

  setupFormListener("aggiungi-sede", "sedi", () => {
    const nome = document.getElementById("nome-sede").value;
    const indirizzo = document.getElementById("indirizzo-sede").value;
    const responsabile = document.getElementById("responsabile-sede").value;
    if (!nome || !indirizzo) return null;
    return { nome, indirizzo, responsabile };
  }, data => data.nome);

  setupFormListener("aggiungi-articolo", "articoli", () => {
    const codice = document.getElementById("codice-articolo").value;
    const descrizione = document.getElementById("descrizione-articolo").value;
    const categoria = document.getElementById("categoria-articolo").value;
    const um = document.getElementById("um-articolo").value;
    const foto = document.getElementById("foto-articolo").value;
    if (!codice || !descrizione) return null;
    return { codice, descrizione, categoria, um, foto };
  }, data => `${data.codice} - ${data.descrizione}`);

  setupFormListener("aggiungi-apparato", "apparati", () => {
    const matricola = document.getElementById("matricola-apparato").value;
    const tipo = document.getElementById("tipo-apparato").value;
    const sede = document.getElementById("sede-apparato").value;
    const stato = document.getElementById("stato-apparato").value;
    if (!matricola || !tipo) return null;
    return { matricola, tipo, sede_corrente: sede, stato };
  }, data => `${data.matricola} - ${data.tipo}`);

  // Event listeners per i tab delle anagrafiche
  document.querySelector('.anagrafiche-tabs').addEventListener('click', (e) => {
    if (!e.target.matches('.tab-btn')) return;

    const anag = e.target.getAttribute('data-anag');

    document.querySelectorAll('.anag-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.anagrafiche-tabs .tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`anag-${anag}`).classList.add('active');
    e.target.classList.add('active');
  });


  app.loadSedi = loadSedi;
  app.loadArticoli = loadArticoli;
  app.loadApparati = loadApparati;
})();