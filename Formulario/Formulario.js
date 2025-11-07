document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario


    let form_ele = $("#imput_group");
    let seccion = form_ele.find(".seccion");

    if (seccion.val() === "" || seccion.val() == null) {
        alert(" Error: El campo 'sección' está vacío.");
        return;
    }

    // Si pasa la validación, muestra el modal
    const modal = document.getElementById('success-modal');
    modal.style.display = 'flex';

    // Oculta el modal y limpia el formulario después de 3 segundos
    setTimeout(() => {
        modal.style.display = 'none';
        form_ele[0].reset(); // Limpia los campos (con jQuery)
    }, 3000);
});
