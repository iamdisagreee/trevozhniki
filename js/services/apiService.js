export class ApiService {
    constructor() {}

    async request(url, options = {}) {
        try {
            console.log(url, options)
            const response = await fetch(url, options)
            console.log(response.status)

            const data = await response.json()

            if (!response.ok){
                const error = new Error(`${response.status} ${data.detail}`)
                error.status = response.status
                throw error
            } 
  
            return data

        } catch (error) {
            console.log(error.message)
            // console.log(error.message)
            throw error
        }
    }
}