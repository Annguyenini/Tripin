import {EventEmitter} from 'events'
// const eventBus =new EventEmitter()
// export default eventBus

class UiEventBus{
    constructor(){
        this.observers ={}
        this.items ={}
    }
    on(key,obs){
        if(!this.observers[key]){
            this.observers[key] =[]
        }
        this.observers[key].push(obs)
    }
    off(key,obs){
        this.observers[key] = this.observers[key].filter((ob)=>ob !==obs) 
    }
    getValueFromKey(key){
        return this.items[key]
    }
    emit(key,val){
        this.items[key] =val
        for(const obs of this.observers[key]){
            obs(val)
        }
    }
}
export default new UiEventBus