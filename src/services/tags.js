import ApiService from "./apiServices";

export async function getAllTags() {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/tag/get-all`
    apiObject.body = {all: 1}
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function createTags(data) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/tag/create`
    apiObject.body = data
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
