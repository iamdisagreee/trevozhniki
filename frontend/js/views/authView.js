export class View {
    constructor() {}

    elements = {
        formAuth: document.querySelector('.form__auth'),
        formLogin: document.querySelector('.form__auth-login'),
        formCode: document.querySelector('.form__code'),
        formAuthError: document.querySelector('.form__auth-error')
    }

    catchEmailError(error) {
        if (error.status === 400) {
            formAuthError.classList.remove('hidden')
        }
        else {
            console.log(error.message)
        }
    }
}