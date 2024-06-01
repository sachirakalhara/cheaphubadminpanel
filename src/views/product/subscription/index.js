// ** React Imports
import {Link} from 'react-router-dom'
import React, {useState, useEffect, Fragment} from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import {Calendar, ChevronDown, Plus, X} from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import {Button, Input, Row, Col, Card, Label, Badge, CardHeader, CardTitle, CardBody, CardSubtitle} from 'reactstrap'

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
import * as DestinationServices from '../../../services/destination-resources'
import * as CustomerServices from '../../../services/customer-resources'
import Select from "react-select";
import ReactFilesMini from "../../../custom-components/file-picker/ReactFiles-Mini";
import Cropper from "react-easy-crop";

import * as CategoryServices from '../../../services/categories';
import * as TagsServices from '../../../services/tags';
import BulCreationModal from "../../../@core/components/modal/product/bulk-create-modal";
import SubscriptionCreationModal from "../../../@core/components/modal/product/subscription-create-modal";
import * as ContributionProductService from "../../../services/contribution-products";

const moment = require('moment')

const after3Months = new Date(new Date().setMonth(new Date().getMonth() + 3))

const defaultValues = {
    productName: '',
    category: '',
    description: '',
    price: '',
    gatewayFee: '',
    tag: '',
    productImageName: '',
    serialDocumentName: ''
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
                <h3 className='text-primary invoice-logo ms-0 mb-2'>Subscription Products</h3>
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

const SubscriptionProductList = () => {
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
    const [serialDocumentName, setSerialDocumentName] = useState('')
    const [serialDocument, setSerialDocument] = useState('');


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
        dispatch(toggleLoading());
        ContributionProductService.getAllContributionProduct()
            .then(res => {
                if (res.success) {
                    setStore({
                        allData: res.data,
                        data: res.data.contribution_product_list,
                        params,
                        total: 0
                    });
                } else {
                    customToastMsg(res.message, res.status);
                }
                dispatch(toggleLoading());
                setIsFetched(true);
            });
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
                    // if (res.data.length>0)
                    res.data.category_list.map((items, index) => {
                        list.push({
                            label: items.name,
                            value: items.id
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
                    // if (res.data.length>0)
                    res.data.tag_list.map((item, index) => {
                        list.push({
                            label: item.name,
                            value: item.id
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
                containerClassName={'pagination react-paginate justify-content-end p-1'}
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


    const onSearch = async (e, type) => {
        // setCurrentPage(0)
        // let poNumber = searchKey
        // let date = picker
        // let customer = customerName
        // switch (type) {
        //     case 'PO_NUMBER':
        //         setSearchKey(e)
        //         poNumber = e
        //         break
        //     case 'DATE':
        //         setPicker(e)
        //         console.log(e)
        //         date = e
        //         break
        //     case 'CUSTOMER':
        //         setCustomerName(e)
        //         customer = e
        //         break
        // }
        //
        // prev = new Date().getTime()
        //
        // setTimeout(async () => {
        //     const now = new Date().getTime()
        //     if (now - prev >= 1000) {
        //         if (poNumber.length === 0 && date.length === 0 && customer.length === 0) {
        //             await getDataList({
        //                 q: value1,
        //                 perPage: rowsPerPage,
        //                 page: 0
        //             })
        //         } else {
        //             await searchOrder({
        //                 q: value1,
        //                 page: 0,
        //                 perPage: 0,
        //                 poNumber,
        //                 date,
        //                 customer
        //             })
        //         }
        //     }
        // }, 1000)

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

    const onChangeSerialDocValue = async (file) => {
        setValue("serialDocumentName", file.name)
        setSerialDocumentName(file.name)
        setSerialDocument(file);
    }

    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Image',
            cell: row => <img src={row.image} alt={row.name}
                              style={{width: '40px', height: '40px', borderRadius: '50%'}}/>,
            sortable: false,
        },
        {
            name: 'Visibility',
            cell: row => <Badge color={row.visibility === 'onHold' ? 'danger' : 'success'}>{row.visibility}</Badge>,
            sortable: true,
        },
        {
            name: 'Tag',
            selector: 'tag_id',
            cell: row => tagsList.length > 0 ? tagsList.find(obj => obj.value === row.tag_id).label : '', // Assuming tag_id is the tag name
            sortable: true,
        },
        {
            name: 'View Details',
            cell: row => <Button color="primary">View</Button>,
            sortable: false,
        },
    ];

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

            <SubscriptionCreationModal
                show={show}
                toggle={() => {
                    setShow(!show)
                    reset()
                }}
                tagList={tagsList}
                categoryList={categoryList}
            />
        </Fragment>
    )
}

export default SubscriptionProductList
