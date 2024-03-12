import ApiService from "./apiServices"

export async function getAllColors() {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `customers`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
