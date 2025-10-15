export class View {
    constructor(jsonChats) {
        this.listChats = jsonChats.chats 
    }

    elements = {
        nav: document.querySelector('.nav'),
        storage: document.querySelector('.storage__items'),
        loader: document.querySelector('.loader')
    }

    renderPage(onDeleteChat) {
        this.elements.storage.innerHTML = ''
        const fragment = document.createDocumentFragment()

        this.listChats.forEach((chat) => {
            const li = document.createElement('li')
            li.className = 'storage__item'
            // li.innerHTML = `
            //     <a href="storage-item.html?id=${chat.id}" class="storage__item-text">${chat.name}</a>
            //     <button class="storage__item-remove" data-id=${chat.id}>Удалить</button></li>`
            const createdAt = new Date(chat.createdAt + 'Z').toLocaleString('ru-RU', {
                  timeZone: 'Europe/Moscow',
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
            })

            li.innerHTML = `
                <div class="storage__item-info">
                    <a class="storage__item-mood" href="storage-item.html?id=${chat.id}">
                        <img class="storage__item-mood-svg" src="../images/mood.svg">
                    </a>
                    <a class="storage__item-interlocutor" href="storage-item.html?id=${chat.id}">
                        <span class="storage__item-interlocutor-name">${chat.interlocutor}</span>
                        <span class="storage__item-interlocutor-date">${createdAt}</span>
                    </a>
                </div>
                <svg class="storage__item-remove viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24.000000" height="24.000000" fill="none">
                    <rect id="tabler:dots" width="24.000000" height="24.000000" x="0.000000" y="0.000000" fill="rgb(255,255,255)" fill-opacity="0" />
                    <path id="Vector" d="M4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071ZM11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071ZM18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071Z" fill-rule="nonzero" stroke="rgb(0,0,0)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>`

            // const removeButton = li.querySelector('.storage__item-remove')
            // removeButton.addEventListener('click', (event) => onDeleteChat(event))

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