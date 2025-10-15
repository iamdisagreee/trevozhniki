export async function renderHeader() {
    
    const header = document.querySelector('.header')
    if (!header) {
        return
    }
    const response = await fetch('../../header.html')
    const html = await response.text()

    header.innerHTML = html

    const oldScripts = header.querySelectorAll('script')

    oldScripts.forEach(oldScript => {
        const newScript = document.createElement('script')
        
        if (oldScript.src) {
            newScript.src = oldScript.src
        } else {
            newScript.textContent = oldScript.textContent
        }
        newScript.type = oldScript.type || 'text/javascript'
        newScript.defer = true
        oldScript.remove()

        document.head.appendChild(newScript)
    })

    
}

