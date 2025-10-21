document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const modal = document.getElementById('success-modal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.display = 'none';
        this.reset();
    }, 3000);
});