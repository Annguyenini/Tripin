import * as VideoThumbnails from 'expo-video-thumbnails';

const generateThumbnail = async (videoUri) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1000, // ms into the video (1 second)
      quality: 0.5 // 0-1, lower = faster + smaller file
    })
    console.log('thumbna',uri)
    return uri
  } catch (error) {
    console.error('Thumbnail failed:', error)
    return null
  }
}
export default generateThumbnail