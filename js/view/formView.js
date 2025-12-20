class FormView {
    constructor() {
        this.form = $('.contact-form');
        this.loadingModal = new bootstrap.Modal(document.getElementById('loading-modal'));
        this.successModal = new bootstrap.Modal(document.getElementById('success-modal'));
        this.errorModal = new bootstrap.Modal(document.getElementById('error-modal'));
    }

    getFormData() {
        return {
            nombre: $('input[name="nombre"]').val(),
            email: $('input[name="email"]').val(),
            empresa: $('input[name="empresa"]').val(),
            sector: $('#sector').val(),
            mensaje: $('#mensaje').val()
        };
    }

    showErrors(errors) {
        this.clearErrors();
        for (let field in errors) {
            let element = $(`[name="${field}"], #${field}`);
            element.addClass('is-invalid');
            element.siblings('.invalid-feedback').text(errors[field]);
        }
    }

    clearErrors() {
        this.form.find('.form-control, .form-select').removeClass('is-invalid');
    }

    showLoading() {
        this.form.hide();
        this.loadingModal.show();
    }

    hideLoading() {
        this.loadingModal.hide();
    }

    showStatus(isSuccess) {
        if (isSuccess) {
            this.successModal.show();
        } else {
            this.errorModal.show();
        }

        setTimeout(() => {
            this.successModal.hide();
            this.errorModal.hide();
            this.resetForm();
        }, 2000);
    }

    resetForm() {
        this.form.trigger('reset');
        this.clearErrors();
        this.form.show();
    }
}