import SqliteService from '../../../backend/database/sqlite/sqlite'
import CurrentTripDataService from '../../../backend/storage/current_trip'
import TripContentsService from '../../../backend/services/trip_contents'
import TripDatabaseService from '../../../backend/database/TripDatabaseService'
import UserDataService from '../../../backend/storage/user'
class TripSync {
    constructor(){
        this.pennding = []
        this.syncing = false
        this.coordinatesSyncing = false
        this.mediasSyncing = false
    }
    addIntoQueue(itemType,version=null,data){
        this.pennding.push({
            'version':version,
            'itemType':itemType,
            'data':data
        })
    }

    async process(){
        if (this.syncing) return
        this.syncing = true
        while(this.pennding.length !==0){
            const item = this.pennding[0]
            switch(item.itemType){
                case 'coordinate':
                    await TripContentsService.send_coordinates(item.data,item.version)
                case 'photo':
                    await TripContentsService.sendTripImage(item.version,CurrentTripDataService.getCurrentTripId(),item.data.media_path,item.data.longitude,item.data.latitude)
                case 'video':
                    await TripContentsService.sendTripVideo(CurrentTripDataService.getCurrentTripId(),item.version,item.data.media_path,item.data.longitude,item.data.latitude)
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
        console.log(medias)
        for(const media of medias){
            this.addIntoQueue(media.media_type,media.version,media)
        }
        await this.process()
    }
    async processTripCoordinatesSync(server_version){
        this.coordinatesSyncing = true
        const DB = await SqliteService.connectDB()
        const current_version = await TripDatabaseService.getTripCoordinateVersion(CurrentTripDataService.getCurrentTripId())
        console.log(current_version,server_version)
        for(let i = server_version; i <= current_version; i++){
            try{
                const rows = await DB.getAllAsync(`SELECT * FROM trip_${CurrentTripDataService.getCurrentTripId()} WHERE version = ?`,[i])
                const payload = rows.map(row=>({
                    time_stamp: parseInt(row.time_stamp,10),
                    coordinates: {
                    latitude: row.latitude,
                    longitude: row.longitude,
                    altitude: row.altitude,
                    speed: row.speed,
                    heading: row.heading,
                    },
                }))
                this.addIntoQueue('coordinate',i,payload)
                console.log(i,payload)
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