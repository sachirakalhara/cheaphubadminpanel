import ApiService from "./apiServices"

export async function getAllMachines(page, from, to) {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `estimations/yarn-requirements/within/${from}/${to}?page=${page}&size=10`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}

export async function getAllMaterialsForCsv(from, to) {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = false
    apiObject.urlencoded = false
    apiObject.endpoint = `estimations/yarn-requirements/within/${from}/${to}`
    apiObject.body = null
    apiObject.multipart = false

    return await ApiService.callApi(apiObject)
}
