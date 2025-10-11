export async function loginn(body){
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

export async function refreshToken(){
    try {
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/refresh', {
                method: 'POST',
                headers: 
                {   
                    'Accept': 'application/json',
                },
                credentials: 'include'
            })
        
        const data = await response.json()

        if (!response.ok){
            const exception = new Error(`${response.status} ${data.detail}`)
            exception.status = response.status
            throw exception
        }
        
        return data

    }catch (exception) {
        throw exception
    }
}

export async function setAccessToken(data) {
    if (data.access_token && data.token_type === 'Bearer'){
        localStorage.setItem('access_token', data.access_token)

    }
    else {
        throw new Error('Не получен access token!')
    }
}


export async function handlingUnathorizedError() {
    try {
        const accessToken = await refreshToken()
        await setAccessToken(accessToken)  
    }
    catch (exception) {
        console.log(exception.message)
        window.location.href = "http://127.0.0.1:5500/login.html"
    }
}

export async function requestToAPI(callback) {
    let accessToken
    try {
        accessToken = localStorage.getItem('access_token')
        return await callback(accessToken)
    } catch (exception) {
        if (exception.status == 401) {
            await handlingUnathorizedError()
            accessToken = localStorage.getItem('access_token')
            return await callback(accessToken)
        }
        throw exception
    }
}