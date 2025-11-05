// Scripts gerais da aplicação
console.log('Pousada Paraíso - Sistema carregado');

// Fechar alerts automaticamente após 5 segundos
document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.alert-success');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.display = 'none';
    }, 5000);
  });
});
