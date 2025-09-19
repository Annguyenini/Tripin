class Auth{
    constructor(){};
    async requestLogin(username,password){
        const request = await fetch('/POST/authverify',{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            username:username,
            password:password 
        })});
        const respond = request.json();
        
     } 
    async requestSignup(email,displayName,username,password){
        const request = await fetch('/POST/authsignup',{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            email:email,
            displayName:displayName,
            username:username,
            password:password 
        })});
        const respond = request.json();
    }   
    }