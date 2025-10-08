// const openConfirm = document.querySelector('.open-confirm')
// const closeConfirm = document.querySelector('.close-confirm')
const formAuth = document.querySelector('.form__auth')
const formLogin = document.querySelector('.form__auth-login')
const formCode = document.querySelector('.form__code')


function serializeForm(authForm) {
    const { elements } = authForm;

    const validatedForm = Array.from(elements)
        .filter((el) => el.value)
        .reduce((acc, el) => { 
            acc[el.name] = el.value;
            return acc  
        }, {})

    return validatedForm
}


async function validateAuthForm(body){
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/validate-auth-form', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: 
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(`${response.status} ${data.detail}`)
        }

    } catch (exception) {
        throw exception
    }
}  


async function sendConfirmationCode(body) {
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/send-confirmation-code', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: 
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(`${response.status} ${data.detail}`)
        }
    } catch (exception) {
        throw exception
    }
}

async function confirmCode(body) {
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/confirm-code', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: 
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        const data = await response.json()

        if (!response.ok){
            throw new Error(`${response.status} ${data.detail}`)
        }
        
    } catch (exception) {
        throw exception
    }    
}

async function addUser(body) {
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: 
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        const data = await response.json()

        if (!response.ok){
            throw new Error(`${response.status} ${data.detail}`)
        }
        
    } catch (exception) {
        throw exception
    }     
}


formAuth.addEventListener('submit', async (event) => {
    event.preventDefault()
    const validatedForm = serializeForm(formAuth)
    
    const toValidateAuthForm = {
        'email': validatedForm.email,
        'username': validatedForm.username
    }

    try{
        await validateAuthForm(toValidateAuthForm)
    } catch (exception) {
        console.error(exception)
        if (exception.message === '400 Email already registered'){
            const existMistake = formAuth.querySelector('.form__auth-mistake')
            // console.log(existMistake)
            if (!existMistake){
                formAuth.insertAdjacentHTML(
                    'beforeend',
                    `<span class="form__auth-mistake"> Почта уже зарегистрирована!</span>`
                )
            }
            else {
                existMistake.innerHTML = `
                    <span class="form__auth-mistake"> Почта уже зарегистрирована!</span>`
            }
            
        }
        else if (exception.message === '400 Username already registered'){
            const existMistake = formAuth.querySelector('.form__auth-mistake')
            console.log(existMistake)
            if (!existMistake){
                formAuth.insertAdjacentHTML(
                    'beforeend',
                    `<span class="form__auth-mistake"> Логин уже зарегистрирован!</span>`
                )
            }
            else {
                existMistake.innerHTML = `
                    <span class="form__auth-mistake"> Логин уже зарегистрирован!</span>`
            }
        } 
        return
    }


    const emailBody = {'email': validatedForm.email}

    try{
        await sendConfirmationCode(emailBody)
    } catch (exception) {
        console.error(exception.message)
        return 
    }

    // copyAuthForm = authForm.cloneNode(true);

    formAuth.classList.remove('form__inner--active')
    formCode.classList.add('form__inner--active')

})

formCode.addEventListener('submit', async (event) => {
    event.preventDefault()

    const validatedForm = serializeForm(formAuth)
    const emailBody = {'email': validatedForm.email}

    const validatedCodeForm = serializeForm(formCode)

    try {
        await confirmCode(
            Object.assign(emailBody, validatedCodeForm)
        )
    } catch (exception) {
        console.error(exception.message)
        if (exception.message == '400 Incorrect code entered') {
            const existMistake = formCode.querySelector('.form__code-mistake')
            console.log(existMistake)
            if (!existMistake){
                formCode.insertAdjacentHTML(
                    'beforeend',
                    `<span class="form__code-mistake"> Неправильный код!</span>`
                )
            }
        }
        return
    }
    try {
        await addUser(validatedForm)
    }
    catch (exception){
        console.error(exception.message)
        return
    }

    window.location.href = "http://127.0.0.1:5500/index.html"
})

formLogin.addEventListener('click', async (event) => {
    window.location.href = "http://127.0.0.1:5500/login.html"
})



