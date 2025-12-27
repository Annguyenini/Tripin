class MachineState{
    constructor(){
        this.State = 'NOTREADY'
        this.observers = []
    }
    attach(observer){
        this.observers.push(observer)
        console.log('add',this.observers)

    }
    detach(observer){
        this.observers = this.observers.filter(obs=>obs!==observer)
    }
    notify(){
        console.log('called')
        this.observers.forEach(obs => obs.update(this.State))
    }
    setState(key){
        this.State = key
        console.log('set',this.State)
        this.notify()
    }
}

const ms = new MachineState
export default ms