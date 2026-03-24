import SqliteService from '../../../backend/database/sqlite/sqlite'
import CurrentTripDataService from '../../../backend/storage/current_trip'
import TripContentsService from '../../../backend/services/trip_contents'
import TripDatabaseService from '../../../backend/database/TripDatabaseService'
import UserDataService from '../../../backend/storage/user'
import { _registerNetworkCallback } from './network_observer'
class TripSync {
    constructor(){
        this.pennding = []
        this.syncing = false
        this.coordinatesSyncing = false
        this.mediasSyncing = false
        _registerNetworkCallback(this.networkCallback.bind(this))
    }
    addIntoQueue(itemType,version=null,data){
        this.pennding.push({
            'version':version,
            'itemType':itemType,
            'data':data
        })
    }
    networkCallback(state){
        if (state) this.process()
    }
    /**
     * process syncing for trip contents including coords and medias
     * @returns 
     */
    async process(){
         if (this.syncing) return
        this.syncing = true
        while(this.pennding.length !==0){
            const item = this.pennding[0]
            console.log(item)

            switch(item.itemType){
                case 'coordinate':
                    await TripContentsService.send_coordinates(item.data,item.version)
                    break;
                case 'media':
                    await TripContentsService.sendTripMedia(item.data.media_id,CurrentTripDataService.getCurrentTripId(),item.data.media_path,item.data.longitude,item.data.latitude,item.data.media_type,item.data.coordinate_id)
                    break;
                
                case 'delete_media':
                    await TripContentsService.deleteMedias(item.data.trip_id,item.data.media_id)
                    break;
            }
            this.pennding.shift()
            
        }
        this.syncing = false
    }
    async processTripMediaSync(server_version){
        const DB = await SqliteService.connectDB()
        const user_id = UserDataService.getUserId()
        const trip_id = CurrentTripDataService.getCurrentTripId()
        const medias = await DB.getAllAsync(`SELECT * FROM user_${user_id}_album WHERE trip_id = ? AND version >= ?`,[trip_id,server_version])
        for(const media of medias){
            this.addIntoQueue(media.media_type,media.version,media)
        }
        await this.process()
    }
    async processTripCoordinatesSync(server_version){
        this.coordinatesSyncing = true
        const DB = await SqliteService.connectDB()
        const current_version = await TripDatabaseService.getTripCoordinateVersion(CurrentTripDataService.getCurrentTripId())
        // const all_trip_coords = await DB.getAllAsync(`
        //     SELECT * FROM trip_${CurrentTripDataService.getCurrentTripId()} 
        //     WHERE version >= ?
        //     `,[server_version])

        
        for(let i = server_version+1; i <= current_version; i++){
            try{
                const rows = await DB.getAllAsync(`SELECT * FROM trip_${CurrentTripDataService.getCurrentTripId()} WHERE version = ?`,[i])
                const payload = rows.map(row=>({
                    time_stamp: row.time_stamp,
                    coordinates: {
                    latitude: row.latitude,
                    longitude: row.longitude,
                    altitude: row.altitude,
                    speed: row.speed,
                    heading: row.heading,
                    event: row.event,
                    coordinate_id:row.coordinate_id
                    },
                }))
                this.addIntoQueue('coordinate',i,payload)
            }
            catch(err){
                console.error(err)
            }
        }
        await this.process()
        this.coordinatesSyncing = false
    }
    
}
export default TripSync = new TripSync()