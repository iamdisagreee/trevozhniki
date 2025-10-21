import { Model } from '../models/headerModel.js'
import { View } from '../views/headerView.js'

const model = new Model()
const view = new View()

await initController()

async function initController() {
    console.log("Test successfull!")
    try{
        await model.initialLoadChats()
    } catch (error) {
        console.error(error.message)
        return
    }
    
    addEventListener()
    console.log(model.listChats)
    view.renderStorage(model.listChats, onDeleteChat)
}

function addEventListener() {
    view.elements.openFindChat.addEventListener('click', openDialogFindChat)
    view.elements.closeFindChat.addEventListener('click', closeDialogFindChat)
    view.elements.inputFindChat.addEventListener('input', inputFilterFindChat)
    view.elements.openMenuFilters.addEventListener('click', openMenuFilters)
    view.elements.nav.addEventListener('scroll', loadingByScroll)
    window.addEventListener('beforeunload', goBackBeginingStorage)
}

async function openDialogFindChat() {
    view.renderDialogFindChat(model.filterChats)
    view.elements.dialogFindChat.showModal()
}

async function closeDialogFindChat(){
    view.elements.dialogFindChat.close()
}

async function inputFilterFindChat() {
    const value = this.value.toLowerCase()
    view.removeHiddenFromLoaderFindChat()
    await model.filterSearch(value)
    await view.sleep(500)
    view.addHiddenFromLoaderFindChat()
    view.renderDialogFindChat(model.filterChats)
}

function openMenuFilters() {
    view.elements.titleStorageHeader.classList.toggle('open')
    view.elements.storageHeader.classList.toggle('open')
    view.elements.sortByDate.classList.toggle('open')
    view.elements.sortByAlphabet.classList.toggle('open')
}


async function loadingByScroll() {
    if (view.blockScrollStorage) return 

    let isChange
    try {
        const storageView = view.elements.storage
        isChange = await model.getAdditionalChats(storageView)
    } catch (error) {
        console.error(error.message)
        return
    }
    if (isChange){
        view.blockScrollStorage = true
        view.removeHiddenFromLoaderStorage()
        await view.sleep(2000)
        view.addHiddenFromLoaderStorage()
        view.blockScrollStorage = false
        view.renderStorage(model.listChats, onDeleteChat)
    } 

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


