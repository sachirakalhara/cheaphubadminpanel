import ApiService from "./apiServices";


export async function createContributionProduct(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `admin/super-admin/contribution/product/create`
    apiObject.body = body
    apiObject.multipart = true

    return await ApiService.callApi(apiObject)
}

export async function getAllContributionProduct() {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `contribution/product/get-all`
    apiObject.body = {"all" : 1}
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function createSubscription(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `admin/super-admin/subscription/create`
    apiObject.body = body
    apiObject.multipart = true

    return await ApiService.callApi(apiObject)
}

export async function getAllSubscriptionPackages(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `subscription/get-all`
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function createPackage(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `admin/super-admin/package/create`
    apiObject.body = body
    apiObject.multipart = true

    return await ApiService.callApi(apiObject)
}
