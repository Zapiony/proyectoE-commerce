class FormView {
    constructor() {
        this.form = $('.contact-form');
        this.loadingModalElement = document.getElementById('loading-modal');
        this.successModalElement = document.getElementById('success-modal');
        this.errorModalElement = document.getElementById('error-modal');
        
        this.loadingModal = new bootstrap.Modal(this.loadingModalElement, { backdrop: 'static', keyboard: false });
        this.successModal = new bootstrap.Modal(this.successModalElement);
        this.errorModal = new bootstrap.Modal(this.errorModalElement);
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
        this.loadingModal.show();
    }

    hideLoading() {
        this.loadingModal.hide();
    }

    showStatus(isSuccess) {
        if (isSuccess) {
            this.successModal.show();
            setTimeout(() => {
                this.successModal.hide();
                this.resetForm();
            }, 3000);
        } else {
            this.errorModal.show();
            setTimeout(() => {
                this.errorModal.hide();
            }, 3000);
        }
    }

    resetForm() {
        this.form.trigger('reset');
        this.clearErrors();
    }
}