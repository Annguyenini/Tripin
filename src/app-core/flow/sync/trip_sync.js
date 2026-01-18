import SqliteService from '../../../backend/storage/sqlite/sqlite'
import CurrentTripDataService from '../../../backend/storage/current_trip'
import TripContentsService from '../../../backend/services/trip_contents'
class TripSync {
    constructor(){
        this.pennding = []
        this.syncing = false
        this.coordinatesSyncing = false
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
            }
            this.pennding.shift()
            
        }
        this.syncing = false
    }

    async processTripCoordinatesSync(server_version){
        this.coordinatesSyncing = true
        const DB = await SqliteService.connectDB()
        const current_version = await DB.getFirstAsync('PRAGMA user_version')
        console.log(current_version.user_version,server_version)
        for(let i = server_version; i <= current_version.user_version; i++){
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