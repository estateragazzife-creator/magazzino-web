(function() {
  function loadStoricoApparati() {
    db.collection("storico_apparati").orderBy("timestamp", "desc").get().then((snapshot) => {
      let html = "<ul>";
      snapshot.forEach(doc => {
        const data = doc.data();
        html += `<li>${data.matricola} - ${data.azione} (${data.da} → ${data.a}) | ${data.timestamp.toDate().toLocaleString()}</li>`;
      });
      html += "</ul>";
      document.getElementById("storico-apparati").innerHTML = html;
    });
  }

  function registraSpostamento(matricola, da, a) {
    db.collection("storico_apparati").add({
      matricola,
      azione: "spostamento",
      da,
      a,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  app.loadStoricoApparati = loadStoricoApparati;
  app.registraSpostamento = registraSpostamento;
})();