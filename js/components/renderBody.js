export async function renderBody() {
    const dataPage = document.body.dataset.page

    switch (dataPage) {
        case 'index': {
            const indexModule = await import ('..//controllers/indexController.js')
            indexModule.initController()
            break
        }

        case 'auth': {
            const authModule = await import ('../controllers/authController.js')
            authModule.initController()
            break
        }

        case 'login': {
            const loginModule = await import ('../controllers/loginController.js')
            loginModule.initController()
            break
        }

        case 'processing': {
            const processingModule = await import ('../controllers/processingController.js')
            processingModule.initController()
            break
        }

        case 'storage-item': {
            const storageItemModule = await import ('../controllers/storageItemController.js')
            storageItemModule.initController()
            break
        }
    }
}