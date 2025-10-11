import { ApiService } from '../services/apiService.js'
import { TokenService } from '../services/tokenService.js'

export class Model {
    constructor() {
        this.api = new ApiService()
        this.token = new TokenService()
    }

    async getLimitChats() {
        try {
            return this.api.request(
                'http://127.0.0.1:8002/api/v1/messages/limit-chats',
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

    async authorizedGetLimitChats() {
        try {
            return await this.token.authorizedRequestToAPI(() => this.getLimitChats())
        } catch (error) {
            throw error
        }
    }

    async getAdditionalChats() {
        const documentCurrentSize = document.documentElement.getBoundingClientRect()
        const clientHeight = document.documentElement.clientHeight

        if (documentCurrentSize.bottom < clientHeight + 150) {
            try {
                return await this.authorizedGetLimitChats()
            }
            catch {error} {
                throw error
            }
        }
        return []
    }
    

    async reloadLastChatId() {
        try {
            await this.api.request(
                `http://127.0.0.1:8002/api/v1/messages/reload-last-chat-id`,
                {
                method: 'PATCH',
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

    async authorizedReloadLastChatId() {
        try {
            return await this.token.authorizedRequestToAPI(() => this.reloadLastChatId())
        } catch (error) {
            throw error
        }
    }

    async deleteChat(chatId) {
        try {
            await this.api.request(
                `http://127.0.0.1:8002/api/v1/messages/chats/${chatId}`,
                {
                method: 'DELETE',
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

    async authorizedDeleteChat(chatId) {
        try {
            return await this.token.authorizedRequestToAPI(() => this.deleteChat(chatId))
        } catch (error) {
            throw error
        }
    }


}