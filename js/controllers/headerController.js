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
    view.renderStorage(model.listChats, onDeleteChat)
}

function addEventListener() {
    view.elements.nav.addEventListener('scroll', loadingByScroll)
    window.addEventListener('beforeunload', goBackBeginingStorage)
    view.elements.openFindChat.addEventListener('click', openDialogFindChat)
    view.elements.closeFindChat.addEventListener('click', closeDialogFindChat)
    view.elements.inputFindChat.addEventListener('input', inputFilterFindChat)
    view.elements.openMenuFilters.addEventListener('click', openMenuFilters)
    console.log(view.elements.sortDate)
    view.elements.sortDate.addEventListener('click', sortByDate)
    view.elements.sortAlphabet.addEventListener('click', sortByAlphabet)
    // view.elements.sortSelect.forEach(typeSort =>
        // typeSort.addEventListener('click', sortingChats)
    // )
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
        view.goToBaseRotation()
    } 

}

async function goBackBeginingStorage() {
    try {
        await model.authorizedReloadLastChatId()
    } catch (error) {
        console.error(error)
        return
    }
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
    view.elements.sortDate.classList.toggle('open')
    view.elements.sortAlphabet.classList.toggle('open')
}

function sortByDate(event) {
    const btn = event.currentTarget
    const sortingDirection = btn.value
    model.sortingByDate(sortingDirection)

    btn.value = btn.value === 'desc' ? 'asc' : 'desc'
    view.renderStorage(model.sortChats)
    view.rotateDirectionDate(sortingDirection)
}

function sortByAlphabet(event) {
    const btn = event.currentTarget
    const sortingDirection = btn.value
    model.sortingByAlphabet(sortingDirection)

    btn.value = btn.value === 'desc' ? 'asc' : 'desc'
    view.renderStorage(model.sortChats)
    view.rotateDirectionAlphabet(sortingDirection)

}


function openStorageItemMenu() {
    console.log('111')
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


