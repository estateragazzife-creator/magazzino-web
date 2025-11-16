// Imposta soglia minima su un articolo
function impostaSoglia(articoloId, soglia) {
  db.collection("magazzino").doc(articoloId).update({
    soglia_minima: soglia
  }).then(() => {
    logAzione("Soglia minima impostata", `Articolo ID: ${articoloId}, soglia: ${soglia}`);
    controllaStockBasso(); // verifica subito
  });
}

// Verifica automaticamente lo stock basso
function controllaStockBasso() {
  db.collection("magazzino").where("soglia_minima", ">", 0).get().then(snapshot => {
    let alertAttivi = false;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.quantita < data.soglia_minima) {
        showError(`⚠️ Stock basso: ${data.nome} (${data.quantita} < ${data.soglia_minima})`);
        alertAttivi = true;
      }
    });
    if (alertAttivi) {
      logAzione("Alert stock basso", "Uno o più articoli sotto soglia");
    }
  });
}

// Controlla ogni volta che si carica la pagina
window.addEventListener("load", controllaStockBasso);