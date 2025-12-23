class TripState{
    constructor(){
        this.states={
            isOnATrip : null,
            get(prop){
                return this[prop]
            },
            set(prop,value){
                this[prop] = value
            }

        }
        this.observers = {}
    }
    attach (observer,key){
        if(!this.observers[key]){
            this.observers[key] = []
        }
        this.observers[key].push(observer)
    }
    dettach(observer,key){
        if (!this.observers[key]) return;
        this.observers = this.observers[key].filter(obs => obs !== observer
        )
    }
    notify(key){
        this.observers[key].forEach(obs => {
            obs.update(this.states.get[key])
        });
    }
    set(key,value){
        this.states.set(key,value)
    }

}

const trip = new TripState()
export default trip