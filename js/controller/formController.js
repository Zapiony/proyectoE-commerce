class FormController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.view.form.on('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const data = this.view.getFormData();
        const validation = this.model.validate(data);

        if (!validation.isValid) {
            this.view.showErrors(validation.errors);
            return;
        }

        this.view.showLoading();
        
        const result = await this.model.sendData();
        
        this.view.hideLoading();
        this.view.showStatus(result);
    }
}

$(document).ready(() => {
    const app = new FormController(new FormModel(), new FormView());
});