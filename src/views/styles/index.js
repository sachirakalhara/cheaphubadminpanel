// ** React Imports
import {Link} from 'react-router-dom'
import React, {useState, useEffect, Fragment} from 'react'

// ** Table Columns
import {columns} from './columns'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import {Calendar, ChevronDown, Plus, Umbrella, X} from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import {Button, Input, Row, Col, Card, Label, CardHeader, CardTitle, CardBody, CardSubtitle} from 'reactstrap'

// ** Store & Actions
import {getData} from '../apps/invoice/store'
import {useDispatch} from 'react-redux'

// ** Styles
import '@styles/react/apps/app-invoice.scss'


import Breadcrumbs from '@components/breadcrumbs'
import Flatpickr from "react-flatpickr"
import {Bar} from "react-chartjs-2"
import * as OrderService from "../../services/order-resources"
import * as stylesService from "../../services/style-resources"
import {customToastMsg, emptyUI} from "../../utility/Utils"
import {useForm} from "react-hook-form"
// import {dataOrder} from "../../@fake-db/apps/orders"
import {toggleLoading} from '@store/loading'

import AdditionModal from "../../@core/components/modal/stylesModal/AdditionModal"
import ConsumptionModal from "../../@core/components/modal/stylesModal/ConsumptionModal"
import * as ColorServices from "../../services/color-resources"

let prev = 0

const CustomHeader = (props) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo ms-0 mb-2'>Styles</h3>
                <Row>
                    <Col lg='6' className='d-flex align-items-center px-0 px-lg-1'>
                        <div className='d-flex align-items-center me-2'>
                            <Label className='form-label' for='default-picker'>
                                Style Number
                            </Label>
                            <div className='inputWithButton'>
                                <Input
                                    id='StyleNumber'
                                    className='ms-50 me-2 w-100'
                                    type='text'
                                    value={props.searchKey}
                                    onChange={props.onChange}
                                    placeholder='Search Style Number'
                                    autoComplete="off"
                                />
                                {props.searchKey.length !== 0 && (
                                    <X size={18}
                                       className='cursor-pointer close-btn'
                                       onClick={async () => props.onClearText()}
                                    />
                                )}
                            </div>
                        </div>

                        {/*<Button onClick={props.onClick}>*/}
                        {/*    Search*/}
                        {/*</Button>*/}

                    </Col>
                    <Col
                        lg='6'
                        className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0'
                    >
                        <Button onClick={() => props.setShow(true)}>
                            <Plus size={15}/> Add Style
                        </Button>
                    </Col>
                </Row>
            </div>
        </Card>
    )
}

const defaultValues = {
    styleNumber: '',
    styleDescription: '',
    falloutPercentage: '',
    baseSize: '',
    colors: []
}

const StylesList = () => {
    // ** Store vars
    const dispatch = useDispatch()
    const {
        control,
        setError,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm({defaultValues})

    // ** States
    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(0)
    // eslint-disable-next-line no-unused-vars
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [show, setShow] = useState(false)
    const [searchKey, setSearchKey] = useState('')
    const [colorsList, setColorsList] = useState([])
    const [isFetched, setIsFetched] = useState(false)

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


    const getDatass = async (params) => {
        dispatch(toggleLoading())
        await stylesService.getAllStylesForTable(params.page)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
                setIsFetched(false)
            })
    }

    // eslint-disable-next-line no-unused-vars
    const searchData = async (params, searchKey) => {
        dispatch(toggleLoading())
        await stylesService.searchStyleDetails(params.page, searchKey.trim())
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
            })
    }

    const getAllColors = async () => {
        await ColorServices.getAllColors()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.name,
                            value: item.id
                        })
                    })
                    setColorsList(list)
                }
            })
    }


    useEffect(async () => {
        await getDatass({
            sort,
            q: value,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage
        })
        await getAllColors()
    }, [])

    const handlePagination = async page => {
        if (searchKey.length === 0) {
            await getDatass({
                sort,
                q: value,
                sortColumn,
                perPage: rowsPerPage,
                page: page.selected
            })
        } else {
            await searchData({
                sort,
                q: value,
                sortColumn,
                perPage: rowsPerPage,
                page: page.selected
            }, searchKey)
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

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        dispatch(
            getData({
                q: value,
                page: currentPage,
                sort: sortDirection,
                perPage: rowsPerPage,
                sortColumn: column.sortField
            })
        )
    }

    const onSubmit = async data => {
        if (Object.values(data).every(field => field.length > 0)) {
            const list = []
            data.colors.map(item => {
                list.push({
                    id: item.value
                })
            })
            const body = {
                styleNumber: data.styleNumber,
                styleDescription: data.styleDescription,
                falloutPercentage: data.falloutPercentage,
                deleted: false,
                baseSize: data.baseSize,
                colors: list
            }
            dispatch(toggleLoading())
            await stylesService.addNewStyle(body)
                .then(res => {
                    if (res.success) {
                        customToastMsg("New style added successfully!", res.status)
                        setShow(false)
                        setCurrentPage(0)
                        setSearchKey('')
                        getDatass({
                            sort,
                            q: value,
                            sortColumn,
                            perPage: rowsPerPage,
                            page: 0
                        })
                        reset()
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

    const customStyles = {
        subHeader: {
            style: {
                display: 'none'
            }
        }
    }

    const onClearText = async () => {
        setCurrentPage(0)
        setSearchKey("")
        await getDatass({
            sort,
            q: value,
            sortColumn,
            page: 0,
            perPage: 0
        })
    }

    const onSearch = async (searchKey) => {
        if (searchKey.length !== 0) {
            setCurrentPage(0)
            await searchData({
                sort,
                q: value,
                sortColumn,
                page: 0,
                perPage: 0
            }, searchKey)
        } else {
            await onClearText()
        }
    }

    const onChangeText = (e) => {
        prev = new Date().getTime()
        setSearchKey(e.target.value)

        setTimeout(async () => {
            const now = new Date().getTime()
            if (now - prev >= 1000) {
                prev = now
                await onSearch(e.target.value)
            }
        }, 1000)

    }

    return (
        <Fragment>
            <div className='invoice-list-wrapper'>
                <CustomHeader
                    value={value}
                    rowsPerPage={rowsPerPage}
                    show={show}
                    setShow={setShow}
                    onChange={(e) => onChangeText(e)}
                    onClick={async () => await onSearch(searchKey)}
                    onClearText={async () => onClearText()}
                    searchKey={searchKey}
                />
                <Card className="mt-2">
                    <div className='invoice-list-dataTable react-dataTable'>
                        <DataTable
                            noHeader
                            pagination
                            sortServer
                            paginationServer
                            subHeader={true}
                            columns={columns}
                            responsive={true}
                            onSort={handleSort}
                            data={dataToRender()}
                            sortIcon={<ChevronDown/>}
                            className='react-dataTable'
                            defaultSortField='invoiceId'
                            paginationDefaultPage={currentPage}
                            paginationComponent={CustomPagination}
                            customStyles={customStyles}
                            noDataComponent={emptyUI(isFetched)}
                        />
                    </div>
                </Card>
                <AdditionModal
                    show={show}
                    toggle={() => {
                        setShow(!show)
                        reset()
                    }}
                    onSubmit={handleSubmit(onSubmit)}
                    control={control}
                    errors={errors}
                    colorsList={colorsList}
                />
            </div>
        </Fragment>
    )
}

export default StylesList