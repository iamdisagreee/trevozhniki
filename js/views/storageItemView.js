export class View {
    constructor() {}

    elements = {
        outResult: document.querySelector('.out__result'),
        formChatFile: document.querySelector('.form__chat-file'),
        formChatFileLabel: document.querySelector('.form__chat-file-label'),
        formChatBtn: document.querySelector('.form__chat-btn'),
        formChatBtnSvg: document.querySelector('.form__chat-btn-svg'),

    }

    printingText(text) {
        this.elements.outResult.textContent = text 
    }

    disableInput() {
        this.elements.formChatFile.disabled = true
        this.elements.formChatFileLabel.classList.add('disable')
        this.elements.formChatBtn.disabled = true
        this.elements.formChatBtn.classList.add('disable')
    }
}