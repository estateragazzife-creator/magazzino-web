(function() {
  function showNotification(message, type = 'info') {
    const container = document.createElement("div");
    container.classList.add("notification", `notification-${type}`);
    container.textContent = message;
    document.body.appendChild(container);

    setTimeout(() => {
      container.remove();
    }, 3000);
  }

  function showError(message) {
    showNotification(message, 'error');
  }

  function showSuccess(message) {
    showNotification(message, 'success');
  }

  function setLoading(element, isLoading) {
    if (isLoading) {
      element.innerHTML = '<div class="loading">Caricamento...</div>';
    }
  }

  // Genera PDF ODT
  function generaPDFODT(odtData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Ordine di Trasferimento", 20, 20);
    doc.setFontSize(12);
    doc.text(`Articolo: ${odtData.articolo}`, 20, 40);
    doc.text(`Quantità: ${odtData.qt}`, 20, 50);
    doc.text(`Da: ${odtData.sede_origine}`, 20, 60);
    doc.text(`A: ${odtData.sede_destinazione}`, 20, 70);
    doc.text(`Data: ${new Date().toLocaleString()}`, 20, 80);

    doc.save(`ODT_${odtData.id}.pdf`);
  }

  // Dark Mode Toggle
  document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    const body = document.body;
    const isDark = body.getAttribute("data-theme") === "dark";
    if (isDark) {
      body.removeAttribute("data-theme");
      document.getElementById("dark-mode-toggle").textContent = "🌙";
    } else {
      body.setAttribute("data-theme", "dark");
      document.getElementById("dark-mode-toggle").textContent = "☀️";
    }
  });

  // Scanner barcode
  document.getElementById("scanner-btn").addEventListener("click", () => {
    document.getElementById("scanner-container").style.display = "block";
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner-container')
      },
      decoder: {
        readers: ["code_128_reader", "ean_reader"]
      }
    }, (err) => {
      if (err) { console.log(err); return; }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      alert("Codice trovato: " + data.codeResult.code);
      document.getElementById("codice-articolo").value = data.codeResult.code;
      Quagga.stop();
      document.getElementById("scanner-container").style.display = "none";
    });
  });

  // Expose public functions
  app.showError = showError;
  app.showSuccess = showSuccess;
  app.setLoading = setLoading;
  app.generaPDFODT = generaPDFODT;
})();