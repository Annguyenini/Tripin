import { createContext,useContext, useRef, useState } from "react";
import { Loading } from "../custom_components/loading";
import { ErrorMessageBox } from "../custom_components/error";
const OverLayContext = createContext()
import LoadingScreen from "../map_box/components/fetching_loading_screen";
import { SyncBanner } from "./syncing_banner";
export const OverLayProvider = ({ children })=>{
    const[visible,setVisible]=useState(false)
    const [type,setType] =useState(null)
    const [errorDataObject,setErrorDataObject]=useState({})
    const allow_type =['error','loading','syncing']    
    const showErrorBox =(tile = null,message =null,duration =3000)=>{
        setErrorDataObject({
            title:tile,
            message:message,
            duration:duration
        })
        setType('error')
        setVisible(true)
    }
    const hideErrorBox =()=>{
        setType('error')
        setVisible(false)

    }
    const showLoading =()=>{
        setType('loading')
        setVisible(true)
        
    }
    const hideLoading =()=>{
        setType('loading')
        setVisible(false)  
    }
    const showSyncing =()=>{
        setType('syncing')
        setVisible(true)
        
    }
    const hideSyncing =()=>{
        setType('syncing')
        setVisible(false)  
    }
    return(
        <OverLayContext.Provider value={{showErrorBox,hideErrorBox,showLoading,hideLoading,showSyncing,hideSyncing}}>
            { children }
            {visible&&type==='loading'&& 
            <LoadingScreen></LoadingScreen>}
            {visible&&type==='error'&& 
            <ErrorMessageBox tile={errorDataObject.tile} message={errorDataObject.message} duration={errorDataObject.duration}></ErrorMessageBox>}
            {visible&&type ==='syncing' &&
            <SyncBanner></SyncBanner>}
        </OverLayContext.Provider>
    )
}
export const UseOverlay =()=>{
    const ctx = useContext(OverLayContext)
    if (!ctx) {
        throw new Error("useLoading must be used inside LoadingProvider");
    }
    return ctx;
}