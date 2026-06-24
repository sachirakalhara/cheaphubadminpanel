import ApiService from "./apiServices";

export async function sendAnnouncement(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/announcement/send`
    apiObject.body = body
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function getRecipientCount(audience) {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `super-admin/announcement/recipient-count?audience=${audience}`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
