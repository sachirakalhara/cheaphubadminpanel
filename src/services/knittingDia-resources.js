import ApiService from "./apiServices"

export async function getAllKnittingDia() {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `knitting-diameters`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function getAllKnittingDiaById(id) {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `knitting-diameters/${id}`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
