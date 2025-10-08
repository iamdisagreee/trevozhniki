class AuthService{
    constructor () {
        this.accessToken = localStorage.getItem('access_token')
    }

    async login(body){
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

    async loginn(body) {
        const data = await this.login(body)
        this.setAccessToken(data)
    }

    async refreshToken(){
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

        } catch (exception) {
            throw exception
        }
    }

    setAccessToken(data) {
        if (data.access_token && data.token_type === 'Bearer'){
            localStorage.setItem('access_token', data.access_token)
            this.accessToken = data.access_token
        }
        else {
            throw new Error('Не получен access token!')
        }
    }

    async handlingUnathorizedError() {
        try {
            const data = await this.refreshToken()
            this.setAccessToken(data)  
        }
        catch (exception) {
            console.log(exception.message)
            window.location.href = "http://127.0.0.1:5500/login.html"
        }
    }

    async requestToAPI(callback) {
        try {
            return await callback(this.accessToken)
        } catch (exception) {
            if (exception.status == 401) {
                await this.handlingUnathorizedError()
                return await callback(this.accessToken)
            }
            throw exception
        }
    }
}