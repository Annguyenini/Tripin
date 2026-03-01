import { useSkiaFrameProcessor } from 'react-native-vision-camera'
import { Skia } from '@shopify/react-native-skia'
import { FILTERS, applyIntensity } from './filters.js'

const useFrameFilter = (activeFilter, intensity = 1) => {
    const frameProcessor = useSkiaFrameProcessor((frame) => {
        'worklet'
        if (!activeFilter || activeFilter === 'none' ||!FILTERS[activeFilter]) {
            frame.render()
            return
        }

        const matrix = applyIntensity(FILTERS[activeFilter], intensity)
        const paint = Skia.Paint()
        paint.setColorFilter(Skia.ColorFilter.MakeMatrix(matrix))
        frame.render(paint)
    }, [activeFilter, intensity])

    return frameProcessor
}

export default useFrameFilter