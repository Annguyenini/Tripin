import { createContext,useContext, useRef, useState } from "react";
import { Loading } from "../custom_components/loading";
import { ErrorMessageBox } from "../custom_components/error";
const OverLayContext = createContext()

export const OverLayProvider = ({ children })=>{
    const[visible,setVisible]=useState(false)
    const [type,setType] =useState(null)
    const [errorDataObject,setErrorDataObject]=useState({})
    const allow_type =['error','loading']    
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

    return(
        <OverLayContext.Provider value={{showErrorBox,hideErrorBox,showLoading,hideLoading}}>
            { children }
            {visible&&type==='loading'&& 
            <Loading></Loading>}
            {visible&&type==='error'&& 
            <ErrorMessageBox tile={errorDataObject.tile} message={errorDataObject.message} duration={errorDataObject.duration}></ErrorMessageBox>}

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