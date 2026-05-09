import safeRun from '../../app-core/helpers/safe_run';
import { copyAsync, documentDirectory, cacheDirectory, deleteAsync, getInfoAsync, makeDirectoryAsync, downloadAsync } from 'expo-file-system/legacy';
import * as VideoThumbnails from 'expo-video-thumbnails';

export const generateOrGetThumbnailFromMediaId = async (media_id, media_path) => {
    let outsource = false
    if (media_path.includes('https')) outsource = true
    const uuid = media_id.split('/').pop().replace(/\.[^.]+$/, '')
    const dest = `${documentDirectory}thumbnails/${uuid}.jpg`

    // Early return if already cached
    const exists = await getInfoAsync(dest)
    if (exists.exists) return dest

    // Copy to cacheDirectory so AVAssetImageGenerator can open it
    const cached_path = `${cacheDirectory}thumb_src_${Date.now()}.mov`

    if (outsource) {
        await downloadAsync(media_path, cached_path)
    } else {
        await copyAsync({ from: media_path, to: cached_path })
    }
    try {
        console.log('gen', cached_path)
        const { uri: thumbnailUri } = await safeRun(
            () => VideoThumbnails.getThumbnailAsync(cached_path, { time: 1000 }),
            'failed_at_generate_thumbnail'
        )

        deleteAsync(cached_path, { idempotent: true }) // fire and forget

        if (!thumbnailUri) return null

        await makeDirectoryAsync(`${documentDirectory}thumbnails/`, { intermediates: true })
        await copyAsync({ from: thumbnailUri, to: dest })
        return dest
    } catch (err) {
        console.error('failed to create thumbnail', err)
        return null
    }
}