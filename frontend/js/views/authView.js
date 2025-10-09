export class View {
    constructor() {}

    elements = {
        formAuth: document.querySelector('.form__auth'),
        formLogin: document.querySelector('.form__auth-login'),
        formCode: document.querySelector('.form__code'),
        formAuthError: document.querySelector('.form__auth-error'),
        formCodeError: document.querySelector('.form__code-error')
    }

    catchEmailError(error) {
        if (error.status === 400) {
            this.elements.formAuthError.classList.remove('hidden')
        }
        console.error(error.message)
    }

    changeFromAuthToCodeForm() {
        this.elements.formAuth.classList.add('hidden')
        this.elements.formCode.classList.remove('hidden')
    }

    catchCodeError(error) {
        if (error.status === 400) {
            this.elements.formCodeError.classList.remove('hidden')
        }
        console.error(error.message)

    }
}