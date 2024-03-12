import ApiService from './apiServices'

export async function renewToken(token) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = false
    apiObject.isBasicAuth = true
    apiObject.urlencoded = true
    apiObject.endpoint = 'authorize'
    apiObject.body = token
    apiObject.multipart = false
    apiObject.state = "renewToken"
    apiObject.grant_type = "refresh_token"

    return await ApiService.callApi(apiObject)
}

export async function authUser(userCredentials) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = false
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = 'login'
    apiObject.body = userCredentials
    apiObject.multipart = false
    apiObject.state = "login"
    apiObject.grant_type = "password"

    return await ApiService.callApi(apiObject)
}

export async function getUserResources() {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = 'users'
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function getUserDetails() {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = 'account'
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function changeUserPassword(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = 'account/change-password'
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
