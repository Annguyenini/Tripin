import * as Location from 'expo-location'
export const GPSSTATE ={
    'walk':{
        accuracy:Location.Accuracy.High,
        distanceInterval: 5, // meters    
        ActivityType:Location.ActivityType.Fitness
    },
    'auto':{
        accuracy:Location.Accuracy.High,
        distanceInterval: 500, // meters    
    }
}  
