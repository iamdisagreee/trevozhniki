export class View {
    constructor() {}

    elements = {
        outResult: document.querySelector('.out__result'),
        formChatFile: document.querySelector('.form__chat-file'),
        formChatBtn: document.querySelector('.form__chat-btn')
    }

    printingText(text) {
        this.elements.outResult.textContent = text 
    }

    disableInput() {
        this.elements.formChatFile.disabled = true
        this.elements.formChatBtn.disabled = true
    }
}