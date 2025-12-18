export const BASE_API='http://192.168.0.111:8000'
export const LOGIN_API =BASE_API+'/auth/login';
export const SIGN_UP_API =BASE_API+'/auth/signup';
export const LOGIN_TOKEN_API = BASE_API+'/auth/login-via-token'
export const REQUEST_NEW_ACCESS_TOKEN_API = BASE_API+'/auth/request-access-token'
export const REQUEST_VERIFICATION_API = BASE_API+'/auth/verify-code'

export const BASE_TRIP_API = "/trip";
export const REQUEST_NEW_TRIP_API = BASE_API+BASE_TRIP_API+"/request-new-trip"