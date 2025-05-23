// ** React Imports
import React, {useState, useEffect, Fragment} from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import {Calendar, ChevronDown, Edit3, Eye, Home, Plus, Sliders, Trash, X} from 'react-feather'
import DataTable from 'react-data-table-component'
import {toggleLoading} from '@store/loading'

// ** Reactstrap Imports
import {Button, Input, Row, Col, Card, Label, CardHeader, CardTitle, CardBody, CardSubtitle} from 'reactstrap'

import {useDispatch} from 'react-redux'


// ** Styles
import '@styles/react/apps/app-invoice.scss'

import {customSweetAlert, customToastMsg, emptyUI, getCustomDateTimeStamp, searchValidation} from "../../utility/Utils"
import {useForm} from "react-hook-form"
import TagsModal from "../../@core/components/modal/tagsModal/tagsModal"
import * as TagsServices from "../../services/tags";

let prev = 0

const CustomHeader = ({
                          onNameTextChange,
                          name,
                          onClearNameText,
                          setShow
                      }) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo mb-2'>Tags</h3>
                <Row>
                    <Col lg='4' className='d-flex align-items-center px-lg-1'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label' for='default-picker'>
                                Name
                            </Label>
                            <div className='inputWithButton'>
                                <Input
                                    id='name'
                                    className='ms-50 me-2 w-100'
                                    type='text'
                                    value={name}
                                    onChange={onNameTextChange}
                                    placeholder='Search Tag Name'
                                    autoComplete="off"
                                />
                                {name.length !== 0 && (
                                    <X size={18}
                                       className='cursor-pointer close-btn'
                                       onClick={onClearNameText}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col
                        lg='8'
                        className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1'
                    >
                        <Button onClick={() => setShow(true)}>
                            <Plus size={15}/> Add Tag
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

const MachineryList = () => {
    // ** Store vars
    const dispatch = useDispatch()

    // ** States
    const [val, setVal] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(1)
    const [statusValue, setStatusValue] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [show, setShow] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedId, setSelectedId] = useState('')
    const [knittingDiameter, setKnittingDiameter] = useState('')
    const [name, setName] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const [csvData, setCsvData] = useState([])
    const [currentDateTime, setCurrentDateTime] = useState('')

    // eslint-disable-next-line no-unused-vars
    const [store, setStore] = useState({
        allData: [],
        data: [],
        params: {
            page: currentPage,
            perPage: rowsPerPage,
            q: val,
            status: statusValue
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
        setValue,
        reset
    } = useForm({defaultValues})


    const getDatass = (params) => {
        dispatch(toggleLoading())

        TagsServices.getAllTags()
            .then(res => {
                if (res.success) {
                    if (res.data?.tag_list!==undefined){
                        setStore({allData: res.data.tag_list, data: res.data.tag_list, params, total: 0})
                    }
                } else {
                    customToastMsg(res.message, res.status)
                }
                dispatch(toggleLoading())
                setIsFetched(true)
            })
    }

    const searchTags = async (params) => {
        dispatch(toggleLoading())
        const data = {
            "all": 1,
            "tag_name": params.searchKey
        }
        dispatch(toggleLoading())
        await TagsServices.filterTags(data)
            .then(res => {
                if (res.success) {
                    console.log(res)
                    setStore({allData: res.data.tag_list, data: res.data.tag_list, params, total: 0})
                } else {
                    customToastMsg(res.message, 0,'',()=>{
                        setStore({allData: [], data: [], params, total: 0})
                    })
                }
                dispatch(toggleLoading())
            })
    }


    useEffect(async () => {
        getDatass({
            sort,
            q: val,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage,
            status: statusValue
        })
    }, [])

    const handleFilter = val => {
        setVal(val)
        getDatass({
            sort,
            q: val,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage,
            status: statusValue
        })
    }

    const handlePerPage = e => {
        getDatass({
            sort,
            q: val,
            sortColumn,
            page: currentPage,
            status: statusValue,
            perPage: parseInt(e.target.value)
        })
        setRowsPerPage(parseInt(e.target.value))
    }

    const handleStatusValue = e => {
        setStatusValue(e.target.value)
        getDatass({
            sort,
            q: val,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage,
            status: e.target.value
        })
    }

    const handlePagination = page => {
        if (knittingDiameter.length === 0 && name.length === 0) {
            getDatass({
                sort,
                q: val,
                sortColumn,
                status: statusValue,
                perPage: rowsPerPage,
                page: page.selected
            })
        } else {
            searchTags({
                searchKey:name,
                page: page.selected,
                name
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
            q: val,
            status: statusValue
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
                q: val,
                page: currentPage,
                sort: sortDirection,
                status: statusValue,
                perPage: rowsPerPage,
                sortColumn: column.sortField
            })
        )
    }

    const onSubmit = async data => {

        if (Object.values(data).every(field => field.length > 0)) {
            const body = {
                name: data.name,
                description: data.description
            }
            dispatch(toggleLoading())
            if (isEditMode) {
                Object.assign(body, {
                    id: selectedId
                })

                await TagsServices.updateTags(body)
                    .then(res => {
                        if (res.success) {
                            customToastMsg("Tag updated updated successfully!", 1)
                            setShow(false)
                            // setCurrentPage(0)
                            getDatass({
                                sort,
                                q: val,
                                sortColumn,
                                page: currentPage - 1,
                                perPage: rowsPerPage,
                                status: statusValue
                            })
                        } else {
                            customToastMsg(res.message, res.status)
                        }
                        dispatch(toggleLoading())
                    })
            } else {
                await TagsServices.createTags(body)
                    .then(res => {
                        if (res.success) {
                            customToastMsg("New tag added successfully!", 1)
                            setShow(false)
                            setCurrentPage(0)
                            getDatass({
                                sort,
                                q: val,
                                sortColumn,
                                page: 0,
                                perPage: rowsPerPage,
                                status: statusValue
                            })
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

    const onUpdateHandler = (data) => {
        setSelectedId(data.id)
        setValue("name", data.name !== null ? data.name : "")
        setValue("description", data.description)

        setShow(true)
        setIsEditMode(true)
    }

    const columns = [
        {
            name: 'Tag Name',
            width: '20%',
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
            name: 'Tag Description',
            center: true,
            cell: row => row.description
        },
        {
            sortable: false,
            width: '15%',
            name: 'Counts',
            center: true,
            cell: row => row.count
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
                    <Button
                        color='danger' outline
                        style={{width:100,padding:5,alignItems:'center'}}
                        onClick={()=>removeItem(row.id)}
                    >
                        <Trash size={15} style={{marginRight: 5,marginBottom:3}}/>
                        Delete
                    </Button>
                </div>
            )
        },
    ]

    const clearTextFields = () => {
        reset()
        setIsEditMode(false)
        setShow(true)
    }

    const customStyles = {
        subHeader: {
            style: {
                display: 'none'
            }
        }
    }

    const onSearch = (value, type) => {
        setName(value)

        prev = new Date().getTime()
        setCurrentPage(0)

        setTimeout(() => {
            const now = new Date().getTime()
            if (now - prev >= 1000) {
                searchTags({
                    searchKey:value,
                    page: 0,
                    perPage: 0,
                })
            }
        }, 1000)

    }

    const removeItem = async (id) => {
        await customSweetAlert(
            'Are you sure you want to remove this?',
            0,
            async () => {
                await TagsServices.deleteTags(id)
                    .then(async res => {
                        if (res.success) {
                            customToastMsg(res.data, res.status)
                            setCurrentPage(0)
                            await getDatass({
                                sort,
                                q: val,
                                sortColumn,
                                page: currentPage,
                                perPage: rowsPerPage,
                                status: statusValue
                            })
                        } else {
                            customToastMsg(res.message, res.status)
                        }
                    })
            }
        )
    }

    return (
        <Fragment>
            <div className=''>
                <CustomHeader
                    value={val}
                    statusValue={statusValue}
                    rowsPerPage={rowsPerPage}
                    handleFilter={handleFilter}
                    handlePerPage={handlePerPage}
                    handleStatusValue={handleStatusValue}
                    onKnittingTextChange={e => onSearch(e.target.value, 'KNITTING')}
                    onNameTextChange={e => onSearch(e.target.value, 'NAME')}
                    knittingDiameter={knittingDiameter}
                    name={name}
                    onClearKnittingText={() => onSearch('', 'KNITTING')}
                    onClearNameText={() => onSearch('', 'NAME')}
                    csvList={csvData}
                    csvAction={() => setCurrentDateTime(getCustomDateTimeStamp)}
                    fileName={`MachineryReport_${currentDateTime}.csv`}
                    setShow={setShow}
                />
                <Card className="mt-2">
                    <div className='invoice-list-dataTable react-dataTable'>
                        <DataTable
                            noHeader={true}
                            pagination
                            sortServer
                            paginationServer
                            subHeader={true}
                            columns={columns}
                            responsive={true}
                            onSort={handleSort}
                            data={dataToRender()}
                            sortIcon={<ChevronDown/>}
                            className="dataTables_wrapper"
                            paginationDefaultPage={currentPage}
                            paginationComponent={CustomPagination}
                            customStyles={customStyles}
                            noDataComponent={emptyUI(isFetched)}
                        />
                    </div>
                </Card>
            </div>
            <TagsModal
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
        </Fragment>
    )
}

export default MachineryList
