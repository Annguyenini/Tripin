import LocalStorage from "../backend/storage/base/localStorage"
import {TRACKING_MODE} from "../backend/tracking/tracking_mode"
import { STORAGE_KEYS } from "../backend/storage/keys/storage_keys"
import safeRun from "./helpers/safe_run"
class Setting extends LocalStorage{
    constructor(){
        super()

        this._tracking_mode = TRACKING_MODE.MEDIAS_ONLY
       
    }
    async setTrackingMode(mode){
        /**
         * mode from TRACKING_MODE
         */
        if (!await this.saveToLocal(STORAGE_KEYS.SETTINGS.TRACKING_MODE,mode)){
            return false
        }
        console.log('tracking mode',mode)
        this._tracking_mode = mode
        return true
    }
    async init(){
        const tracking_type =await this.getDataFromLocal(STORAGE_KEYS.SETTINGS.TRACKING_MODE)  
        this._tracking_mode = tracking_type ?? TRACKING_MODE.MEDIAS_ONLY
    }
    getTrackingMode (){
        return this._tracking_mode
    }

}
export default new Setting