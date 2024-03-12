import ApiService from "./apiServices"

export async function getAllComponents() {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `garment-parts`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

