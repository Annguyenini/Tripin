import * as SecureStore from 'expo-secure-store'
// import { setSurfaceProps } from 'react-native/types_generated/Libraries/ReactNative/AppRegistryImpl';


export class Auth{
    constructor(){};
    async requestLogin(username,password){
        const request = await fetch('http://127.0.0.1:5000/login',{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            username:username,
            password:password 
        })});
        const respond = await request.json();
        SecureStore.setItemAsync("refresh_token",respond.refresh_token)
        SecureStore.setItemAsync("access_token",respond.access_token)
        return request.status;
     } 
    async authenticateToken(key){
        const token = await SecureStore.getItemAsync(key);
        const respond = await fetch('http://127.0.0.1:5000/login/token',{
            method : "POST",
            headers:{"Content-Type":"application/json",
                "Authorization": `Bearer${token}`
            } 
            
        });
        const message = await respond.json();
        if(message.status==401){
            return ({"message":message.Message,"status": 401})
        }
        return({"message":message.Message,"status": 200,"userdatas":message.userdatas})
        
    }
    async requestSignup(email,displayName,username,password){
        const request = await fetch('http://127.0.0.1:5000/signup',{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            email:email,
            displayName:displayName,
            username:username,
            password:password 
        })});
        const respond = await request.json();
        console.log(respond)
        return {"status":request.status,"message":request.message};
    }   
    }