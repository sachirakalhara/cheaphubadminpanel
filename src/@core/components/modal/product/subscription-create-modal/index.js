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
import imgBoxBlack from '@src/assets/images/bulk/box-black.png'
import imgBoxWhite from '@src/assets/images/bulk/box-white.png'
import {Controller, useForm} from "react-hook-form"
import Select from "react-select";
import ReactFilesMini from "../../../../../custom-components/file-picker/ReactFiles-Mini";
import Cropper from "react-easy-crop";
import {customToastMsg, fileReader, getCroppedImg, isEmpty, isImageFile} from "../../../../../utility/Utils";
import Radio from "../../../../../@core/components/radio/RadioVuexy";
import cryptoLogo from '@src/assets/images/icons/payments/crypto.webp'
import stripeLogo from '@src/assets/images/icons/payments/visa-cc.png'
import {ArrowLeft, ArrowRight} from "react-feather";
import * as BulkProductServices from '../../../../../services/bulk-products';
import RepeatingSubscriptionForm from "../../../../../views/forms/form-repeater/subscription/RepeatingSubscriptionForm";
import RepeatingPackageForm from "../../../../../views/forms/form-repeater/packages/RepeatingPackageForm";
import * as ContributionProductService from '../../../../../services/contribution-products';

const defaultValues = {
    productName: '',
    category: '',
    description: '',
    tag: '',
    productImageName: '',
    serviceInfo: '',
    slugUrl: ''
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

const SubscriptionCreationModal = (props) => {
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
    const [productId, setProductId] = useState(null)

    // react hook form configurations
    const {control, setError, handleSubmit, formState: {errors}, setValue, getValues, reset} = useForm({defaultValues});


    // product image upload
    const onCropChange = (crop, type) => {
        setProductImageCrop(crop)
    }

    const onCropComplete = async (croppedArea, croppedAreaPixels, type) => {
        setProductImageCroppedAreaPixels(croppedAreaPixels)
        await showCroppedImage(croppedAreaPixels)
    }

    const showCroppedImage = async (croppedRatio) => {
        const rotation = 0;
        try {
            const croppedImage = await getCroppedImg(
                productImageSrc,
                croppedRatio,
                rotation
            )
            setProductCroppedImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }

    const handleChangeFileShare = async (file) => {
        if (isImageFile(file.name)) {
            setProductImageIsCropVisible(true);
            setProductImageName(file.name);
            let imageDataUrl = await fileReader(file);
            setFile(file)
            setProductImageSrc(imageDataUrl);
            setValue("productImageName", file.name)
        } else {
            setProductImageIsCropVisible(false);
        }
    }

    const onSubmitGeneralDetails = async data => {
        const obj = {
            productName: data.productName,
            category: data.category.toString(),
            description: data.description,
            tag: data.tag.toString(),
            productImageName: data.productImageName,
            serviceInfo: data.serviceInfo
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

    const onSubmitSEODetails = async dataObj => {
        const obj = {
            slugUrl: dataObj.slugUrl
        }


        if (Object.values(obj).every(field => field.length > 0)) {
            let data = new FormData();
            data.append('name', getValues('productName'))
            data.append('description', getValues('description'))
            data.append('tag_id', getValues('tag'))
            data.append('image', file)
            data.append('service_info', getValues('serviceInfo'))
            data.append('slug_url', getValues('slugUrl'))
            data.append('visibility', visibilityMode)
            data.append('categories', getValues('category'))

            ContributionProductService.createContributionProduct(data)
                .then(res => {
                    console.log(res)
                    if (res.success) {
                        console.log(res)
                        setProductId(res.data.contribution_product.id);
                        setActive(3)
                        customToastMsg("Product is successfully created", 1);
                    } else {
                        customToastMsg(res.message, res.status)
                    }
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
        if (selectedActiveValue === 1 || selectedActiveValue === 2) {
            if (selectedActiveValue <= active) {
                setActive(selectedActiveValue)
            }
        } else {
            setActive(selectedActiveValue)
        }
    }

    return (
        <Modal show={props.show} toggle={props.toggle} headTitle="Add New Service Product">
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
                            <img src={active !== 2 ? imgSEOBlack : imgSEOWhite} alt="img" height={20} width={20}
                                 className="me-1"/>
                            <span className={`fw-bold fw-bolder ${active !== 2 ? 'text-black' : ''}`}>SEO</span>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink active={active === 3} onClick={() => onHeaderTabPress(3)}>
                            <img src={active !== 3 ? imgDollarBlack : imgDollarWhite} alt="img" height={20} width={20}
                                 className="me-1"/>
                            <span className={`fw-bold fw-bolder ${active !== 3 ? 'text-black' : ''}`}>Subscription / Variant</span>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink active={active === 4} onClick={() => onHeaderTabPress(4)}>
                            <img src={active !== 4 ? imgBoxBlack : imgBoxWhite} alt="img" height={20}
                                 width={20} className="me-1"/>
                            <span className={`fw-bold fw-bolder ${active !== 4 ? 'text-black' : ''}`}>Packages</span>
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

                    <Col md={12} xs={12}>
                        <Label className='form-label mb-1' for='serviceInfo'>
                            Service Info <span style={{color: 'red'}}>*</span>
                        </Label>
                        <Controller
                            name='serviceInfo'
                            control={control}
                            render={({field}) => (
                                <Input {...field} id='serviceInfo' placeholder='Service Info' value={field.value}
                                       type="textarea" rows='4'
                                       invalid={errors.serviceInfo && true} autoComplete="off"/>
                            )}
                        />
                        {errors.serviceInfo && <FormFeedback>Please enter a valid service info</FormFeedback>}
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
                                            console.log("Hellow world");
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

            {active === 3 && (
                <RepeatingSubscriptionForm
                    productId={productId}
                />
            )}

            {active === 4 && (
                <RepeatingPackageForm
                    productId={productId}
                />
            )}

        </Modal>
    )
}

export default SubscriptionCreationModal;
