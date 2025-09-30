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
    if (data.accessToken && data.tokenType === 'Bearer'){
        // localStorage.setItem('accessToken', data.accessToken)

    }
    else {
        throw new Error('Не получен access token!')
    }
}


formLogin.addEventListener('submit', async (event) => {
    event.preventDefault()
    const validatedForm = serializeForm(formLogin)
    // console.log(Array.from(validatedForm.entries()))


    try {
        const response = await loginn(validatedForm)
        localStorage.setItem('accessToken', response.accessToken)
    } catch (exception){
        console.error(exception.message)
        return 
    }
    
})

formAuth.addEventListener('click', async (event) => {
    window.location.href = "http://127.0.0.1:5500/auth.html"
})