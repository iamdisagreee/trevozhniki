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