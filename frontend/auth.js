function addUser(firstname, username, email, password){
    try{
        return fetch('http://127.0.0.1:8001/api/v1/auth/'), {
            mehod: 'POST',
            body: JSON.stringify(firstname, username, email, password)
        }
    } catch (error){
        console.log(error)
    }
}

function login(username, password){
    try{
        fetch('http://127.0.0.1:8001/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify(username, password),
        })
        .then(response => response.json())
        .then(data => {
            if (data.accessToken && data.tokenType === 'Bearer') {
                localStorage.setItem('accessToken', data.accessToken)
                return data
            }
        })
    } catch {error}{
        console.log(error)
    }

}

function refreshAccessToken(){
    try{
        fetch('http://127.0.0.1:8001/api/v1/auth/refresh'), {
            method: 'POST'
        }
        .then(response => response.json())
        .then(data => {
            if (data.accessToken && data.tokenType === 'Bearer') {
                localStorage.setItem('accessToken', data.accessToken)
                return data
            }
        })    
    } catch {error}{
        console.log(error)
    }
}

function makeAuthenticatedRequest(url, method='GET', body=null){
    const accessToken = localStorage.getItem('accessToken')
    try {
        return fetch(url, {
            method: method,
            headers: {'Authorization': `Bearer ${accessToken}`},
            body: body
        })
        .then(response => response.json())
    } catch {error}{
        const newAccessToken = refreshAccessToken()
        return fetch(url, {
            method: method,
            headers: {'Authorization': `Bearer ${newAccessToken}`},
            body: body
        })
        .then(response => response.json())
    }
}

function logout(){
    try{
        return makeAuthenticatedRequest('127.0.0.1:8001/api/v1/auth/logout', 'POST')
    } catch{error}{
        console.log(error)
    }
}

function sendConfirmationCode(email){
    try{
        return makeAuthenticatedRequest('127.0.0.1:8001/api/v1/auth/send-confirmation-code', 'POST',
            JSON.stringify(email)
        )
    } catch (error){
        console.log(error)
    }
}

function confirmCode(email, enteredCode){
    try{
        return  fetch('127.0.0.1:8000/api/v1/auth/confirm-code'), {
            method: 'POST',
            body: JSON.stringify(email, enteredCode)
        }
        .then(response => response.json())
    } catch (error) {
        console.log(error)
    }
}


