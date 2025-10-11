import { header } from './templates.js'
import { requestToAPI } from './token.js'

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
async function deleteChat(token, chatId) {
    try {
        const response = await fetch(`http://127.0.0.1:8002/api/v1/messages/chats/${chatId}`, {
        method: 'DELETE',
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
async function clickToRemoveChat(event) {
    const button = event.currentTarget
    const itemId = button.dataset.id
    const li = button.closest('li')
    
    try {
        await requestToAPI((token) => deleteChat(token, itemId))
        li.remove()
    } catch (exception) {
        console.log(exception.message)
    }
}
// storage.addEventListener('click', async (event) => {
//     const itemId = event.currentTarget.dataset.id
//     console.log(itemId)
//     localStorage.setItem('current_id', itemId)
//     window.location.href = "http://127.0.0.1:5500/storage.html"
// })


let responseChats
try {
    responseChats = await requestToAPI(getAllChats)
} catch (exception) {
    console.log(exception.message)
}

responseChats.chats.forEach((chat) => {
    const li = document.createElement('li')
    li.className = 'storage__item'
    li.innerHTML = `
        <a href="storage-item.html?id=${chat.id}" class="storage__item-text">${chat.name}</a>
        <button class="storage__item-remove" data-id=${chat.id}>Удалить</button></li>`
    
    const linkText = li.querySelector('.storage__item-text')
    // linkText.addEventListener('click', (event) => {
    //     event.preventDefault()
    //     window.location.href = `storage-item.html?id=${chat.id}`
    // })

    const removeButton = li.querySelector('.storage__item-remove')
    removeButton.addEventListener('click', clickToRemoveChat)
    fragment.appendChild(li)
})

storage.appendChild(fragment)
