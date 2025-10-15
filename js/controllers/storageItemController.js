import { Model } from '../models/storageItemModel.js'
import { View } from '../views/storageItemView.js'

const model = new Model()
const view = new View()

export async function initController() {
    console.log('Test successfulll!')

    let responseChat
    const chatId = model.getChatIdByUrl()
    try {
        responseChat = await model.getChat(chatId)
    } catch (error) {
        console.error(error.message)
        return
    }
    console.log(responseChat.text)
    view.printingText(responseChat.text)

    view.disableInput()
}
