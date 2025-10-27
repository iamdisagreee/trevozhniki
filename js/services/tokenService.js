import { ApiService } from '../services/apiService.js'

export class TokenService{
    constructor () {
        this.api = new ApiService()
        this.accessToken = localStorage.getItem('access_token')
    }

    async login(body){
        try{
            return this.api.request(
                'http://127.0.0.1:8001/api/v1/auth/login',
                {
                    method: 'POST',
                    body: body,
                    headers: 
                    {   
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                }
            )
        } catch (error) {
            throw error
        }
    }

    async loginn(body) {
        try{
            const data = await this.login(body)
            this.setAccessToken(data)
        } catch (error) {
            throw error
        }

    }

    async refreshToken(){
        try {
            return this.api.request(
                'http://127.0.0.1:8001/api/v1/auth/refresh',
                {
                    method: 'POST',
                    headers: 
                    {   
                        'Accept': 'application/json',
                    },
                    credentials: 'include'
                }
            )
        } catch (error) {
            throw error
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
        catch (error) {
            console.log(error.message)
            window.location.href = "http://127.0.0.1:5500/login.html"
        }
    }

    async authorizedRequestToAPI(callback) {
        try {
            return await callback()
        } catch (error) {
            if (error.status == 401) {
                await this.handlingUnathorizedError()
                return await callback()
            }
            // console.log('ЗДЕСЬ', error.status)
            throw error
        }
    }


    getPayloadJwt() {
        const jwt = localStorage.getItem('access_token')
        const tokenParts = jwt.split('.')
        const decodedPayload = JSON.parse(atob(tokenParts[1]))
        return decodedPayload
        
    }
}