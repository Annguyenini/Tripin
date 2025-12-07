class CoordinateService {
    constructor(){
        if(CoordinateService.instance) return CoordinateService.instance;
        CoordinateService.instance = this;
        this.current_lat = null;
        this.current_lng = null;
        this.current_speed = null;
        this.current_altitude = null;
        this.current_heading = null;
    }
    setCurrentAttribute(lat,lng,speed,altitude,heading){
        
    }

}