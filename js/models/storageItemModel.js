import { ApiService } from '../services/apiService.js'
import { TokenService } from '../services/tokenService.js'

export class Model {
    constructor() {
        this.api = new ApiService()
        this.token = new TokenService()
        
    }

    async getChat(chatId) {
        try {
            return await this.api.request(
                `http://127.0.0.1:8002/api/v1/messages/chats/${chatId}`,
                {
                method: 'GET',
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

    getChatIdByUrl() {
        return new URLSearchParams(window.location.search).get('id')
    }
    
}