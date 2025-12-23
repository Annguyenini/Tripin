class LocalData{

    /**
     * Default abstract object 
     */
    constructor(){
        if (new.target === LocalData){
            throw new Error ("Cannot call a abstract object!")
        }
    }
    initialize(){
        throw new Error("Missing an init fucntion!")
    }

}
export default LocalData