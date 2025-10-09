export class View {
    constructor() {}

    elements = {
        processingLink: document.querySelector('#processing__link'),
        storageLink: document.querySelector('#storage__link')
    }

    catchNoAccessToken(accessToken, page) {
        if (!accessToken) {
            window.location.href = "http://127.0.0.1:5500/login.html"
        } else {
            window.location.href = `http://127.0.0.1:5500/${page}`
        }
    }
}