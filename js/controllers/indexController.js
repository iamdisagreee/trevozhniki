import { Model } from '../models/indexModel.js'
import { View } from '../views/indexView.js'

const model = new Model()
const view = new View()

export function initController() {
    addEventListener()
}

function addEventListener() {
    view.elements.processingLink.addEventListener('click', handlingTokenProcessing)
    view.elements.storageLink.addEventListener('click', handlingTokenStorage)
}

function handlingTokenProcessing(event) {
    event.preventDefault()
    console.log(model.token.accessToken)
    view.catchNoAccessToken(
        model.token.accessToken,
        'processing.html'
    )
}

function handlingTokenStorage() {
    view.catchNoAccessToken(
        model.token.accessToken,
        'storage.html'
    )
}