
import React from 'react';
import Files from "react-files";
import * as commonFunc from "../../utility/commonFun";
import './ReactFiles.scss';
import proPic from '../../../assets/img/views/profile/pro-pic.png'
import squarePic from '../../../assets/img/views/create/square.png'

// const onFilesChange_ = props => files => {
//   if (files.length !== 0) {
//     props.sendImageData(files[0])
//   }
// };
const onFilesChange = props => async files => {
  if (files.length !== 0) {
    let file = await commonFunc.compressImage(files);
    let base64 = await commonFunc.readFile(file);
    // console.log(base64)
    props.sendImageData(base64,file)
  }
};
const App = (props) =>{
  return(
    <div className={"cover-photo-wrapper"}>
      <Files
        className='files-dropzone-file'
        onChange={onFilesChange(props)}
        accepts={["image/png", "image/jpg", "image/jpeg"]}
        multiple={false}
        maxFileSize={4050000}
        minFileSize={0}
        onError={commonFunc.onFileError}
        clickable
      >
        <div className="file-wrapper">
          <img className={`pro-image ${props.imageFile === null || props.imageFile === '' ? `best-fit`:``}`} src={props.imageFile ? props.imageFile : props.pageType ? squarePic : proPic} alt={"."} />
          <div>
            <p className={"p-text"}>
              {/*Best image size 350 X 500 px <br/> */}
              Image must be less than 4MB
            </p>
          </div>
        </div>
      </Files>
    </div>
  )
}
export default App;
