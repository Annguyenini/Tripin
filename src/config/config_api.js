export const BASE_API='http://192.168.0.111:8000'
export const LOGIN_API =BASE_API+'/auth/login';
export const SIGN_UP_API =BASE_API+'/auth/signup';
export const LOGIN_TOKEN_API = BASE_API+'/auth/login-via-token'
export const REQUEST_NEW_ACCESS_TOKEN_API = BASE_API+'/auth/request-access-token'
export const REQUEST_VERIFICATION_API = BASE_API+'/auth/verify-code'

export const BASE_TRIP_API = "/trip";
export const REQUEST_NEW_TRIP_API = BASE_API+BASE_TRIP_API+"/request-new-trip"
export const END_TRIP = BASE_API+BASE_TRIP_API+"/end-trip"
export const REQUEST_TRIPS_DATA = BASE_API+BASE_TRIP_API+'/trips'
export const REQUEST_TRIP_DATA = BASE_API+BASE_TRIP_API+'/trip'
export const REQUEST_CURRENT_TRIP_ID = BASE_API+BASE_TRIP_API+'/current-trip-id'


export const BASE_TRIP_CONTENTS_API = '/trip-contents'
export const SEND_COORDINATES = BASE_API+BASE_TRIP_CONTENTS_API
export const SEND_MEDIAS_BASE = BASE_API+BASE_TRIP_CONTENTS_API
export const REQUEST_LOCATION_CONDITIONS = BASE_API+BASE_TRIP_CONTENTS_API+'/location-conditions'
export const REQUEST_TRIP_COORDINATES = BASE_API+BASE_TRIP_CONTENTS_API
export const REQUEST_TRIP_MEDIAS = BASE_API+BASE_TRIP_CONTENTS_API


export const BASE_USER_API = '/user'
export const UPDATE_PROFILE_IMAGE = BASE_API+BASE_USER_API+'/update-avatar'
export const GET_USER_DATA = BASE_API+BASE_USER_API+'/get-user-data'
