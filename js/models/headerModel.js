import { ApiService } from '../services/apiService.js'
import { TokenService } from '../services/tokenService.js'

export class Model {
    constructor() {
        this.listChats = [] 
        this.lastFilteredValue = null
        this.filterChats = []
        this.sortChats = []
        this.isLoadingStorage = false
        this.hasMoreStorage = true
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

    async initialLoadChats() {
        try {
            const data = (await this.authorizedGetLimitChats()).chats
            this.listChats = data
            this.sortChats = data
        } catch (error) {
            throw error
        }
    }

        async getAdditionalChats(currentSizeNav) {
        const clientHeight = document.documentElement.clientHeight

        if (currentSizeNav.bottom < clientHeight + 100 && !this.isLoadingStorage && this.hasMoreStorage) {
            this.isLoadingStorage = true
            try {
                const addditionalChats = (await this.authorizedGetLimitChats()).chats
                if (addditionalChats.length) {
                    this.listChats.push(...addditionalChats)
                    this.sortChats = [...this.listChats]
                    return true
                }
                else {
                    this.hasMoreStorage = false
                }
            }
            catch (error) {
                throw error
            }
            finally {
                this.isLoadingStorage = false
            }
        }
        return false
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

    async getChatsByLine(line) {
        try {
            return this.api.request(
                `http://127.0.0.1:8002/api/v1/messages/chats-by-line?line=${line}`,
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

   async authorizedGetChatsByLine(line) {
        try {
            return await this.token.authorizedRequestToAPI(() => this.getChatsByLine(line))
        } catch (error) {
            throw error
        }
    }

    async filterSearch(value, renderDialogFindChat, sleep) {
        console.log(this.lastFilteredValue)
        clearTimeout(this.lastFilteredValue)

        let oneBar = setTimeout( async () => {
            if (value === '') {
                this.filterChats = []
            } else {
                const filterChats = (await this.authorizedGetChatsByLine(value)).chats
                this.filterChats = filterChats
            }
            console.log(this.filterChats)
            renderDialogFindChat(this.filterChats)
        }, 500)

        this.lastFilteredValue = oneBar
    }


    sortingByDate(sortingDirection) {
        this.sortChats.sort((a, b) => {
            return sortingDirection === 'asc'
            ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
            : Date.parse(b.createdAt) - Date.parse(a.createdAt) 
        })
    }

    sortingByAlphabet(sortingDirection) {
        this.sortChats.sort((a, b) => {
            const nameOne = a.interlocutor.toLowerCase()
            const nameTwo = b.interlocutor.toLowerCase()
            return sortingDirection === 'asc'
            ? nameOne > nameTwo ? 1 : -1
            : nameTwo > nameOne ? 1 : -1 
        })
    }

    sortingByParameters(sortingType, sortingDirection) {
        this.sortChats.sort((a, b) => {
            switch(sortingType) {
                case 'date':
                    return sortingDirection === 'asc'
                    ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
                    : Date.parse(b.createdAt) - Date.parse(a.createdAt)
                case 'alphabet':
                    const nameOne = a.interlocutor.toLowerCase()
                    const nameTwo = b.interlocutor.toLowerCase()
                    return sortingDirection === 'asc'
                    ? nameOne > nameTwo ? 1 : -1
                    : nameTwo > nameOne ? 1 : -1
            }
        })
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

    getUsernameFromJwt() {
        return this.token.getPayloadJwt().username
    }
}