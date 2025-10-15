import { Model } from '../models/processingModel.js'
import { View } from '../views/processingView.js'

const model = new Model()
const view = new View()

export function initController() {
    console.log("Test successfull!")
    addEventListener()
}

function addEventListener(){
    view.elements.formChat.addEventListener('submit', handlingFormFile)
    view.elements.formChatFile.addEventListener('change', addFilename)
}

async function handlingFormFile(event) {
    event.preventDefault()

    const validatedChatForm = model.serializeForm(this)

    let responseUpload

    try {
        responseUpload = await model.authorizedUploadFile(validatedChatForm)
    }
    catch (error) {
        view.catchUploadError(error)
        return
    }

    view.preparingProcessing()

    const { chatId, filename } = responseUpload
    const bodyToProcessingFile = { chatId, filename } 

    let responseProcessing
    try {
        responseProcessing = await model.authorizedProcessingFile(bodyToProcessingFile)
    } catch (error) {
       view.catchProcessingError()
       return
    }

    view.finalProcessing()
    
    const startPosition = 0
    view.printingText(responseProcessing.text, startPosition)
    
    
    // + Логика добавления нового чата в общий список 
}

function addFilename() {
    view.isFileUploaded()
}

