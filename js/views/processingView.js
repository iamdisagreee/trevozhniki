export class View {
    constructor() {}

    elements = {
        formChat: document.querySelector('.form__chat'),
        formChatFile: document.querySelector('.form__chat-file'),
        formChatFileSvg: document.querySelector('.form__chat-file-svg'),
        formChatStatus: document.querySelector('.form__chat-status'),
        formChatBtn: document.querySelector('.form__chat-btn'),
        formChatBtnSvg: document.querySelector('.form__chat-btn-svg'),
        loader: document.querySelector('.loader.processing__loader'),
        out: document.querySelector('.out'),
        storage__items: document.querySelector('.storage__items')
    }

    catchUploadError(error) {
        const status = error.status
        let message

        switch (status) {
            case 400: {
                message = 'Некорректное расширение файла!'
                break  
            }
            case 413: {
                message = 'Недопустимый размер файла!'
                break  
            }
            case 415: {
                message = 'Некорректное содержимое файла!'    
                break
            }
            default:
                message = 'Попробуй еще раз!'
        }

        this.elements.formChatStatus.textContent = message
        this.changeStyleUploadFileError()
        this.disableSendBtn()

        console.error(error.message)
    }

    changeStyleUploadFileError() {
        this.elements.formChatStatus.classList.add('error')
        this.elements.formChatBtn.classList.add('error')
    }

    removeStyleUploadFileError() {
        this.elements.formChatStatus.classList.remove('error')
        this.elements.formChat.classList.remove('error')    
    }

    disableSendBtn() {
        this.elements.formChatBtnSvg.classList.add('disable')
        this.elements.formChatBtn.disabled = true
    }

    enableSendBtn() {
        this.elements.formChatBtnSvg.classList.remove('disable')
        this.elements.formChatBtn.disabled = false
    }

    preparingProcessing() {
        this.elements.formChatBtn.disabled = true
        this.elements.formChatFile.disabled = true
        this.elements.formChatStatus.textContent = ''
        this.elements.loader.classList.remove('hidden')
    }

    catchProcessingError(error) {
        console.error(error.message)
    }

    finalProcessing() {
        this.elements.loader.classList.add('hidden')
        this.elements.out.classList.remove('hidden')
    }

    printingText(text, position) {
        if (position === text.length) return
            this.elements.out.textContent += text[position]
        setTimeout(() => this.printingText(text, position+1), 0)
    }

    isFileUploaded() {
        if (this.elements.formChatFile.files.length > 0){
            this.elements.formChatStatus.textContent = this.elements.formChatFile.files[0].name
        }
    }

    addUploadedFileToStorage(chat) {
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
            // const toOpenStorageItemMenu = li.querySelector('.storage__item-open-menu')
            // toOpenStorageItemMenu.addEventListener('click', (event) => openStorageItemMenu(event))
            this.elements.storage__items.insertAdjacentElement('afterbegin', li)
    }

    disableStyleAfterProcessFile() {
        this.elements.formChatFileSvg.classList.add('disable')
        this.elements.formChatBtnSvg.classList.add('disable')
    }

}