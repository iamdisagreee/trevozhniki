import { Model } from '../models/authModel.js'
import { View } from '../views/authView.js'

const model = new Model()
const view = new View()


export function initController() {
    console.log('Test succesfull!')
    addEventListener()
}

function addEventListener() {
    view.elements.formAuth.addEventListener('submit', handlingFormAuth),
    view.elements.inputAuth.forEach((inputArea) => {
        inputArea.addEventListener('click', focusInputArea)
    })
    view.elements.formAuthEmail.addEventListener('input', removeErrorFromEmailAuth)
    view.elements.formAuthPasswordAreaFirst.addEventListener('input', removeErrorFromInputPasswordlAuthFirst)
    view.elements.formAuthPasswordAreaSecond.addEventListener('input', removeErrorFromInputPasswordlAuthSecond)
    view.elements.formAuthPasswords.forEach(pswd => 
        pswd.addEventListener('input', removeErrorFromMatchesPasswordAuth)
    )
    view.elements.formAuthPasswordShow.forEach((pswdShow) => {
        pswdShow.addEventListener('mousedown', showPassword)
        pswdShow.addEventListener('mouseup', closePassword)
    })
    view.elements.formCodeInput.addEventListener('input', handlingCodeEntry)
    view.elements.formAuthLogin.addEventListener('click', redirectToLogin)
}

async function handlingFormAuth(event) {
    event.preventDefault()
    const validatedAuthForm = model.serializeForm(this)
    view.isFormSendEmail = true
    view.isFormSendFirstPswd = true
    view.isFormSendSecondPswd = true

    if (view.catchEmailNotInputed(validatedAuthForm))
        return

    if (view.catchFilterEmailInput(validatedAuthForm.email))
        return

    if (view.catchFirstPasswordNotInputed(validatedAuthForm)) {
        return
    }

    if (view.catchSecondPasswordNotInputed(validatedAuthForm)) {
        return
    }

    const isPasswordsMatch = model.inputPasswordsMatch(
        validatedAuthForm.passwordFirst,
        validatedAuthForm.passwordSecond
    )
    if (view.catchPasswordMatches(isPasswordsMatch))
        return

    const toValidateEmail = {'email': validatedAuthForm.email}

    try {
        await model.validatedAuthForm(toValidateEmail)
    } catch (error) {
        view.catchNotUnqueEmailError(error)
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

function focusInputArea(event) {
    const inputArea = event.currentTarget
    view.focusIfInputArea(inputArea)
}

function removeErrorFromEmailAuth() {
    view.removeCatchInputEmailError()
}

function removeErrorFromInputPasswordlAuthFirst() {
    view.removeCatchInputPasswordErrorFirst()
}

function removeErrorFromInputPasswordlAuthSecond() {
    view.removeCatchInputPasswordErrorSecond()
}

function removeErrorFromMatchesPasswordAuth() {
    view.removeСatchPasswordMathes()
}

function showPassword(event) {
    const pswdShow = event.currentTarget
    view.showPasswordClick(pswdShow)
}

function closePassword(event) {
    const pswdShow = event.currentTarget
    view.closePasswordClick(pswdShow)
}

async function handlingCodeEntry(event){
    view.removeCatchCodeError(event)

    const replacedCode = view.replaceInputCode(event)

    if (event.currentTarget.value.length < 6) return


    const getdAuthForm = model.serializeForm(view.elements.formAuth)
    const bodyToConfirmCode = {
            'email': getdAuthForm.email,
            'enteredCode': replacedCode
    }

    try {
        await model.confirmCode(bodyToConfirmCode)
    } catch (error) {
        view.catchCodeError(error, event)
        return
    }

    const validatedAuthForm = {
        'email': getdAuthForm.email,
        'password': getdAuthForm.passwordFirst
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