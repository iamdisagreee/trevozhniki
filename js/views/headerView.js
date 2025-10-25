export class View {
    constructor() {
        this.blockScrollStorage = false
        this.activeStorageItemId = null
        this.positionYStorageItemId = 0
        this.positionScrollStorageItemdId = 0
    }

    elements = {
        nav: document.querySelector('.nav'),
        openFindChat: document.querySelector('.find-chat__link'),
        dialogFindChat: document.querySelector('.find-chat__dialog'),
        closeFindChat: document.querySelector('.find-chat__dialog-close'),
        inputFindChat: document.querySelector('.find-chat__dialog-input'),
        chatsFindChat: document.querySelector('.find-chat__dialog-items'),
        loaderFindChat: document.querySelector('.loader.find-chat__loader'),
        openMenuFilters: document.querySelector('.storage__header-open-filters'),
        storageHeader: document.querySelector('.storage__header'),
        titleStorageHeader: document.querySelector('.storage__header-title'),
        sortDate: document.querySelector('.sort-by-date'),
        sortAlphabet: document.querySelector('.sort-by-alphabet'),
        sortDateDirection: document.querySelector('.sort-by-date__direction'),
        sortAlphabetDirection: document.querySelector('.sort-by-alphabet__direction'),
        storage: document.querySelector('.storage__items'),
        // openStorageItemMenu: document.querySelector('storage__item-remove'),
        storageItemMenu: document.querySelector('.storage__item-menu'),
        removeStorageItem: document.querySelector('.storage__item-remove'),
        loaderStotage: document.querySelector('.loader.storage__loader'),
    }

    renderDialogFindChat(listChats) {
        this.elements.chatsFindChat.innerHTML = ''
        const fragment = document.createDocumentFragment()
        
        listChats.forEach((chat) => {
            const li = document.createElement('li')
            li.className = 'storage__item'
            const createdAt = new Date(chat.createdAt + 'Z').toLocaleString('ru-RU')
            li.innerHTML = `
                <div class="storage__item-info">
                    <a class="storage__item-mood" href="storage-item.html?id=${chat.id}">
                        <img class="storage__item-mood-svg" src="../images/mood.svg">
                    </a>
                    <a class="storage__item-interlocutor" href="storage-item.html?id=${chat.id}">
                        <span class="storage__item-interlocutor-name">${chat.interlocutor}</span>
                        <span class="storage__item-interlocutor-date">${createdAt}</span>
                    </a>
                </div>`
            fragment.appendChild(li)
        })
        this.elements.chatsFindChat.append(fragment)
    }

    removeHiddenFromLoaderFindChat() {
        this.elements.loaderFindChat.classList.remove('hidden')
    }

    addHiddenFromLoaderFindChat() {
        this.elements.loaderFindChat.classList.add('hidden')
    }  

    goToBaseRotation() {
        this.elements.sortDateDirection.classList.remove('rotate-up')
        this.elements.sortDateDirection.classList.remove('rotate-down')
        this.elements.sortAlphabetDirection.classList.remove('rotate-up')
        this.elements.sortAlphabetDirection.classList.remove('rotate-down')
    }

    rotateDirection(classListMain, classListSecondary, sortingDirection) {
        classListSecondary.remove('rotate-up')
        classListSecondary.remove('rotate-down')
        if (sortingDirection === 'asc')
            classListMain.add('rotate-down')
        else{
            classListMain.remove('rotate-down')
            classListMain.add('rotate-up')
        }
    }

    rotateDirectionDate(sortingDirection) {
        const classListDate = this.elements.sortDateDirection.classList
        const classListAlphabet = this.elements.sortAlphabetDirection.classList

        this.rotateDirection(classListDate, classListAlphabet, sortingDirection)

        this.elements.sortAlphabet.value = 'asc'
    }

    rotateDirectionAlphabet(sortingDirection) {
        const classListDate = this.elements.sortDateDirection.classList
        const classListAlphabet = this.elements.sortAlphabetDirection.classList
        
        this.rotateDirection(classListAlphabet, classListDate, sortingDirection)

        this.elements.sortDate.value = 'asc'
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    renderStorage(listChats, openStorageItemMenu) {
        this.elements.storage.innerHTML = ''
        const fragment = document.createDocumentFragment()

        listChats.forEach((chat) => {
            const li = document.createElement('li')
            li.className = 'storage__item'
            const createdAt = new Date(chat.createdAt + 'Z').toLocaleString('ru-RU', {
                  timeZone: 'Europe/Moscow',
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
            })
            li.dataset.id = chat.id
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
                <button class="storage__item-open-menu">
                    <svg class="storage__item-open-menu-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24.000000" height="24.000000" fill="none">
                        <rect id="tabler:dots" width="24.000000" height="24.000000" x="0.000000" y="0.000000" fill="rgb(255,255,255)" fill-opacity="0" />
                        <path id="Vector" d="M4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071ZM11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071ZM18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071Z" fill-rule="nonzero" stroke="rgb(0,0,0)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                    </svg>
                </button>
                `
            const toOpenStorageItemMenu = li.querySelector('.storage__item-open-menu')
            toOpenStorageItemMenu.addEventListener('click', (event) => openStorageItemMenu(event))

                // <div class="storage__item-menu">
                // </div>
            // const removeButton = li.querySelector('.storage__item-remove')
            // removeButton.addEventListener('click', (event) => onDeleteChat(event))

            fragment.appendChild(li)
        })

        this.elements.storage.appendChild(fragment)
    }

    addActiveToStorageItem(openMenu) {
        openMenu.closest('li').classList.toggle('active')
    }

    isRemoveBackgroundStorageItem() {
        if (this.activeStorageItemId) {
            const lastStorageItemId = this.elements.storage.querySelector(`[data-id="${this.activeStorageItemId}"`)
            lastStorageItemId.classList.remove('active')
        }
    }      

    showStorageItemMenu(openMenu) {
        
        const storageItem = openMenu.closest('li')
        const storageItemId = storageItem.dataset.id

        this.elements.storageItemMenu.classList.toggle('open')

        if (this.activeStorageItemId !== storageItemId) {
            const rect = openMenu.getBoundingClientRect()
            const top = rect.top + 50
            const left = rect.left
            this.elements.storageItemMenu.style.top = top + 'px'
            this.elements.storageItemMenu.style.left = left + 'px'
            this.elements.storageItemMenu.style.transform = `translateY(0px)`
            this.elements.storageItemMenu.classList.add('open')
            this.positionYStorageItemId = top
            this.positionScrollStorageItemdId = this.elements.nav.scrollTop

            this.isRemoveBackgroundStorageItem()
        }

        this.activeStorageItemId = storageItemId
        this.elements.storageItemMenu.dataset.id = storageItemId
    }

    isMoveStorageItemMenu() {
        if (this.activeStorageItemId){
            this.elements.storageItemMenu.style.top = `${this.positionYStorageItemId 
                - (this.elements.nav.scrollTop - this.positionScrollStorageItemdId)}px`
        }
    }

    deleteStorageItem(chatId, storageItemMenu) {
        const storageItem = this.elements.storage.querySelector(`[data-id="${chatId}"`)

        storageItem.remove()    
        storageItemMenu.classList.remove('open')
        this.activeStorageItemId = null       
    }

    closeStorageItemMenuOutside(event) {
        const menu = this.elements.storageItemMenu
        const openMenu = event.target.closest('.storage__item-open-menu')

        if (!menu.classList.contains('open')){
            return
        }

        if (!menu.contains(event.target) && !openMenu) {
            menu.classList.remove('open')
            this.isRemoveBackgroundStorageItem()
        }
    }

    closeStorageItemMenuEsc(event) {
        if (event.key === 'Escape') {
            const menu = this.elements.storageItemMenu

            if (menu.classList.contains('open')) {
                menu.classList.remove('open')
                this.isRemoveBackgroundStorageItem()
            }
        }
    }
    removeHiddenFromLoaderStorage() {
        this.elements.loaderStotage.classList.remove('hidden')
    }
    
    addHiddenFromLoaderStorage() {
        this.elements.loaderStotage.classList.add('hidden')
    }  

        
}               