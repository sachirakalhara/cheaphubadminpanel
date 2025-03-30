import ApiService from "./apiServices";

export async function getAllCouponCodes(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/coupon/get-all`
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function createCouponCodes(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/coupon/create`
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function editCouponCodes(body) {
    const apiObject = {}
    apiObject.method = 'PUT'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/coupon/update`
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}