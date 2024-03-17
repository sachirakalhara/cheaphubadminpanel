import React, {useState} from "react"
import Modal from "../../index"
import {Button, Col, FormFeedback, Input, Label, Row, UncontrolledTooltip} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import Flatpickr from "react-flatpickr"
import {PRICE_TERMS} from "../../../../../const/constant"
import {AlertCircle} from "react-feather";
import ReactFilesMini from "../../../../../custom-components/file-picker/ReactFiles-Mini";
import Cropper from "react-easy-crop";
import {fileReader, getCroppedImg, isImageFile} from "../../../../../utility/Utils";
import "../../styles.scss";

const options = {
    enableTime: false,
    dateFormat: 'Y-m-d'
}


const CROP_ASPECT_TO_FIRST_IMAGE = 1;
//value should be <1
const CROP_ASPECT_TO_SECOND_IMAGE = 3 / 2;
const CROP_ASPECT_TO_SHARE_URL_IMAGE = 5 / 3

const types = {
    PRODUCT_IMAGE: 'program-modal-banner'
}

const OrderAdditionModal = (props) => {

    const [uploadedProductImage, setUploadedProductImage] = useState(null)
    const [productImageSrc, setProductImageSrc] = useState('')
    const [productImageCrop,setProductImageCrop] = useState({x: 0, y: 0})
    const [productImageCroppedAreaPixels,setProductImageCroppedAreaPixels]=useState(null)
    const [productCroppedImage,setProductCroppedImage]=useState(null)
    const [productImageIsCropVisible,setProductImageIsCropVisible]=useState(false)
    const [productImageZoom,setProductImageZoom]=useState(1)
    const [productImageName,setProductImageName]=useState('')


    const customStyle = (error) => ({
        control: styles => ({
            ...styles,
            borderColor: error ? '#EA5455' : styles.borderColor,
            '&:hover': {
                borderColor: error ? '#EA5455' : styles['&:hover'].borderColor
            }
        })
    })

    const onCropChange = (crop, type) => {
        if (type === types.PRODUCT_IMAGE) setProductImageCrop(crop)
    }

    const onCropComplete = async (croppedArea, croppedAreaPixels, type) => {
        if (type === types.PRODUCT_IMAGE) await setProductImageCroppedAreaPixels(croppedAreaPixels)

        cropButtonHandler(type)
    }

    /*image cropper */
    const cropButtonHandler = (type) => {
        showCroppedImage(type);
    }

    const showCroppedImage = async (type) => {
        const rotation = 0;
        if (type ===  types.PRODUCT_IMAGE){
            try {
                const croppedImage = await getCroppedImg(
                    productImageSrc,
                    productImageCroppedAreaPixels,
                    rotation
                )
                setProductCroppedImage(croppedImage)
            }catch (e) {
                console.error(e)
            }
        }
    }

    const handleChangeFileShare = async (file, type) => {
        if (isImageFile(file.name)) {
            if (type === types.PRODUCT_IMAGE){
                console.log(isImageFile(file.name))
                setProductImageIsCropVisible(true);
                setProductImageName(file.name);
                let imageDataUrl = await fileReader(file);
                console.log(imageDataUrl)
                setProductCroppedImage(imageDataUrl);
                setProductImageSrc(imageDataUrl);
            }
        }else {
            setProductImageIsCropVisible(false);
        }
    }

    return (
        <Modal show={props.show} toggle={props.toggle} headTitle="Add New Order">
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='productName'>
                        Product Name <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name='productName'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='productName' placeholder='Product Name' value={field.value}
                                   invalid={props.errors.productName && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.productName && <FormFeedback>Please enter a valid name</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='customer'>
                        Product Category <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        control={props.control}
                        name='category'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='category'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Product Category'
                                    options={props.categoryList}
                                    theme={selectThemeColors}
                                    value={props.categoryList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.category)}
                                />
                            )
                        }}
                    />
                    {props.errors.category &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select category</span>}
                </Col>


                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='description'>
                        Description <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name='description'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='description' placeholder='Description' value={field.value}
                                   type="textarea"
                                   invalid={props.errors.description && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.description && <FormFeedback>Please enter a valid description</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='price'>
                        Price <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name='price'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='price' placeholder='Price' value={field.value}
                                   invalid={props.errors.price && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.price && <FormFeedback>Please enter a price</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='Gateway Fee'>
                        Gateway Fee <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name='gatewayFee'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='gatewayFee' placeholder='Gateway Fee' value={field.value}
                                   invalid={props.errors.gatewayfee && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.gatewayFee && <FormFeedback>Please enter a valid gateway fee</FormFeedback>}
                </Col>

                {/*<Col md={6} xs={12}>*/}
                {/*    <Label className='form-label mb-1' for='poDate'>*/}
                {/*        PO Date*/}
                {/*    </Label>*/}
                {/*    <Controller*/}
                {/*        control={props.control}*/}
                {/*        name='poDate'*/}
                {/*        render={({field: {onChange, value, name}}) => {*/}
                {/*            return (*/}
                {/*                <Flatpickr*/}
                {/*                    className='form-control w-100'*/}
                {/*                    id='poDate'*/}
                {/*                    options={options}*/}
                {/*                    value={value}*/}
                {/*                    onChange={([date], dateStr) => {*/}
                {/*                        onChange(dateStr)*/}
                {/*                    }}*/}
                {/*                    name={name}*/}
                {/*                />*/}
                {/*            )*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    {props.errors.poDate && <FormFeedback>Please select a po date</FormFeedback>}*/}
                {/*</Col>*/}

                {/*<Col md={6} xs={12}>*/}
                {/*    <Label className='form-label mb-1' for='deliveryDate'>*/}
                {/*        Delivery Date*/}
                {/*    </Label>*/}
                {/*    <Controller*/}
                {/*        control={props.control}*/}
                {/*        name='deliveryDate'*/}
                {/*        render={({field: {onChange, value, name}}) => {*/}
                {/*            return (*/}
                {/*                <Flatpickr*/}
                {/*                    className='form-control w-100'*/}
                {/*                    id='deliveryDate'*/}
                {/*                    options={options}*/}
                {/*                    value={value}*/}
                {/*                    onChange={([date], dateStr) => {*/}
                {/*                        onChange(dateStr)*/}
                {/*                    }}*/}
                {/*                    name={name}*/}
                {/*                />*/}
                {/*            )*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    {props.errors.deliveryDate && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a delivery date</span>}*/}
                {/*</Col>*/}

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='tag'>
                        Tag <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        control={props.control}
                        name='tag'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='tag'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Tags'
                                    options={props.tagList}
                                    theme={selectThemeColors}
                                    value={props.tagList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.tag)}
                                />
                            )
                        }}
                    />
                    {props.errors.destination &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a destination</span>}
                </Col>


                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='productImage'>
                        Product Image <span style={{color: 'red'}}>*</span>
                        {/*<AlertCircle id={"ProductImage"} style={{marginLeft: '10px'}} width={16}*/}
                        {/*             heigth={16}/>*/}
                        {/*<UncontrolledTooltip*/}
                        {/*    placement="top"*/}
                        {/*    target="ProductImage"*/}
                        {/*>*/}
                        {/*    Image submitted will be shown on CheapHub public user site.*/}
                        {/*</UncontrolledTooltip>*/}
                    </Label>

                    <Col>
                        <Row>
                            <Col>
                                <ReactFilesMini
                                    pageType
                                    disabled={false}
                                    sendImageData={async (imageFile, file) => {
                                        await handleChangeFileShare(file, types.PRODUCT_IMAGE);
                                    }}
                                    accepts={["image/png", "image/jpg", "image/jpeg"]}
                                    imageFile={productImageName ? productImageName : uploadedProductImage}
                                />

                                <div className='view-button-container'>
                                    {uploadedProductImage &&
                                    <a href={uploadedProductImage} target="_blank">View</a>
                                    }
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} lg={12} xs={12}>
                                {productImageIsCropVisible && (
                                    <div>
                                        <div className={'program-modal-image-cropper'}>
                                            <Cropper
                                                image={productImageSrc}
                                                crop={productImageCrop}
                                                aspect={CROP_ASPECT_TO_FIRST_IMAGE}
                                                zoom={productImageZoom}
                                                onCropChange={(crop) => {
                                                    onCropChange(crop, types.PRODUCT_IMAGE)
                                                }}
                                                onCropComplete={async (croppedArea, croppedAreaPixels) => {
                                                    await onCropComplete(croppedArea, croppedAreaPixels, types.PRODUCT_IMAGE)
                                                }}

                                            />
                                        </div>
                                        <div className="program-modal-image-cropper-controller">
                                            <input
                                                disabled = {false}
                                                type="range"
                                                value={productImageZoom}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                aria-labelledby="Zoom"
                                                onChange={(e) => {
                                                    setProductImageZoom(e.target.value)
                                                }}
                                                className="zoom-range"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            {/*{productCroppedImage &&*/}
                            <Col lg={12} md={12} sm={12}>
                                <img src={productCroppedImage}
                                     style={{width: '50%'}}
                                     loading={"lazy"}
                                     className={'program-modal-image-cropper-output'}
                                />
                            </Col>
                            {/*}*/}
                        </Row>
                    </Col>


                    {/*<Controller*/}
                    {/*    control={props.control}*/}
                    {/*    name='tag'*/}
                    {/*    render={({field: {onChange, value, name, ref}}) => {*/}
                    {/*        return (*/}
                    {/*            <Select*/}
                    {/*                id='tag'*/}
                    {/*                className='react-select'*/}
                    {/*                classNamePrefix='select'*/}
                    {/*                placeholder='Tags'*/}
                    {/*                options={props.tagList}*/}
                    {/*                theme={selectThemeColors}*/}
                    {/*                value={props.tagList.find((c) => c.value === value)}*/}
                    {/*                onChange={(selectedOption) => {*/}
                    {/*                    onChange(selectedOption.value)*/}
                    {/*                }}*/}
                    {/*                name={name}*/}
                    {/*                inputRef={ref}*/}
                    {/*                required={true}*/}
                    {/*                errorText={true}*/}
                    {/*                styles={customStyle(props.errors.tag)}*/}
                    {/*            />*/}
                    {/*        )*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {props.errors.destination &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a destination</span>}
                </Col>


                <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                    <Button type='submit' className='me-1' color='success'>
                        Submit
                    </Button>
                    <Button type='reset' color='secondary' outline onClick={props.toggle}>
                        Discard
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default OrderAdditionModal
