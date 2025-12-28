import { useMemo } from "react"
import { Gesture } from "react-native-gesture-handler"
export const Zoom_mode_gesture = useMemo(()=>{
  Gesture.Pan().onUpdate((e)=>{
    console.log(e)
  }) .onEnd(console.log(e)) 
})