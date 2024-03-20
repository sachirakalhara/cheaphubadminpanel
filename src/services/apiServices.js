import axios from 'axios'
import apiConfig from './apiConfig'
import * as constants from "../const/constant"
import * as commonFunc from "../utility/Utils"

import * as authService from "./auth"
import qs from "qs"

let body = {}
let headers

const renewTokenHandler = async (apiObject) => {
    let result
    // renew token - start
    const obj = {
        refresh_token: localStorage.getItem(constants.StorageStrings.REFRESH_TOKEN),
        grant_type: 'refresh_token'
    }
    await authService.renewToken(qs.stringify(obj))
        .then(async response => {
            if (response.access_token) {
                Cookies.set(constants.StorageStrings.ACCESS_TOKEN, response.access_token)
                localStorage.setItem(constants.StorageStrings.ACCESS_TOKEN, response.access_token)
                Cookies.set(constants.StorageStrings.REFRESH_TOKEN, response.refresh_token)
                localStorage.setItem(constants.StorageStrings.REFRESH_TOKEN, response.refresh_token)
                // eslint-disable-next-line no-use-before-define
                result = await callApi(apiObject)
            } else {
                await commonFunc.removeCookiesValues()
                await commonFunc.clearLocalStorage()
                window.location.reload()
            }
        })
    // renew token - end
    return result
}


export const callApi = async (apiObject) => {
    const method = apiObject.method ? apiObject.method.toLowerCase() : 'get'

    if (method === 'post' || method === 'put' || method === 'patch') {
        body = apiObject.body ? apiObject.body : {}
    }

    headers = {
        'Content-Type': apiObject.urlencoded ? 'application/x-www-form-urlencoded' : apiObject.multipart ? 'multipart/form-data' : 'application/json'
    }
    if (apiObject.authentication) {
        const access_token = localStorage.getItem(constants.StorageStrings.ACCESS_TOKEN)
        if (access_token) {
            headers.Authorization = `Bearer ${access_token}`
        }
    }
    if (apiObject.isBasicAuth) {
        headers.Authorization = 'Basic';
    }


    const url = `${apiConfig.serverUrl}/${apiConfig.basePath}/${apiObject.endpoint}`
    let result

    await axios[method](url, method !== 'get' && method !== 'delete' ? body : {headers}, {headers})
        .then(async response => {
            if (!response.data.success) {
                const code = response.data.errorCode
                if (code === 470 || code === 471) {
                    await commonFunc.removeCookiesValues()
                    await commonFunc.clearLocalStorage()
                    window.location = `${constants.BASE_URL}/login`
                }
            }
            result = {
                data: response.data === ''?[]:response.data,
                status: response.data.message === 'Success' || response.data.message === 'OK' ? 1 : 0,
                success: response.data.message === 'Success' || response.data.message === 'OK' || response.data.message === undefined,
                message: response.data.message
            };
        })
        .catch(async error => {
            if (error !== undefined) {
                if (error.response === undefined) {
                    result = await {
                        success: false,
                        status: 0,
                        message: "Your connection was interrupted",
                        data: null
                    }
                } else if (error.response.status === 401) {

                    // if (apiObject.state === "renewToken") {
                    //     result = await {success: false, status: 2, message: error.response.data.message};
                    // }
                    // if (apiObject.state === "login") {
                    //     result = await {success: false, status: 0, message: error.response.data.message};
                    // }

                    // result = await renewTokenHandler(apiObject)

                    result = await {
                        success: false,
                        status: 0,
                        message: error.response.data.message,
                        data: null
                    }


                } else if (error.response.status === 403) {
                    result = await {
                        success: false,
                        status: 2,
                        message: "Access is denied.",
                        data: null
                    }
                } else if (error.response.status === 417 || error.response.status === 404) {
                    result = await {
                        success: false,
                        status: 0,
                        message: "Oops! Something went wrong.",
                        data: null
                    }
                } else if (error.response.data !== undefined) {
                    result = await {
                        success: false,
                        status: 0,
                        message: error.response.data.message,
                        data: null
                    }
                } else {
                    result = await {
                        success: false,
                        status: 2,
                        message: "Sorry, something went wrong.",
                        data: null
                    }
                }
            } else {
                result = await {
                    success: false,
                    status: 2,
                    message: "Your connection was interrupted!",
                    data: null
                }
            }
        })

    return result
}

export default {callApi, renewTokenHandler}
