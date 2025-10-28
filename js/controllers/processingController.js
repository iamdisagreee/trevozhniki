import { Model } from '../models/processingModel.js'
import { View } from '../views/processingView.js'
import { openStorageItemMenu } from './headerController.js'

const model = new Model()
const view = new View()

export function initController() {
    console.log("Test successfull!")
    view.disableSendBtn()
    addEventListener()
}

function addEventListener(){
    view.elements.formChatFile.addEventListener('change', addFilename)
    view.elements.formChat.addEventListener('submit', handlingFormFile)
}

function addFilename() {
    view.isFileUploaded()
    view.removeStyleUploadFileError()
    view.enableSendBtn()
}


async function handlingFormFile(event) {
    event.preventDefault()

    const validatedChatForm = model.serializeForm(this)

    let responseUpload

    try {
        responseUpload = (await model.authorizedUploadFile(validatedChatForm)).chat
        // console.log(responseUpload)
    }
    catch (error) {
        view.catchUploadError(error)
        return
    }

    view.preparingProcessing()

    const { id, filename } = responseUpload
    const chatId = id
    const bodyToProcessingFile = { chatId, filename } 
    view.disableStyleAfterProcessFile()

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

    // console.log(responseUpload)
    view.addUploadedFileToStorage(responseUpload, openStorageItemMenu)
    
    
}

