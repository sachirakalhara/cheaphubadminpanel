import FileType from "file-type/browser";
import {AlertTriangle, Check, X} from "react-feather";
import React, {Fragment} from "react";
import {Slide, toast} from "react-toastify";
import Avatar from '@components/avatar'
import moment from "moment";


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
                <span role='img' aria-label='toast-text'>{body}</span>
            </div>
        )}
    </Fragment>
)

export const notifyMessage = (msg, type, duration) => {
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
        <ToastContent title={msgType} body={msg} assets={assets}/>,
        {
            con: false,
            transition: Slide,
            hideProgressBar: false,
            autoClose: 5500,
            position: "top-center"
        }
    )

};


export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
}

export const onFileError = (error) => {
    console.log("error:::::::::::")
    notifyMessage(error.message);
};

export const stringTrimFunction = (length, string) => {
    if (length > 0 && string && string.length > length) {
        return `${string.substring(0, length)}...`;
    } else {
        return string
    }
}

//** using for get real file extension **//
export const getRealFileExtension = (e) => {
    return new Promise(function (resolve, reject) {
        FileType.fromBlob(e).then((res) => {
            resolve(res)
        })
    }).then(function (result) {
        return result?.mime
    })
}

// Function to get the real file extension
export const getRealFileExtensionForTxt = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase(); // Get the file extension
    return extension === 'txt'; // Return true if the extension is 'txt', false otherwise
}

export const formDataToJson = (formData) => {
    let object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    return object;
};

export const formDataDateConverter = (date) => {
    return moment(date).format("YYYY-MM-DD");
};


export const getDatePickerOptions = (isOnOpen, minDate, maxDate) => {
    const baseOptions = {
        altInput: true,
        altFormat: "d/m/Y"
    };

    if (!minDate) {
        return baseOptions; // No minDate case
    }

    if (!isOnOpen) {
        return {
            ...baseOptions,
            minDate: formDataDateConverter(minDate)
        };
    }

    return {
        ...baseOptions,
        onOpen: (selectedDates, dateStr, instance) => {
            if (minDate) instance.set("minDate", formDataDateConverter(minDate));
            if (maxDate) instance.set("maxDate", formDataDateConverter(maxDate));
        }
    };
};
