// const openConfirm = document.querySelector('.open-confirm')
// const closeConfirm = document.querySelector('.close-confirm')
const formAuth = document.querySelector('.form__auth')
const formCode = document.querySelector('.form__code')


function serializeForm(authForm) {
    const { elements } = authForm;

    const validatedForm = Array.from(elements)
        .filter((el) => el.value)
        .reduce((acc, el) => { 
            acc[el.name] = el.value;
            return acc  
        }, {})

    return validatedForm
}


async function validateAuthForm(body){
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/validate-auth-form', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: 
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        .then(response => response.json())
        console.log(response)
    } catch (e) {
        throw e
    }
}  


async function sendConfirmationCode(emailBody) {
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/send-confirmation-code', {
            method: 'POST',
            body: JSON.stringify(emailBody),
            headers: 
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        .then(response => response.json())
        console.log(response)
    } catch (e) {
        throw e
    }
}

async function confirmCode(body) {
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/confirm-code', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: 
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        .then(response => response.json())
        console.log(response)
    } catch (e) {
        console.log(e)
    }    
}

async function addUser(body) {
    try{
        const response = await fetch('http://127.0.0.1:8001/api/v1/auth/', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: 
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        .then(response => response.json())
        console.log(response)
    } catch (e) {
        console.log(e)
    }    
}


formAuth.addEventListener('submit', async (event) => {
    event.preventDefault()
    
    const validatedForm = serializeForm(formAuth)
    
    const toValidateAuthForm = {
        'email': validatedForm.email,
        'username': validatedForm.username
    }

    await validateAuthForm(toValidateAuthForm)

    // copyAuthForm = authForm.cloneNode(true);

    formAuth.classList.remove('form__inner--active')
    formCode.classList.add('form__inner--active')

    const emailBody = {'email': validatedForm.email}

    try{
        await sendConfirmationCode(emailBody)
    } catch (e) {
        console.error(`Что-то пошло не так: ${e}`)
    }

    // try{
    //     await confirmCode(enteredCode)
    // } catch (e) {
    //     console.error('Увы... Неправильный пароль броузи')
    // }

    // await addUser(JSON.stringify(validatedForm))
})

formCode.addEventListener('submit', async (event) => {
    event.preventDefault()

    const validatedForm = serializeForm(formAuth)
    const emailBody = {'email': validatedForm.email}

    const validatedCodeForm = serializeForm(formCode)

    console.log(Object.assign(emailBody, validatedCodeForm))

    try {
        await confirmCode(
            Object.assign(emailBody, validatedCodeForm)
        )
    } catch (e) {
        console.error('Увы... Неправильный пароль броузи')
    }

    await addUser(validatedForm)
})




// document.getElementById('btn').addEventListener('click', function () {
//   window.location.href = 'http://site.ru';
// });


// function serializeForm(authForm) {
//     console.log(authForm.elements)
// }



// function sendConfirmationCode(email){
//     try{
//         return makeAuthenticatedRequest('127.0.0.1:8001/api/v1/auth/send-confirmation-code', 'POST',
//             JSON.stringify(email)
//         )
//     } catch (error){
//         console.log(error)
//     }
// }


// function openModalAndBlockScrool() {
//     confirm.showModal()
//     console.log('asd')
//     document.body.classList.add('scroll-block')
// }

// function returnScroll() {
//     document.body.classList.remove('scrool-block')
// }

// function close() {
//     confirm.close()
//     returnScroll()
// }

// openConfirm.addEventListener('click', () => openModalAndBlockScrool())
// closeConfirm.addEventListener('click', () => close())
// confirm.addEventListener('cancel', (event) => event.preventDefault())

// Нажали на пространство вне диалога - то закрываем
// function closeOnOverlayClick({currentTarger, target}){
//     const dialog = currentTarger;
//     const isOnOverlayClick = targer === dialog
//     if (isOnOverlayClick){
//         close()
//     }
// }

// dialog.addEventListener('click', closeOnOverlayClick)

// При нажатии на ESC закрывается
// dialog.addEventListener('cancel', () => returnScroll())