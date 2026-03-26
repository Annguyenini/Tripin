import * as MediaLibrary from 'expo-media-library';
import safeRun from '../../app-core/helpers/safe_run';
export const getAlbumPermission=async()=>{
    const permission = await safeRun(()=> MediaLibrary.getPermissionsAsync())
    return permission
}