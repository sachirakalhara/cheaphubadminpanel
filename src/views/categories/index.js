// ** React Imports
import {Link} from 'react-router-dom'
import React, {useState, useEffect, Fragment} from 'react'

// ** Table Columns
import {columns} from './columns'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import {Calendar, ChevronDown, Eye, Plus, Trash, Umbrella, X} from 'react-feather'
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
import {customSweetAlert, customToastMsg, emptyUI} from "../../utility/Utils"
import {useForm} from "react-hook-form"
// import {dataOrder} from "../../@fake-db/apps/orders"
import {toggleLoading} from '@store/loading'

import AdditionModal from "../../@core/components/modal/categoryModal/AdditionModal"
import ConsumptionModal from "../../@core/components/modal/categoryModal/ConsumptionModal"
import * as ColorServices from "../../services/color-resources"
import * as CategoryServices from "../../services/categories";
import * as StyleServices from "../../services/style-resources";
import TagsModal from "../../@core/components/modal/tagsModal/tagsModal";

let prev = 0

const CustomHeader = (props) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo ms-0 mb-2'>Categories</h3>
                <Row>
                    <Col lg='6' className='d-flex align-items-center px-0 px-lg-1'>
                        <div className='d-flex align-items-center me-2'>
                            <Label className='form-label' for='default-picker'>
                                Category Name
                            </Label>
                            <div className='inputWithButton'>
                                <Input
                                    id='categoryName'
                                    className='ms-50 me-2 w-100'
                                    type='text'
                                    value={props.searchKey}
                                    onChange={props.onChange}
                                    placeholder='Search Category Name'
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
                            <Plus size={15}/> Add Category
                        </Button>
                    </Col>
                </Row>
            </div>
        </Card>
    )
}

const defaultValues = {
    name: '',
    description: '',
}

const CategoryList = () => {
    // ** Store vars
    const dispatch = useDispatch()
    const {
        control,
        setError,
        handleSubmit,
        formState: {errors},
        reset,
        setValue
    } = useForm({defaultValues})

    // ** States
    // eslint-disable-next-line no-unused-vars
    const [value1, setValue1] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(0)
    // eslint-disable-next-line no-unused-vars
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [show, setShow] = useState(false)
    const [searchKey, setSearchKey] = useState('')
    const [colorsList, setColorsList] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedId, setSelectedId] = useState('')

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


    const getDatass = async (params) => {
        dispatch(toggleLoading())
        // await stylesService.getAllStylesForTable(params.page)
        //     .then(res => {
        //         if (res.success) {
        //             setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
        //         } else {
        //             customToastMsg(res.data.title, res.status)
        //         }
        //         dispatch(toggleLoading())
        //         setIsFetched(false)
        //     })
        await CategoryServices.getAllCategories()
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.category_list, data: res.data.category_list, params, total: 0})
                } else {
                    customToastMsg(res.message, res.status)
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
                    customToastMsg(res.message, res.status)
                }
                dispatch(toggleLoading())
            })
    }


    useEffect(async () => {
        await getDatass({
            sort,
            q: value1,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage
        })
    }, [])

    const handlePagination = async page => {
        if (searchKey.length === 0) {
            await getDatass({
                sort,
                q: value1,
                sortColumn,
                perPage: rowsPerPage,
                page: page.selected
            })
        } else {
            await searchData({
                sort,
                q: value1,
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

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        dispatch(
            getDatass({
                q: value1,
                page: currentPage,
                sort: sortDirection,
                perPage: rowsPerPage,
                sortColumn: column.sortField
            })
        )
    }

    const onSubmit = async data => {
        if (Object.values(data).every(field => field.length > 0)) {
            const body = {
                name: data.name,
                description: data.description,
            }
            dispatch(toggleLoading())

            if (isEditMode) {

                Object.assign(body, {
                    id: selectedId
                })

                await CategoryServices.updateCategory(body)
                    .then(res => {
                        if (res.success) {
                            customToastMsg("Category updated successfully!", 1)
                            setShow(false)
                            setCurrentPage(0)
                            setSearchKey('')
                            getDatass({
                                sort,
                                q: value1,
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
            }else {
                await CategoryServices.createCategory(body)
                    .then(res => {
                        if (res.success) {
                            customToastMsg("New category added successfully!", 1)
                            setShow(false)
                            setCurrentPage(0)
                            setSearchKey('')
                            getDatass({
                                sort,
                                q: value1,
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
            }


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
            q: value1,
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
                q: value1,
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

    const onUpdateHandler = (data) => {
        setSelectedId(data.id)
        setValue("name", data.name !== null ? data.name : "")
        setValue("description", data.description)

        setShow(true)
        setIsEditMode(true)
    }

    const columns = [
        {
            name: 'Category Name',
            width: '30%',
            center: true,
            cell: row => (
                <div className='d-flex align-items-center w-100 justify-content-around'>
                    <span style={{maxWidth:90}}>{row.name}</span>
                </div>
            )
        },
        {
            sortable: false,
            width: '35%',
            name: 'Category Description',
            center: true,
            cell: row => row.description
        },
        {
            name: 'Actions',
            width: '30%',
            center: true,
            cell: row => (
                <div className='d-flex align-items-center w-100 justify-content-evenly'>
                    <Button
                        color='success' outline
                        style={{width:80,padding:5,alignItems:'center'}}
                        onClick={()=>onUpdateHandler(row)}
                    >
                        <Eye size={15} style={{marginRight: 5,marginBottom:3}}/>
                        Edit
                    </Button>
                    {/*<Button*/}
                    {/*    color='danger' outline*/}
                    {/*    style={{width:100,padding:5,alignItems:'center'}}*/}
                    {/*>*/}
                    {/*    <Trash size={15} style={{marginRight: 5,marginBottom:3}}/>*/}
                    {/*    Delete*/}
                    {/*</Button>*/}
                </div>
            )
        },
    ]

    return (
        <Fragment>
            <div className='invoice-list-wrapper'>
                <CustomHeader
                    value={value1}
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
                    isEditMode={isEditMode}
                />
            </div>
        </Fragment>
    )
}

export default CategoryList
