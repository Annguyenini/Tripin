import safeRun from '../../app-core/helpers/safe_run';
import { copyAsync,documentDirectory,getInfoAsync,makeDirectoryAsync } from 'expo-file-system/legacy';
import * as VideoThumbnails from 'expo-video-thumbnails';

export const generateOrGetThumbnailFromMediaId =async(media_id,media_path)=>{
    console.log('generate tem','media_id:',media_id,'media_path:',media_path)
    const uuid = media_id.split('/').pop().replace(/\.[^.]+$/, '');
    const dest = `${documentDirectory}thumbnails/${uuid}.jpg`;
    const exists = await getInfoAsync(dest)
    // if exists reuse dest
    if(exists.exists) return dest
    // generate and copy to assignt place
    try{
        const {uri:thumbnailUri} = await VideoThumbnails.getThumbnailAsync(media_path,{time:0})
         if(!thumbnailUri) return null
        await safeRun(()=>makeDirectoryAsync(
            `${documentDirectory}thumbnails/`, 
            { intermediates: true }
        ),'failed_to_make_thumbnail_dir')
        await safeRun(()=>copyAsync({from:thumbnailUri ,to:dest}),'failed_to_copy_thumbnai')
        return dest
    }
    catch(err){
        console.error('failed to created thumbnail')
        return
    }
    
   
}