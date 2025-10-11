import { ApiService } from '../services/apiService.js'
import { TokenService } from '../services/tokenService.js'


export class Model {
    constructor() {
        this.api = new ApiService()
        this.token = new TokenService()
    }
}