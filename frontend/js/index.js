const processingLink = document.querySelector('#processing__link')
const storageLink = document.querySelector('#storage__link')

// console.log(processingLink)

processingLink.addEventListener('click', async (event) => {
    event.preventDefault()
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken){
        window.location.href = "http://127.0.0.1:5500/login.html"
    }
    else {
        window.location.href = "http://127.0.0.1:5500/processing.html"
    }
})