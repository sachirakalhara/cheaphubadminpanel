// ** React Imports
import {Link} from 'react-router-dom'
import React, {useState, useEffect, Fragment} from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import {Calendar, ChevronDown, Edit3, Eye, Home, Plus, Sliders, X} from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import {Button, Input, Row, Col, Card, Label, CardHeader, CardTitle, CardBody, CardSubtitle} from 'reactstrap'

import {useDispatch} from 'react-redux'


// ** Styles
import '@styles/react/apps/app-invoice.scss'

import * as ProductionRejectionServices from "../../services/productionRejection-resources"
import {
    customToastMsg,
    emptyUI,
    getCustomDateTimeStamp,
    isEmpty,
    roundNumber,
    searchValidation
} from "../../utility/Utils"
import {useForm} from "react-hook-form"
import Flatpickr from "react-flatpickr"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import ProductionRejectionModal from "../../@core/components/modal/productionRejectionModal"
import * as stylesService from "../../services/style-resources"

import {toggleLoading} from '@store/loading'
import * as machineService from "../../services/machine-resources"
import {CSVLink} from "react-csv"

const moment = require('moment')

const customStyles = {
    container: provided => ({
        ...provided,
        minWidth: 150
        // minWidth: "100%"
    })
}

const CustomHeader = ({
                          picker,
                          stylesList,
                          componentList,
                          machinesList,
                          selectedStyle,
                          selectedComponent,
                          selectedMachine,
                          onChangeStyle,
                          onChangeComponent,
                          onChangeMachiines,
                          onChangeDate,
                          onClose,
                          onClearPicker,
                          csvList,
                          csvAction,
                          fileName
                      }) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0'>
                <h3 className='text-primary invoice-logo mb-2'>Production and Rejections</h3>
                <Row>
                    <Col lg={csvList.length !== 0 ? 10 : 12} className='d-flex pr-0 mr-0'>
                        <div className="demo-inline-spacing">
                            <div className='d-flex align-items-center'>
                                <Label className='form-label' for='default-picker'>
                                    Date Range
                                </Label>
                                <div className='inputWithButton'>
                                    <Flatpickr
                                        value={picker}
                                        id='range-picker'
                                        className='form-control ms-1'
                                        onChange={onChangeDate}
                                        style={{width: 255}}
                                        placeholder={'Date Range'}
                                        options={{
                                            mode: 'range',
                                            showMonths: 2
                                        }}
                                        onClose={onClose}
                                    />
                                    {picker.length !== 0 && (
                                        <X size={18}
                                           className='cursor-pointer close-btn me-1'
                                           onClick={onClearPicker}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className='d-flex align-items-center'>
                                <Label className='form-label' for='default-picker'>
                                    Style
                                </Label>
                                <Select
                                    id='style'
                                    className='react-select ms-1'
                                    classNamePrefix='select'
                                    placeholder='Style'
                                    options={stylesList}
                                    theme={selectThemeColors}
                                    value={stylesList.find((c) => c.value === selectedStyle)}
                                    isClearable={true}
                                    onChange={onChangeStyle}
                                    styles={customStyles}
                                />
                            </div>
                            <div className='d-flex align-items-center'>
                                <Label className='form-label' for='default-picker'>
                                    Component
                                </Label>
                                <Select
                                    id='component'
                                    className='react-select ms-1'
                                    classNamePrefix='select'
                                    placeholder='Component'
                                    options={componentList}
                                    theme={selectThemeColors}
                                    value={selectedComponent !== "" ? componentList.find((c) => c.value === selectedComponent) : null}
                                    isClearable={true}
                                    onChange={onChangeComponent}
                                    styles={customStyles}
                                />
                            </div>
                            <div className='d-flex align-items-center'>
                                <Label className='form-label' for='default-picker'>
                                    Machine
                                </Label>
                                <Select
                                    id='machine'
                                    className='react-select ms-1'
                                    classNamePrefix='select'
                                    placeholder='Machine'
                                    options={machinesList}
                                    theme={selectThemeColors}
                                    value={machinesList.find((c) => c.value === selectedMachine)}
                                    isClearable={true}
                                    onChange={onChangeMachiines}
                                    styles={customStyles}
                                />
                            </div>
                            {/*<Button>*/}
                            {/*    <Sliders size={15} className="rotate-90" style={{marginRight: 5}}/>*/}
                            {/*    Filter*/}
                            {/*</Button>*/}
                        </div>
                    </Col>
                    {csvList.length !== 0 && (
                        <Col lg='2' className='d-flex align-items-start justify-content-end pt-2'>
                            <CSVLink
                                headers={[
                                    {label: "Date", key: "date"},
                                    {label: "Shift", key: "shift"},
                                    {label: "Order", key: "order"},
                                    {label: "Style", key: "style"},
                                    {label: "Component", key: "component"},
                                    {label: "Machine", key: "machine"},
                                    {label: "Production (PCS)", key: "production"},
                                    {label: "Production Weight (kg)", key: "productionWeight"},
                                    {label: "Rejection Weight (kg)", key: "rejectionWeight"}
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
    date: moment(new Date()).format('YYYY-MM-DD'),
    shift: '',
    style: '',
    orderId: '',
    // orderItemId: '',
    component: '',
    machine: '',
    production: '',
    rejection: '',
    productionWeight: ''
}

const ProductionRejection = () => {
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
    const [isEditMode, setIsEditMode] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [selectedId, setSelectedId] = useState('')
    const [picker, setPicker] = useState([])
    const [stylesList, setStylesList] = useState([])
    const [componentList, setComponentList] = useState([])
    const [machinesList, setMachinesList] = useState([])
    const [selectedStyle, setSelectedStyle] = useState('')
    const [selectedComponent, setSelectedComponent] = useState('')
    const [selectedMachine, setSelectedMachine] = useState('')
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
        getValues,
        reset
    } = useForm({defaultValues})


    const getDatass = (params) => {
        dispatch(toggleLoading())
        ProductionRejectionServices.getAllData(params.page)
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

    const getCsvData = () => {
        ProductionRejectionServices.getDateRange()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map((item) => {
                        list.push({
                            date: moment(item.date).format('YYYY-MM-DD'),
                            shift: item.shift,
                            order: item?.order.poNumber,
                            style: item?.style.styleNumber,
                            component: item?.component.type,
                            machine: item?.machine.name,
                            production: item.productionCount,
                            productionWeight: item.productionWeight,
                            rejectionWeight: item.rejectionCount
                        })
                    })
                    setCsvData(list)
                }
            })
    }

    // eslint-disable-next-line no-unused-vars
    const getStylesDetails = async () => {
        await stylesService.getAllStyles()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.styleNumber,
                            value: item.id
                        })
                    })
                    setStylesList(list)
                }
            })
    }

    const getMachines = async () => {
        await machineService.getMachines()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.name,
                            value: item.id
                        })
                    })
                    setMachinesList(list)
                }
            })
    }

    useEffect(async () => {
        await getStylesDetails()
        await getMachines()
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

    const searchData = async (params) => {
        const body = {
            styleId: searchValidation(params.style),
            componentId: searchValidation(params.component),
            machineId: searchValidation(params.machine),
            fromDate: searchValidation(params.fromDate),
            toDate: searchValidation(params.toDate)
        }
        dispatch(toggleLoading())
        await ProductionRejectionServices.searchProductionRejections(body, params.page)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.message, res.status)
                }
                dispatch(toggleLoading())
            })
    }

    const searchDataForCsv = async (params) => {
        const body = {
            styleId: searchValidation(params.style),
            componentId: searchValidation(params.component),
            machineId: searchValidation(params.machine),
            fromDate: searchValidation(params.fromDate),
            toDate: searchValidation(params.toDate)
        }
        await ProductionRejectionServices.searchProductionRejectionsForCsv(body)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map((item) => {
                        list.push({
                            date: moment(item.date).format('YYYY-MM-DD'),
                            shift: item.shift,
                            order: item?.order.poNumber,
                            style: item?.style.styleNumber,
                            component: item?.component.type,
                            machine: item?.machine.name,
                            production: item.productionCount,
                            productionWeight: roundNumber(item.productionWeight),
                            rejectionWeight: roundNumber(item.rejectionCount)
                        })
                    })
                    setCsvData(list)
                }
            })
    }

    const handlePagination = page => {
        if (selectedStyle.length === 0 && selectedComponent.length === 0 && selectedMachine.length === 0 && picker.length === 0) {
            getDatass({
                sort,
                q: val,
                sortColumn,
                status: statusValue,
                perPage: rowsPerPage,
                page: page.selected
            })
        } else {
            searchData({
                sort,
                q: val,
                sortColumn,
                page: 0,
                perPage: 0,
                status: statusValue,
                style: selectedStyle,
                machine: selectedMachine,
                component: selectedComponent,
                fromDate: moment(picker[0]).format('YYYY-MM-DD'),
                toDate: moment(picker[1]).format('YYYY-MM-DD')
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
        } else if ((store.data?.length === 0 && isFiltered) || !store.data) {
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

        const keys = Object.keys(data)
        console.log(keys)

        if (data.production.length === 0 && data.rejection.length === 0 && data.productionWeight.length === 0) {
            console.log('invalid')
        } else {
            if (data.production.length === 0) {
                delete data[keys[keys.length - 3]]
            }

            if (data.rejection.length === 0) {
                delete data[keys[keys.length - 2]]
            }

            if (data.productionWeight.length === 0) {
                delete data[keys[keys.length - 1]]
            }
        }

        if (Object.values(data).every(field => field.length > 0)) {
            const body = {
                shift: data.shift,
                date: `${data.date}T00:00:00Z`,
                // orderItemId: data.orderItemId,
                orderId: data.orderId,
                styleId: data.style,
                machineId: data.machine,
                componentId: data.component,
                productionCount: data.production !== undefined ? Number(data.production) : 0,
                productionWeight: data.productionWeight !== undefined ? Number(data.productionWeight) : 0,
                rejectionCount: data.rejection !== undefined ? Number(data.rejection) : 0
            }
            dispatch(toggleLoading())
            if (isEditMode) {
                Object.assign(body, {
                    id: selectedId
                })

                await ProductionRejectionServices.updateRecord(body)
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
                await ProductionRejectionServices.saveNewRecord(body)
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
        setValue("date", moment(data.date).format('YYYY-MM-DD'))
        setValue("shift", data.shift)
        setValue("style", data.style.id)
        setValue("orderId", data.order !== null ? data.order.id : null)
        // setValue("orderItemId", data.orderItem.id)
        setValue("component", data.component.id)
        setValue("machine", data.machine.id)
        setValue("production", data.productionCount !== null ? data.productionCount.toString() : "0")
        setValue("productionWeight", data.productionWeight !== null ? data.productionWeight.toString() : "0")
        setValue("rejection", data.rejectionCount !== null ? data.rejectionCount.toString() : "0")

        setShow(true)
        setIsEditMode(true)
    }

    const columns = [
        {
            name: 'Date',
            minWidth: '120px',
            center: true,
            cell: row => moment(row.date).format('YYYY-MM-DD')
        },
        {
            name: 'Shift',
            minWidth: '90px',
            center: true,
            cell: row => row.shift
        },
        {
            name: 'Order',
            minWidth: '150px',
            center: true,
            cell: row => (row.order !== null ? row.order.poNumber : null)
        },
        {
            name: 'Style',
            minWidth: '150px',
            center: true,
            cell: row => row.style.styleNumber
        },
        {
            name: 'Component',
            minWidth: '190px',
            center: true,
            cell: row => row.component.type
        },
        {
            minWidth: '170px',
            name: 'Machine',
            center: true,
            cell: row => row.machine.name
        },
        {
            minWidth: '140px',
            name: <span className="text-center">Production (PCS)</span>,
            center: true,
            cell: row => row.productionCount
        },
        {
            minWidth: '140px',
            name: <span className="text-center">Production Weight <span className="text-lowercase">(Kg)</span></span>,
            center: true,
            cell: row => roundNumber(row.productionWeight)
        },
        {
            minWidth: '140px',
            name: <span className="text-center">Rejection Weight <span className="text-lowercase">(Kg)</span></span>,
            center: true,
            cell: row => roundNumber(row.rejectionCount)
        },
        {
            minWidth: '140px',
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
        setIsEditMode(false)
        reset()
        setShow(true)
    }

    const customStyles = {
        subHeader: {
            style: {
                display: 'none'
            }
        }
    }

    const getStylesComponents = async (id) => {
        await stylesService.getComponentsByStyleId(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.component.type,
                            value: item.component.id
                        })
                    })
                    setComponentList(list)
                }
            })
    }

    const searchProductionRejection = (e, type) => {
        setCurrentPage(0)
        let style = selectedStyle
        let component = selectedComponent
        let machine = selectedMachine
        let fromDate = !isEmpty(picker[0]) ? moment(picker[0]).format('YYYY-MM-DD') : ''
        let toDate = !isEmpty(picker[1]) ? moment(picker[1]).format('YYYY-MM-DD') : ''

        const data = e !== null ? e.value : ""
        console.log(data)


        switch (type) {
            case 'STYLE':
                setSelectedStyle(data)
                setSelectedComponent("")
                style = data
                component = ""
                break
            case 'COMPONENT':
                setSelectedComponent(data)
                component = data
                break
            case 'MACHINE':
                setSelectedMachine(data)
                machine = data
                break
            case 'DATE':
                setPicker(e)
                fromDate = e.length !== 0 ? moment(e[0]).format('YYYY-MM-DD') : ''
                toDate = e.length !== 0 ? moment(e[1]).format('YYYY-MM-DD') : ''
                break
            default:
                break
        }

        if (style.length === 0 && machine.length === 0 && component.length === 0 && fromDate.length === 0 && toDate.length === 0) {
            getDatass({
                sort,
                q: val,
                sortColumn,
                page: 0,
                perPage: 0,
                status: statusValue
            })
            getCsvData()
        } else {
            searchData({
                sort,
                q: val,
                sortColumn,
                page: 0,
                perPage: 0,
                status: statusValue,
                style,
                machine,
                component,
                fromDate,
                toDate
            })
            searchDataForCsv({
                style,
                machine,
                component,
                fromDate,
                toDate
            })
        }


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
                    onModalBtnClick={() => {
                        setShow(true)
                        clearTextFields()
                    }}
                    picker={picker}
                    stylesList={stylesList}
                    componentList={componentList}
                    machinesList={machinesList}
                    selectedStyle={selectedStyle}
                    selectedComponent={selectedComponent}
                    selectedMachine={selectedMachine}
                    onClose={(selectedDates, dateStr, instance) => {
                        if (selectedDates.length === 1) {
                            instance.setDate([picker[0], picker[1]], true)
                        }
                    }}
                    onChangeDate={date => {
                        if (date.length === 2) {
                            searchProductionRejection(date, 'DATE')
                        }
                    }}
                    onChangeStyle={(selectedOption) => {
                        if (selectedOption !== null) {
                            getStylesComponents(selectedOption.value)
                        } else {
                            setComponentList([])
                        }
                        searchProductionRejection(selectedOption, 'STYLE')
                    }}
                    onChangeComponent={(selectedOption) => {
                        searchProductionRejection(selectedOption, 'COMPONENT')
                    }}
                    onChangeMachiines={(selectedOption) => {
                        searchProductionRejection(selectedOption, 'MACHINE')
                    }}
                    onClearPicker={() => searchProductionRejection([], 'DATE')}
                    csvList={csvData}
                    csvAction={() => setCurrentDateTime(getCustomDateTimeStamp)}
                    fileName={`ProductionRejectionReport_${currentDateTime}.csv`}
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
            {show && (
                <ProductionRejectionModal
                    show={show}
                    toggle={() => {
                        setShow(!show)
                        reset()
                    }}
                    onSubmit={handleSubmit(onSubmit)}
                    control={control}
                    errors={errors}
                    isEditMode={isEditMode}
                    styleId={getValues("style")}
                    orderId={getValues("orderId")}
                />
            )}

        </Fragment>
    )
}

export default ProductionRejection
