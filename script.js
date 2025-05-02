// Funcion para hacer los cambios de seccion en la pagina al hacerles "click"
function showSection(id) {
    document.querySelectorAll('section').forEach(sec => {
      sec.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  }