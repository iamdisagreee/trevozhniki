// import {loginn, refreshToken, setAccessToken} fro 



const formFile = document.querySelector(".form__file")


function serializeForm(formLogin) {
    return new FormData(formLogin)
}


async function uploadFile(body, token) {
    try {
        const response = await fetch('http://127.0.0.1:8002/api/v1/messages/uploadfile', {
        method: 'POST',
        body: body,
        headers: 
        {   
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })
        
        const data = await response.json()

        if (!response.ok){
            const error = new Error(`${response.status} ${data.detail}`)
            error.status = response.status
            throw error
        }

    } catch (exception) {
        throw exception
    }

}

formFile.addEventListener('submit', async (event) => {
    event.preventDefault()
    const accessToken = localStorage.getItem('access_token')
    const validatedForm = serializeForm(formFile)

    try{
        await uploadFile(validatedForm, accessToken) 
    } catch (exception) {
        let message
        let tokenInfo
        switch (exception.status){
            case 401: {
                try {
                    tokenInfo = await refreshToken()
                    await uploadFile(validatedForm, tokenInfo.access_token) 

                }
                catch (exception) {
                    console.log(exception.message)
                    window.location.href = "http://127.0.0.1:5500/login.html"
                }
                break
            }
            case 400:
                message = 'Некорректное расширение файла!'            
            case 410:
                message = 'Некорректное содержимое файла!'    
                break
            case 413:
                message = 'Недопустимый размер файла!'
                break
            default:
                message = 'Попробуй еще раз!'
        }

        console.log(tokenInfo)

        const existMistake = formFile.querySelector('.form__file-mistake')
        if (!existMistake){
            formFile.insertAdjacentHTML(
                'beforeend',
                `<span class="form__file-mistake"> ${message}</span>`
            )
        }
        else {
            existMistake.innerHTML = `
            <span class="form__file-mistake"> ${message}</span>`
        }
        console.log(exception.message)
        return
    }

    formFile.innerHTML = '<h1>ЧТО-ТО ЖДЕМ</h1>'
    
})

