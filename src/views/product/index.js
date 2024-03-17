// ** React Imports
import {Link} from 'react-router-dom'
import React, {useState, useEffect, Fragment} from 'react'

// ** Table Columns
import {columns} from './columns'

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
import * as OrderService from "../../services/order-resources"
import {customToastMsg, emptyUI, searchValidation} from "../../utility/Utils"


import {toggleLoading} from '@store/loading'
import {useForm} from "react-hook-form"
import OrderAdditionModal from "../../@core/components/modal/orderModal/addition"
import * as DestinationServices from '../../services/destination-resources'
import * as CustomerServices from '../../services/customer-resources'
import Select from "react-select";

const moment = require('moment')

const after3Months = new Date(new Date().setMonth(new Date().getMonth() + 3))

const defaultValues = {
    productName: '',
    category: '',
    description: '',
    price:'',
    gatewayFee:'',
    tag:'',
    poDate: moment(new Date()).format('YYYY-MM-DD'),
    deliveryDate: moment(after3Months).format('YYYY-MM-DD'),
    destination: '',
    priceTerm: ''
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

const CustomHeader = (props) => {
    return (
        <Card className="mb-0">
            <Col className='invoice-list-table-header w-100 py-2 px-2' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo ms-0 mb-2'>Products</h3>
                <Row>
                    <Col lg='5' className='d-flex align-items-center'>
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
                            Component
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

const InvoiceList = () => {
    // ** Store vars
    const dispatch = useDispatch()

    // ** States
    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [show, setShow] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [destinationList, setDestinationList] = useState([])
    const [customersList, setCustomersList] = useState([])
    const [searchKey, setSearchKey] = useState('')
    const [picker, setPicker] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [isFetched, setIsFetched] = useState(false)

    const list = [
        {
            id:1,
            name:'Netflix Private Profile',
            stock:'In Stock',
            price:'123',
            tags:'Audio Book, E-Book, Streaming',
            category:'Education, Streaming',
            date:new Date()
        },
        {
            id:1,
            name:'Netflix Private',
            stock:'In Stock',
            price:'123',
            tags:'Audio Book, E-Book, Streaming',
            category:'Education, Streaming',
            date:new Date()
        }
    ]


    const [store, setStore] = useState({
        allData: [],
        data: [],
        params: {
            page: currentPage,
            perPage: rowsPerPage,
            q: value
        },
        total: 0
    })

    // ** Hooks
    const {
        control,
        setError,
        handleSubmit,
        formState: {errors},
        // eslint-disable-next-line no-unused-vars
        // setValue,
        // getValues,
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

    const getAllDestinations = async () => {
        await DestinationServices.getAllDestination()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(items => {
                        list.push({
                            label: items.name,
                            value: items.id
                        })
                    })
                    setDestinationList(list)
                }
            })
    }

    const getAllCustomers = async () => {
        await CustomerServices.getAllColors()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.name,
                            value: item.id
                        })
                    })
                    setCustomersList(list)
                }
            })
    }

    useEffect(async () => {
        getDataList({
            q: value,
            page: currentPage,
            perPage: rowsPerPage
        })
        // await getAllDestinations()
        // await getAllCustomers()
    }, [])

    const handlePagination = async page => {
        if (searchKey.length === 0 && picker.length === 0 && customerName.length === 0) {
            await getDataList({
                q: value,
                perPage: rowsPerPage,
                page: page.selected
            })
        } else {
            setCurrentPage(0)
            await searchOrder({
                q: value,
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
            q: value
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
        if (Object.values(data).every(field => field.length > 0)) {
            const body = {
                poNumber: data.poNumber,
                poDate: `${data.poDate}T00:00:00Z`,
                quantity: null,
                deliveryDate: `${data.deliveryDate}T00:00:00Z`,
                priceTerm: data.priceTerm,
                customer: {
                    id: data.customer
                },
                destination: {
                    id: data.destination
                }
            }
            dispatch(toggleLoading())
            await OrderService.saveOrder(body)
                .then(res => {
                    if (res.success) {
                        customToastMsg("Order added successfully!", 1)
                        setCurrentPage(0)
                        setRowsPerPage(0)
                        setCustomerName('')
                        setPicker('')
                        setSearchKey('')
                        getDataList({
                            q: value,
                            page: 0,
                            perPage: 0
                        })
                        setShow(false)
                    } else {
                        customToastMsg(res.message, res.status)
                    }
                    dispatch(toggleLoading())
                })

        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: 'required'
                    })
                }
            }
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
                        q: value,
                        perPage: rowsPerPage,
                        page: 0
                    })
                } else {
                    await searchOrder({
                        q: value,
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

    return (
        <Fragment>
            <div className='invoice-list-wrapper'>
                <CustomHeader
                    value={value}
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
                            q: value,
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
            <OrderAdditionModal
                show={show}
                toggle={() => {
                    setShow(!show)
                    reset()
                }}
                onSubmit={handleSubmit(onSubmit)}
                control={control}
                errors={errors}
                tagList={destinationList}
                categoryList={customersList}
            />
        </Fragment>
    )
}

export default InvoiceList
