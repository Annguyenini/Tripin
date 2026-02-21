    
export const STORAGE_KEYS={
    USER:{
        USER_DATA:'user.user_data',
        USER_ROLE:'user.user_role'
    },
    CURRENT_TRIP:{
        CURRENT_TRIP_DATA:'trip.trip_data',
        CURRNET_TRIP_IMAGE:'trip.trip_image',
        CURRENT_TRIP_STATUS:'trip.trip_status', 
    },
    LOCATION:{
        LOCATION_COND_DATA:'location.location_cond_data',
        CURRENT_CITY:'location.current_city',
    },
    SETTINGS:{
        TRIP_STATUS:'settings.trip_status',
        FOREGROUNDPERMISSION :"settings.foreground_permission",
        BACKGROUNDPERMISSION :"settings.background_permission",
    },
    

}


export const DATA_KEYS ={
    TRIP:{
        TRIP_DATA:'trip_data',
        ALL_TRIP_LIST:'all_trip',
    },
    CURRENT_TRIP:{
        CURRENT_TRIP_DATA:'current_trip_data',
        CURRENT_TRIP_ID:'current_trip_id',
        CURRENT_TRIP_NAME:'current_trip_name',
        CURRENT_TRIP_IMAGE:'current_trip_image',
        CURRENT_TRIP_CREATED_TIME :'current_created_time',
        CURRENT_TRIP_STATUS:'trip_status',
        CURRENT_TRIP_STORAGE_KEY :'trip_storage_key',
        CURRENT_TRIP_COORDINATES_ARRAY:'current_coordinate_array'
    },
    USER:{
        USER_DATA:'user_data',
        USER_ID :'user_id',
        USER_NAME:'user_name',
        USER_AVATAR:'user_avatar',
        USER_DISPLAY_NAME:'user_display_name',
        USER_AUTH:'user_auth',
        USER_ROLE:'user_role'
    },
    LOCATION:{
        CONDITIONS:'location_data',
        CITY: 'location_city'
    },
    PERMISSIONS:{
        FOREGROUNDPERMISSION :"settings.foreground_permission",
        BACKGROUNDPERMISSION :"settings.background_permission",
    },
    TRIP_CONTENTS:{
        CURRENT_TRIP_COORDINATES:'current_trip_coordinates',
        CURRENT_TRIP_MEDIA:'current_trip_medias',
    },

}