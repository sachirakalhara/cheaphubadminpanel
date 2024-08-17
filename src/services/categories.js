import ApiService from "./apiServices";

export async function getAllCategories() {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `category/get-all`
    apiObject.body = {all: 1}
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function createCategory(data) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `admin/super-admin/category/create`
    apiObject.body = data
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function updateCategory(data) {
    const apiObject = {}
    apiObject.method = 'PUT'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/category/update`
    apiObject.body = data
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function filterCategories(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.multipart = false
    apiObject.endpoint = `category/filter`
    apiObject.body = body

    return await ApiService.callApi(apiObject)
}
