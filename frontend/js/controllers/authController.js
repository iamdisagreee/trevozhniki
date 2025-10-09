import { Model } from '../models/authModel.js'
import { View } from '../views/authView.js'

const model = new Model()
const view = new View()


export function initController() {
    console.log('Test succesfull!')
    addEventListener()
}

function addEventListener() {
    view.elements.formAuth.addEventListener('submit', handlingFormAuth)
    view.elements.formCode.addEventListener('submit', handlingFormCode)
    view.elements.formLogin.addEventListener('click', redirectToLogin)
}

async function handlingFormAuth(event) {
    event.preventDefault()

    const validatedAuthForm = model.serializeForm(this)
    const toValidateEmail = {'email': validatedAuthForm.email}

    try {
        await model.validatedAuthForm(toValidateEmail)
    } catch (error) {
        view.catchEmailError(error)
        return
    } 

    try {
        await model.sendConfirmationCode(toValidateEmail)
    } 
    catch (error) {
        console.error(error.message)
        return
    }

    view.changeFromAuthToCodeForm()
}

async function handlingFormCode(event) {
    event.preventDefault()

    const validatedAuthForm = model.serializeForm(view.elements.formAuth)
    const validatedCodeForm = model.serializeForm(this)

    const bodyToConfirmCode = Object.assign(
        {'email': validatedAuthForm.email},
        validatedCodeForm
    ) 

    try {
        await model.confirmCode(bodyToConfirmCode)
    } catch (error) {
        view.catchCodeError(error)
        return
    }

    try {
        await model.addUser(validatedAuthForm)
    } catch (error) {
        console.error(error.message)
        return
    }

    try {
        await model.loginUser(validatedAuthForm)
    } catch (error) {
        console.error(error.message)
        return
    }

    window.location.href = "http://127.0.0.1:5500/index.html"

}

function redirectToLogin() {
    window.location.href = "http://127.0.0.1:5500/login.html"
}