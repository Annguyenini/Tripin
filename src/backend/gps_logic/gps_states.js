import * as Location from 'expo-location'
export const GPSSTATE ={
    'walk':{
        accuracy:Location.Accuracy.Balanced,
        distanceInterval: 5, // meters    
        ActivityType:Location.ActivityType.Fitness
    },
    'auto':{
        accuracy:Location.Accuracy.Balanced,
        distanceInterval: 500, // meters    
    },
    'stationary':{
        accuracy:Location.Accuracy.Lowest,
        distanceInterval: 5,
    }
}  
