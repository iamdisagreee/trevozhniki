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

    async getAdditionalChats(storage) {
        // const documentC  urrentSize = document.documentElement.getBoundingClientRect()
        // const currentSizeNav = nav.getBoundingClientRect()
        const currentSizeNav = storage.getBoundingClientRect()
        const clientHeight = document.documentElement.clientHeight

        console.log(currentSizeNav, clientHeight)
        if (currentSizeNav.bottom < clientHeight + 100) {
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
                body: JSON.stringify({}),
                headers: 
                    {   
                        'Content-Type': 'application/json',
                        // 'Accept': 'application/json',
                        'Authorization': `Bearer ${this.token.accessToken}`
                    },
                keepalive: true
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