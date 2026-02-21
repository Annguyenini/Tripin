import NetworkObserver from '../../app-core/flow/sync/network_observer'
import * as API from '../../config/config_api'
import AuthService from './auth'
import TokenService from './token_service'
const activeFetch = {}

export default async function fetchFunction(url, options = {}, retry = true) {
    if (activeFetch[url]) {
        console.log('deduped request for', url)
        return activeFetch[url]  // return the same promise to both callers
    }
    
    activeFetch[url] =  _doFetch(url, options, retry).finally(() => {
        delete activeFetch[url]
    })

    console.log('fetch data',activeFetch[url])

    return activeFetch[url]
}

async function _doFetch(url, options, retry) {
    try {
        const token = await TokenService.getToken('access_token')
        const headers = { ...(options.headers || {}) }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const respond = await fetch(url, { ...options, headers })

        if (respond.status === 304) return { ok: true, status: 304, data: null }

        const data = await respond.json()

        if (respond.status === 401 && data.code === 'token_expired' && retry) {
            await AuthService.requestNewAccessToken()
            delete activeFetch[url]
            return fetchFunction(url, options, false)
        }

        NetworkObserver.setServerStatus(true)
        return { ok: true, status: respond.status, data:data }

    } catch (err) {
        console.error('Failed to fetch', err)
        if (err instanceof TypeError && err.message === 'Network request failed') {
            NetworkObserver.setServerStatus(false)
            return { ok: false, code:'network_error'}
        }
        return { ok: false }
    }
}