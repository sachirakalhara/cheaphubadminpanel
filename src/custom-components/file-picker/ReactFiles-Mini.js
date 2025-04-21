import React, {useState} from 'react';
import Files from "react-files";
import * as commonFunc from "../../utility/commonFun";
import './ReactFiles.scss';
import {
    getRealFileExtension,
    getRealFileExtensionForTxt,
    notifyMessage,
    stringTrimFunction
} from "../../utility/commonFun";
import imageCompression from 'browser-image-compression'; // Import the library

const App = (props) => {
    const [fileName, setFileName] = useState(null);

    const onFilesChange = props => async files => {
        if (files.length !== 0) {
            let fileObj = files[0];

            const extension = fileObj.name.split('.').pop().toLowerCase();
            if (extension === 'txt') {
                setFileName(fileObj.name);
                props.sendImageData(fileObj.name, fileObj);
            } else {
                try {
                    // Compress the image
                    const options = {
                        maxSizeMB: 1, // Maximum size in MB
                        maxWidthOrHeight: 1920, // Max width or height
                        useWebWorker: true
                    };
                    const compressedFile = await imageCompression(fileObj, options);

                    getRealFileExtension(compressedFile).then(res => {
                        if (res) {
                            setFileName(compressedFile.name);
                            props.sendImageData(compressedFile.name, compressedFile);
                        } else {
                            notifyMessage("You have uploaded file extension is mismatched with actual file extension");
                            setFileName('');
                            props.sendImageData('', {});
                        }
                    });
                } catch (error) {
                    notifyMessage("Error compressing the image: " + error.message);
                }
            }
        }
    };

    const linkViewer = () => {

    }

    return (
        <div className={"cover-photo-wrapper file-picker-mini"}>
            <Files
                className='files-dropzone-file'
                onChange={onFilesChange(props)}
                accepts={props.accepts ? props.accepts : ["image/png", "image/jpg", "image/jpeg", "application/pdf", "application/msword", "application/xls", "application/xlsx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".xlsx", ".xls", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]}
                multiple={false}
                maxFileSize={12050000}
                minFileSize={0}
                onError={commonFunc.onFileError}
                clickable={props.disabled ? !props.disabled : true}
            >
                <div className={`file-picker-mini-sub`}>
                    <div className={`${props.invalid ? 'error' : ''}`}>
                        {props.defaultImg ? (
                            <p className="active-lbl w-100">
                                {props.defaultImg}
                            </p>
                        ) : (
                            <p
                                className={`${props.imageFile && !props.imageFile.startsWith("http") ? 'active-lbl' : ''}`}>
                                {fileName ? stringTrimFunction(60, fileName) : (props.imageFile && !props.imageFile.startsWith("http")) ? props.imageFile : props.imageFile && props.imageFile.startsWith("http") ? "Choose File (Update)" : props.placeholder !== undefined ? props.placeholder : "Choose File"}
                            </p>
                        )}

                    </div>
                    <button
                        type={'button'}
                        className={'file-picker-btn'}
                    >
                        {props.buttonText ? props.buttonText : 'Browse'}
                    </button>
                </div>
            </Files>
        </div>
    )
}
export default App;
