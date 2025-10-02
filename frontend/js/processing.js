import { handlingUnathorizedError } from './token.js'



const formFile = document.querySelector(".form__file")
const chat = document.querySelector('.chat')
const out = document.querySelector('.out')



function serializeForm(formLogin) {
    return new FormData(formLogin)
}


async function uploadFile(body, token) {
    try {
        const response = await fetch('http://127.0.0.1:8002/api/v1/messages/uploadfile', {
        method: 'POST',
        body: body,
        headers: 
        {   
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })
        
        const data = await response.json()

        if (!response.ok){
            const error = new Error(`${response.status} ${data.detail}`)
            error.status = response.status
            throw error
        }

    } catch (exception) {
        throw exception
    }

}
async function preventProcessingFormFile(event) {
    event.preventDefault()
    return await processingFormFile()
}


async function processingFormFile(){
    const accessToken = localStorage.getItem('access_token')
    const validatedForm = serializeForm(formFile)
    try{
        await uploadFile(validatedForm, accessToken) 
    } catch (exception) {
        let message
        switch (exception.status){
            case 401: {
                await handlingUnathorizedError()
                await processingFormFile()
                break
            }
            case 400:
                message = 'Некорректное расширение файла!'
                break
            case 413:
                message = 'Недопустимый размер файла!'
                break          
            case 415:
                message = 'Некорректное содержимое файла!'    
                break
            default:
                message = 'Попробуй еще раз!'
        }
        if (exception.status != 401){
            const existMistake = formFile.querySelector('.form__file-mistake')
            if (!existMistake){
                formFile.insertAdjacentHTML(
                    'beforeend',
                    `<span class="form__file-mistake"> ${message}</span>`
                )
            }
            else {
                existMistake.innerHTML = `
                <span class="form__file-mistake"> ${message}</span>`
            }
            console.log(exception.message)
        }
        return
    }

    formFile.classList.remove('messages--active')
    chat.classList.add('messages--active')


    const str = 'Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!'

    let position = 0
    const typeText = () => {
        if (position === str.length) return
        out.textContent += str[position]
        position++
        setTimeout(typeText, 200)
    }
    typeText()
}



formFile.addEventListener('submit', preventProcessingFormFile)


// const str = 'Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!'

// let position = 0

// const typeText = () => {
//     if (position === str.length) return
//     out.textContent += str[position]
//     position++
//     setTimeout(typeText, 50)
// }


// function getRandomInt(min = 50, max = 750){
//     return Math.floor(min + Math.random() * (max + 1 - min))
// }

// typeText()
