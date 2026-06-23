import Modal from "../../index";
import React, {Fragment, useEffect, useState} from "react";
import "../../styles.scss";
import {selectThemeColors} from '@utils'
import {Button, Col, FormFeedback, Input, Label, Nav, NavItem, NavLink, Row} from "reactstrap";
import imgBlack from '@src/assets/images/bulk/attachment-black.png'
import imgWhite from '@src/assets/images/bulk/attachment-white.png'
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
import {customToastMsg, fileReader, getCroppedImg, isImageFile} from "../../../../../utility/Utils";
import RepeatingSubscriptionForm from "../../../../../views/forms/form-repeater/subscription/RepeatingSubscriptionForm";
import RepeatingPackageForm from "../../../../../views/forms/form-repeater/packages/RepeatingPackageForm";
import * as ContributionProductService from '../../../../../services/contribution-products';
import {formDataToJson} from "../../../../../utility/commonFun";
import {toggleLoading} from "../../../../../redux/loading";
import {useDispatch} from "react-redux";
import qs from 'qs';
import {composeAbout, parseAbout, composeServiceInfo, parseServiceInfo} from "./productContent";

const defaultValues = {
    productName: '',
    category: '',
    description: '',
    tag: '',
    productImageName: '',
    serviceInfo: '',
    id: null,
    // slugUrl: ''
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
    const dispatch = useDispatch()

    const [active, setActive] = useState(props.isManageMode ? 3 : 1);

    // image uploader
    const [uploadedProductImage, setUploadedProductImage] = useState(null)
    const [productImageSrc, setProductImageSrc] = useState('')
    const [productImageCrop, setProductImageCrop] = useState({x: 0, y: 0})
    const [productImageCroppedAreaPixels, setProductImageCroppedAreaPixels] = useState(null)
    const [productCroppedImage, setProductCroppedImage] = useState(null)
    const [productImageIsCropVisible, setProductImageIsCropVisible] = useState(false)
    const [productImageZoom, setProductImageZoom] = useState(1)
    const [productImageName, setProductImageName] = useState('')

    const [visibilityMode, setVisibilityMode] = useState('open');

    const [file, setFile] = useState(null);
    const [productId, setProductId] = useState(null);
    const [buttonName, setButtonName] = useState(props.isEditMode ? 'Update' : 'Submit');

    // structured product-editor content (About + Service Info)
    const [aboutHead, setAboutHead] = useState('');
    const [aboutBody, setAboutBody] = useState('');
    const [tiers, setTiers] = useState([]);
    const [features, setFeatures] = useState([]);
    const [structErrors, setStructErrors] = useState({});

    const updateTier = (i, patch) => setTiers(prev => prev.map((t, j) => (j === i ? {...t, ...patch} : t)));
    const removeTier = (i) => setTiers(prev => prev.filter((_, j) => j !== i));
    const addTier = () => setTiers(prev => prev.concat([{emoji: '', name: '', best: false, points: ''}]));

    const updateFeature = (i, patch) => setFeatures(prev => prev.map((f, j) => (j === i ? {...f, ...patch} : f)));
    const removeFeature = (i) => setFeatures(prev => prev.filter((_, j) => j !== i));
    const addFeature = () => setFeatures(prev => prev.concat([{emoji: '', title: '', desc: ''}]));

    // react hook form configurations
    const {control, setError, handleSubmit, formState: {errors}, setValue, getValues, reset} = useForm({defaultValues});


    // product image upload
    const onCropChange = (crop, type) => {
        setProductImageCrop(crop)
    }

    const onCropComplete = async (croppedArea, croppedAreaPixels, type) => {
        setProductImageCroppedAreaPixels(croppedAreaPixels)

        try {
            const croppedImage = await getCroppedImg(
                productImageSrc,
                croppedAreaPixels ?? {width: 1640, height: 1640, x: 0, y: 360},
                0
            );
            setProductCroppedImage(croppedImage);

            const response = await fetch(croppedImage);
            const blob = await response.blob();
            const jpgName = productImageName.replace(/\.[^.]+$/, '.jpg');
            const file = new File([blob], jpgName, {type: blob.type});

            setFile(file);

            return file;
        } catch (e) {
            console.error(e);
        }
    }

    const handleChangeFileShare = async (file) => {
        if (isImageFile(file.name)) {
            setProductImageIsCropVisible(true);
            setProductImageName(file.name);
            let imageDataUrl = await fileReader(file);
            // setFile(file)
            setProductImageSrc(imageDataUrl);
            setValue("productImageName", file.name)
        } else {
            setProductImageIsCropVisible(false);
        }
    }

    const onSubmitGeneralDetails = async data => {
        // compose structured content into the HTML columns the customer site renders
        const composedDescription = composeAbout({headline: aboutHead, body: aboutBody});
        const composedServiceInfo = composeServiceInfo({tiers, features});

        // validate structured content
        const structErr = {};
        if (!aboutHead.trim()) structErr.aboutHead = true;
        if (!aboutBody.trim()) structErr.aboutBody = true;
        const hasTier = tiers.some(t => (t.name || '').trim());
        const hasFeature = features.some(f => (f.title || '').trim());
        if (!hasTier && !hasFeature) structErr.serviceInfo = true;
        setStructErrors(structErr);

        // validate the react-hook-form managed required fields
        const baseObj = {
            productName: data.productName,
            category: (data.category || '').toString(),
            tag: (data.tag || '').toString(),
            productImageName: data.productImageName
        }
        let baseValid = true;
        for (const key in baseObj) {
            if (!baseObj[key] || baseObj[key].length === 0) {
                setError(key, {type: 'required'})
                baseValid = false;
            }
        }

        if (Object.keys(structErr).length === 0 && baseValid) {
            setValue('description', composedDescription)
            setValue('serviceInfo', composedServiceInfo)
            setActive(active + 1)
        }
    }

    const onSubmitSEODetails = async dataObj => {
        if (!props.isEditMode && !file) {
            customToastMsg('Please upload a product image first', 0)
            return
        }

        dispatch(toggleLoading())
        let data = new FormData();
        data.append('name', getValues('productName'))
        data.append('description', getValues('description'))
        data.append('tag_id', getValues('tag'))
        data.append('service_info', getValues('serviceInfo'))
        data.append('visibility', visibilityMode)
        data.append('categories', `[${getValues('category')}]`)

        if (props.isEditMode) {
            data.append('id', getValues('id'))
            data.append('_method', "PUT")
        }

        if (file !== null) {
            data.append('image', file);
        }

        const fetchAPI = props.isEditMode ? ContributionProductService.updateContributionProduct : ContributionProductService.createContributionProduct;

        fetchAPI(data)
            .then(res => {
                dispatch(toggleLoading())
                if (res.success) {
                    setProductId(res.data.contribution_product.id);
                    customToastMsg(`Product is successfully ${props.isEditMode ? "updated" : "created"}`, 1);
                    if (!props.isEditMode) {
                        setActive(3)
                    } else {
                        props.toggle();
                    }
                } else {
                    customToastMsg(res.message, res.status)
                }
            })
            .catch(() => {
                dispatch(toggleLoading())
                customToastMsg('Failed to save product. Please try again.', 0)
            })
    }

    useEffect(() => {
        console.log(props.tagList)
        if (props.isEditMode) {
            loadDefaultValues(props.selectedData);
        } else {
            setVisibilityMode("open")
        }
    }, [])

    const loadDefaultValues = (data) => {
        console.log(data)
        setValue("productName", data.name)
        setValue("category", data.categories.length !== 0 ? data.categories[0].id : '')
        setValue("description", data.description)
        setValue("tag", data.tag_id)
        setValue("productImageName", data.image)
        setValue("serviceInfo", data.service_info)
        setValue("id", data.id)
        // setValue("slugUrl", data.slug_url)

        // hydrate the structured editor from existing HTML (or legacy text)
        const about = parseAbout(data.description)
        setAboutHead(about.headline)
        setAboutBody(about.body)
        const si = parseServiceInfo(data.service_info)
        setTiers(si.tiers)
        setFeatures(si.features)

        setVisibilityMode(data.visibility)
        setUploadedProductImage(data.image)
    }

    const onHeaderTabPress = (selectedActiveValue) => {
        if (selectedActiveValue === 1 || selectedActiveValue === 2) {
            if (selectedActiveValue <= active) {
                setActive(selectedActiveValue)
            }
        } else {
            setActive(selectedActiveValue)
        }
    }

    const getPackagesList = (subscriptionList) => {
        const list = [];

        // "subscriptionList": [
        //     {
        //         "id": 1,
        //         "name": "UK",
        //         "serial": "giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]",
        //         "available_serial_count": 3,
        //         "gateway_fee": 12,
        //         "packages": [
        //             {
        //                 "id": 1,
        //                 "name": "wwww",
        //                 "price": 1500,
        //                 "replace_count": 3,
        //                 "expiry_duration": 13,
        //                 "payment_method": "card",
        //                 "subscription": {
        //                     "id": 1,
        //                     "contribution_product_id": 1,
        //                     "name": "UK",
        //                     "serial": "giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]",
        //                     "available_serial_count": 3,
        //                     "gateway_fee": 12,
        //                     "created_at": "2025-04-03T20:28:31.000000Z",
        //                     "updated_at": "2025-04-11T13:18:38.000000Z"
        //                 }
        //             }
        //         ]
        //     }
        // ]

        console.log("subscriptionList::::", subscriptionList)

        subscriptionList.forEach((item) => {
            item.packages.forEach((packageItem) => {
                list.push(packageItem)
            })
        })

        console.log("subscriptionList::::", list)

        return list;
    }

    return (
        <Modal show={props.show} toggle={props.toggle}
               headTitle={!props.isEditMode ? props.isManageMode ? "Manage Service Product" : "Add New Service Product" : "Edit Service Product"}>
            <Fragment>
                <Nav pills className='mt-1 mb-0 pb-0'>

                    {!props.isManageMode && (
                        <>
                            <NavItem>
                                <NavLink active={active === 1} disabled={active !== 1}
                                         onClick={() => onHeaderTabPress(1)}>
                                    <img src={active !== 1 ? imgBlack : imgWhite} alt="img" height={20} width={20}
                                         className="me-1"/>
                                    <span
                                        className={`fw-bold fw-bolder ${active !== 1 ? 'text-black' : ''}`}>General</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink active={active === 2} disabled={active !== 2}
                                         onClick={() => onHeaderTabPress(2)}>
                                    <img src={active !== 2 ? imgSEOBlack : imgSEOWhite} alt="img" height={20} width={20}
                                         className="me-1"/>
                                    <span className={`fw-bold fw-bolder ${active !== 2 ? 'text-black' : ''}`}>SEO</span>
                                </NavLink>
                            </NavItem>
                        </>
                    )}

                    {!props.isEditMode && (
                        <>
                            <NavItem>
                                <NavLink
                                    active={active === 3}
                                    disabled={active !== 3 && active !== 4 && (!props.isManageMode)}
                                    onClick={() => onHeaderTabPress(3)}>
                                    <img src={active !== 3 ? imgDollarBlack : imgDollarWhite} alt="img" height={20}
                                         width={20}
                                         className="me-1"/>
                                    <span className={`fw-bold fw-bolder ${active !== 3 ? 'text-black' : ''}`}>Subscription / Variant</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    active={active === 4}
                                    disabled={active !== 3 && active !== 4 && (!props.isManageMode)}
                                    onClick={() => onHeaderTabPress(4)}>
                                    <img src={active !== 4 ? imgBoxBlack : imgBoxWhite} alt="img" height={20}
                                         width={20} className="me-1"/>
                                    <span
                                        className={`fw-bold fw-bolder ${active !== 4 ? 'text-black' : ''}`}>Packages</span>
                                </NavLink>
                            </NavItem>
                        </>
                    )}


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
                            <span style={{
                                fontSize: '12px',
                                color: '#EA5455',
                                marginTop: 4
                            }}>Please select category</span>}
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

                    {/* About — structured headline + body (composed into `description` HTML) */}
                    <Col md={12} xs={12}>
                        <div className='border rounded p-2'>
                            <Label className='form-label mb-1 fw-bolder d-block'>
                                About <span style={{color: 'red'}}>*</span>
                                <span style={{fontSize: '11px', fontWeight: 400, color: '#9a99b3'}} className='ms-1'>— shown as the intro paragraph</span>
                            </Label>
                            <Label className='form-label mb-1' for='aboutHead'>Headline</Label>
                            <Input
                                id='aboutHead'
                                placeholder='One punchy line'
                                value={aboutHead}
                                onChange={(e) => {
                                    setAboutHead(e.target.value)
                                    setStructErrors(prev => ({...prev, aboutHead: undefined}))
                                }}
                                invalid={structErrors.aboutHead && true}
                                autoComplete='off'
                            />
                            <Label className='form-label mb-1 mt-1' for='aboutBody'>Body</Label>
                            <Input
                                type='textarea'
                                id='aboutBody'
                                rows={3}
                                placeholder='Describe the product…'
                                value={aboutBody}
                                onChange={(e) => {
                                    setAboutBody(e.target.value)
                                    setStructErrors(prev => ({...prev, aboutBody: undefined}))
                                }}
                                invalid={structErrors.aboutBody && true}
                            />
                            {(structErrors.aboutHead || structErrors.aboutBody) &&
                                <div style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Headline and body are required</div>}
                        </div>
                    </Col>

                    {/* Service Info — comparison tiers + "What's included" features (composed into `service_info` HTML) */}
                    <Col md={12} xs={12}>
                        <div className='border rounded p-2'>
                            <Label className='form-label mb-1 fw-bolder d-block'>
                                Service Info <span style={{color: 'red'}}>*</span>
                            </Label>

                            {/* Tiers */}
                            <div className='d-flex justify-content-between align-items-center mb-1'>
                                <span className='fw-bold'>Tiers</span>
                                <Button size='sm' color='primary' outline type='button' onClick={addTier}>
                                    + Add tier
                                </Button>
                            </div>
                            {tiers.map((t, i) => (
                                <div key={i} className='border rounded p-1 mb-1'>
                                    <Row className='g-1 align-items-center'>
                                        <Col xs={3} md={2}>
                                            <Input
                                                placeholder='⚡'
                                                maxLength={2}
                                                style={{textAlign: 'center'}}
                                                value={t.emoji}
                                                onChange={(e) => updateTier(i, {emoji: e.target.value})}
                                            />
                                        </Col>
                                        <Col>
                                            <Input
                                                placeholder='Tier name'
                                                value={t.name}
                                                onChange={(e) => updateTier(i, {name: e.target.value})}
                                                autoComplete='off'
                                            />
                                        </Col>
                                        <Col xs='auto'>
                                            <Button size='sm' type='button'
                                                    color={t.best ? 'primary' : 'secondary'}
                                                    outline={!t.best}
                                                    onClick={() => updateTier(i, {best: !t.best})}>
                                                ★ Best
                                            </Button>
                                        </Col>
                                        <Col xs='auto'>
                                            <Button size='sm' type='button' color='danger' outline
                                                    onClick={() => removeTier(i)}>
                                                ✕
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Input
                                        type='textarea'
                                        className='mt-1'
                                        rows={3}
                                        placeholder='One bullet per line'
                                        value={t.points}
                                        onChange={(e) => updateTier(i, {points: e.target.value})}
                                    />
                                </div>
                            ))}

                            {/* Features */}
                            <div className='d-flex justify-content-between align-items-center mb-1 mt-2'>
                                <span className='fw-bold'>What's included</span>
                                <Button size='sm' color='primary' outline type='button' onClick={addFeature}>
                                    + Add feature
                                </Button>
                            </div>
                            {features.map((f, i) => (
                                <Row key={i} className='g-1 align-items-center mb-1'>
                                    <Col xs={3} md={2}>
                                        <Input
                                            placeholder='🎬'
                                            maxLength={2}
                                            style={{textAlign: 'center'}}
                                            value={f.emoji}
                                            onChange={(e) => updateFeature(i, {emoji: e.target.value})}
                                        />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Input
                                            placeholder='Feature'
                                            value={f.title}
                                            onChange={(e) => updateFeature(i, {title: e.target.value})}
                                            autoComplete='off'
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            placeholder='Short description'
                                            value={f.desc}
                                            onChange={(e) => updateFeature(i, {desc: e.target.value})}
                                            autoComplete='off'
                                        />
                                    </Col>
                                    <Col xs='auto'>
                                        <Button size='sm' type='button' color='danger' outline
                                                onClick={() => removeFeature(i)}>
                                            ✕
                                        </Button>
                                    </Col>
                                </Row>
                            ))}

                            {structErrors.serviceInfo &&
                                <div style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please add at least one tier or feature</div>}
                        </div>
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
                                                 imageFile={productImageName}
                                                 defaultImg={uploadedProductImage}
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
                                                onCropComplete={async (croppedArea, croppedAreaPixels) => {
                                                    await onCropComplete(croppedArea, croppedAreaPixels, types.PRODUCT_IMAGE)
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
                        <div className='form-check mb-1'>
                            <Input
                                type='radio'
                                value='open'
                                id='open'
                                name='payment-method-radio'
                                checked={visibilityMode === 'open'}
                                onChange={() => setVisibilityMode('open')}
                            />
                            <Label className='form-check-label' for='open'>
                                Open
                            </Label>
                        </div>
                    </Col>

                    {props.isEditMode && (
                        <Col md={8} xs={12}>
                            <Label className='form-label mb-1' for='ProductUrl'>
                                Product Url
                            </Label>
                            <Row>
                                <Col md={8} xs={12}>
                                    <Input id='slugUrl' placeholder='Product Url'
                                           disabled={props.selectedData.visibility === "onHold"}
                                           value={`https://${props.selectedData.url}`}/>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Button color='secondary' outline
                                            disabled={props.selectedData.visibility === "onHold"}
                                            onClick={() => {
                                                navigator.clipboard.writeText(`https://${props.selectedData.url}`)
                                                    .then(() => {
                                                        customToastMsg('Copied to clipboard!', 1)
                                                    })
                                                    .catch((err) => {
                                                        customToastMsg('Failed to copy!', 0)
                                                    })
                                            }}
                                    >
                                        Copy Product Name
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    )}

                    <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                        <Button type='submit' className='me-1' color='success'>
                            {buttonName}
                        </Button>
                        <Button type='reset' color='secondary' outline onClick={props.toggle}>
                            Discard
                        </Button>
                    </Col>
                </Row>
            )}

            {active === 3 && (
                <RepeatingSubscriptionForm
                    productId={props.isManageMode ? props.selectedData?.id : productId}
                    isManageMode={props.isManageMode}
                    subscriptionList={props.selectedData?.subscriptions ?? []}
                    toggle={props.toggle}
                    nextButtonAction={() => setActive(active + 1)}
                />
            )}

            {active === 4 && (
                <RepeatingPackageForm
                    productId={props.isManageMode ? props.selectedData?.id : productId}
                    packageList={getPackagesList(props.selectedData?.subscriptions ?? [])}
                    isManageMode={props.isManageMode}
                    toggle={props.toggle}
                />
            )}

        </Modal>
    )
}

export default SubscriptionCreationModal;
