export class UserDataService{
    constructor(){
        if(UserDataService.instance){
            return UserDataService.instance
        }
        this.user_id = null;
        this.user_name = null;
        this.display_name =null;
        UserDataService.instance = this;
    }

    setUserId (user_id){
        this.user_id = user_id;
    }
    setUserName(user_name){
        this.user_name = user_name;
    }
    setDisplayName(display_name){
        this.display_name = display_name;
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
}