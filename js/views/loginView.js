export class View {
    constructor() {
        this.isFormSendEmail = false
        this.isFormSendPswd = false
    }

    elements = {
        formLogin: document.querySelector('.form__login'),
        inputAuth: document.querySelectorAll('.input__auth'),
        formLoginEmailArea: document.querySelector('.login__email-area'),
        formLoginPasswordArea: document.querySelector('.login__password-area'),
        formLoginEmail: document.querySelector('#email'),
        formLoginPassword: document.querySelector('#password'),
        formLoginPasswordShow: document.querySelector('#passsword-show'),
        formAuth: document.querySelector('.form__login-auth-btn'),
        formLoginError: document.querySelector('.form__login-error')
    }

    focusIfInputArea(inputArea) {
        const input = inputArea.querySelector('input')
        input.focus()
    }
    showPasswordClick() {
        this.elements.formLoginPassword.type = 'text'
        this.elements.formLoginPasswordShow.classList.add('active')
    }

    closePasswordClick() {
        this.elements.formLoginPassword.type = 'password'
        this.elements.formLoginPasswordShow.classList.remove('active')
    }

    catchEmailNotInputed(jsonValidateLoginForm) {
        if (!jsonValidateLoginForm.username) {
            this.elements.formLoginEmailArea.classList.add('input__login-error')
            this.elements.formLoginError.textContent = 'Укажите логин или почту'
            this.elements.formLoginError.classList.add('active')
            return true
        }
    }

    removeCatchInputEmailError() {
        if (this.isFormSendEmail) {
            this.elements.formLoginEmailArea.classList.remove('input__login-error')
            this.isFormSendEmail = false
            this.elements.formLoginError.classList.remove('active')
        }
    }

    catchPasswordNotInputed(jsonValidateLoginForm) {
        if (!jsonValidateLoginForm.password) {
            this.elements.formLoginPasswordArea.classList.add('input__login-error')
            this.elements.formLoginError.textContent = 'Укажите пароль'
            this.elements.formLoginError.classList.add('active')
            return true
        }
    }

    removeCatchInputPasswordError() {
        if (this.isFormSendPswd) {
            this.elements.formLoginPasswordArea.classList.remove('input__login-error')
            this.isFormSendEmail = false
            this.elements.formLoginError.classList.remove('active')
        }
    }

    catchLoginDataError(error) {
        let message 
        if (error.message === '401 Incorrect username') {
            message = 'Неправильный логин!'
            this.elements.formLoginEmailArea.classList.add('input__login-error')
        } else if (error.message === '401 Incorrect password') {
            this.elements.formLoginPasswordArea.classList.add('input__login-error')
            message =  'Неправильный пароль!'
        } else {
            console.error(error.message)
        }
        
        this.elements.formLoginError.classList.add('active')
        this.elements.formLoginError.textContent = message
    }
}