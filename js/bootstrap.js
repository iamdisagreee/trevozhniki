import { renderAppHeader } from './components/appHeader.js'

document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.page
    // renderAppHeader()

    switch (page) {
        case 'index': {
            const indexModule = await import ('./controllers/indexController.js')
            indexModule.initController()
            break
        }

        case 'auth': {
            const authModule = await import ('./controllers/authController.js')
            authModule.initController()
            break
        }

        case 'login': {
            const loginModule = await import ('./controllers/loginController.js')
            loginModule.initController()
            break
        }

        case 'processing': {
            const processingModule = await import ('./controllers/processingController.js')
            processingModule.initController()
            break
        }

        case 'storage-item': {
            const storageItemModule = await import ('./controllers/storageItemController.js')
            storageItemModule.initController()
            break
        }
        
        case 'storage': {
            const storageModule = await import ('./controllers/storageController.js')
            storageModule.initController()
            break
        }
    }
})