import { Model } from '../models/headerModel.js'
import { View } from '../views/headerView.js'

const model = new Model()
const view = new View(await model.authorizedGetLimitChats())

await initController()

async function initController() {
    console.log("Test successfull!")
    
    addEventListener()

    view.renderPage(onDeleteChat)
}

function addEventListener() {
    view.elements.nav.addEventListener('scroll', loadingByScroll)
    window.addEventListener('beforeunload', goBackBeginingStorage)
}

async function loadingByScroll() {
    let additionalChats
    // console.log("AA")
    try {
        const storage = view.elements.storage
        additionalChats = await model.getAdditionalChats(storage)
    } catch (error) {
        console.error(error.message)
        return
    }

    if (additionalChats.chats) {
        // view.removeHiddenFromLoad()
        view.listChats.push(...additionalChats.chats)
        // setTimeout( () => {console.log("I am sleep fo 5 seconds")}, 5000)
        // view.addHiddenFromLoad()
    }
    
    view.renderPage(onDeleteChat)

}

async function goBackBeginingStorage() {
    // console.log("AAAA")
    try {
        await model.authorizedReloadLastChatId()
    } catch (error) {
        console.error(error)
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


