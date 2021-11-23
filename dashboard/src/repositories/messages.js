import axios from "axios"
import {ML_API_URL} from '../constants'

export class MessageRepository {
    async getRange(start, end) {
        return axios.get(`${ML_API_URL}/v2/messages?start=${start}&end=${end}`)
    }
    
    async  getAll(){
        return axios.get(`${ML_API_URL}/v2/messages`)
    }
}