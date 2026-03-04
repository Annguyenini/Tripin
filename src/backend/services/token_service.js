import * as SecureStore from 'expo-secure-store'
import { jwtDecode } from 'jwt-decode'

const ALLOW_TYPE = ['access_token', 'refresh_token']

class TokenService {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
    }

    /**
     * Set token
     * @param type - type of token (refresh_token, access_token)
     * type must be one of {@link ALLOW_TYPE}
     */
    async setToken(type, token) {
        if (typeof type !== 'string') {
            console.error("type must be string")
            return
        }
        const item = ALLOW_TYPE.find(t => t === type)
        if (!item) {
            console.error("Type must be 'access_token' or 'refresh_token'")
            return
        }
        try {
            await SecureStore.setItemAsync(type, token);
        } catch (error) {
            console.error(`Error at set ${type}`, error);
            throw error;
        }
    }

    /**
     * Delete token
     * @param type - type of token (refresh_token, access_token)
     * type must be one of {@link ALLOW_TYPE}
     */
    async deleteToken(type) {
        if (typeof type !== 'string') {
            console.error("type must be string")
            return
        }
        const item = ALLOW_TYPE.find(t => t === type)
        if (!item) {
            console.error("Type must be 'access_token' or 'refresh_token'")
            return
        }
        try {
            await SecureStore.deleteItemAsync(type)
        } catch (error) {
            console.error("Error trying to delete token", error)
            throw error
        }
    }

    /**
     * Get token
     * @param type - type of token (refresh_token, access_token)
     * type must be one of {@link ALLOW_TYPE}
     * @returns token
     */
    async getToken(type) {
        if (typeof type !== 'string') {
            console.error("type must be string")
            return
        }
        const item = ALLOW_TYPE.find(t => t === type)
        if (!item) {
            console.error("Type must be 'access_token' or 'refresh_token'")
            return
        }
        try {
            return await SecureStore.getItemAsync(type);
        } catch (error) {
            console.error("Error at get token:", error)
        }
    }

    async verifyTokenOffline(token) {
        try {
            const payload = jwtDecode(token)
            const now = Math.floor(Date.now() / 1000)
            if (payload.exp && payload.exp < now) {
                return { status: false, message: 'Token Expired!', code: 'token_expired' }
            }
            return { status: true, message: 'Successfully!', code: 'successfully', payload }
        } catch (err) {
            return { status: false, message: 'Token Invalid!', code: 'token_invalid' }
        }
    }
}

const tokenService = new TokenService()
export default tokenService