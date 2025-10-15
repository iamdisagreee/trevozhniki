import { renderHeader } from './components/renderHeader.js'
import { renderBody } from './components/renderBody.js'

document.addEventListener('DOMContentLoaded', async () => {  
    renderHeader()
    await renderBody()
})