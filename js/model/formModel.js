class FormModel {
    constructor() {
        this.emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }

    isValidEmail(email) {
        return this.emailPattern.test(email);
    }

    validate(formData) {
        let errors = {};

        if (!formData.nombre.trim()) errors.nombre = 'El nombre completo es obligatorio.';
        
        if (!formData.email.trim()) {
            errors.email = 'El correo electrónico es obligatorio.';
        } else if (!this.isValidEmail(formData.email.trim())) {
            errors.email = 'Formato de correo inválido.';
        }

        if (!formData.empresa.trim()) errors.empresa = 'El nombre de la empresa es obligatorio.';
        if (!formData.sector) errors.sector = 'Debes seleccionar un sector.';
        if (!formData.mensaje.trim()) errors.mensaje = 'El mensaje no puede estar vacío.';

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    async sendData() {
        // Simula la respuesta del servidor
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Math.random() >= 0.5);
            }, 3000);
        });
    }
}