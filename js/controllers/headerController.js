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

    setUsernameFromJwt()
    view.renderStorage(model.listChats, openStorageItemMenu)
}

function addEventListener() {
    view.elements.nav.addEventListener('scroll', loadingByScroll)
    window.addEventListener('beforeunload', goBackBeginingStorage)
    view.elements.openFindChat.addEventListener('click', openDialogFindChat)
    view.elements.closeFindChat.addEventListener('click', closeDialogFindChat)
    view.elements.inputFindChat.addEventListener('input', inputFilterFindChat)
    view.elements.openMenuFilters.addEventListener('click', openMenuFilters)
    view.elements.sortDate.addEventListener('click', sortByDate)
    view.elements.sortAlphabet.addEventListener('click', sortByAlphabet)
    view.elements.removeStorageItem.addEventListener('click', removeStorageItemById),
    document.addEventListener('click', closeStorageItemMenuIfOutside)
    document.addEventListener('keydown', closeStorageItemMenuIfEsc)


}

async function loadingByScroll() {
    if (view.blockScrollStorage) return 

    let isChange
    const currentSizeNav = view.elements.storage.getBoundingClientRect()
    try {
        isChange = await model.getAdditionalChats(currentSizeNav)
    } catch (error) {
        console.error(error.message)
        return
    }
    if (isChange){
        view.blockScrollStorage = true
        view.removeHiddenFromLoaderStorage()
        await view.sleep(500)
        view.addHiddenFromLoaderStorage()
        view.blockScrollStorage = false
        view.renderStorage(model.listChats, openStorageItemMenu)
        view.goToBaseRotation()
    }

    view.isMoveStorageItemMenu()

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
    view.renderStorage(model.sortChats, openStorageItemMenu)
    view.rotateDirectionDate(sortingDirection)
}

function sortByAlphabet(event) {
    const btn = event.currentTarget
    const sortingDirection = btn.value
    model.sortingByAlphabet(sortingDirection)

    btn.value = btn.value === 'desc' ? 'asc' : 'desc'
    view.renderStorage(model.sortChats, openStorageItemMenu)
    view.rotateDirectionAlphabet(sortingDirection)
}


function openStorageItemMenu(event) {
    const openMenu = event.currentTarget
    view.addActiveToStorageItem(openMenu)
    view.showStorageItemMenu(openMenu)
}

async function removeStorageItemById(event) {
    const storageItemMenu = event.currentTarget.closest('div')
    const chatId = storageItemMenu.dataset.id

    try {
        await model.authorizedDeleteChat(chatId)
        view.deleteStorageItem(chatId, storageItemMenu)
        
    } catch (error) {
        console.error(error.message)
    }
}

function closeStorageItemMenuIfOutside(event) {
    view.closeStorageItemMenuOutside(event)
}

function closeStorageItemMenuIfEsc(event) {
    view.closeStorageItemMenuEsc(event)
}

function setUsernameFromJwt() {
    const username = model.getUsernameFromJwt()
    view.setUsernameProfileLink(username)
}


