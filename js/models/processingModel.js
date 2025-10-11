import { ApiService } from '../services/apiService.js'
import { TokenService } from '../services/tokenService.js'


export class Model {
    constructor() {
        this.api = new ApiService()
        this.token = new TokenService()
    }

    serializeForm(formLogin) {
        return new FormData(formLogin)
    }

    async uploadFile(body) {
        try {

            return this.api.request(
                'http://127.0.0.1:8002/api/v1/messages/uploadfile',
                {
                    method: 'POST',
                    body: body,
                    headers: 
                    {   
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.token.accessToken}`
                    },
                }
            )
        } catch (error) {
            throw error
        }
    }

    async authorizedUploadFile(body) {
        try{
            return await this.token.authorizedRequestToAPI(() => this.uploadFile(body))
        } catch (error) {
            throw error
        }
    }

    async processingFile(body) {
        try {
            return this.api.request(
                'http://127.0.0.1:8002/api/v1/messages/processingfile', 
                {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: 
                    {   
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token.accessToken}`,
                    },
                }
            )
        } catch (error) {
            throw error
        }
    }

    async authorizedProcessingFile(body) {
        try{
            return await this.token.authorizedRequestToAPI(() => this.processingFile(body))
        } catch (error) {
            throw error
        }
    }
}

