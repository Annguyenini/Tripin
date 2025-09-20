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
        console.log(respond)
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
        return respond;
    }   
    }