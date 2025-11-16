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