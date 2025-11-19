/**
 *  Prerequisitos:
 *  - FORM - BTN
 *  - setTimeout
 *  - modal loading => .loading
 *  - modal éxito => .success
 *  - modal error => .error
 *  Proceso:
 *  1. USR ingresa datos
 *  2. USR hace un submit
 *  3. SYS muestra un cuadro de carga
 *  4. SYS oculta form
 *  5. SYS recibe respuesta del servidor
 *  5.1 RES es TRUE: SYS Muestra mensaje éxito
 *  5.2 RES es FALSE: SYS Muestra mensaje error
 */

$(document).ready(function() {
    let form = $('.contact-form');
    let loadingModal = $('.loading-modal');
    let successModal = $('.success-modal');
    let errorModal = $('.error-modal');

    form.on('submit', function(event) {
        event.preventDefault();
        
        // Ocultar formulario y mostrar pantalla de carga
        form.hide();
        loadingModal.show();

        // Simular tiempo de carga (3 segundos)
        setTimeout(function() {
            // Ocultar pantalla de carga
            loadingModal.hide();
            
            // Generar resultado aleatorio (true/false)
            const isSuccess = Math.random() >= 0.5;
            
            // Mostrar modal según el resultado
            if (isSuccess) {
                successModal.show();
            } else {
                errorModal.show();
            }
            
            // Ocultar mensaje después de 2 segundos
            setTimeout(function() {
                successModal.hide();
                errorModal.hide();
                form.trigger('reset');
                form.show(); // Mostrar formulario nuevamente
            }, 2000);
            
        }, 3000);
    });
});