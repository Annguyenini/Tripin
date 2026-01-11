import LocalStorage from "../../storage/localStorage";
// import { ETAG_KEY } from "./etag_keys";
class EtagService extends LocalStorage{
    constructor(){
        super()
    }
    async saveEtagToLocal(key,etag){
        await this.saveToLocal(key,etag)
        return 
    }
    async getEtagFromLocal(key){
        return await this.getDataFromLocal(key)
    }
    async deleteEtagFromLocal(key){
        return await this.deleteDataFromLocal(key)
    }
}
export default new EtagService()