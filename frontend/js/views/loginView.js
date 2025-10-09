export class View {
    constructor() {}

    elements = {
        formLogin: document.querySelector('.form__login'),
        formAuth: document.querySelector('.form__login-auth'),
        formLoginError: document.querySelector('.form__login-error')
    }
    
    showError(message) {
        this.elements.formLoginError.textContent = message
        this.elements.formLoginError.classList.remove('hidden')
    }

    catchLoginError(error) {
        if (error.message === '401 Incorrect username') {
            this.showError('Неправильный логин!')
        } else if (error.message === '401 Incorrect password') {
            this.showError('Неправильный пароль!')
        } else {
            console.error(error.message)
        }
    }
}