import CurrentTripDataService from '../../backend/storage/current_trip'
import * as API from '../../config/config_api'
import TokenService from './token_service'
import AuthService from './auth'
import getTimestamp from '../addition_functions/get_current_time'
import * as FileSystem from 'expo-file-system/legacy'
class TripContentService{

    async send_coordinates(coor_object,version){
        try{
            const token = await TokenService.getToken('access_token')
            const respond = await fetch(API.SEND_COORDINATES+`/${CurrentTripDataService.getCurrentTripId()}/coordinates`,{
                method:'POST',
                headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
                body:JSON.stringify({
                    coordinates:coor_object,
                    version:version})
            })
        
            const data = await respond.json()
            console.log(data)
            if(respond.status ===401){
                if(data.code === 'token_expired'){
                    await AuthService.requestNewAccessToken()
                    return await this.send_coordinates(coor_object,version)
                }
            }
            return {'ok':true,'status':respond.status,'data':data}
        }
        catch(err){
            console.log(err)
            return {'ok':false}
        }

    }


    async requestTripCoordinates(trip_id,version){
        try{

            const respond = await fetch(API.REQUEST_TRIP_COORDINATES+`/${trip_id}/coordinates`,{
                method:'GET',
                headers:{'Authorization':`Bearer ${await TokenService.getToken('access_token')}`},
                body: JSON.stringify({
                    version:version
                })
            })
        
            const data = await respond.json()
            if(respond.status ===401){
                if(data.code === 'token_expired'){
                    await AuthService.requestNewAccessToken()
                    return await this.requestTripCoordinates()
                }
            }            
            return ({'ok':true,'status':respond.status,'data':data})
        }
        catch(err){
            console.error('Failed at request current trip coordinates: ',err)
            return ({'ok':false})
        }
    }
     async request_location_conditions(longitude,latitude){
        try{
            const respond = await fetch(API.REQUEST_LOCATION_CONDITIONS+`?longitude=${longitude}&latitude=${latitude}`,{
                methods:'GET',
                headers:{'Content-Type':'application/json','Authorization':`Bearer ${await TokenService.getToken('access_token')}`},
            })
       
            const data = await respond.json()
            if(respond.status ===401){
                if(data.code === 'token_expired'){
                    await AuthService.requestNewAccessToken()
                    return await this.request_location_conditions(longitude,latitude)
                }
            }
            return({'ok':true,'status':respond.status,'data':data})
        }
        catch(err){
            console.error('Failed at request location condition: ',err)
            return({'ok':false,'status':respond.status,'data':data})
        }
    }


    async sendTripImage(version,trip_id,imageUri,longitude,latitude){
        try{
            const token = await TokenService.getToken('access_token')
            const form =  new FormData()
            const fileInfo = await FileSystem.getInfoAsync(imageUri)
            console.log(fileInfo)

            // if(imageUri.startsWith('ph://')){
            //     im
            // }
            form.append('image',{
                uri:imageUri,
                type:'image/jpeg',
                name:`trip${trip_id}_${getTimestamp()}.jpg`
            })
            form.append('data',JSON.stringify({
                trip_id:String(trip_id),
                longitude:String(longitude),
                latitude:String(latitude),
                time_stamp : getTimestamp(),
                version :String(version)
            }))

        
            const respond = await fetch(API.SEND_MEDIAS_BASE+`/${trip_id}/upload`,{
                method:'POST',
                headers:{'Authorization':`Bearer ${token}`},
                body:form
            })
        
            const data = await respond.json()
            if(respond.status ===401){
                
                if (data.code === 'token_expired'){
                    await AuthService.requestNewAccessToken()
                    return await this.sendTripImage(version,trip_id,imageUri,longitude,latitude)
                }
            }
            return({'ok':true,'status':respond.status,'data':data})
        }
        catch(err){
            console.error('Failed at send trip image: ',err)
            return({'ok':false})
        }
    }
    async sendTripVideo(trip_id,video_version,videoUri,longitude,latitude){
        try{
            const form = new FormData()
            const path = `trip${trip_id}_${getTimestamp()}`
            form.append('video',{
                uri:videoUri,
                name:`${path}.mp4`,
                type:'video/mp4'
            })
            form.append('data',JSON.stringify({
                longitude:longitude,
                latitude:latitude,
                time_stamp:getTimestamp(),
                video_version:video_version,
            }))

            const token = await TokenService.getToken('access_token')
        
            const respond = await fetch(API.SEND_MEDIAS_BASE+`/${trip_id}/upload`,{
                method:'POST',
                headers:{'Content-Type':'multipart/form-data','Authorization':`Bearer ${token}`},
                body:form
            })
            const data = await respond.json()
            if(respond.status===401){
                if (data.code === 'token_expired'){
                    await AuthService.requestNewAccessToken()
                    return await this.sendTripVideo(trip_id,video_version,videoUri,longitude,latitude)
                }
            }
            return({'ok':true,'status':respond.status,'data':data})

        }
        catch(err){
            console.error('Failed at send trip video: ',err)
            return({'ok':false})
        }
    }


    async requestTripMedias(trip_id){
        try{
            const respond = await fetch(API.REQUEST_TRIP_MEDIAS+`/${trip_id}/medias`,{
                method :'GET',
                headers:{'Authorization':`Bearer ${await TokenService.getToken('access_token')}`}
            })
            const data = await respond.json()
            if(respond.status===401){
                if (data.code === 'token_expired'){
                    await TokenService.requestNewAccessToken()
                    return await this.sendTripVideo(videoUri,longitude,latitude)
                }
            }
            return({'ok':true,'status':respond.status,'data':data})
    
        }
        catch(err){
            console.error('failed at request trip media: ',err)
            return({'ok':true})
        }
    }
}
export default new TripContentService()