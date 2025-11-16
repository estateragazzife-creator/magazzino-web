function esportaCSV() {
  const csv = [];
  csv.push(["Codice", "Nome", "Quantità", "Sede", "Categoria"]);

  db.collection("magazzino").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      csv.push([data.codice || "", data.nome, data.quantita, data.sede, data.categoria]);
    });

    const content = "data:text/csv;charset=utf-8," + csv.map(e => e.join(";")).join("\n");
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "magazzino_" + new Date().toISOString().slice(0,10) + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}