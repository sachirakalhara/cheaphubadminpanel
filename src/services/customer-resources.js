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


export async function getAllCustomers(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `user/get-all`
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function getAllTotalSpend() {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/total-customer-spend`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function getCustomerDetails(id) {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `user/${id}`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
