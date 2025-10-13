export class View {
    constructor(jsonChats) {
        this.listChats = jsonChats.chats 
    }

    elements = {
        storage: document.querySelector('.storage'),
        loader: document.querySelector('.loader')
    }

    renderPage(onDeleteChat) {
        this.elements.storage.innerHTML = ''
        const fragment = document.createDocumentFragment()

        this.listChats.forEach((chat) => {
            const li = document.createElement('li')
            li.className = 'storage__item'
            li.innerHTML = `
                <a href="storage-item.html?id=${chat.id}" class="storage__item-text">${chat.name}</a>
                <button class="storage__item-remove" data-id=${chat.id}>Удалить</button></li>`
            
            const removeButton = li.querySelector('.storage__item-remove')
            removeButton.addEventListener('click', (event) => onDeleteChat(event))

            fragment.appendChild(li)
        })

        this.elements.storage.appendChild(fragment)
    }

    removeHiddenFromLoad() {
        this.elements.loader.classList.remove('hidden')
    }

    addHiddenFromLoad() {
        this.elements.loader.classList.add('hidden')
    }

    deleteStorageItem(button) {
        const li = button.closest('li')
        console.log(li)
        li.remove()             
    }               
}               