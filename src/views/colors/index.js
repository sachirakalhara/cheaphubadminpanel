// ** React Imports
import {Link} from 'react-router-dom'
import React, {useState, useEffect, Fragment} from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import {Calendar, ChevronDown, Edit3, Eye, Home, Plus, Sliders, X} from 'react-feather'
import DataTable from 'react-data-table-component'
import {toggleLoading} from '@store/loading'

// ** Reactstrap Imports
import {Button, Input, Row, Col, Card, Label, CardHeader, CardTitle, CardBody, CardSubtitle} from 'reactstrap'

import {useDispatch} from 'react-redux'


// ** Styles
import '@styles/react/apps/app-invoice.scss'

import * as MachineService from "../../services/machine-resources"
import * as ColorsService from "../../services/color-resources"
import {customToastMsg, emptyUI, getCustomDateTimeStamp, searchValidation} from "../../utility/Utils"
import {useForm} from "react-hook-form"
import ColorsModal from "../../@core/components/modal/colorsModal"
import {CSVLink} from "react-csv"

let prev = 0

const CustomHeader = ({
                          onNameTextChange,
                          // onKnittingTextChange,
                          //   knittingDiameter
                          name,
                          onClearNameText,
                          csvList,
                          csvAction,
                          fileName
                          // onClearKnittingText
                      }) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo mb-2'>Colors</h3>
                <Row>
                    <Col lg='5' className='d-flex align-items-center px-0 px-lg-1'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label' for='default-picker'>
                                Search Color Name
                            </Label>
                            <div className='inputWithButton'>
                                <Input
                                    id='name'
                                    className='ms-50 me-2 w-100'
                                    type='text'
                                    value={name}
                                    onChange={onNameTextChange}
                                    placeholder='Search Color Name'
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

                    {csvList.length !== 0 && (
                        <Col lg='7' className='d-flex align-items-center px-0 px-lg-1 justify-content-end'>
                            <CSVLink
                                headers={[
                                    {label: "Color Name", key: "name"},
                                    {label: "Color Code", key: "code"}
                                ]}
                                target="_blank"
                                data={csvList}
                                className="btn btn-primary"
                                asyncOnClick={true}
                                onClick={csvAction}
                                filename={fileName}
                            >
                                Export CSV
                            </CSVLink>
                        </Col>
                    )}

                </Row>
            </div>
        </Card>

    )
}

const defaultValues = {
    colorName: '',
    colorCode: ''
}

const ColorsList = () => {
    // ** Store vars
    const dispatch = useDispatch()

    // ** States
    const [val, setVal] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(0)
    const [statusValue, setStatusValue] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [show, setShow] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [knittingDiaData, setKnittingDiaData] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedId, setSelectedId] = useState('')
    // const [knittingDiameter, setKnittingDiameter] = useState('')
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
        ColorsService.getAllColorsWithPaginate(params.page)
            // eslint-disable-next-line no-unused-vars
            .then(res => {
                if (res.success) {
                    // console.log(res.data.content)
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
                setIsFetched(true)
            })
    }

    const getAllColorsForCsv = async () => {
        await ColorsService.getAllColors()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map((item) => {
                        list.push({
                            name: item.name,
                            code: item.code
                        })
                    })
                    setCsvData(list)
                }
            })
    }

    const searchColors = async (params) => {
        const body = {
            // knittingDiameter: searchValidation(params.knittingDiameter),
            name: searchValidation(params.name)
        }
        dispatch(toggleLoading())
        await ColorsService.searchColors(body, params.page)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
            })
    }

    const searchColorsForCsv = async (params) => {
        const body = {
            name: searchValidation(params.name)
        }
        dispatch(toggleLoading())
        await ColorsService.searchColorsForCsv(body, params.page)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map(item => {
                        list.push({
                            name: item.name,
                            code: item.code
                        })
                    })
                    setCsvData(list)
                }
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
        await getAllColorsForCsv()
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
        if (name.length === 0) {
            getDatass({
                sort,
                q: val,
                sortColumn,
                status: statusValue,
                perPage: rowsPerPage,
                page: page.selected
            })
        } else {
            searchColors({
                sort,
                q: val,
                sortColumn,
                page: page.selected,
                perPage: page.selected,
                status: statusValue,
                // knittingDiameter,
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

        if (data['colorName']) {
            const body = {
                name: data.colorName,
                code: data.colorCode,
                deleted: false
            }
            dispatch(toggleLoading())
            if (isEditMode) {
                Object.assign(body, {
                    id: selectedId
                })

                await ColorsService.updateColor(body, selectedId)
                    .then(res => {
                        if (res.success) {
                            customToastMsg("Color update successfully!", res.status)
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
                await ColorsService.addColor(body)
                    .then(res => {
                        if (res.success) {
                            customToastMsg("Color added successfully!", res.status)
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

    // eslint-disable-next-line no-unused-vars
    const onUpdateHandler = (data) => {
        setSelectedId(data.id)
        setValue("colorName", data.name !== null ? data.name : "")
        setValue("colorCode", data.code)

        setShow(true)
        setIsEditMode(true)
    }

    const columns = [
        {
            name: 'Color Name',
            width: '50%',
            center: true,
            cell: row => row.name
        },
        {
            width: '50%',
            name: 'Color Code',
            center: true,
            cell: row => row.code
        }
        // {
        //     width: '30%',
        //     name: 'Action',
        //     center: true,
        //     // eslint-disable-next-line no-unused-vars
        //     cell: row => (
        //         <Button
        //             color='success' outline
        //             style={{height: 30, paddingTop: 0, paddingBottom: 0}}
        //             onClick={() => onUpdateHandler(row)}
        //         >
        //             <Edit3 size={15} style={{marginRight: 5}}/>
        //             Edit
        //         </Button>
        //     )
        // }

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
        // let diameter = knittingDiameter
        let searchName = name

        switch (type) {
            case 'NAME':
                setName(value)
                searchName = value
                break
            default:
                break
        }

        prev = new Date().getTime()
        setCurrentPage(0)

        setTimeout(() => {
            const now = new Date().getTime()
            if (now - prev >= 1000) {
                if (searchName.length === 0) {
                    getDatass({
                        sort,
                        q: val,
                        sortColumn,
                        page: 0,
                        perPage: 0,
                        status: statusValue,
                        // knittingDiameter: diameter,
                        name: searchName
                    })
                    getAllColorsForCsv()
                } else {
                    searchColors({
                        sort,
                        q: val,
                        sortColumn,
                        page: 0,
                        perPage: 0,
                        status: statusValue,
                        // knittingDiameter: diameter,
                        name: searchName
                    })
                    searchColorsForCsv({
                        name: searchName
                    })
                }
            }
        }, 1000)

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
                    onNameTextChange={e => onSearch(e.target.value, 'NAME')}
                    name={name}
                    onClearNameText={() => onSearch('', 'NAME')}
                    csvList={csvData}
                    csvAction={() => setCurrentDateTime(getCustomDateTimeStamp)}
                    fileName={`ColorsReport_${currentDateTime}.csv`}
                />
                <Col
                    lg='4'
                    className='w-100 actions-right justify-content-end d-flex flex-lg-nowrap flex-wrap pe-1'
                >
                    <Button onClick={() => {
                        clearTextFields()
                    }} style={{width: 100}}>
                        <Plus size={15} style={{marginRight: 5}}/>
                        Add
                    </Button>
                </Col>
                <Row className="mt-2">
                    <Col lg='3'/>
                    <Col lg='6'>
                        <Card>
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

                    </Col>

                    <Col lg='3'/>
                </Row>

            </div>
            <ColorsModal
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

export default ColorsList
