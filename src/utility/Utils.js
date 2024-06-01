// ** Checks if an object is empty (returns boolean)
import {StorageStrings} from "../const/constant"
import Cookies from "js-cookie"
import React, {Fragment} from "react"
import {AlertTriangle, X, Check} from "react-feather"
import Avatar from '@components/avatar'
import {Slide, toast} from "react-toastify"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import img from '@src/assets/images/icons/empty.png'

export const MySwal = withReactContent(Swal)

export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
    const today = new Date()
    return (
        /* eslint-disable operator-linebreak */
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
        /* eslint-enable */
    )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = {month: 'short', day: 'numeric', year: 'numeric'}) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
    const date = new Date(value)
    let formatting = {month: 'short', day: 'numeric'}

    if (toTimeForCurrentDay && isToday(date)) {
        formatting = {hour: 'numeric', minute: 'numeric'}
    }

    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
    if (userRole === 'admin') return '/'
    if (userRole === 'client') return '/access-control'
    return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary25: '#1b9af8', // for option hover bg-color
        primary: '#1b9af8', // for selected option bg-color
        neutral10: '#1b9af8', // for tags bg-color
        neutral20: '#ededed', // for input border-color
        neutral30: '#ededed' // for input hover border-color
    }
})


export const removeCookiesValues = async () => {
    await Cookies.remove(StorageStrings.ACCESS_TOKEN)
    await Cookies.remove(StorageStrings.REFRESH_TOKEN)
}

export const clearLocalStorage = async () => {
    localStorage.clear()
}

const ToastContent = ({title, body, assets}) => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' className={assets.color} icon={assets.icon}/>
                <h6 className='toast-title fw-bolder custom-font-toast'>{title}</h6>
            </div>
        </div>
        {body && (
            <div className='toastify-body'>
                <span>{body}</span>
            </div>
        )}
    </Fragment>
)

export const customToastMsg = (title, type, body) => {
    let msgType = "info"
    let assets = {
        color: "bg-info",
        icon: <AlertTriangle size={15}/>
    }

    if (type === 2) {
        msgType = "info"
        assets = {
            color: "bg-info",
            icon: <AlertTriangle size={15}/>
        }
    } else if (type === 0) {
        msgType = "error"
        assets = {
            color: "bg-danger",
            icon: <X size={15}/>
        }
    } else if (type === 1) {
        msgType = "success"
        assets = {
            color: "bg-success",
            icon: <Check size={15}/>
        }
    }

    toast[msgType](
        <ToastContent title={title} body={body} assets={assets}/>,
        {icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000}
    )
}

export const customSweetAlert = (text, type, buttonEvent, title) => {

    let msgType = "warning"
    if (type === 2) {
        msgType = "info"
    } else if (type === 0) {
        msgType = "error"
    } else if (type === 1) {
        msgType = "success"
    }

    return MySwal.fire({
        title,
        text,
        icon: msgType,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            buttonEvent()
        }
    })
}

export const stringToColour = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF
        colour += (`00${value.toString(16)}`).substr(-2)
    }
    return colour
}

// using for 2 digit rounding
export const roundNumber = (str) => {
    return Number(str).toFixed(2).replace(/\.0+$/, '')
}

// using for 2 decimal rounding
export const roundNumber2Decimals = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

export const isEmpty = (str) => {
    return (!str || str.length === 0)
}
export const searchValidation = (val) => {
    return (val.length !== 0 ? val.trim() : "0")
}

export const emptyUI = (isFetched) => {
    return (
        isFetched ? (
            <div className="my-2">
                <div className="text-center">
                    <img src={img} alt="img" height={85} width={70} className="mb-1"/>
                </div>
                <div className="text-center text-body empty-text">There are no records to display</div>
            </div>
        ) : null
    )
}

export const getCustomDateTimeStamp = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate() < 10 ? `0${  now.getDate()}` : now.getDate()
    const hours = now.getHours() < 10 ? `0${  now.getHours()}` : now.getHours()
    const minutes = now.getMinutes() < 10 ? `0${  now.getMinutes()}` : now.getMinutes()
    const milliseconds = now.getMilliseconds()

    return `${year}-${month}-${date}T${hours}.${minutes}.${milliseconds}`
}

export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0)

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(URL.createObjectURL(file))
        }, 'image/png')
    })
}

export const getExtension = (filename) => {
    let parts = filename.split('.');
    return parts[parts.length - 1];
}

export const isImageFile = (filename) => {
    let ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'png':
        case 'jpeg':
            return true;
    }
    return false;
}

export const fileReader = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}
