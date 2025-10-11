import { header } from './templates.js'
import { requestToAPI } from './token.js'


const headerLink = document.querySelector('.header').innerHTML = header
const chatId = new URLSearchParams(window.location.search).get('id')
const outResult = document.querySelector('.out__result')

async function getChat(token) {
    try {
        const response = await fetch(`http://127.0.0.1:8002/api/v1/messages/chats/${chatId}`, {
        method: 'GET',
        headers: 
        {   
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })
        
        const data = await response.json()

        if (!response.ok){
            const error = new Error(`${response.status} ${data.detail}`)
            error.status = response.status
            throw error
        }
        return data

    } catch (exception) {
        throw exception
    }
}

let responseChat
try {
    responseChat = await requestToAPI(getChat)
} catch (exception) {
    console.log(exception.message)
}

outResult.textContent = responseChat.text






