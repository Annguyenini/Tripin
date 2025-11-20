export class CoordinatesMap{
    constructor(){
        if (CoordinatesMap.instance) return CoordinatesMap.instance;
        CoordinatesMap.instance = this;
        this.map = new Map();
    }


    push (key,value){
        this.map.set(key,value);
    }

    delete(key){
        this.map.delete(key);
    }
    clear(){
        this.map.clear();
    }

}



