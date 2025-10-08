import { ApiService } from '../services/apiService.js'

export class Model {
    constructor() {
        this.api = new ApiService()
    }

    serializeForm(authForm) {
        const { elements } = authForm;

        const validatedForm = Array.from(elements)
            .filter((el) => el.value)
            .reduce((acc, el) => { 
                acc[el.name] = el.value;
                return acc  
            }, {})

        return validatedForm     
    }

    async validatedAuthForm(body) {
        try {
            await this.api.request(
                'http://127.0.0.1:8001/api/v1/auth/validate-auth-form',
                {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers:
                    {   
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                }
            )
        }
        catch (error){
            throw error
        }
    }

    async sendConfirmationCode(body) {
        try {
            await this.api.request(
                'http://127.0.0.1:8001/api/v1/auth/send-confirmation-code',
                {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: 
                    {   
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                }
            )
        } catch (error) {
            throw error
        }
    }

    async confirmCode(body) {
        try{
            await this.api.request(
                    'http://127.0.0.1:8001/api/v1/auth/confirm-code', 
                    {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: 
                        {   
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                    }
            )            
        } catch (error) {
            throw error
        }    
    }

    async addUser(body) {
        try{
            await this.api.request(
                'http://127.0.0.1:8001/api/v1/auth/',
                {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: 
                    {   
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                }
            )
        } catch (error) {
            throw error
        }     
    }

    
}