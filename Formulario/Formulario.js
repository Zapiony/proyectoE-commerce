document.getElementById('contact-form').addEventListener('submit', function(event) {
    // Previene el envío por defecto del formulario (evita la recarga de la página)
    event.preventDefault();

    // Obtiene la referencia a la ventana modal de éxito
    const modal = document.getElementById('success-modal');

    // Muestra la ventana modal (asumiendo que Formulario.css la oculta por defecto)
    modal.style.display = 'flex';

    // Configura un temporizador para ocultar la modal y resetear el formulario después de 3 segundos
    setTimeout(() => {
        modal.style.display = 'none'; // Oculta la modal
        this.reset(); // Limpia todos los campos del formulario
    }, 3000); // 3000 milisegundos = 3 segundos
});