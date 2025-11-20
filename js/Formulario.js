/**
 * Prerequisitos:
 * - FORM - BTN
 * - setTimeout
 * - modal loading => .loading
 * - modal éxito => .success
 * - modal error => .error
 * Proceso:
 * 1. USR ingresa datos
 * 2. USR hace un submit
 * 3. SYS muestra un cuadro de carga
 * 4. SYS oculta form
 * 5. SYS recibe respuesta del servidor
 * 5.1 RES es TRUE: SYS Muestra mensaje éxito
 * 5.2 RES es FALSE: SYS Muestra mensaje error
 */

$(document).ready(function() {
    let form = $('.contact-form');
    let loadingModal = new bootstrap.Modal(document.getElementById('loading-modal'));
    let successModal = new bootstrap.Modal(document.getElementById('success-modal'));
    let errorModal = new bootstrap.Modal(document.getElementById('error-modal'));

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function validateForm() {
        let isValid = true;

        form.find('.form-control, .form-select').removeClass('is-invalid');
        form.find('.invalid-feedback').text('');

        if ($('input[name="nombre"]').val().trim() === '') {
            $('input[name="nombre"]').addClass('is-invalid');
            $('input[name="nombre"]').siblings('.invalid-feedback').text('El nombre completo es obligatorio.');
            isValid = false;
        }

        const emailField = $('input[name="email"]');
        if (emailField.val().trim() === '') {
            emailField.addClass('is-invalid');
            emailField.siblings('.invalid-feedback').text('El correo electrónico es obligatorio.');
            isValid = false;
        } else if (!isValidEmail(emailField.val().trim())) {
            emailField.addClass('is-invalid');
            emailField.siblings('.invalid-feedback').text('Por favor, introduce un formato de correo válido (ej: usuario@dominio.com).');
            isValid = false;
        }

        if ($('input[name="empresa"]').val().trim() === '') {
            $('input[name="empresa"]').addClass('is-invalid');
            $('input[name="empresa"]').siblings('.invalid-feedback').text('El nombre de la empresa es obligatorio.');
            isValid = false;
        }

        if ($('#sector').val() === null || $('#sector').val() === '') {
            $('#sector').addClass('is-invalid');
            $('#sector').siblings('.invalid-feedback').text('Debes seleccionar una industria o sector.');
            isValid = false;
        }

        if ($('#mensaje').val().trim() === '') {
            $('#mensaje').addClass('is-invalid');
            $('#mensaje').siblings('.invalid-feedback').text('El mensaje no puede estar vacío.');
            isValid = false;
        }
        
        return isValid;
    }

    form.on('submit', function(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        form.hide();
        loadingModal.show();

        setTimeout(function() {
            loadingModal.hide();
            
            const isSuccess = Math.random() >= 0.5;
            
            if (isSuccess) {
                successModal.show();
            } else {
                errorModal.show();
            }
            
            setTimeout(function() {
                successModal.hide();
                errorModal.hide();
                form.trigger('reset');
                
                form.find('.form-control, .form-select').removeClass('is-invalid is-valid');

                form.show();
            }, 2000);
            
        }, 3000);
    });
});