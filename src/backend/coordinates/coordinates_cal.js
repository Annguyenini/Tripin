class CoordinatesCal{
    static instance

    constructor(){
        if(CoordinatesCal.instance) return CoordinatesCal.instance;
        CoordinatesCal.instance = this;
    }
    init_var(){
        this.currentCoors =null;
    }
    haversineDistance (lat1, lat2, lng1,lng2){
        // a = sin^2 (delta lat(rad)/2) +cos(lat1)* cos(lat2) *sin^2(delta lng(rad)/2)
        // c = 2 arctan 2(sqrt (a),sqrt(1-a) )
        // return D = R*c
        const R = 6371000
        const Rdel_lat = toRad(lat2-lat1);
        const Rdel_lng = toRad(lng2-lng1);
        const a  = (Math.sin(Rdel_lat/2)**2) + (Math.cos(toRad(lat1))* Math.cos(toRad(lat2)) * Math.sin(Rdel_lng/2)**2);
        const c = 2 *Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
        const D = R * c;
        return D
    }
}