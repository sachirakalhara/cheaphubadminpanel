/**
 * Created by WebStorm.
 * User: athukorala
 * Date: 5/13/20
 * Time: 9:20 AM
 */
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


const App = (props) => {
    const [fileName, setFileName] = useState(null);

    const onFilesChange = props => async files => {
        if (files.length !== 0) {
            let fileObj = files[0];

            const extension = fileObj.name.split('.').pop().toLowerCase();
            if (extension ==='txt'){
                setFileName(fileObj.name);
                props.sendImageData(fileObj.name, fileObj);
            }else {
                getRealFileExtension(fileObj).then(res => {
                    if (res){
                        setFileName(fileObj.name);
                        props.sendImageData(fileObj.name, fileObj);
                    }else {
                        notifyMessage("You have uploaded file extension is mismatched with actual file extension");
                        setFileName('');
                        props.sendImageData('', {});
                    }

                })
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
                        <p
                            className={`${props.imageFile && !props.imageFile.startsWith("http") ? 'active-lbl' : ''}`}>
                            {fileName ? stringTrimFunction(60,fileName) : (props.imageFile && !props.imageFile.startsWith("http")) ? props.imageFile : props.imageFile && props.imageFile.startsWith("http") ? "Choose File (Update)" : props.placeholder !== undefined ? props.placeholder : "Choose File"}
                        </p>
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
