import { Model } from '../models/loginModel.js'
import { View } from '../views/loginView.js'

const model = new Model()
const view = new View()

export function initController() {
    console.log('Test succesfull!')
    addEventListener()
}

function addEventListener() {
    view.elements.formLogin.addEventListener('submit', handlingFormLogin)
    view.elements.formAuth.addEventListener('click', handlingFormAuth)
}

async function handlingFormLogin(event) {
    event.preventDefault()

    const validatedLoginForm = model.serializeForm(this)

    try {
        await model.token.loginn(validatedLoginForm)
    } catch (error) {
        view.catchLoginError(error)
        return
    }

    window.location.href = "http://127.0.0.1:5500/index.html"
}

function handlingFormAuth() {
    window.location.href = "http://127.0.0.1:5500/auth.html"
}

