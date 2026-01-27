import TripContents from '../../backend/services/trip_contents'
import LocationService from '../local_data/local_location_data'
import locationDataService from '../../backend/storage/current_location_data_service'
import TripSync from './sync/trip_sync'
import TripDatabaseService from '../../backend/database/TripDatabaseService'
import TripCoordinateDatabase from '../../backend/database/trip_coordinate_database'
class TripContentHandler{
    constructor(){
        this.TripCoordinateDatabaseService = new TripCoordinateDatabase()
    }

    async sendCoordinatesHandler(coors_object,version=null){
        console.log('prepare', coors_object,version)
        const respond = await TripContents.send_coordinates(coors_object,version)
        
        if (respond.status ===409){
            // prevent duplicate sync
            if(TripSync.coordinatesSyncing){
                TripSync.addIntoQueue('coordinate',version,coors_object)   
                return respond.ok
            }
            console.log('missing')
            await TripSync.processTripCoordinatesSync(respond.data.missing_versions)
        }
        return respond.ok
    }




    async requestLocationConditionsHandler(){
        const coors = await LocationService.getCurrentCoor()
        if(!coors){
            return false
        }
        const longitude = coors.coords.longitude
        const latitude = coors.coords.latitude
        const respond = await TripContents.request_location_conditions(longitude,latitude)
        if(!respond.ok||respond.status!== 200) return false
        const data = respond.data
        if (data.geo_data){
            await locationDataService.setCurrentLocationConditionToLocal(data.geo_data)
            await locationDataService.setCurrentCityToLocal(data.city)
            return true
        }
        return false
    
    }

    async requestTripCoordinatesHandler(trip_id){
        const version = await TripDatabaseService.getTripCoordinateVersion(trip_id)
        const respond = await TripContents.requestTripCoordinates(trip_id,version)
        if(!respond.ok) return false
        if (respond.status!==200) return false
        if(respond.status ===304) return true
        const data = respond.data
        if (data.coordinates){
            if (await this.TripCoordinateDatabaseService.handlerCoordinateFromServer(data.coordinates))
            {
                await TripDatabaseService.updateTripCorrdinateVersion(trip_id,data.newest_version)
            }
        }
        return true
    }
    async uploadTripImageHandler(version,trip_id,imageUri){
        if (!imageUri)return
        const coor = await LocationService.getCurrentCoor()
        const longitude = coor.coords.longitude
        const latitude = coor.coords.latitude
        const respond = await TripContents.sendTripImage(version,trip_id,imageUri,longitude,latitude)
        console.log(respond)
        const data = respond.data
        if (respond.status === 409){
            await TripSync.processTripMediaSync(data.missing_versions)
        }
        if(!respond.ok || respond.status !==200) return 

        return respond   
    }
    async uploadTripVideoHandler(video_version,trip_id,videoUri){
        if (!videoUri)return
        const coor = await LocationService.getCurrentCoor()
        const longitude = coor.coords.longitude
        const latitude = coor.coords.latitude
        const respond = await TripContents.sendTripVideo(trip_id,video_version,videoUri,longitude,latitude)
         const data = respond.data
        if (respond.status === 409){
            await TripSync.processTripMediaSync(data.missing_versions)
        }
        if(!respond.ok || respond.status !==200) return 
        return respond   
    }
    // async requestSTripMedias (){
    //     console.log(CurrentTripDataService.getCurrentTripId())
    //     const respond = await TripContents.requestTripMedias(CurrentTripDataService.getCurrentTripId())
    //     if(!respond.ok || respond.status !==200) return
    //     const data = respond.data
    //     await TripContentsDataService.setCurrentMedias(data.medias)
    // }
}

export default new TripContentHandler()