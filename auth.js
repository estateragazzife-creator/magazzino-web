// Cambio tab
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = e.target.getAttribute('data-tab');

    // Rimuovi active
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));

    // Aggiungi active
    document.getElementById(`tab-${tab}`).classList.add('active');
    e.target.classList.add('active');
  });
});