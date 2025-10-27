import { Model } from '../models/processingModel.js'
import { View } from '../views/processingView.js'

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
    view.removeStyleUploadFileError()
    view.isFileUploaded()
    view.enableSendBtn()
}


async function handlingFormFile(event) {
    event.preventDefault()

    const validatedChatForm = model.serializeForm(this)

    let responseUpload

    try {
        responseUpload = await model.authorizedUploadFile(validatedChatForm)
        // console.log(responseUpload)
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

    view.disableStyleAfterProcessFile()
    view.addUploadedFileToStorage(responseUpload)
    
    
}

