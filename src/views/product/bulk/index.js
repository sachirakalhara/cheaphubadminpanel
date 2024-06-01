// ** React Imports
import {Link} from 'react-router-dom'
import React, {useState, useEffect, Fragment} from 'react'

// ** Table Columns
import {columns} from '../columns'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import {Calendar, ChevronDown, Plus, X} from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import {Button, Input, Row, Col, Card, Label, CardHeader, CardTitle, CardBody, CardSubtitle} from 'reactstrap'

// ** Store & Actions
import {useDispatch} from 'react-redux'
import {selectThemeColors} from '@utils'

// ** Styles
import '@styles/react/apps/app-invoice.scss'

import Flatpickr from "react-flatpickr"
import * as OrderService from "../../../services/order-resources"
import {customToastMsg, emptyUI, fileReader, getCroppedImg, isImageFile, searchValidation} from "../../../utility/Utils"


import {toggleLoading} from '@store/loading'
import {Controller, useForm} from "react-hook-form"
import OrderAdditionModal from "../../../@core/components/modal/orderModal/addition"
import BulCreationModal from "../../../@core/components/modal/product/bulk-create-modal"
import * as DestinationServices from '../../../services/destination-resources'
import * as CustomerServices from '../../../services/customer-resources'
import Select from "react-select";
import ReactFilesMini from "../../../custom-components/file-picker/ReactFiles-Mini";
import Cropper from "react-easy-crop";

import * as CategoryServices from '../../../services/categories';
import * as TagsServices from '../../../services/tags';

const moment = require('moment')

const after3Months = new Date(new Date().setMonth(new Date().getMonth() + 3))

const defaultValues = {
    productName: '',
    category: '',
    description: '',
    price: '',
    gatewayFee: '',
    tag: '',
    productImageName: ''
}

const options = {
    enableTime: false,
    dateFormat: 'Y-m-d'
}

let prev = 0

const customStyles = {
    container: provided => ({
        ...provided,
        minWidth: 150
        // minWidth: "100%"
    })
}

const CROP_ASPECT_TO_FIRST_IMAGE = 1;
//value should be <1
const CROP_ASPECT_TO_SECOND_IMAGE = 3 / 2;
const CROP_ASPECT_TO_SHARE_URL_IMAGE = 5 / 3

const types = {
    PRODUCT_IMAGE: 'program-modal-banner'
}

const CustomHeader = (props) => {

    return (
        <Card className="mb-0">
            <Col className='invoice-list-table-header w-100 py-2 px-2' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo ms-0 mb-2'>Bulk Products</h3>
                <Row>
                    <Col lg='4' className='d-flex align-items-center'>
                        <Label className='form-label' for='default-picker'>
                            Product Name
                        </Label>
                        <div className='inputWithButton'>
                            <Input
                                className='ms-1 w-100'
                                type='text'
                                value={props.searchKey}
                                onChange={props.onChangeNumber}
                                placeholder='Product Name'
                                autoComplete="off"
                            />
                            {props.searchKey.length !== 0 && (
                                <X size={18}
                                   className='cursor-pointer close-btn'
                                   onClick={async () => props.onClearPoNumber()}
                                />
                            )}
                        </div>
                    </Col>
                    <Col lg='6' className='d-flex align-items-center'>
                        <Label className='form-label' for='default-picker'>
                            Category
                        </Label>
                        <Select
                            id='category'
                            className='react-select ms-1'
                            classNamePrefix='select'
                            placeholder='Category'
                            options={props.categoryList}
                            theme={selectThemeColors}
                            value={props.selectedCategory !== "" ? props.categoryList.find((c) => c.value === props.selectedCategory) : null}
                            isClearable={true}
                            onChange={props.onChangeCategory}
                            styles={customStyles}
                        />
                    </Col>

                    {/*<Col*/}
                    {/*    lg='4'*/}
                    {/*    className='d-flex align-items-center'*/}
                    {/*>*/}

                    {/*    <Label className='form-label' for='default-picker'>*/}
                    {/*        PO Date*/}
                    {/*    </Label>*/}
                    {/*    <div className='inputWithButton'>*/}
                    {/*        <Flatpickr*/}
                    {/*            className='form-control ms-1 w-100'*/}
                    {/*            value={props.picker}*/}
                    {/*            onChange={props.onFlatPickrChange}*/}
                    {/*            options={options}*/}
                    {/*            placeholder={"Select PO Date"}*/}
                    {/*        />*/}
                    {/*        {props.picker.length !== 0 && (*/}
                    {/*            <X size={18}*/}
                    {/*               className='cursor-pointer close-btn'*/}
                    {/*               onClick={async () => props.onClearPicker()}*/}
                    {/*            />*/}
                    {/*        )}*/}
                    {/*    </div>*/}


                    {/*    /!*<Button onClick={props.onButtonClick} className="ms-1">*!/*/}
                    {/*    /!*    Filter*!/*/}
                    {/*    /!*</Button>*!/*/}
                    {/*</Col>*/}
                </Row>
            </Col>
        </Card>
    )
}

