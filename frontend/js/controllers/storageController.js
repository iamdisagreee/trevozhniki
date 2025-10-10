import { Model } from '../models/storageModel.js'
import { View } from '../views/storageView.js'

const model = new Model()
const view = new View()

export async function initController() {
    console.log("Test successfull!")
    
    let responseStorage 
    try {
        responseStorage = await model.authorizedGetAllChats()
    } catch (error){
        console.error(error.message)
    }

    view.renderPage(responseStorage, onDeleteChat)
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


