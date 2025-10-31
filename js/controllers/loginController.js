import { Model } from '../models/loginModel.js'
import { View } from '../views/loginView.js'

const model = new Model()
const view = new View()

export function initController() {
    console.log('Test succesfull!')
    addEventListener()
}

function addEventListener() {
    view.elements.inputAuth.forEach((inputArea) => {
        inputArea.addEventListener('click', focusInputArea)
    })
    view.elements.formLoginPasswordShow.addEventListener('mousedown', showPassword)
    view.elements.formLoginPasswordShow.addEventListener('mouseup', closePassword)
    view.elements.formLoginEmail.addEventListener('input', removeErrorFromEmailLogin)
    view.elements.formLoginPassword.addEventListener('input', removeErrorFromInputPasswordLogin)    
    view.elements.formLogin.addEventListener('submit', handlingFormLogin)
    view.elements.formAuth.addEventListener('click', handlingFormAuth)
}

function focusInputArea(event) {
    const inputArea = event.currentTarget
    view.focusIfInputArea(inputArea)
}

function showPassword() {
    view.showPasswordClick()
}

function closePassword() {
    view.closePasswordClick()
}

function removeErrorFromEmailLogin() {
    view.removeCatchInputEmailError()
}

function removeErrorFromInputPasswordLogin() {
    view.removeCatchInputPasswordError()
}


async function handlingFormLogin(event) {
    event.preventDefault()

    view.isFormSendEmail = true
    view.isFormSendPswd = true
    const validatedLoginForm = model.serializeForm(this)
    const jsonValidateLoginForm = Object.fromEntries(validatedLoginForm.entries());

    if (view.catchEmailNotInputed(jsonValidateLoginForm)){
        return
    }

    if (view.catchPasswordNotInputed(jsonValidateLoginForm)){
        return
    }

    try {
        await model.token.loginn(validatedLoginForm)
    } catch (error) {
        view.catchLoginDataError(error)
        return
    }

    window.location.href = "http://127.0.0.1:5500/index.html"
}
function handlingFormAuth() {
    window.location.href = "http://127.0.0.1:5500/auth.html"
}

