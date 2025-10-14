export class View {
    constructor() {}

    elements = {
        formChat: document.querySelector('.form__chat'),
        formChatFile: document.querySelector('.form__chat-file'),
        formChatStatus: document.querySelector('.form__chat-status'),
        formChatBtn: document.querySelector('.form__chat-btn'),
        formChatBtnSvg: document.querySelector('.form__chat-btn-svg'),
        loader: document.querySelector('.loader'),
        out: document.querySelector('.out')
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
        this.elements.formChatBtnSvg.classList.remove('active')
        console.error(error.message)
    }

    preparingProcessing() {
        this.elements.formChatBtn.disabled = true
        this.elements.formChatFile.disabled = true
        this.elements.formChatStatus.textContent = ''
        this.elements.loader.classList.remove('hidden')
        this.elements.formChatBtnSvg.classList.remove('active')
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
        setTimeout(() => this.printingText(text, position+1), 50)
    }

    isFileUploaded() {
        if (this.elements.formChatFile.files.length > 0){
            this.elements.formChatStatus.textContent = this.elements.formChatFile.files[0].name
            this.elements.formChatBtnSvg.classList.add('active')
        }
    }


}