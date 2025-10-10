export class View {
    constructor() {}

    elements = {
        storage: document.querySelector('.storage'),
        fragment: document.createDocumentFragment()
    }

    renderPage(responseStorage, onDeleteChat) {
        responseStorage.chats.forEach((chat) => {
            const li = document.createElement('li')
            li.className = 'storage__item'
            li.innerHTML = `
            <a href="storage-item.html?id=${chat.id}" class="storage__item-text">${chat.name}</a>
            <button class="storage__item-remove" data-id=${chat.id}>Удалить</button></li>`
            
            const removeButton = li.querySelector('.storage__item-remove')
            removeButton.addEventListener('click', (event) => onDeleteChat(event))

            this.elements.fragment.appendChild(li)
        })

        this.elements.storage.appendChild(this.elements.fragment)
    }

    deleteStorageItem(button) {
        const li = button.closest('li')
        console.log(li)
        li.remove()             
    }               
}               