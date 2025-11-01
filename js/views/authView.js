const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export class View {
    constructor() {
        this.isFormSendEmail = false
        this.isFormSendFirstPswd = false
        this.isFormSendSecondPswd = false
        this.isIncorrectPasswords = false
    }

    elements = {
        formAuth: document.querySelector('.form__auth'),
        inputAuth: document.querySelectorAll('.input__auth'),
        formAuthEmailArea: document.querySelector('.input__email-area'),
        formAuthEmail: document.querySelector('.input__email'),
        formAuthPasswordsArea: document.querySelectorAll('.input__password-area'),
        formAuthPasswordAreaFirst: document.querySelector('.input__password-area-first'),
        formAuthPasswordAreaSecond: document.querySelector('.input__password-area-second'),
        formAuthPasswords: document.querySelectorAll('.input__password'),
        passwordAuthFirst: document.querySelector('#password-first'),
        passwordAuthSecond: document.querySelector('#password-second'),
        passwordAuthFirstShow: document.querySelector('#passsword-first-show'),
        passwordAuthSecondShow: document.querySelector('#password-second-show'),
        formAuthPasswordShow: document.querySelectorAll('.input__password-show'),
        formAuthError: document.querySelector('.form__auth-error'),
        formCode: document.querySelector('.form__code'),
        formCodeInput: document.querySelector('.input__code-text'),
        formCodeArea: document.querySelector('.input__code-area'),
        formCodeError: document.querySelector('.form__code-error'),
        formAuthLogin: document.querySelector('.form__auth-login')
    }

    focusIfInputArea(inputArea) {
        const input = inputArea.querySelector('input')
        input.focus()
    }

    catchEmailNotInputed(validatedAuthForm) {
        if (!validatedAuthForm.hasOwnProperty('email')) {
            this.elements.formAuthEmailArea.classList.add('input__auth-error')
            this.elements.formAuthError.textContent = 'Укажите почту'
            this.elements.formAuthError.classList.add('active')
            return true
        }
    }

    catchFilterEmailInput(email) {
        if (!EMAIL_REGEXP.test(email)) {
            this.elements.formAuthEmailArea.classList.add('input__auth-error')
            this.elements.formAuthError.textContent = 'Неправильный формат почты'
            this.elements.formAuthError.classList.add('active')
            return true
        }
    }

    catchNotUnqueEmailError(error) {
        if (error.status === 400) {
            this.elements.formAuthEmailArea.classList.add('input__auth-error')
            this.elements.formAuthError.textContent = 'Почта уже зарегистрирована'
            this.elements.formAuthError.classList.add('active')
        }
        console.error(error.message)
    }
    
    removeCatchInputEmailError() {
        if (this.isFormSendEmail) {
            this.elements.formAuthEmailArea.classList.remove('input__auth-error')
            this.isFormSendEmail = false
            this.elements.formAuthError.classList.remove('active')
        }
    }


    catchFirstPasswordNotInputed(validatedAuthForm) {
        if (!validatedAuthForm.hasOwnProperty('passwordFirst')) {
            this.elements.formAuthPasswordAreaFirst.classList.add('input__auth-error')
            this.elements.formAuthError.textContent = 'Пароль не указан'
            this.elements.formAuthError.classList.add('active')
            return true 
        }
    }

    removeCatchInputPasswordErrorFirst() {
        if (this.isFormSendFirstPswd) {
            this.elements.formAuthPasswordAreaFirst.classList.remove('input__auth-error')
            this.isFormSendFirstPswd = false
            this.elements.formAuthError.classList.remove('active')
        }
    }

    catchSecondPasswordNotInputed(validatedAuthForm) {
        if (!validatedAuthForm.hasOwnProperty('passwordSecond')) {
            this.elements.formAuthPasswordAreaSecond.classList.add('input__auth-error')
            this.elements.formAuthError.textContent = 'Повторный пароль не указан'
            this.elements.formAuthError.classList.add('active')
            return true 
        }
    }

    removeCatchInputPasswordErrorSecond() {
        if (this.isFormSendSecondPswd) {
            this.elements.formAuthPasswordAreaSecond.classList.remove('input__auth-error')
            this.isFormSendSecondPswd = false
            this.elements.formAuthError.classList.remove('active')
        }
    }

    catchPasswordMatches(isPasswordsMatch){
        if (!isPasswordsMatch) {
            this.elements.formAuthPasswordsArea.forEach(pswd => 
                pswd.classList.add('input__code-error')
            )
            this.elements.formAuthError.textContent = 'Пароли не совпадают'
            this.elements.formAuthError.classList.add('active')
            this.isIncorrectPasswords = true
            return true
        }
    }

    removeСatchPasswordMathes() {
        // console.log(this.isIncorrectPasswords)
        if (this.isIncorrectPasswords){
            this.elements.formAuthPasswordsArea.forEach(pswd => 
                pswd.classList.remove('input__code-error')
            )
            this.elements.formAuthError.classList.remove('active')            
            this.isIncorrectPasswords = false
        }
    }

    showPasswordClick(pswdShow) {
        if (pswdShow.dataset.password === 'first') {
            this.elements.passwordAuthFirst.type = 'text'
            this.elements.passwordAuthFirstShow.classList.add('active')
        }
        else {
            this.elements.passwordAuthSecond.type = 'text'
            this.elements.passwordAuthSecondShow.classList.add('active')
        }
    }

    closePasswordClick(pswdShow) {
        if (pswdShow.dataset.password === 'first') {
            this.elements.passwordAuthFirst.type = 'password'
            this.elements.passwordAuthFirstShow.classList.remove('active')
        }
        else {
            this.elements.passwordAuthSecond.type = 'password'     
            this.elements.passwordAuthSecondShow.classList.remove('active')
        }
    }

    changeFromAuthToCodeForm() {
        this.elements.formAuth.classList.add('hidden')
        this.elements.formCode.classList.remove('hidden')
        this.elements.formCodeInput.focus()
    }

    replaceInputCode(event) {
        const replacedCode = event.target.value.replace(/\D/g, '')
        event.target.value = replacedCode
        return replacedCode
    }

    catchCodeError(error, event) {
        this.elements.formCodeArea.classList.add('input__code-error')
        this.elements.formCodeError.classList.add('active')
        event.target.value = ''
        let msg
        if (error.status === 400) {
            msg = 'Неправильный проверочный код'
        } else if(error.status === 404) {
            msg = 'Пользователь уже создан. Попробуй заново зарегистироваться'
        } else {
            msg = 'Попробуй заново зарегистрироваться'
        }
        this.elements.formCodeError.textContent = msg
        console.error(error.message)
    }


    removeCatchCodeError(event) {
        this.elements.formCodeArea.classList.remove('input__code-error')
        this.elements.formCodeError.classList.remove('active')
        event.target.blur()
    }
}