const formLogin = document.querySelector('.form__login')
const formAuth = document.querySelector('.form__login-auth')

function serializeForm(formLogin) {
    return new FormData(formLogin)
}

async function loginn(body){
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/login', {
            method: 'POST',
            body: body,
            headers: 
            {   
                'Accept': 'application/json'
            },
            credentials: 'include'
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(`${response.status} ${data.detail}`)
        }

        return data

    } catch (exception) {
        throw exception
    }
}

async function setAccessToken(data) {
    if (data.access_token && data.token_type === 'Bearer'){
        localStorage.setItem('access_token', data.access_token)

    }
    else {
        throw new Error('Не получен access token!')
    }
}


formLogin.addEventListener('submit', async (event) => {
    event.preventDefault()
    const validatedForm = serializeForm(formLogin)
    let response
    try {
        response = await loginn(validatedForm)
        console.log(response)

    } catch (exception){
        console.error(exception.message)
        if (exception.message == '401 Incorrect username') {
            const existMistake = formLogin.querySelector('.form__login-mistake')
            // console.log(existMistake)
            if (!existMistake){
                formLogin.insertAdjacentHTML(
                    'beforeend',
                    `<span class="form__login-mistake"> Неправильный логин!</span>`
                )
            }
            else {
                existMistake.innerHTML = `
                <span class="form__login-mistake"> Неправильный логин!</span>
                `
            }
        } else if (exception.message == '401 Incorrect password') {
            const existMistake = formLogin.querySelector('.form__login-mistake')
            // console.log(existMistake)
            if (!existMistake){
                formLogin.insertAdjacentHTML(
                    'beforeend',
                    `<span class="form__login-mistake"> Неправильный пароль!</span>`
                )
            }
            else {
                existMistake.innerHTML = `
                <span class="form__login-mistake"> Неправильный пароль!</span>
                `
            }
        }
        return 
    }
    
    try {
        await setAccessToken(response)
    } catch (exception){
        console.error(exception.message)
        return 
    }

    window.location.href = "http://127.0.0.1:5500/index.html"

    
})

formAuth.addEventListener('click', async (event) => {
    window.location.href = "http://127.0.0.1:5500/auth.html"
})