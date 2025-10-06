import { header } from './templates.js'
import { name } from './token.js'

const headerLink = document.querySelector('.header').innerHTML = header
const storage = document.querySelector('.storage') 
const fragment = document.createDocumentFragment()

async function getAllChats(token) {
    try {
        const response = await fetch('http://127.0.0.1:8002/api/v1/messages/chats', {
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

// let accessToken = localStorage.getItem('access_token')
// let responseChats
// try {
//     responseChats = await getAllChats(accessToken)
// } catch (exception) {
//     switch (exception.status) {
//         case 401: {
//             responseChats = await name(
//                 () => {
//                     accessToken = localStorage.getItem('access_token')
//                     responseChats = getAllChats(accessToken)
//                 }
//             )
//             break
//         }
//     }
// }

try {
    await name(getAllChats)
} catch (exception) {
    console.log(exception.message)
}

responseChats.chats.forEach((chat) => {
    const li = document.createElement('li')
    li.className = 'storage__item'
    li.innerHTML = `
        <a href="" class="storage__item-text">${chat.name}</a>
        <button class="storage__item-link">+</button>
        <button class="storage__item-remove">-</button></li>`
    fragment.appendChild(li)
})

storage.appendChild(fragment)

