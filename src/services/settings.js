import ApiService from "./apiServices"

export async function getSettings() {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/settings`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function updateSettings(body) {
    const apiObject = {}
    apiObject.method = 'PUT'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/settings`
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
