(function() {
  function loadODT() {
    db.collection("odt").orderBy("timestamp", "desc").get().then((snapshot) => {
      let html = "<ul>";
      snapshot.forEach(doc => {
        const data = doc.data();
        html += `<li>${data.articolo} - Qt: ${data.qt} | ${data.sede_origine} → ${data.sede_destinazione} | Stato: ${data.stato} <button onclick="app.stampaODT('${doc.id}', '${data.articolo}', ${data.qt}, '${data.sede_origine}', '${data.sede_destinazione}')">Stampa</button></li>`;
      });
      html += "</ul>";
      document.getElementById("lista-odt").innerHTML = html;
    });
  }

  function stampaODT(id, articolo, qt, origine, destinazione) {
    app.generaPDFODT({ id, articolo, qt, sede_origine: origine, sede_destinazione: destinazione });
  }

  async function loadStockManagementUI() {
    const articoliSelect = document.getElementById("articolo-odt");
    const origineSelect = document.getElementById("sede-origine-odt");
    const destinazioneSelect = document.getElementById("sede-destinazione-odt");

    // Pulisce le opzioni esistenti
    articoliSelect.innerHTML = '<option value="">Seleziona articolo</option>';
    origineSelect.innerHTML = '<option value="">Seleziona sede di origine</option>';
    destinazioneSelect.innerHTML = '<option value="">Seleziona sede di destinazione</option>';

    // Carica articoli
    try {
      const articoliSnapshot = await db.collection("articoli").get();
      articoliSnapshot.forEach(doc => {
        const articolo = doc.data();
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `${articolo.codice} - ${articolo.descrizione}`;
        option.dataset.nome = articolo.descrizione;
        articoliSelect.appendChild(option);
      });
    } catch (error) {
      app.showError("Errore nel caricamento degli articoli.");
      console.error(error);
    }

    // Carica sedi
    try {
      const sediSnapshot = await db.collection("sedi").get();
      sediSnapshot.forEach(doc => {
        const sede = doc.data();
        const optionOrigine = document.createElement('option');
        optionOrigine.value = sede.nome;
        optionOrigine.textContent = sede.nome;
        origineSelect.appendChild(optionOrigine);

        const optionDestinazione = document.createElement('option');
        optionDestinazione.value = sede.nome;
        optionDestinazione.textContent = sede.nome;
        destinazioneSelect.appendChild(optionDestinazione);
      });
    } catch (error) {
      app.showError("Errore nel caricamento delle sedi.");
      console.error(error);
    }
  }


  document.getElementById("aggiungi-odt").addEventListener("submit", async (e) => {
    e.preventDefault();

    const articoloSelect = document.getElementById("articolo-odt");
    const articoloId = articoloSelect.value;
    const articoloNome = articoloSelect.options[articoloSelect.selectedIndex].dataset.nome;
    const qt = parseInt(document.getElementById("qt-odt").value);
    const origine = document.getElementById("sede-origine-odt").value;
    const destinazione = document.getElementById("sede-destinazione-odt").value;

    if (origine === destinazione) {
      app.showError("La sede di origine e destinazione non possono coincidere.");
      return;
    }

    if (qt <= 0) {
      app.showError("La quantità deve essere maggiore di zero.");
      return;
    }

    const magazzinoRef = db.collection("magazzino");
    const origineQuery = magazzinoRef.where("articolo_id", "==", articoloId).where("sede", "==", origine);
    const destinazioneQuery = magazzinoRef.where("articolo_id", "==", articoloId).where("sede", "==", destinazione);

    try {
      await db.runTransaction(async (transaction) => {
        const origineSnapshot = await transaction.get(origineQuery);
        
        if (origineSnapshot.empty) {
          throw new Error(`Nessun magazzino trovato per l'articolo ${articoloNome} nella sede ${origine}.`);
        }

        const origineDoc = origineSnapshot.docs[0];
        const origineData = origineDoc.data();

        if (origineData.quantita < qt) {
          throw new Error(`Quantità insufficiente. Disponibili: ${origineData.quantita}, Richiesti: ${qt}`);
        }

        // Decrementa la quantità dalla sede di origine
        transaction.update(origineDoc.ref, { quantita: origineData.quantita - qt });

        // Incrementa la quantità nella sede di destinazione
        const destinazioneSnapshot = await transaction.get(destinazioneQuery);
        if (destinazioneSnapshot.empty) {
          // Se l'articolo non esiste nella sede di destinazione, crea un nuovo documento
          const nuovoArticoloInDestinazioneRef = magazzinoRef.doc(); // Crea un nuovo documento con ID autogenerato
          transaction.set(nuovoArticoloInDestinazioneRef, {
            articolo_id: articoloId,
            nome: articoloNome,
            quantita: qt,
            sede: destinazione,
            categoria: origineData.categoria, // Assumiamo che la categoria sia la stessa
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        } else {
          // Se l'articolo esiste, aggiorna la quantità
          const destinazioneDoc = destinazioneSnapshot.docs[0];
          const destinazioneData = destinazioneDoc.data();
          transaction.update(destinazioneDoc.ref, { quantita: destinazioneData.quantita + qt });
        }

        // Crea il documento ODT
        const odtRef = db.collection("odt").doc();
        transaction.set(odtRef, {
          articolo_id: articoloId,
          articolo: articoloNome,
          qt,
          sede_origine: origine,
          sede_destinazione: destinazione,
          stato: "creato",
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      });

      app.showSuccess("ODT creato e magazzino aggiornato con successo!");
      app.logAzione("ODT creato", `${articoloNome} (${qt}) da ${origine} a ${destinazione}`);
      document.getElementById("aggiungi-odt").reset();
      loadODT();
      app.loadMagazzino(); // Aggiorna la vista del magazzino
    } catch (error) {
      app.showError(`Errore nella creazione dell'ODT: ${error.message}`);
      console.error("Errore transazione ODT: ", error);
    }
  });

  app.stampaODT = stampaODT;
  app.loadODT = loadODT;
  app.loadStockManagementUI = loadStockManagementUI;
})();