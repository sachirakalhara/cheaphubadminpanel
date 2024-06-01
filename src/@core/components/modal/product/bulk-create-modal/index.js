import Modal from "../../index";
import React, {Fragment, useEffect, useState} from "react";
import "../../styles.scss";
import {selectThemeColors} from '@utils'
import {
    Button,
    Col,
    FormFeedback,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    Nav,
    NavItem,
    NavLink,
    Row
} from "reactstrap";
import imgBlack from '@src/assets/images/bulk/attachment-black.png'
import imgWhite from '@src/assets/images/bulk/attachment-white.png'
import imgDeliveryBlack from '@src/assets/images/bulk/delivery-black.png'
import imgDeliveryWhite from '@src/assets/images/bulk/delivery-white.png'
import imgDollarBlack from '@src/assets/images/bulk/dollar-black.png'
import imgDollarWhite from '@src/assets/images/bulk/dollar-white.png'
import imgSEOBlack from '@src/assets/images/bulk/seo-black.png'
import imgSEOWhite from '@src/assets/images/bulk/seo-white.png'
import {Controller, useForm} from "react-hook-form"
import Select from "react-select";
import ReactFilesMini from "../../../../../custom-components/file-picker/ReactFiles-Mini";
import Cropper from "react-easy-crop";
import {fileReader, getCroppedImg, isEmpty, isImageFile} from "../../../../../utility/Utils";
import Radio from "../../../../../@core/components/radio/RadioVuexy";
import cryptoLogo from '@src/assets/images/icons/payments/crypto.webp'
import stripeLogo from '@src/assets/images/icons/payments/visa-cc.png'
import {ArrowLeft, ArrowRight} from "react-feather";
import * as BulkProductServices from '../../../../../services/bulk-products';

const defaultValues = {
    productName: 'asd',
    category: '',
    description: 'asd',
    tag: '',
    productImageName: '',
    serialList: '',
    serviceInfo: '',
    minimumQty: '30',
    maximumQty: '50',
    price: '65',
    gatewayFee: '560',
    cryptoRadio: false,
    stripeRadio: false,
    selectedPaymentMethods: [],
    slugUrl: 'sad',
}

const customStyle = (error) => ({
    control: styles => ({
        ...styles,
        borderColor: error ? '#EA5455' : styles.borderColor,
        '&:hover': {
            borderColor: error ? '#EA5455' : styles['&:hover'].borderColor
        }
    })
})

const types = {
    PRODUCT_IMAGE: 'program-modal-banner'
}

const CROP_ASPECT_TO_FIRST_IMAGE = 1;

