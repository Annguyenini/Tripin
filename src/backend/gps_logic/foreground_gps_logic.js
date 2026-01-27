import * as Location from 'expo-location'
import locationDataService from '../storage/current_location_data_service'
let subcription 
export const startForegroundGPSTracker =async()=>{
    console.log('start')
    
   subcription = await Location.watchPositionAsync(
    {
        accuracy: Location.Accuracy.High,
        // timeInterval:50000,
        distanceInterval:2,
    },
    (location)=>{
        getCityData(location)
    },
    (error)=>{
        console.error(error)
    }
)
}
export const endForegroundGPSTracker = async()=>{
    console.log('end')
    if(subcription){
        subcription.remove()
        subcription =null
    }
}
const getCityData = async(location)=>{
    const city_object = await Location.reverseGeocodeAsync({
            accuracy:Location.Accuracy.High,
            altitude:location.coords.altitude,
            latitude:location.coords.latitude,
            longitude:location.coords.longitude
        })
    locationDataService.setCurrentCity(city_object[0].city)
    // console.log(city_object)
}