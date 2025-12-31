class Subject {
    constructor(){
        this.observers ={}
    }
    attach(observer,key){
        if(!this.observers[key]){
            this.observers[key] = []
        }
        this.observers[key].push(observer)
    }
    detach (observer,key){
        if(!this.observers[key])return
        this.observers[key]= this.observers[key].filter(obs => obs!==observer)
    }
    notify(key,data){
        if(!this.observers[key])return
        for (const obs of this.observers[key]){
            obs.update(data)
        }

    }
}
export default Subject