const BulCreationModal = (props) => {
    const [active, setActive] = useState(1);

    // image uploader
    const [uploadedProductImage, setUploadedProductImage] = useState(null)
    const [productImageSrc, setProductImageSrc] = useState('')
    const [productImageCrop, setProductImageCrop] = useState({x: 0, y: 0})
    const [productImageCroppedAreaPixels, setProductImageCroppedAreaPixels] = useState(null)
    const [productCroppedImage, setProductCroppedImage] = useState(null)
    const [productImageIsCropVisible, setProductImageIsCropVisible] = useState(false)
    const [productImageZoom, setProductImageZoom] = useState(1)
    const [productImageName, setProductImageName] = useState('')

    const [productType, setProductType] = useState(1);
    const [visibilityMode, setVisibilityMode] = useState('card');

    const [file, setFile] = useState(null);

    // react hook form configurations
    const {control, setError, handleSubmit, formState: {errors}, setValue, getValues, reset} = useForm({defaultValues});


    // product image upload
    const onCropChange = (crop, type) => {
        if (type === types.PRODUCT_IMAGE) setProductImageCrop(crop)
    }

    const onCropComplete = (croppedArea, croppedAreaPixels, type) => {
        if (type === types.PRODUCT_IMAGE) setProductImageCroppedAreaPixels(croppedAreaPixels)

        cropButtonHandler(type)
    }

    /*image cropper */
    const cropButtonHandler = (type) => {
        showCroppedImage(type);
    }

    const showCroppedImage = async (type) => {
        const rotation = 0;
        if (type === types.PRODUCT_IMAGE) {
            try {
                const croppedImage = await getCroppedImg(
                    productImageSrc,
                    productImageCroppedAreaPixels,
                    rotation
                )
                console.log(croppedImage)
                setProductCroppedImage(croppedImage)
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleChangeFileShare = async (file, type) => {
        if (isImageFile(file.name)) {
            if (type === types.PRODUCT_IMAGE) {
                console.log(isImageFile(file.name))
                setProductImageIsCropVisible(true);
                setProductImageName(file.name);
                let imageDataUrl = await fileReader(file);
                console.log('imageDataUrl::::::::::::::::::::::', file)
                setFile(file)
                setProductImageSrc(imageDataUrl);
                setValue("productImageName", file.name)
            }
        } else {
            setProductImageIsCropVisible(false);
        }
    }

    const onSubmitGeneralDetails = async data => {

        console.log(data)

        // productName: '',
        //     category: '',
        //     description: '',
        //     tag: '',
        //     productImageName: '',
        //     serialList: '',
        //     serviceInfo: '',
        //     minimumQty: '',
        //     maximumQty: '',
        //     price: '',
        //     gatewayFee: '',
        //     slugUrl: ''

        const obj = {
            productName: data.productName,
            category: data.category.toString(),
            description: data.description,
            tag: data.tag.toString(),
            productImageName: data.productImageName
        }

        console.log(obj)

        if (Object.values(obj).every(field => field.length > 0)) {

            setActive(active + 1)

        } else {
            for (const key in obj) {
                if (obj[key].length === 0) {
                    setError(key, {
                        type: 'required'
                    })
                }
            }
        }

    }

    const onSubmitDeliveryDetails = async data => {
        const obj = {
            minimumQty: data.minimumQty,
            maximumQty: data.maximumQty
        }

        if (productType === 1) {
            Object.assign(obj, {serialList: data.serialList})
        } else {
            Object.assign(obj, {serviceInfo: data.serviceInfo})
        }

        if (Object.values(obj).every(field => field.length > 0)) {
            setActive(active + 1)
        } else {
            for (const key in obj) {
                if (obj[key].length === 0) {
                    setError(key, {
                        type: 'required'
                    })
                }
            }
        }
    }

    const onSubmitPricingDetails = async data => {

        const list = [];

        if (data.cryptoRadio) {
            list.push('crypto')
        }

        if (data.stripeRadio) {
            list.push('stripe')
        }

        setValue('selectedPaymentMethods', list);


        const obj = {
            price: data.price,
            gatewayFee: data.gatewayFee,
        }

        if (Object.values(obj).every(field => field.length > 0)) {
            setActive(active + 1)
        } else {
            for (const key in obj) {
                if (obj[key].length === 0) {
                    setError(key, {
                        type: 'required'
                    })
                }
            }
        }
    }

    const onSubmitSEODetails = async data => {
        const obj = {
            slugUrl: data.slugUrl
        }

        if (Object.values(obj).every(field => field.length > 0)) {

            let data = new FormData();
            data.append('name', getValues('productName'))
            data.append('description', getValues('description'))
            data.append('price', getValues('price'))
            data.append('gateway_fee', getValues('gatewayFee'))
            data.append('image', file)
            data.append('categories', getValues('category'))
            data.append('tag_id', getValues('tag'))
            data.append('payment_method', getValues('selectedPaymentMethods'))
            data.append('serial', getValues('serialList'))
            data.append('minimum_quantity', getValues('minimumQty'))
            data.append('maximum_quantity', getValues('maximumQty'))
            data.append('service_info', getValues('serviceInfo'))
            data.append('slug_url', getValues('slugUrl'))
            data.append('visibility', visibilityMode)

            console.log(data)

            BulkProductServices.createBulkProduct(data)
                .then(res => {
                    console.log(res)
                })


        } else {
            for (const key in obj) {
                if (obj[key].length === 0) {
                    setError(key, {
                        type: 'required'
                    })
                }
            }
        }
    }

    useEffect(() => {
        console.log(props.tagList)
    }, [])

    const onHeaderTabPress = (selectedActiveValue) => {
        if (selectedActiveValue <= active) {
            setActive(selectedActiveValue)
        }
    }

    return (
        <Modal show={props.show} toggle={props.toggle} headTitle="Add New Bulk Product">
            <Fragment>
                <Nav pills className='mt-1 mb-0 pb-0'>
                    <NavItem>
                        <NavLink active={active === 1} onClick={() => onHeaderTabPress(1)}>
                            <img src={active !== 1 ? imgBlack : imgWhite} alt="img" height={20} width={20}
                                 className="me-1"/>
                            <span className={`fw-bold fw-bolder ${active !== 1 ? 'text-black' : ''}`}>General</span>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink active={active === 2} onClick={() => onHeaderTabPress(2)}>
                            <img src={active !== 2 ? imgDeliveryBlack : imgDeliveryWhite} alt="img" height={20}
                                 width={20} className="me-1"/>
                            <span className={`fw-bold fw-bolder ${active !== 2 ? 'text-black' : ''}`}>Delivery</span>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink active={active === 3} onClick={() => onHeaderTabPress(3)}>
                            <img src={active !== 3 ? imgDollarBlack : imgDollarWhite} alt="img" height={20} width={20}
                                 className="me-1"/>
                            <span className={`fw-bold fw-bolder ${active !== 3 ? 'text-black' : ''}`}>Pricing</span>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink active={active === 4} onClick={() => onHeaderTabPress(4)}>
                            <img src={active !== 4 ? imgSEOBlack : imgSEOWhite} alt="img" height={20} width={20}
                                 className="me-1"/>
                            <span className={`fw-bold fw-bolder ${active !== 4 ? 'text-black' : ''}`}>SEO</span>
                        </NavLink>
                    </NavItem>
                </Nav>
            </Fragment>

            {active === 1 && (
                <Row tag='form' className='gy-1 pt-2' onSubmit={handleSubmit(onSubmitGeneralDetails)}>
                    <Col md={4} xs={12}>
                        <Label className='form-label mb-1 ' for='productName'>
                            Product Name <span style={{color: 'red'}}>*</span>
                        </Label>
                        <Controller
                            name='productName'
                            control={control}
                            render={({field}) => (
                                <Input {...field} id='productName' placeholder='Product Name' value={field.value}
                                       invalid={errors.productName && true} autoComplete="off"/>
                            )}
                        />
                        {errors.productName && <FormFeedback>Please enter a valid name</FormFeedback>}
                    </Col>

                    <Col md={4} xs={12}>
                        <Label className='form-label mb-1' for='customer'>
                            Product Category <span style={{color: 'red'}}>*</span>
                        </Label>
                        <Controller
                            control={control}
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
                                        styles={customStyle(errors.category)}
                                    />
                                )
                            }}
                        />
                        {errors.category &&
                        <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select category</span>}
                    </Col>

                    <Col md={4} xs={12}>
                        <Label className='form-label mb-1' for='tag'>
                            Tag <span style={{color: 'red'}}>*</span>
                        </Label>
                        <Controller
                            control={control}
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
                                        styles={customStyle(errors.tag)}
                                    />
                                )
                            }}
                        />
                        {errors.tag &&
                        <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a Tag</span>}
                    </Col>

                    <Col md={12} xs={12}>
                        <Label className='form-label mb-1' for='description'>
                            Description <span style={{color: 'red'}}>*</span>
                        </Label>
                        <Controller
                            name='description'
                            control={control}
                            render={({field}) => (
                                <Input {...field} id='description' placeholder='Description' value={field.value}
                                       type="textarea" rows='4'
                                       invalid={errors.description && true} autoComplete="off"/>
                            )}
                        />
                        {errors.description && <FormFeedback>Please enter a valid description</FormFeedback>}
                    </Col>

                    <Col md={6} xs={12}>
                        <Label className='form-label mb-1' for='productImage'>
                            Product Image <span style={{color: 'red'}}>*</span>
                        </Label>

                        <Controller
                            name='productImageName'
                            control={control}
                            render={({field}) => (
                                <ReactFilesMini  {...field} id='productImageName'
                                                 pageType
                                                 disabled={false}
                                                 sendImageData={async (imageFile, file) => {
                                                     await handleChangeFileShare(file, types.PRODUCT_IMAGE);
                                                 }}
                                                 invalid={errors.productImageName && true}
                                                 accepts={["image/png", "image/jpg", "image/jpeg"]}
                                                 imageFile={productImageName ? productImageName : uploadedProductImage}
                                />

                            )}
                        />
                        {errors.productImageName &&
                        <span style={{
                            fontSize: '12px',
                            color: '#EA5455',
                            marginTop: 4
                        }}>Please choose a product image</span>}
                    </Col>

                    <Col md={12} lg={12} xs={12}>
                        <Row className='align-items-center'>
                            <Col md={6} lg={6} xs={12}>
                                {productImageIsCropVisible && productImageSrc && (
                                    <div>
                                        <div className='program-modal-image-cropper'>
                                            <Cropper
                                                image={productImageSrc}
                                                crop={productImageCrop}
                                                aspect={CROP_ASPECT_TO_FIRST_IMAGE}
                                                zoom={productImageZoom}
                                                onCropChange={(crop) => {
                                                    onCropChange(crop, types.PRODUCT_IMAGE)
                                                }}
                                                onCropComplete={(croppedArea, croppedAreaPixels) => {
                                                    onCropComplete(croppedArea, croppedAreaPixels, types.PRODUCT_IMAGE)
                                                }}

                                            />
                                        </div>
                                        <div className="program-modal-image-cropper-controller">
                                            <input
                                                disabled={false}
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

                            {productCroppedImage && productImageSrc &&
                            <Col lg={6} md={6} sm={12}>
                                <img src={productCroppedImage}
                                     style={{width: '30%'}}
                                     loading={"lazy"}
                                     className='program-modal-image-cropper-output'
                                />
                            </Col>
                            }

                        </Row>
                    </Col>

                    <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                        <Button type='submit' className='me-1' color='success'>
                            Next
                        </Button>
                        <Button type='reset' color='secondary' outline onClick={props.toggle}>
                            Discard
                        </Button>
                    </Col>
                </Row>
            )}

            {active === 2 && (
                <>
                    <Col lg={4} sm={12}
                         className={'program-modal-text-input-filed program-modal-row'}>
                        <label className='program-modal-label'>Product Type
                        </label>
                        <div className='program-modal-radio-btn-group'>
                            <Radio
                                label='Serials Based'
                                className="program-modal-radio-btn"
                                checked={productType === 1}
                                onChange={() => {
                                    setProductType(1);
                                    setValue('serialList', '');
                                    setValue('serviceInfo', '');
                                }}
                            />

                            <Radio
                                label='Service Based'
                                className={"program-modal-radio-btn"}
                                checked={productType === 2}
                                onChange={() => {
                                    setProductType(2);
                                    setValue('serialList', '');
                                    setValue('serviceInfo', '');
                                }}
                            />
                        </div>
                    </Col>
                    <Row tag='form' className='gy-1 pt-2' onSubmit={handleSubmit(onSubmitDeliveryDetails)}>

                        {productType === 1 ? (
                            <Col md={12} xs={12}>
                                <Label className='form-label mb-1' for='serialList'>
                                    Serials list <span style={{color: 'red'}}>*</span>
                                </Label>
                                <Controller
                                    name='serialList'
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field} id='serialList' placeholder='Serial List' value={field.value}
                                               type="textarea" rows='4'
                                               invalid={errors.serialList && true} autoComplete="off"/>
                                    )}
                                />
                                {errors.serialList && <FormFeedback>Please enter a valid serials List</FormFeedback>}
                            </Col>
                        ) : (
                            <Col md={12} xs={12}>
                                <Label className='form-label mb-1' for='serviceInfo'>
                                    Service Info <span style={{color: 'red'}}>*</span>
                                </Label>
                                <Controller
                                    name='serviceInfo'
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field} id='serviceInfo' placeholder='Service Info'
                                               value={field.value}
                                               type="textarea" rows='4'
                                               invalid={errors.serviceInfo && true} autoComplete="off"/>
                                    )}
                                />
                                {errors.serviceInfo && <FormFeedback>Please enter a valid service info</FormFeedback>}
                            </Col>
                        )}


                        <Col md={6} xs={12}>
                            <Label className='form-label mb-1' for='qty'>
                                Minimum Quantity <span style={{color: 'red'}}>*</span>
                            </Label>
                            <Controller
                                name='minimumQty'
                                control={control}
                                render={({field}) => (
                                    <Input {...field} id='minimumQty' placeholder='Minimum Quantity' value={field.value}
                                           invalid={errors.minimumQty && true} autoComplete="off"/>
                                )}
                            />
                            {errors.minimumQty && <FormFeedback>Please enter a valid minimum quantity</FormFeedback>}
                        </Col>

                        <Col md={6} xs={12}>
                            <Label className='form-label mb-1' for='qty'>
                                Maximum Quantity <span style={{color: 'red'}}>*</span>
                            </Label>
                            <Controller
                                name='maximumQty'
                                control={control}
                                render={({field}) => (
                                    <Input {...field} id='maximumQty' placeholder='Maximum Quantity' value={field.value}
                                           invalid={errors.maximumQty && true} autoComplete="off"/>
                                )}
                            />
                            {errors.maximumQty && <FormFeedback>Please enter a valid maximum quantity</FormFeedback>}
                        </Col>

                        <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                            <Button type='submit' className='me-1' color='success'>
                                Next
                            </Button>
                            <Button type='reset' color='secondary' outline onClick={props.toggle}>
                                Discard
                            </Button>
                        </Col>

                    </Row>
                </>
            )}


            {active === 3 && (
                <>
                    <Row tag='form' className='gy-1 pt-2' onSubmit={handleSubmit(onSubmitPricingDetails)}>

                        <Col md={3} xs={12}>
                            <h5>Payment methods <span style={{color: 'red'}}>*</span></h5>
                            <ListGroup>

                                <ListGroupItem className='border-0 px-0'>
                                    <Controller
                                        name='cryptoRadio'
                                        control={control}
                                        render={({field: {onChange, value, name}}) => {

                                            return (
                                                <label htmlFor='cryptoRadio' className='d-flex cursor-pointer'>
                                                <span className='avatar avatar-tag bg-light-success me-1'>
                                                    <img src={cryptoLogo} alt='cryptoLogo' height='25'/>
                                                 </span>
                                                    <span
                                                        className='d-flex align-items-center justify-content-between flex-grow-1'>
                                                    <div className='me-1'><h5 className='d-block fw-bolder'>Crypto</h5></div>
                                                <span>
                                                    <Input type='radio'
                                                           id='cryptoRadio'
                                                           name={name}
                                                           value={value}
                                                           onClick={() => {
                                                               onChange(!value)
                                                           }}
                                                           onChange={() => {
                                                               onChange(!value)
                                                           }}
                                                           checked={value}
                                                    />
                                                </span>
                                                </span>
                                                </label>
                                            )

                                        }}
                                    />
                                </ListGroupItem>

                                <ListGroupItem className='border-0 px-0'>
                                    <Controller
                                        name='stripeRadio'
                                        control={control}
                                        render={({field: {onChange, value, name}}) => {
                                            return (
                                                <label htmlFor='stripeRadio' className='d-flex cursor-pointer'>
                                                <span className='avatar avatar-tag bg-light-warning me-1'>
                                                    <img src={stripeLogo} alt='stripeLogo' height='25'/>
                                                </span>
                                                    <span
                                                        className='d-flex align-items-center justify-content-between flex-grow-1'>
                                                    <div className='me-1'><h5 className='d-block fw-bolder'>Stripe</h5></div>
                                                    <span>
                                                        <Input type='radio'
                                                               id='stripeRadio'
                                                               name={name}
                                                               value={value}
                                                               onClick={() => {
                                                                   onChange(!value)
                                                               }}
                                                               onChange={() => {
                                                                   onChange(!value)
                                                               }}
                                                               checked={value}
                                                        />
                                                    </span>
                                                </span>
                                                </label>
                                            )
                                        }}
                                    />

                                </ListGroupItem>
                            </ListGroup>

                            {getValues("selectedPaymentMethods").length === 0 &&
                            <div className="invalid-feedback-custom">Please select a payment method</div>}

                        </Col>

                        <Col md={9} xs={12}/>

                        <Col md={6} xs={12}>
                            <Label className='form-label mb-1' for='price'>
                                Product Price <span style={{color: 'red'}}>*</span>
                            </Label>
                            <Controller
                                name='price'
                                control={control}
                                render={({field}) => (
                                    <Input {...field} id='price' placeholder='Product Price' value={field.value}
                                           invalid={errors.price && true} autoComplete="off"/>
                                )}
                            />
                            {errors.price && <FormFeedback>Please enter a valid product price</FormFeedback>}
                        </Col>

                        <Col md={6} xs={12}>
                            <Label className='form-label mb-1' for='gatewayFee'>
                                Gateway Fee <span style={{color: 'red'}}>*</span>
                            </Label>
                            <Controller
                                name='gatewayFee'
                                control={control}
                                render={({field}) => (
                                    <Input {...field} id='gatewayFee' placeholder='Gateway Fee' value={field.value}
                                           invalid={errors.gatewayFee && true} autoComplete="off"/>
                                )}
                            />
                            {errors.gatewayFee && <FormFeedback>Please enter a valid gateway fee</FormFeedback>}
                        </Col>


                        <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                            <Button type='submit' className='me-1' color='success'>
                                Next
                            </Button>
                            <Button type='reset' color='secondary' outline onClick={props.toggle}>
                                Discard
                            </Button>
                        </Col>

                    </Row>
                </>
            )}

            {active === 4 && (
                <Row tag='form' className='gy-1 pt-2' onSubmit={handleSubmit(onSubmitSEODetails)}>

                    <label className='program-modal-label'>
                        Product visibility settings
                    </label>

                    <Col xs={12}>
                        <div className='form-check mb-1'>
                            <Input
                                type='radio'
                                value='unlisted'
                                id='unlisted'
                                name='payment-method-radio'
                                checked={visibilityMode === 'unlisted'}
                                onChange={() => setVisibilityMode('unlisted')}
                            />
                            <Label className='form-check-label' for='unlisted'>
                                Unlisted
                            </Label>
                        </div>
                        <div className='form-check mb-1'>
                            <Input
                                type='radio'
                                value='onHold'
                                id='onHold'
                                name='payment-method-radio'
                                checked={visibilityMode === 'onHold'}
                                onChange={() => setVisibilityMode('onHold')}
                            />
                            <Label className='form-check-label' for='onHold'>
                                On Hold
                            </Label>
                        </div>
                    </Col>

                    <Col md={8} xs={12}>
                        <Label className='form-label mb-1' for='slugUrl'>
                            Slug Url <span style={{color: 'red'}}>*</span>
                        </Label>
                        <Row>
                            <Col md={8} xs={12}>
                                <Controller
                                    name='slugUrl'
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field} id='slugUrl' placeholder='Slug Url' value={field.value}
                                               invalid={errors.slugUrl && true} autoComplete="off"/>
                                    )}
                                />
                                {errors.slugUrl && <FormFeedback>Please enter a valid slug url</FormFeedback>}
                            </Col>
                            <Col md={4} xs={12}>
                                <Button color='secondary' outline
                                        onClick={() => {
                                        }}
                                >
                                    Copy Product Name
                                </Button>
                            </Col>
                        </Row>


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
            )}

        </Modal>
    )
}

export default BulCreationModal;
