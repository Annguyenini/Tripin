# Authentication Architecture

## Overview
JWT-based authentication with access/refresh token rotation.
Access tokens are short-lived (15 minutes); refresh tokens are used to obtain new access tokens without re-login (30 days).

## Token Flow
```
User Login → Server returns access_token + refresh_token
                │
                ├── access_token  → stored in SecureStore, attached to every request
                └── refresh_token → stored in SecureStore, used only to refresh
```

## Refresh Flow
```
Request fails with 401 + code: 'token_expired'
        │
        ▼
AuthService.requestNewAccessToken()
        │
        ▼
POST /auth/refresh with refresh_token
        │
        ├── success → store new access_token → retry original request
        └── fail    → logout user → clear all tokens
Request fails with 401 + code: 'token_invalid'
        |
        |__return back to the auth screen

```

## Files
| File | Responsibility |
|------|---------------|
| `flow/auth_handler.js` | handle login,login with token,logout,
| signup,verifycode |
| `services/auth/auth.js` | Login, logout, token refresh, 
| sigup, verify code |
| `services/auth/TokenService.js` | Store, retrieve, delete tokens from SecureStore |
| `services/_doFetch.js` | Attaches token to every request, handles 401 retry |


## Logout Flow
```
logout()
    ├── delete access_token from SecureStore
    ├── delete refresh_token from SecureStore
    ├── delete user data from local storage
    ├── reset current trip data
    ├── stop GPS logic
    └── clear all local storage
```

## Security Notes
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Refresh tokens are rotated on every use
- Failed refresh → force logout to prevent invalid state
- All tokens cleared on logout, no residual auth state



