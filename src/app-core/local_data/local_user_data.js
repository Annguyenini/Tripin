import { Alert } from "react-native";
import UserDataService from "../../backend/storage/user";
import LocalData from './local_data'
import { DATA_KEYS } from "../../backend/storage/storage_keys";
class UserData extends LocalData{
    /**
     * 
     */
    constructor(){
        super()
        this.user_name = null;
        this.display_name = null;
        this.user_id =null
        this.initialize()
        UserDataService.attach(this,DATA_KEYS.USER.USER_DATA)

    }
    /**
     * construct initial value
     */
    async initialize(){
        const user_data = await UserDataService.getUserData()
        if(!user_data){
            return 
        }
        this.user_name = user_data.user_name;
        this.display_name = user_data.display_name;
        this.user_id = user_data.user_id;
    }
    /**
     * callback from userDataService
     * @param {object} new_data_object 
     * @returns 
     */
    update(new_data_object){
        if (!new_data_object){
             this.user_name = null;
            this.display_name = null;
            this.user_id = null;
            return;}
        this.user_name = new_data_object.user_name;
        this.display_name = new_data_object.display_name;
        this.user_id = new_data_object.user_id;
    
    }
    /**
     * detach from update/
     */
    destroy(){
        UserDataService.detach(this,DATA_KEYS.USER.USER_DATA)
    }
    
    
}
const userdata = new UserData()
export default userdata