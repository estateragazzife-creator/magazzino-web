// Avvia un inventario ciclico
function avviaInventario() {
  const sede = prompt("Inserisci la sede per l'inventario:");
  if (!sede) return;

  db.collection("magazzino").where("sede", "==", sede).get().then(snapshot => {
    const inventario = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const qtaReale = prompt(`[${data.nome}] Quantità reale trovata? (teorico: ${data.quantita})`, data.quantita);
      if (qtaReale !== null) {
        inventario.push({
          id: doc.id,
          nome: data.nome,
          teorico: data.quantita,
          reale: parseInt(qtaReale) || 0,
          sede: data.sede,
          differenza: (parseInt(qtaReale) || 0) - data.quantita
        });
      }
    });

    // Mostra riepilogo
    let html = "<h4>Riepilogo inventario</h4><ul>";
    let aggiornamenti = [];

    inventario.forEach(item => {
      html += `<li><strong>${item.nome}</strong>: teorico=${item.teorico}, reale=${item.reale} → Δ=${item.differenza}</li>`;
      if (item.differenza !== 0) {
        aggiornamenti.push(
          db.collection("magazzino").doc(item.id).update({ quantita: item.reale })
        );
      }
    });
    html += "</ul>";

    // Salva su log
    logAzione("Inventario ciclico completato", `Sede: ${sede}, articoli: ${inventario.length}`);

    // Aggiorna DB
    Promise.all(aggiornamenti).then(() => {
      showSuccess("Inventario completato e stock aggiornato!");
      document.getElementById("tab-dashboard").innerHTML += html;
      loadMagazzino();
    });
  });
}