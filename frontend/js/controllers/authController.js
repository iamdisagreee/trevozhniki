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
    view.elements.formCode.addEventListener('sumbit')
    view.elements.formLogin.addEventListener('click')
}

async function handlingFormAuth(event) {
    event.preventDefault()

    const validatedAuthForm = model.serializeForm(this)

    try {
        model.validatedAuthForm(validatedAuthForm.email)
    } catch (error) {
        view.catchEmailError(error)
        return
    } 

    // console.log(validatedForm)
}

