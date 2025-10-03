import { handlingUnathorizedError } from './token.js'



const formChat = document.querySelector('.form__chat')
const formChatFile = document.querySelector('.form__chat-file')
const formChatStatus = document.querySelector('.form__chat-status')
// const formChatFileChange = document.querySelector('.form__chat-file-change')
const formChatBtn = document.querySelector('.form__chat-btn')
const formChatBtnSvg = document.querySelector('.form__chat-btn-svg')
const loader = document.querySelector('.loader')
const out = document.querySelector('.out')

formChat.addEventListener('submit', preventHandlingFormFile)
formChatFile.addEventListener('change', addFilename)

// const chat = document.querySelector('.chat')



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

        return data

    } catch (exception) {
        throw exception
    }
}

async function processingFile(body, token) {
    try {
        const response = await fetch('http://127.0.0.1:8002/api/v1/messages/processingfile', {
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

        return data

    } catch (exception) {
        throw exception
    }
}

function printingText(text, position) {
    if (position === text.length) return
    out.textContent += text[position]
    // out.scrollIntoView(
    //     false
    //     // {behavior: "smooth", block: "end", inline: "end"}
    // )
    setTimeout(() => printingText(text, position+1), 0)
}

async function preventHandlingFormFile(event) {
    event.preventDefault()
    if (!formChatFile.files.length){
        formChatStatus.textContent = "Файл не загружен!!!!"

    }
    return await handlingFormFile()
}

async function handlingFormFile(){
    let responseUpload
    const accessToken = localStorage.getItem('access_token')
    const validatedForm = serializeForm(formChat)
    console.log(Array.from(validatedForm.entries()))
    try{
        responseUpload = await uploadFile(validatedForm, accessToken) 
    } catch (exception) {
        let message
        switch (exception.status){
            case 401: {
                await handlingUnathorizedError()
                responseUpload = await handlingFormFile()
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
            formChatStatus.textContent = message 
            console.log(exception.message)
        }
        return
    }

    formChatBtn.disabled = true
    formChatFile.disabled = true
    formChatStatus.textContent = ''
    loader.classList.remove('hidden')
    formChatBtnSvg.classList.remove('form__chat-btn-svg--active')

    
    // try {
    //     responseProcessing = await processingFile(accessToken)
    // } 
    // catch (exception) {
    //     let message
    //     switch (exception.status) {
    //         case 401: {
    //             await handlingUnathorizedError()
    //             responseProcessing = await processingFile()
    //             break
    //         }
    //         default:
    //             message = 'Попробуй еще раз!'
    //     }
    //     if (message.status != 401) {
    //         console.log(exception.message)
    //     }
    //     return
    // }

    loader.classList.add('hidden')
    out.classList.remove('hidden')
    // const startPosition = 0
    // printingText(responseProcessing.text, startPosition)

    const startPosition = 0
    printingText(`
        Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!
        Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!
        Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!
        Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!
        Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!
        Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!
        Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!Сааааамыыый ллууууучшииий дееень заааахоооодииил вчееееера-а-а-а-а!!!
    `, startPosition)
}

function addFilename(){
    // console.log(fileInput)
    if (formChatFile.files.length > 0){
        formChatStatus.textContent = formChatFile.files[0].name
        formChatBtnSvg.classList.add('form__chat-btn-svg--active')
    }
}



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
