export class ApiService {
    constructor() {}

    async request(url, options = {}) {
        try {
            const response = await fetch(url, options)

            const data = await response.json()

            if (!response.ok){
                const error = new Error(`${response.status} ${data.detail}`)
                error.status = response.status
                throw error
            } 
  
            return data
        } catch (error) {
            throw error
        }
    }
}