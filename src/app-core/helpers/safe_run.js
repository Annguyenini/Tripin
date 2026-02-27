const safeRun=async(fn,errorCode)=>{
    try{
        return await fn()
    }
    catch(err){
        console.error(`Failed at ${errorCode}`,err)
        throw { status: 500, error: errorCode }

    }
}
export default safeRun