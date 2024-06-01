import ApiService from "./apiServices";

export async function createBulkProduct(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/bulk/product/create`
    apiObject.body = body
    apiObject.multipart = true

    return await ApiService.callApi(apiObject)
}

export async function getAllBulkProducts() {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/bulk/product/get-all`
    apiObject.body = {"all" : 1}
    apiObject.multipart = true

    return await ApiService.callApi(apiObject)
}
