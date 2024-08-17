import ApiService from "./apiServices";

export async function getAllTags() {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `tag/get-all`
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
    apiObject.endpoint = `admin/super-admin/tag/create`
    apiObject.body = data
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function deleteTags(id) {
    const apiObject = {}
    apiObject.method = 'DELETE'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/tag/${id}`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function updateTags(body) {
    const apiObject = {}
    apiObject.method = 'PUT'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `admin/super-admin/tag/update`
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}


export async function filterTags(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.multipart = false
    apiObject.endpoint = `tag/filter`
    apiObject.body = body

    return await ApiService.callApi(apiObject)
}
