

import * as SecureStore from 'expo-secure-store'


const KEY={
    USERNAME:'username',
    USERID:'userid',
    DISPLAYNAME:'displayname',
    USERROLE:'role'
}
export class UserDataService{
    constructor(){
        if(UserDataService.instance){
            return UserDataService.instance
        }
        this.user_id = null;
        this.user_name = null;
        this.display_name =null;
        this.trip_status = false;
        this.trip_name = null;
        this.user_role = null;
        UserDataService.instance = this;
    }
    setTripStatus(status, trip_name){
        this.trip_status = status;
        this.trip_name = trip_name;
    }

    async setUserId (user_id){
        this.user_id = user_id;
        try{
            await SecureStore.setItemAsync(KEY.USERID,user_id)
        }
        catch(secureStoreError){
            console.error(`Error to set ${KEY.USERID}`)
        }
    }
    async setUserName(user_name){
        this.user_name = user_name;
        try {
            await SecureStore.setItemAsync(KEY.USERNAME,user_name)
        }
        catch(secureStoreError){
            console.error(`Error at set key ${KEY.USERNAME}`)
        }

    }
    async setDisplayName(display_name){
        this.display_name = display_name;
        try {
            await SecureStore.setItemAsync(KEY.DISPLAYNAME,display_name)
        }
        catch(secureStoreError){
            console.error(`Error at set key ${KEY.DISPLAYNAME}`)
        }

    }
    async etUserRole(role){
        this.user_role =role
        try {
            await SecureStore.setItemAsync(KEY.USERROLE,role)
        }
        catch(secureStoreError){
            console.error(`Error at set key ${KEY.USERROLE}`)
        }
    }
    getUserId(){
        if(!this.user_id){
            return this.null;
        }
        return this.user_id
    }
    
    getUserName(){
        if(!this.user_name){
            return this.null;
        }
        return this.user_name
    }

    getDisplayName(){
        if(!this.display_name){
            return this.null;
        }
        return this.display_name
    }
    resetUserInfo(){
        this.display_name =null;
        this.user_name = null;
        this.user_id =null;
    }

}