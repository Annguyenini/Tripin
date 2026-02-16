import TripContents from '../../backend/services/trip_contents'
import LocationService from '../local_data/local_location_data'
import locationDataService from '../../backend/storage/current_location_data_service'
import TripSync from './sync/trip_contents_sync'
import TripDatabaseService from '../../backend/database/TripDatabaseService'
import TripCoordinateDatabase from '../../backend/database/trip_coordinate_database'
import UserDataService from '../../backend/storage/user'
import CurrentDisplayCoordinateObserver from '../../frontend/map_box/functions/current_display_coordinates_observer'
import Albumdb from '../../backend/album/albumdb'
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
            return true
        }
        return false
    
    }

    async getTripCoordinatesHandler(trip_id){
        let coordinates 
        // step 1 get the version and asking the backend
        const version = await TripDatabaseService.getTripCoordinateVersion(trip_id)
        const respond = await TripContents.requestTripCoordinates(trip_id,version)
        if(!respond.ok) return false
        
        // if the backend have the same data as the local db have
        // we get it from local db and return
        if(respond.status ===304){
            coordinates = await this.TripCoordinateDatabaseService.getAllCoordinatesFromTripId(trip_id)     
            console.log(coordinates)
            return coordinates
        }
        // if the backend failed return None
        if (respond.status!==200) return null
        
        // if server have new or diff data
        const data = respond.data
        coordinates = data.coordinates
        // console.log(data)
        // if there are no data
        if(!data.coordinates) return null
        // if the data belong to the user
        // we stored, else we just return the data
        if(data.user_id === UserDataService.getUserId()){
            // if we stored the data correctly 
            if (await this.TripCoordinateDatabaseService.handlerCoordinateFromServer(coordinates,trip_id)){
                // we updated the version of data
                TripDatabaseService.updateTripCorrdinateVersion(trip_id,data.newest_version)
                }
        }
        return coordinates
    }
    async requestTripMediasHandler(trip_id){
        const version = await TripDatabaseService.getTripMediaVersion(trip_id)
        const respond = await TripContents.requestTripMedias(trip_id,version)
        let assests =[]
        if(respond.status ===304){
            assests = await Albumdb.getAssestsFromTripId(trip_id)
            return assests
        }
        else if (respond.status !==200) return []
        else return respond.data.medias

    }
    async uploadTripImageHandler(version,trip_id,imageUri){
        if (!imageUri)return
        try{
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
        catch(err){
            console.error(err)
        }   
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