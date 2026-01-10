import TripContents from '../../backend/services/trip_contents'
import LocationService from '../local_data/local_location_data'
import locationDataService from '../../backend/storage/location'
import TripContentsDataService from '../../backend/storage/trip_contents'
import CurrentTripDataService from '../../backend/storage/current_trip'
class TripContentHandler{
    async sendCoordinatesHandler(coors_object){
        const respond = await TripContents.send_coordinates(coors_object)
        return respond
    }
    async requestLocationConditionsHandler(){
        const coors = await LocationService.getCurrentCoor()
        if(!coors){
            return false
        }
        const longitude = coors.coords.longitude
        const latitude = coors.coords.latitude
        const respond = await TripContents.request_location_conditions(longitude,latitude)
        if(respond.status!== 200) return false
        const data = respond.data
        if (data.geo_data){
            await locationDataService.setCurrentLocationCondition(data.geo_data)
            await locationDataService.setCurrentCity(data.city)
            return true
        }
        return false
    
    }
    async requestCurrentTripCoordinatesHandler(){
        const respond = await TripContents.requestCurrentTripCoordinates()
        if (respond.status!==200) return false
        const data = respond.data
        if (data.coordinates){
            await TripContentsDataService.SetCurrentCoordinates(data.coordinates)
        }
    }
    async uploadTripImageHandler(imageUri){
        if (!imageUri)return
        const coor = await LocationService.getCurrentCoor()
        const longitude = coor.coords.longitude
        const latitude = coor.coords.latitude
        const respond = await TripContents.sendTripImage(imageUri,longitude,latitude)
        return respond   
    }
    async uploadTripVideoHandler(videoUri,thumbnailsUri){
        if (!videoUri)return
        const coor = await LocationService.getCurrentCoor()
        const longitude = coor.coords.longitude
        const latitude = coor.coords.latitude
        const respond = await TripContents.sendTripVideo(videoUri,thumbnailsUri,longitude,latitude)
        return respond   
    }
    async requestCurrentTripMedias (){
        const respond = await TripContents.requestTripMedias(CurrentTripDataService.getCurrentTripId())
        if(respond.status !==200) return
        const data = respond.data
        await TripContentsDataService.setCurrentMedias(data.medias)
    }
}

export default new TripContentHandler()