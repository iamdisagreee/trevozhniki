import { Model } from '../models/storageModel.js'
import { View } from '../views/storageView.js'

const model = new Model()
const view = new View(await model.authorizedGetLimitChats())

export async function initController() {
    console.log("Test successfull!")
    
    addEventListener()

    view.renderPage(onDeleteChat)
}

function addEventListener() {
    window.addEventListener('scroll', loadingByScroll)
    window.addEventListener('beforeunload', goBackBeginingStorage)
}

async function loadingByScroll() {
    let additionalChats
    
    try {
        additionalChats = await model.getAdditionalChats()
    } catch (error) {
        console.error(error.message)
        return
    }

    if (additionalChats.chats) {
        view.listChats.push(...additionalChats.chats)
        // console.log(view.listChats)
    }
    
    view.renderPage(onDeleteChat)

}

async function goBackBeginingStorage() {
    console.log("AAAA")
    try {
        await model.authorizedReloadLastChatId()
    } catch (error) {
        console.error(error.message)
        return
    }
}

async function onDeleteChat(event) {
    const button = event.currentTarget

    try {
        await model.authorizedDeleteChat(button.dataset.id)
        view.deleteStorageItem(button)

    } catch (error) {
        console.error(error.message)
    }
}


