export const ETAG_KEY =  {
    USERDATA :'user_data_etag',
    ALL_TRIPS_LIST :'all_trip_etag',
}

export const GENERATE_TRIP_ETAG_KEY=(trip_id)=>{
    return `trip:${trip_id}_etag`
}