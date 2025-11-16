// firma-digitale.js
let firmaCanvas = document.getElementById("firma-canvas");
let ctx = firmaCanvas.getContext("2d");
ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.strokeStyle = "#000";

let isDrawing = false;

firmaCanvas.addEventListener("mousedown", startDrawing);
firmaCanvas.addEventListener("mousemove", draw);
firmaCanvas.addEventListener("mouseup", stopDrawing);
firmaCanvas.addEventListener("mouseout", stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  [ctx.beginPath(), ctx.moveTo(e.offsetX, e.offsetY)];
}

function draw(e) {
  if (!isDrawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

document.getElementById("pulisci-firma").addEventListener("click", () => {
  ctx.clearRect(0, 0, firmaCanvas.width, firmaCanvas.height);
});

document.getElementById("conferma-firma").addEventListener("click", () => {
  const dataURL = firmaCanvas.toDataURL();
  logAzione("Firma digitale aggiunta", "Documento firmato");
  // Salva su DB se necessario: db.collection("firme").add({ dataURL, utente, timestamp });
  document.getElementById("modal-firma").style.display = "none";
  ctx.clearRect(0, 0, firmaCanvas.width, firmaCanvas.height);
});

document.getElementById("close-firma").addEventListener("click", () => {
  document.getElementById("modal-firma").style.display = "none";
  ctx.clearRect(0, 0, firmaCanvas.width, firmaCanvas.height);
});