const BulkProductList = () => {
    // ** Store vars
    const dispatch = useDispatch()

    // ** States
    // eslint-disable-next-line no-unused-vars
    const [value1, setValue1] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [show, setShow] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [categoryList, setCategoryList] = useState([])
    const [tagsList, setTagsList] = useState([])
    const [searchKey, setSearchKey] = useState('')
    const [picker, setPicker] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [isFetched, setIsFetched] = useState(false)


    const [uploadedProductImage, setUploadedProductImage] = useState(null)
    const [productImageSrc, setProductImageSrc] = useState('')
    const [productImageCrop, setProductImageCrop] = useState({x: 0, y: 0})
    const [productImageCroppedAreaPixels, setProductImageCroppedAreaPixels] = useState(null)
    const [productCroppedImage, setProductCroppedImage] = useState(null)
    const [productImageIsCropVisible, setProductImageIsCropVisible] = useState(false)
    const [productImageZoom, setProductImageZoom] = useState(1)
    const [productImageName, setProductImageName] = useState('')

    const list = [
        {
            id: 1,
            name: 'Netflix Private Profile',
            stock: 'In Stock',
            price: '123',
            tags: 'Audio Book, E-Book, Streaming',
            category: 'Education, Streaming',
            date: new Date()
        },
        {
            id: 1,
            name: 'Netflix Private',
            stock: 'In Stock',
            price: '123',
            tags: 'Audio Book, E-Book, Streaming',
            category: 'Education, Streaming',
            date: new Date()
        }
    ]


    const [store, setStore] = useState({
        allData: [],
        data: [],
        params: {
            page: currentPage,
            perPage: rowsPerPage,
            q: value1
        },
        total: 0
    })

    // ** Hooks
    const {
        control,
        setError,
        handleSubmit,
        formState: {errors},
        setValue,
        reset
    } = useForm({defaultValues})


    const getDataList = (params) => {
        // dispatch(toggleLoading())
        // OrderService.getAllOrders(params.page)
        //     // eslint-disable-next-line no-unused-vars
        //     .then(res => {
        //         if (res.success) {
        //             setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
        //         } else {
        //             customToastMsg(res.data.title, res.status)
        //         }
        //         dispatch(toggleLoading())
        //         setIsFetched(true)
        //     })

        setStore({allData: list, data: list, params, total: 1})
    }

    const searchOrder = (params) => {
        dispatch(toggleLoading())
        const body = {
            poNumber: searchValidation(params.poNumber),
            dateTime: searchValidation(params.date),
            customerName: searchValidation(params.customer)
        }
        OrderService.searchOrders(params.page, body)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
            })
    }

    const getAllCategories = async () => {
        await CategoryServices.getAllCategories()
            .then(res => {
                if (res.success) {
                    console.log(res)
                    const list = []
                    if (res.data.length > 0)
                        res.data.category_list.map((items, index) => {
                            list.push({
                                label: items.name,
                                value: items.id,
                                key:index
                            })
                        })
                    setCategoryList(list)
                }
            })
    }

    const getAllTags = async () => {
        await TagsServices.getAllTags()
            .then(res => {
                if (res.success) {
                    const list = []
                    if (res.data.length > 0)
                    res.data.tag_list.map((item, index) => {
                        list.push({
                            label: item.name,
                            value: item.id,
                            key:index
                        })
                    })
                    setTagsList(list)
                }
            })
    }

    useEffect(async () => {
        getDataList({
            q: value1,
            page: currentPage,
            perPage: rowsPerPage
        })
        await getAllCategories()
        await getAllTags()
    }, [])

    const handlePagination = async page => {
        if (searchKey.length === 0 && picker.length === 0 && customerName.length === 0) {
            await getDataList({
                q: value1,
                perPage: rowsPerPage,
                page: page.selected
            })
        } else {
            setCurrentPage(0)
            await searchOrder({
                q: value1,
                perPage: rowsPerPage,
                page: page.selected,
                poNumber: searchKey,
                date: picker,
                customer: customerName
            })
        }

        setCurrentPage(page.selected + 1)
    }

    const CustomPagination = () => {

        return (
            <ReactPaginate
                nextLabel=''
                breakLabel='...'
                previousLabel=''
                pageCount={store.total || 1}
                activeClassName='active'
                breakClassName='page-item'
                pageClassName={'page-item'}
                breakLinkClassName='page-link'
                nextLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousLinkClassName={'page-link'}
                previousClassName={'page-item prev'}
                onPageChange={page => handlePagination(page)}
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                containerClassName='pagination react-paginate justify-content-end p-1'
            />
        )
    }

    const dataToRender = () => {
        const filters = {
            q: value1
        }

        const isFiltered = Object.keys(filters).some(function (k) {
            return filters[k].length > 0
        })

        if (store.data?.length > 0) {
            return store.data
        } else if (store.data?.length === 0 && isFiltered) {
            return []
        } else {
            return store.allData.slice(0, rowsPerPage)
        }
    }

    const customStyles = {
        subHeader: {
            style: {
                display: 'none'
            }
        }
    }

    const onSubmit = async data => {
        console.log(data)
        if (Object.values(data).every(field => field.length > 0)) {
            // const body = {
            //     poNumber: data.poNumber,
            //     poDate: `${data.poDate}T00:00:00Z`,
            //     quantity: null,
            //     deliveryDate: `${data.deliveryDate}T00:00:00Z`,
            //     priceTerm: data.priceTerm,
            //     customer: {
            //         id: data.customer
            //     },
            //     destination: {
            //         id: data.destination
            //     }
            // }
            // dispatch(toggleLoading())
            // await OrderService.saveOrder(body)
            //     .then(res => {
            //         if (res.success) {
            //             customToastMsg("Order added successfully!", 1)
            //             setCurrentPage(0)
            //             setRowsPerPage(0)
            //             setCustomerName('')
            //             setPicker('')
            //             setSearchKey('')
            //             getDataList({
            //                 q: value,
            //                 page: 0,
            //                 perPage: 0
            //             })
            //             setShow(false)
            //         } else {
            //             customToastMsg(res.message, res.status)
            //         }
            //         dispatch(toggleLoading())
            //     })

        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: 'required'
                    })
                }
            }

            console.log(data)
        }
    }

    const onSearch = async (e, type) => {
        setCurrentPage(0)
        let poNumber = searchKey
        let date = picker
        let customer = customerName
        switch (type) {
            case 'PO_NUMBER':
                setSearchKey(e)
                poNumber = e
                break
            case 'DATE':
                setPicker(e)
                console.log(e)
                date = e
                break
            case 'CUSTOMER':
                setCustomerName(e)
                customer = e
                break
        }

        prev = new Date().getTime()

        setTimeout(async () => {
            const now = new Date().getTime()
            if (now - prev >= 1000) {
                if (poNumber.length === 0 && date.length === 0 && customer.length === 0) {
                    await getDataList({
                        q: value1,
                        perPage: rowsPerPage,
                        page: 0
                    })
                } else {
                    await searchOrder({
                        q: value1,
                        page: 0,
                        perPage: 0,
                        poNumber,
                        date,
                        customer
                    })
                }
            }
        }, 1000)

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const onCropChange = (crop, type) => {
        if (type === types.PRODUCT_IMAGE) setProductImageCrop(crop)
    }

    const onCropComplete = async (croppedArea, croppedAreaPixels, type) => {
        if (type === types.PRODUCT_IMAGE) await setProductImageCroppedAreaPixels(croppedAreaPixels)

        await cropButtonHandler(type)
    }

    /*image cropper */
    const cropButtonHandler = async (type) => {
        await showCroppedImage(type);
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

                console.log(':::::::::::::::::::::::::::::::::::============================', croppedImage)
                await setProductCroppedImage(croppedImage)
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
                console.log(imageDataUrl)
                setProductImageSrc(imageDataUrl);
                setValue("productImageName", file.name)
            }
        } else {
            setProductImageIsCropVisible(false);
        }
    }

    return (
        <Fragment>
            <div className='invoice-list-wrapper'>
                <CustomHeader
                    value={value1}
                    rowsPerPage={rowsPerPage}
                    onChangeNumber={(e) => onSearch(e.target.value, 'PO_NUMBER')}
                    onChangeCustomer={(e) => onSearch(e.target.value, 'CUSTOMER')}
                    /* eslint-disable-next-line no-unused-vars */
                    onFlatPickrChange={([date], dateStr) => {
                        // const d = moment(date).utc()
                        onSearch(dateStr, 'DATE')
                    }}
                    searchKey={searchKey}
                    customerName={customerName}
                    picker={picker}
                    onButtonClick={async () => {
                        setCurrentPage(0)
                        await searchOrder({
                            q: value1,
                            page: 0,
                            perPage: 0
                        })
                    }}
                    onClearPoNumber={() => onSearch('', 'PO_NUMBER')}
                    onClearPicker={() => onSearch('', 'DATE')}

                    categoryList={[]}
                    selectedCategory={''}
                    onChangeCategory={() => onSearch('', 'CATEGORY')}
                />
                <Col
                    lg='4'
                    className='w-100 actions-right justify-content-end d-flex flex-lg-nowrap flex-wrap pe-1 my-1'
                >
                    <Button onClick={() => {
                        setShow(true)
                        reset()
                    }} style={{width: 100}}>
                        <Plus size={15} style={{marginRight: 5}}/>
                        Add
                    </Button>
                </Col>
                <Card>
                    <div className='invoice-list-dataTable react-dataTable'>
                        <DataTable
                            noHeader
                            pagination
                            sortServer
                            paginationServer
                            subHeader={true}
                            columns={columns}
                            responsive={true}
                            data={dataToRender()}
                            className='react-dataTable'
                            paginationDefaultPage={currentPage}
                            paginationComponent={CustomPagination}
                            customStyles={customStyles}
                            noDataComponent={emptyUI(isFetched)}
                        />
                    </div>
                </Card>
            </div>

            <BulCreationModal
                show={show}
                toggle={() => {
                    setShow(!show)
                    reset()
                }}
                tagList={tagsList}
                categoryList={categoryList}
            />

            {/*<OrderAdditionModal*/}
            {/*    show={show}*/}
            {/*    toggle={() => {*/}
            {/*        setShow(!show)*/}
            {/*        reset()*/}
            {/*    }}*/}
            {/*    onSubmit={handleSubmit(onSubmit)}*/}
            {/*    control={control}*/}
            {/*    errors={errors}*/}
            {/*    tagList={tagsList}*/}
            {/*    categoryList={categoryList}*/}
            {/*    renderImageUploader={*/}
            {/*        <Col md={6} xs={12}>*/}
            {/*            <Label className='form-label mb-1' for='productImage'>*/}
            {/*                Product Image <span style={{color: 'red'}}>*</span>*/}
            {/*            </Label>*/}

            {/*            <Col>*/}
            {/*                <Row>*/}
            {/*                    <Col>*/}

            {/*                        <Controller*/}
            {/*                            name='productImageName'*/}
            {/*                            control={control}*/}
            {/*                            render={({field}) => (*/}
            {/*                                <ReactFilesMini  {...field} id='productImageName'*/}
            {/*                                                 pageType*/}
            {/*                                                 disabled={false}*/}
            {/*                                                 sendImageData={async (imageFile, file) => {*/}
            {/*                                                     await handleChangeFileShare(file, types.PRODUCT_IMAGE);*/}
            {/*                                                 }}*/}
            {/*                                                 invalid={errors.productImageName && true}*/}
            {/*                                                 accepts={["image/png", "image/jpg", "image/jpeg"]}*/}
            {/*                                                 imageFile={productImageName ? productImageName : uploadedProductImage}*/}
            {/*                                />*/}

            {/*                            )}*/}
            {/*                        />*/}

            {/*                        {errors.productImageName &&*/}
            {/*                        <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please choose a product image</span>}*/}

            {/*                    </Col>*/}
            {/*                </Row>*/}
            {/*                <Row>*/}
            {/*                    <Col md={12} lg={12} xs={12}>*/}
            {/*                        {productImageIsCropVisible && productImageSrc &&(*/}
            {/*                            <div>*/}
            {/*                                <div className={'program-modal-image-cropper'}>*/}
            {/*                                    <Cropper*/}
            {/*                                        image={productImageSrc}*/}
            {/*                                        crop={productImageCrop}*/}
            {/*                                        aspect={CROP_ASPECT_TO_FIRST_IMAGE}*/}
            {/*                                        zoom={productImageZoom}*/}
            {/*                                        onCropChange={(crop) => {*/}
            {/*                                            onCropChange(crop, types.PRODUCT_IMAGE)*/}
            {/*                                        }}*/}
            {/*                                        onCropComplete={async (croppedArea, croppedAreaPixels) => {*/}
            {/*                                            await onCropComplete(croppedArea, croppedAreaPixels, types.PRODUCT_IMAGE)*/}
            {/*                                        }}*/}

            {/*                                    />*/}
            {/*                                </div>*/}
            {/*                                <div className="program-modal-image-cropper-controller">*/}
            {/*                                    <input*/}
            {/*                                        disabled={false}*/}
            {/*                                        type="range"*/}
            {/*                                        value={productImageZoom}*/}
            {/*                                        min={1}*/}
            {/*                                        max={3}*/}
            {/*                                        step={0.1}*/}
            {/*                                        aria-labelledby="Zoom"*/}
            {/*                                        onChange={(e) => {*/}
            {/*                                            setProductImageZoom(e.target.value)*/}
            {/*                                        }}*/}
            {/*                                        className="zoom-range"*/}
            {/*                                    />*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        )}*/}
            {/*                    </Col>*/}
            {/*                </Row>*/}
            {/*                <Row>*/}
            {/*                    {productCroppedImage && productImageSrc &&*/}
            {/*                    <Col lg={12} md={12} sm={12}>*/}
            {/*                        <img src={productCroppedImage}*/}
            {/*                             style={{width: '50%'}}*/}
            {/*                             loading={"lazy"}*/}
            {/*                             className={'program-modal-image-cropper-output'}*/}
            {/*                        />*/}
            {/*                    </Col>*/}
            {/*                    }*/}
            {/*                </Row>*/}
            {/*            </Col>*/}

            {/*        </Col>*/}
            {/*    }*/}
            {/*/>*/}
        </Fragment>
    )
}

export default BulkProductList
