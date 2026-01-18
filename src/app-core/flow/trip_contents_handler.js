import TripContents from '../../backend/services/trip_contents'
import LocationService from '../local_data/local_location_data'
import locationDataService from '../../backend/storage/location'
import TripContentsDataService from '../../backend/storage/trip_contents'
import CurrentTripDataService from '../../backend/storage/current_trip'
import TripSync from './sync/trip_sync'
class TripContentHandler{


    async sendCoordinatesHandler(coors_object,version=null){
        console.log('prepare', coors_object,version)
        const respond = await TripContents.send_coordinates(coors_object,version)
        if (respond.status ===409){
            // prevent duplicate sync
                        console.log('missing1')

            if(TripSync.coordinatesSyncing){
                            console.log('missing2')

                TripSync.addIntoQueue('coordinate',version,coors_object)
                return null
            }
            console.log('missing')
            await TripSync.processTripCoordinatesSync(respond.data.missing_versions)
        }
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