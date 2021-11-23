import axios from "axios"
import {ML_API_URL} from '../constants'

export class TimeLineRepository {

    async getRange(start, end) {
        return axios.get(`${ML_API_URL}/v1/timeline?start=${start}&end=${end}`)
    }
    
    async  getAll(){
        return axios.get(`${ML_API_URL}/v1/timeline`)
    }
}