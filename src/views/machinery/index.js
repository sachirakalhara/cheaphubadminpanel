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
import {customToastMsg, emptyUI, getCustomDateTimeStamp, searchValidation} from "../../utility/Utils"
import {useForm} from "react-hook-form"
import MachinesModal from "../../@core/components/modal/machinesModal/machinesModal"
import OrderModal from "../../@core/components/modal/orderModal"
import * as knittingDiaServices from "../../services/knittingDia-resources"
import {CSVLink} from "react-csv"

let prev = 0

const CustomHeader = ({
                          onNameTextChange,
                          onKnittingTextChange,
                          knittingDiameter,
                          name,
                          onClearNameText,
                          onClearKnittingText,
                          csvList,
                          csvAction,
                          fileName
                      }) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo mb-2'>Machinery</h3>
                <Row>
                    <Col lg='5' className='d-flex align-items-center px-0 px-lg-1'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label' for='default-picker'>
                                Knitting Diameter
                            </Label>
                            <div className='inputWithButton'>
                                <Input
                                    id='knittingDiameter'
                                    className='ms-50 me-2 w-100'
                                    type='text'
                                    value={knittingDiameter}
                                    onChange={onKnittingTextChange}
                                    placeholder='Search Knitting Diameter'
                                    autoComplete="off"
                                />
                                {knittingDiameter.length !== 0 && (
                                    <X size={18}
                                       className='cursor-pointer close-btn'
                                       onClick={onClearKnittingText}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>

                    <Col lg='4' className='d-flex align-items-center px-0 px-lg-1'>
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
                                    placeholder='Search Name'
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
                        <Col lg='3' className='d-flex align-items-center justify-content-end px-0 px-lg-1'>
                            <CSVLink
                                headers={[
                                    {label: "Model Number", key: "modelNumber"},
                                    {label: "Knitting Diameter", key: "knittingDiameter"},
                                    {label: "Name", key: "name"},
                                    {label: "Number", key: "number"}
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
    modelNumber: '',
    knittingDiameter: '',
    name: '',
    number: ''
}

const MachineryList = () => {
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
    const [knittingDiaList, setKnittingDiaList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [knittingDiaData, setKnittingDiaData] = useState([])
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
        MachineService.getAllMachines(params.page)
            // eslint-disable-next-line no-unused-vars
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
                setIsFetched(true)
            })
    }

    const getCsvData = async () => {
        await MachineService.getMachines()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map((item) => {
                        list.push({
                            modelNumber: item.modelNumber,
                            knittingDiameter: item?.knittingDiameter.knittingDiameter,
                            name: item.name,
                            number: item.number
                        })
                    })
                    setCsvData(list)
                }
            })
    }

    const getAllKnittingDia = async () => {
        await knittingDiaServices.getAllKnittingDia()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            value: item.id,
                            label: item.knittingDiameter
                        })
                    })
                    setKnittingDiaList(list.sort((a, b) => Number(a.label) - Number(b.label)))
                    setKnittingDiaData(res.data)
                }
            })
    }

    const searchMachines = async (params) => {
        const body = {
            knittingDiameter: searchValidation(params.knittingDiameter),
            name: searchValidation(params.name)
        }
        dispatch(toggleLoading())
        await MachineService.searchMachines(body, params.page)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
            })
    }

    const getAllSearchedCsvData = async (params) => {
        const body = {
            knittingDiameter: searchValidation(params.knittingDiameter),
            name: searchValidation(params.name)
        }

        await MachineService.searchMachinesForCsv(body)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map((item) => {
                        list.push({
                            modelNumber: item.modelNumber,
                            knittingDiameter: item?.knittingDiameter.knittingDiameter,
                            name: item.name,
                            number: item.number
                        })
                    })
                    setCsvData(list)
                }
            })

    }

    useEffect(async () => {
        await getAllKnittingDia()
        getDatass({
            sort,
            q: val,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage,
            status: statusValue
        })
        await getCsvData()
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
            searchMachines({
                sort,
                q: val,
                sortColumn,
                page: page.selected,
                perPage: page.selected,
                status: statusValue,
                knittingDiameter,
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
                modelNumber: data.modelNumber,
                number: data.number,
                capacity: "0",
                machineType: "KNITTING",
                knittingDiameterId: knittingDiaData.find(obj => obj.id === data.knittingDiameter).id
            }
            dispatch(toggleLoading())
            if (isEditMode) {
                Object.assign(body, {
                    deleted: false,
                    id: selectedId
                })

                await MachineService.updateMachine(body)
                    .then(res => {
                        if (res.success) {
                            customToastMsg(res.data, res.status)
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
                await MachineService.saveNewMachine(body)
                    .then(res => {
                        if (res.success) {
                            customToastMsg(res.data, res.status)
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
        setValue("modelNumber", data.modelNumber !== null ? data.modelNumber : "")
        setValue("knittingDiameter", knittingDiaList.find(obj => obj.value === data.knittingDiameter.id).value.toString())
        setValue("name", data.name)
        setValue("number", data.number.toString())

        setShow(true)
        setIsEditMode(true)
    }

    const columns = [
        {
            name: 'Model Number',
            width: '20%',
            center: true,
            cell: row => row.modelNumber
        },
        {
            name: 'Knitting Diameter',
            width: '20%',
            center: true,
            cell: row => (row.knittingDiameter !== null ? row.knittingDiameter.knittingDiameter : null)
        },
        {
            width: '30%',
            name: 'Name',
            center: true,
            cell: row => row.name
        },
        {
            width: '15%',
            name: 'Number',
            center: true,
            cell: row => row.number
        },
        {
            width: '15%',
            name: 'Action',
            center: true,
            // eslint-disable-next-line no-unused-vars
            cell: row => (
                <Button
                    color='success' outline
                    style={{height: 30, paddingTop: 0, paddingBottom: 0}}
                    onClick={() => onUpdateHandler(row)}
                >
                    <Edit3 size={15} style={{marginRight: 5}}/>
                    Edit
                </Button>
            )
        }

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
        let diameter = knittingDiameter
        let searchName = name

        switch (type) {
            case 'KNITTING':
                setKnittingDiameter(value)
                diameter = value
                break
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
                if (diameter.length === 0 && searchName.length === 0) {
                    getDatass({
                        sort,
                        q: val,
                        sortColumn,
                        page: 0,
                        perPage: 0,
                        status: statusValue,
                        knittingDiameter: diameter,
                        name: searchName
                    })
                    getCsvData()
                } else {
                    searchMachines({
                        sort,
                        q: val,
                        sortColumn,
                        page: 0,
                        perPage: 0,
                        status: statusValue,
                        knittingDiameter: diameter,
                        name: searchName
                    })

                    getAllSearchedCsvData({
                        knittingDiameter: diameter,
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
                    onKnittingTextChange={e => onSearch(e.target.value, 'KNITTING')}
                    onNameTextChange={e => onSearch(e.target.value, 'NAME')}
                    knittingDiameter={knittingDiameter}
                    name={name}
                    onClearKnittingText={() => onSearch('', 'KNITTING')}
                    onClearNameText={() => onSearch('', 'NAME')}
                    csvList={csvData}
                    csvAction={() => setCurrentDateTime(getCustomDateTimeStamp)}
                    fileName={`MachineryReport_${currentDateTime}.csv`}
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
            <MachinesModal
                show={show}
                toggle={() => {
                    setShow(!show)
                    reset()
                }}
                onSubmit={handleSubmit(onSubmit)}
                control={control}
                errors={errors}
                list={knittingDiaList}
                isEditMode={isEditMode}
            />
        </Fragment>
    )
}

export default MachineryList
