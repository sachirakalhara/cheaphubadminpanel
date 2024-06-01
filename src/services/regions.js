import ApiService from "./apiServices";

export async function getAllRegions() {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/region/get-all`
    apiObject.body = {all: 1}
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function createRegions() {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/region/create`
    apiObject.body = {all: 1}
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
