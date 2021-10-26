import axios from "axios"
import {ML_API_URL} from '../constants'

export class LocationRepository {
    async getRange(start, end) {
        return axios.get(`${ML_API_URL}/locations?start=${start}&end=${end}`)
    }
    
    async  getAll(){
        return axios.get(`${ML_API_URL}/locations`)
    }
}