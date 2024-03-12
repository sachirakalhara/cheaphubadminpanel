import React, {useEffect, useRef, useState} from "react"
import {Alert, Button, ButtonGroup, Card, CardBody, Col, Input, Label, Row, Table} from "reactstrap"
import {INTERVAL_SUMMARY_TYPES} from "../../../const/constant"
import ReactPaginate from "react-paginate"
import SummeryBarChart from "../../charts/analytics/SummeryBarChart"
import MachineAvgChart from "../../charts/analytics/MachineAvgChart"
import IntervalSummeryChart from "../../charts/analytics/IntervalSummeryChart"
import classnames from "classnames"
import * as StyleServices from '../../../services/style-resources'
import * as ProductionRejectionServices from '../../../services/productionRejection-resources'
import Flatpickr from "react-flatpickr"
import {customToastMsg, emptyUI, getCustomDateTimeStamp, isEmpty, roundNumber} from "../../../utility/Utils"
import {useDispatch} from "react-redux"
import {toggleLoading} from '@store/loading'
import Select from "react-select"
import {selectThemeColors} from '@utils'
import {X} from "react-feather"
import {CSVLink} from "react-csv"

const moment = require('moment')

function dateISOStringConvertor(date) {
    return moment(date).format('YYYY-MM-DD')
}

let selectStyleId = ''

const ProductionAnalysis = () => {
    const refComp = useRef(null)

    const dispatch = useDispatch()
    // eslint-disable-next-line no-unused-vars
    const [totalPages, setTotalPages] = useState(0)
    const [activeView, setActiveView] = useState('table')
    const [activeSubView, setActiveSubView] = useState('DAILY')
    const [stylesList, setStylesList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [selectedStyle, setSelectedStyle] = useState()
    const [picker, setPicker] = useState([])
    const [intervalPicker, setIntervalPicker] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [currentPage, setCurrentPage] = useState(0)
    const [currentDateTime, setCurrentDateTime] = useState('')

    // eslint-disable-next-line no-unused-vars
    const [store, setStore] = useState({
        allData: [],
        data: [],
        params: {
            page: 0,
            currentPage: 0
        },
        total: 0
    })
    const [productionGraphData, setProductionGraphData] = useState([])

    // eslint-disable-next-line no-unused-vars
    const [storeIntervalSummery, setStoreIntervalSummery] = useState({
        allData: [],
        data: [],
        params: {
            page: 0,
            currentPage: 0
        },
        total: 0
    })
    // eslint-disable-next-line no-unused-vars
    const [intervalSummaryList, setIntervalSummaryList] = useState([])
    const [intervalSummaryListForCsv, setIntervalSummaryListForCsv] = useState([])

    const [storeMachineSummery, setStoreMachineSummery] = useState({
        allData: [],
        data: [],
        params: {
            page: 0,
            currentPage: 0
        },
        total: 0
    })

    // eslint-disable-next-line no-unused-vars
    const [machineSummaryList, setMachineSummary] = useState([])
    const [isFetched1, setIsFetched1] = useState(false)
    const [isFetched2, setIsFetched2] = useState(false)
    const [isFetched3, setIsFetched3] = useState(false)
    const [isFetched4, setIsFetched4] = useState(false)
    const [isFetched5, setIsFetched5] = useState(false)
    const [isFetched6, setIsFetched6] = useState(false)


    const getSummeryDate = (dateRage, selectedId, params) => {
        const body = {
            styleId: selectedId,
            fromDate: dateISOStringConvertor(dateRage[0]),
            toDate: dateISOStringConvertor(dateRage[1])
        }
        ProductionRejectionServices.getSummeryList(params.page, body)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.message, res.status)
                    setStore({
                        allData: [],
                        data: [],
                        params: {
                            page: 0,
                            currentPage: 0
                        },
                        total: 0
                    })
                }
                dispatch(toggleLoading())
                setIsFetched1(true)
            })
    }

    const getSummeryDateForGraph = (dateRage, selectedId) => {
        const body = {
            styleId: selectedId,
            fromDate: dateISOStringConvertor(dateRage[0]),
            toDate: dateISOStringConvertor(dateRage[1])
        }
        ProductionRejectionServices.getSummeryGraph(body)
            .then(res => {
                if (res.success) {
                    setProductionGraphData(res.data)
                } else {
                    setProductionGraphData([])
                    customToastMsg(res.message, res.status)
                }
                setIsFetched4(true)
            })
    }


    const getIntervalSummeryList = (selectedId, type, params, dateRange) => {
        const body = {
            styleId: selectedId,
            type,
            fromDate: !isEmpty(dateRange[0]) ? dateISOStringConvertor(dateRange[0]) : 0,
            toDate: !isEmpty(dateRange[1]) ? dateISOStringConvertor(dateRange[1]) : 0
        }

        ProductionRejectionServices.getIntervalSummery(params.page, body)
            .then(res => {
                if (res.success) {
                    setStoreIntervalSummery({
                        allData: res.data.content,
                        data: res.data.content,
                        params,
                        total: res.data.totalPages
                    })
                } else {
                    customToastMsg(res.message, res.status)
                    setStoreIntervalSummery({
                        allData: [],
                        data: [],
                        params: {
                            page: 0,
                            currentPage: 0
                        },
                        total: 0
                    })
                }
                dispatch(toggleLoading())
                setIsFetched2(true)
            })
    }

    // eslint-disable-next-line no-unused-vars
    const groupList = (list) => {
        // this gives an object with dates as keys
        const groups = list.reduce((group, item) => {
            const componentType = item.componentType
            if (!group[componentType]) {
                group[componentType] = []
            }
            group[componentType].push(item)
            return group
        }, {})

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((componentType) => {
            return {
                componentType,
                subList: groups[componentType].sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
            }
        })
        setIntervalSummaryList(groupArrays)
    }

    const getIntervalSummaryForGraph = (selectedId, type, dateRange) => {
        const body = {
            styleId: selectedId,
            type,
            fromDate: !isEmpty(dateRange[0]) ? dateISOStringConvertor(dateRange[0]) : 0,
            toDate: !isEmpty(dateRange[1]) ? dateISOStringConvertor(dateRange[1]) : 0
        }

        ProductionRejectionServices.getIntervalSummeryGraph(body)
            .then(async res => {
                if (res.success) {
                    groupList(res.data)
                    const list = []
                    console.log(type)
                    res.data.map(item => {
                        list.push({
                            date: moment(item.date).format(type === 'DAILY' ? 'YYYY-MM-DD' : type === 'MONTHLY' ? 'YYYY-MM' : 'YYYY'),
                            component: item.componentType,
                            production: roundNumber(item.productionCount),
                            rejection: roundNumber(item.rejectionCount)
                        })
                    })
                    setIntervalSummaryListForCsv(list)
                } else {
                    setIntervalSummaryList([])
                    setIntervalSummaryListForCsv([])
                    customToastMsg(res.message, res.status)
                }
                dispatch(toggleLoading())
                setIsFetched5(true)
            })
    }

    const getMachineSummaryList = (styleId, params) => {
        ProductionRejectionServices.getMachineSummary(styleId, params.page)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map(item => {
                        list.push({
                            knittingDiameter: item.knittingDiameter !== null ? item.knittingDiameter : 0,
                            machines: item.machines,
                            weight: roundNumber(item.weight),
                            average: roundNumber(Number(item.weight) / Number(item.machines))
                        })
                    })
                    setStoreMachineSummery({
                        allData: list,
                        data: list,
                        params,
                        total: res.data.totalPages
                    })
                } else {
                    customToastMsg(res.message, res.status)
                    setStoreMachineSummery({
                        allData: [],
                        data: [],
                        params: {
                            page: 0,
                            currentPage: 0
                        },
                        total: 0
                    })
                }
                setIsFetched3(true)
            })
    }

    const getMachineSummaryForGraph = (styleId) => {
        ProductionRejectionServices.getMachineSummaryForGraph(styleId)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map(item => {
                        list.push({
                            knittingDiameter: item.knittingDiameter !== null ? item.knittingDiameter : 0,
                            machines: item.machines,
                            weight: roundNumber(item.weight),
                            average: roundNumber(Number(item.weight) / Number(item.machines))
                        })
                    })
                    setMachineSummary(list)
                } else {
                    setMachineSummary([])
                    customToastMsg(res.message, res.status)
                }
                setIsFetched6(true)
            })

    }

    const getDateRange = async (selectedId) => {
        await ProductionRejectionServices.getDateRange()
            .then(async res => {
                if (res.success) {
                    const latestDate = new Date(Math.max(...res.data.content.map(e => new Date(e.date))))
                    const olderDate = new Date(Math.min(...res.data.content.map(e => new Date(e.date))))
                    const dateRage = [olderDate, latestDate]
                    setPicker(dateRage)
                    getSummeryDate(dateRage, selectedId, {page: 0, currentPage: 0})
                    getSummeryDateForGraph(dateRage, selectedId)
                    getIntervalSummeryList(selectedId, activeSubView, {page: 0, currentPage: 0}, intervalPicker)
                    getIntervalSummaryForGraph(selectedId, activeSubView, intervalPicker)
                    getMachineSummaryList(selectedId, {page: 0, currentPage: 0})
                    getMachineSummaryForGraph(selectedId)
                } else {
                    dispatch(toggleLoading())
                    customToastMsg(res.data.title, res.status)
                }

            })
    }

    const getAllStyles = async () => {
        dispatch(toggleLoading())
        await StyleServices.getAllStyles()
            .then(async res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.styleNumber,
                            value: item.id
                        })
                    })
                    setStylesList(list)
                    setSelectedStyle(list[0]?.value)
                    selectStyleId = list[0]?.value
                    await getDateRange(list[0]?.value)
                } else {
                    dispatch(toggleLoading())
                    customToastMsg(res.data.title, res.status)
                }
            })
    }

    useEffect(async () => {
        await getAllStyles()
    }, [])

    const tableBodyItems = store.data.map((item, i) => (
        <tr key={i} style={{fontSize: 12}}>
            <td>
                <p className='text-center'>{item.componentType}</p>
            </td>
            <td>
                <p className='text-center'>{item.productionCount}</p>
            </td>
            <td>
                <p className='text-center'>{roundNumber(item.rejectionCount)}</p>
            </td>
        </tr>
    ))

    const tableBodyItems2 = storeIntervalSummery.data.map((item, i) => (
        <tr key={i} style={{fontSize: 12}}>
            <td>
                <p className='text-center'>
                    {moment(item.date).format(activeSubView === 'DAILY' ? 'YYYY-MM-DD' : activeSubView === 'MONTHLY' ? 'YYYY-MM' : 'YYYY')}
                </p>
            </td>
            <td>
                <p className='text-center'>{item.componentType}</p>
            </td>
            <td>
                <p className='text-center'>{item.productionCount}</p>
            </td>
            <td>
                <p className='text-center'>{roundNumber(item.rejectionCount)}</p>
            </td>
        </tr>
    ))

    const tableBodyItems3 = storeMachineSummery.data.map((item, i) => (
        <tr key={i} style={{fontSize: 12}}>
            <td>
                <p className='text-center'>{item.knittingDiameter}</p>
            </td>
            <td>
                <p className='text-center'>{item.machines}</p>
            </td>
            <td>
                <p className='text-center'>{item.weight !== null ? roundNumber(item.weight) : null}</p>
            </td>
            <td>
                <p className='text-center'>{item.average}</p>
            </td>
        </tr>
    ))

    const handleStyleSelection = (e) => {
        setSelectedStyle(e.value)
        selectStyleId = e.value
        dispatch(toggleLoading())
        getSummeryDate(picker, e.value, {page: 0, currentPage: 0})
        getSummeryDateForGraph(picker, e.value)
        getIntervalSummeryList(e.value, activeSubView, {page: 0, currentPage: 0}, intervalPicker)
        getIntervalSummaryForGraph(e.value, activeSubView, intervalPicker)
        getMachineSummaryList(e.value, {page: 0, currentPage: 0})
        getMachineSummaryForGraph(e.value)
    }

    const handleSummarySelection = async (e) => {
        await setActiveSubView(e.value)
        dispatch(toggleLoading())
        getIntervalSummeryList(selectedStyle, e.value, {page: 0, currentPage: 0}, intervalPicker)
        getIntervalSummaryForGraph(selectedStyle, e.value, intervalPicker)
    }

    const handlePagination = (type, page) => {
        dispatch(toggleLoading())
        switch (type) {
            case 'SUMMARY':
                getSummeryDate(picker, selectedStyle, {
                    page: page.selected,
                    currentPage: page.selected + 1
                })
                break
            case 'INTERVAL_SUMMARY':
                getIntervalSummeryList(selectedStyle, activeSubView, {
                    page: page.selected,
                    currentPage: page.selected + 1
                }, intervalPicker)
                break
            case 'MACHINE_SUMMARY':
                getMachineSummaryList(selectedStyle, {
                    page: page.selected,
                    currentPage: page.selected + 1
                })
                break
            default:
                break
        }
    }

    const customStyles = {
        container: provided => ({
            ...provided,
            width: 150
            // minWidth: "100%"
        })
    }

    const getSummeryCsvData = (data) => {
        const list = []
        data.map(item => {
            list.push({
                component: item.componentType,
                productionPCS: item.productionCount,
                rejection: item.rejectionCount
            })
        })
        return list
    }

    const getMachineAverageCsvData = (data) => {
        const list = []
        data.map(item => {
            list.push({
                knittingDiameter: item.knittingDiameter,
                machines: item.machines,
                weight: roundNumber(item.weight),
                average: roundNumber(Number(item.weight) / Number(item.machines))
            })
        })
        return list
    }

    return (
        <div className='invoice-list-table-header w-100 py-2' style={{whiteSpace: 'nowrap'}}>
            <Row>
                <Col lg='12' className='d-flex align-items-center mb-1'>
                    <div className='d-flex justify-content-between w-100'>
                        <div className="d-flex align-items-center">
                            <label htmlFor='rows-per-page'>Style</label>
                            <Select
                                className='react-select ms-1'
                                classNamePrefix='select'
                                placeholder='Style'
                                options={stylesList}
                                theme={selectThemeColors}
                                value={stylesList.find((c) => c.value === selectedStyle)}
                                onChange={handleStyleSelection}
                                styles={customStyles}
                            />
                        </div>

                        <ButtonGroup>
                            <Button
                                tag='label'
                                className={classnames('btn-icon view-btn grid-view-btn', {
                                    active: activeView === 'table'
                                })}
                                color='primary'
                                outline={activeView !== 'table'}
                                onClick={() => setActiveView('table')}
                            >
                                Table View
                            </Button>
                            <Button
                                tag='label'
                                className={classnames('btn-icon view-btn list-view-btn', {
                                    active: activeView === 'graph'
                                })}
                                color='primary'
                                outline={activeView !== 'graph'}
                                onClick={() => setActiveView('graph')}
                            >
                                Graph View
                            </Button>
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>

            {activeView !== 'graph' ? (
                <div>
                    <Row>
                        <Col lg='5' className='d-flex py-2'>
                            <Card className='invoice-preview-card w-100'>
                                <CardBody className='invoice-padding'>
                                    <div className="align-items-center d-flex ms-0 mb-2 justify-content-between">
                                        <h4 className='text-truncate'>Summary</h4>

                                        {productionGraphData.length !== 0 && (
                                            <CSVLink
                                                headers={[
                                                    {label: "Component", key: "component"},
                                                    {label: "Production PCS", key: "productionPCS"},
                                                    {label: "Rejection (kg)", key: "rejection"}
                                                ]}
                                                target="_blank"
                                                data={getSummeryCsvData(productionGraphData)}
                                                className="btn btn-primary"
                                                asyncOnClick={true}
                                                onClick={() => setCurrentDateTime(getCustomDateTimeStamp)}
                                                filename={`SummeryReport_${currentDateTime}.csv`}
                                            >
                                                Export CSV
                                            </CSVLink>
                                        )}
                                    </div>

                                    {/*<div className="d-flex my-1">*/}
                                    {/*    <div className="d-flex">*/}
                                    {/*        <span className="fw-bold">From : </span>*/}
                                    {/*        <span>01.01.2020</span>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="d-flex ms-3">*/}
                                    {/*        <span className="fw-bold">To : </span>*/}
                                    {/*        <span>15.01.2020</span>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <div className='d-flex align-items-center mb-2'>
                                        <Label className='form-label' for='default-picker'>
                                            Date Range
                                        </Label>
                                        <Flatpickr
                                            value={picker}
                                            id='range-picker'
                                            className='form-control ms-1'
                                            style={{width: 210}}
                                            onChange={date => {
                                                if (date.length === 2) {
                                                    setPicker(date)
                                                    dispatch(toggleLoading())
                                                    getSummeryDate(date, selectStyleId, {
                                                        page: 0,
                                                        currentPage: 0
                                                    })
                                                    getSummeryDateForGraph(date, selectedStyle)
                                                }
                                            }}
                                            onClose={(selectedDates, dateStr, instance) => {
                                                if (selectedDates.length === 1) {
                                                    instance.setDate([picker[0], picker[1]], true)
                                                }
                                            }}
                                            options={{
                                                mode: 'range',
                                                showMonths: 2
                                                // defaultDate:[new Date(picker[0]), new Date(picker[1])]
                                            }}
                                            placeholder={"Select Date Range"}
                                        />

                                    </div>

                                    {store.data?.length !== 0 ? (
                                        <>
                                            <Table responsive borderless size="sm" className="table-outline">
                                                <thead>
                                                <tr>
                                                    <th className='text-center'
                                                        style={{borderTopLeftRadius: 8}}>Component
                                                    </th>
                                                    <th className='px-2 text-center'><span>Production</span> <br/>
                                                        <span>PCS</span></th>
                                                    <th className='text-center' style={{borderTopRightRadius: 8}}>
                                                        <span>Rejection</span> <br/> <span
                                                        className="text-lowercase">(Kg)</span></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {tableBodyItems}
                                                </tbody>
                                            </Table>
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
                                                onPageChange={page => handlePagination('SUMMARY', page)}
                                                forcePage={store.params.currentPage !== 0 ? store.params.currentPage - 1 : 0}
                                                containerClassName={'pagination react-paginate justify-content-end pt-1'}
                                            />
                                        </>
                                    ) : emptyUI(isFetched1)}

                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg='7' className='d-flex py-2'>
                            <Card className='invoice-preview-card w-100'>
                                <CardBody className='invoice-padding'>
                                    <div className="align-items-center d-flex ms-0 mb-2 justify-content-between">
                                        <h4 className='text-truncate'>Interval Summary</h4>

                                        {intervalSummaryListForCsv.length !== 0 && (
                                            <CSVLink
                                                headers={[
                                                    {
                                                        label: activeSubView === 'DAILY' ? 'Date' : activeSubView === 'MONTHLY' ? 'Month' : 'Year',
                                                        key: "date"
                                                    },
                                                    {label: "Component", key: "component"},
                                                    {label: "Production PCS", key: "production"},
                                                    {label: "Rejection (kg)", key: "rejection"}
                                                ]}
                                                target="_blank"
                                                data={intervalSummaryListForCsv}
                                                className="btn btn-primary"
                                                asyncOnClick={true}
                                                onClick={() => setCurrentDateTime(getCustomDateTimeStamp)}
                                                filename={`IntervalSummeryReport_${currentDateTime}.csv`}
                                            >
                                                Export CSV
                                            </CSVLink>
                                        )}
                                    </div>
                                    <Col lg='12'>
                                        <div className="d-flex my-1">
                                            {/*<Input*/}
                                            {/*    type='select'*/}
                                            {/*    id='rows-per-page'*/}
                                            {/*    value={activeSubView}*/}
                                            {/*    onChange={handleSummarySelection}*/}
                                            {/*    className='form-control'*/}
                                            {/*>*/}
                                            {/*    {INTERVAL_SUMMARY_TYPES.map((item, i) => (*/}
                                            {/*        <option value={item.value} key={i}>{item.label}</option>*/}
                                            {/*    ))}*/}
                                            {/*</Input>*/}
                                            <Select
                                                className='react-select ms-1'
                                                classNamePrefix='select'
                                                placeholder='Style'
                                                options={INTERVAL_SUMMARY_TYPES}
                                                theme={selectThemeColors}
                                                value={INTERVAL_SUMMARY_TYPES.find((c) => c.value === activeSubView)}
                                                onChange={handleSummarySelection}
                                                styles={customStyles}
                                            />
                                            <div className='d-flex align-items-center mb-2 ms-2 w-75'>
                                                <Label className='form-label' for='default-picker'>
                                                    Date Range
                                                </Label>
                                                <Flatpickr
                                                    // value={intervalPicker}
                                                    id='range-picker'
                                                    className='form-control ms-1'
                                                    onChange={date => {
                                                        if (date.length === 2) {
                                                            setIntervalPicker(date)
                                                            dispatch(toggleLoading())
                                                            getIntervalSummeryList(selectStyleId, activeSubView, {
                                                                page: 0,
                                                                currentPage: 0
                                                            }, date)
                                                            getIntervalSummaryForGraph(selectStyleId, activeSubView, date)
                                                        }
                                                    }}
                                                    placeholder={"Select Date Range"}
                                                    onClose={(selectedDates, dateStr, instance) => {
                                                        if (selectedDates.length === 1) {
                                                            instance.setDate([intervalPicker[0], intervalPicker[1]], true)
                                                        }
                                                    }}
                                                    style={{width: 210}}
                                                    options={{
                                                        mode: 'range',
                                                        showMonths: 2,
                                                        defaultDate: intervalPicker
                                                    }}
                                                    ref={refComp}
                                                />
                                                {intervalPicker.length !== 0 && (
                                                    <div
                                                        className='ms-2'>
                                                        <X size={18}
                                                           className='cursor-pointer'
                                                           onClick={() => {
                                                               refComp.current.flatpickr.clear()
                                                               dispatch(toggleLoading())
                                                               setIntervalPicker([])
                                                               getIntervalSummeryList(selectedStyle, activeSubView, {
                                                                   page: 0,
                                                                   currentPage: 0
                                                               }, [])
                                                               getIntervalSummaryForGraph(selectedStyle, activeSubView, [])
                                                           }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>

                                    {storeIntervalSummery.data.length !== 0 ? (
                                        <>
                                            <Table responsive borderless size="sm" className="table-outline">
                                                <thead>
                                                <tr>
                                                    <th className='text-center'
                                                        style={{borderTopLeftRadius: 8}}>{activeSubView === 'DAILY' ? 'Date' : activeSubView === 'MONTHLY' ? 'Month' : 'Year'}</th>
                                                    <th className='text-center'>Component</th>
                                                    <th className='px-2 text-center'><span>Production</span> <br/>
                                                        <span>PCS</span></th>
                                                    <th className='text-center' style={{borderTopRightRadius: 8}}>
                                                        <span>Rejection</span> <br/> <span
                                                        className="text-lowercase">(Kg)</span></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {tableBodyItems2}
                                                </tbody>
                                            </Table>
                                            <ReactPaginate
                                                nextLabel=''
                                                breakLabel='...'
                                                previousLabel=''
                                                pageCount={storeIntervalSummery.total || 1}
                                                activeClassName='active'
                                                breakClassName='page-item'
                                                pageClassName={'page-item'}
                                                breakLinkClassName='page-link'
                                                nextLinkClassName={'page-link'}
                                                pageLinkClassName={'page-link'}
                                                nextClassName={'page-item next'}
                                                previousLinkClassName={'page-link'}
                                                previousClassName={'page-item prev'}
                                                onPageChange={page => handlePagination('INTERVAL_SUMMARY', page)}
                                                forcePage={storeIntervalSummery.params.currentPage !== 0 ? storeIntervalSummery.params.currentPage - 1 : 0}
                                                containerClassName={'pagination react-paginate justify-content-end pt-1'}
                                            />
                                        </>
                                    ) : emptyUI(isFetched2)}

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg='7' className='d-flex'>
                            <Card className='invoice-preview-card w-100'>
                                <CardBody className='invoice-padding'>
                                    <div className="align-items-center d-flex ms-0 mb-2 justify-content-between">
                                        <h4 className='text-truncate'>Machine Averages</h4>

                                        {machineSummaryList.length !== 0 && (
                                            <CSVLink
                                                headers={[
                                                    {label: "knitting Diameter", key: "knittingDiameter"},
                                                    {label: "Number of used machines", key: "machines"},
                                                    {label: "Total Production Weight", key: "weight"},
                                                    {label: "Total Machine Average", key: "average"}
                                                ]}
                                                target="_blank"
                                                data={getMachineAverageCsvData(machineSummaryList)}
                                                className="btn btn-primary"
                                                asyncOnClick={true}
                                                onClick={() => setCurrentDateTime(getCustomDateTimeStamp)}
                                                filename={`MachineAveragesReport_${currentDateTime}.csv`}
                                            >
                                                Export CSV
                                            </CSVLink>
                                        )}
                                    </div>

                                    {storeMachineSummery.data.length !== 0 ? (
                                        <>
                                            <Table responsive borderless size="sm" className="table-outline">
                                                <thead>
                                                <tr>
                                                    <th className='text-center' style={{borderTopLeftRadius: 8}}>
                                                        <span>Knitting</span> <br/> <span>Diameter</span></th>
                                                    <th className='px-2 text-center'><span>Number of</span> <br/> <span>Used Machines</span>
                                                    </th>
                                                    <th className='text-center'><span>Total Production</span>
                                                        <br/> <span>Weight <span className="text-lowercase">(Kg)</span></span>
                                                    </th>
                                                    <th className='text-center' style={{borderTopRightRadius: 8}}>
                                                        <span>Total Machine</span> <br/> <span>Average</span></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {tableBodyItems3}
                                                </tbody>
                                            </Table>
                                            <ReactPaginate
                                                nextLabel=''
                                                breakLabel='...'
                                                previousLabel=''
                                                pageCount={storeMachineSummery.total || 1}
                                                activeClassName='active'
                                                breakClassName='page-item'
                                                pageClassName={'page-item'}
                                                breakLinkClassName='page-link'
                                                nextLinkClassName={'page-link'}
                                                pageLinkClassName={'page-link'}
                                                nextClassName={'page-item next'}
                                                previousLinkClassName={'page-link'}
                                                previousClassName={'page-item prev'}
                                                onPageChange={page => handlePagination('MACHINE_SUMMARY', page)}
                                                forcePage={storeMachineSummery.params.currentPage !== 0 ? storeMachineSummery.params.currentPage - 1 : 0}
                                                containerClassName={'pagination react-paginate justify-content-end pt-1'}
                                            />
                                        </>
                                    ) : emptyUI(isFetched3)}

                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </div>
            ) : (
                <Row className="mt-2">
                    <Col lg={6}>
                        <Col>
                            <SummeryBarChart
                                primaryBar={'#FFEF5F'}
                                secondaryBar={'#FFA115'}
                                labelColor={'#6e6b7b'}
                                dataList={productionGraphData}
                                gridLineColor={'rgba(200, 200, 200, 0.2)'}
                                picker={picker}
                                onClose={(selectedDates, dateStr, instance) => {
                                    if (selectedDates.length === 1) {
                                        instance.setDate([picker[0], picker[1]], true)
                                    }
                                }}
                                onChangeDate={date => {
                                    if (date.length === 2) {
                                        setPicker(date)
                                        dispatch(toggleLoading())
                                        getSummeryDate(date, selectStyleId, {
                                            page: 0,
                                            currentPage: 0
                                        })
                                        getSummeryDateForGraph(date, selectedStyle)
                                    }
                                }}
                                fetched={isFetched4}
                            />
                        </Col>
                        <Col>
                            <MachineAvgChart
                                primaryBar={'#666EE8'}
                                secondaryBar={'#EA5455'}
                                labelColor={'#6e6b7b'}
                                gridLineColor={'rgba(200, 200, 200, 0.2)'}
                                dataList={machineSummaryList}
                                fetched={isFetched5}
                            />
                        </Col>
                    </Col>


                    <Col lg={6}>
                        <IntervalSummeryChart
                            primaryBar={'#28dac6'}
                            secondaryBar={'#CB4335'}
                            labelColor={'#6e6b7b'}
                            gridLineColor={'rgba(200, 200, 200, 0.2)'}
                            activeView={activeSubView}
                            onDailyClick={async () => {
                                await setActiveSubView('DAILY')
                                dispatch(toggleLoading())
                                getIntervalSummeryList(selectedStyle, 'DAILY', {
                                    page: 0,
                                    currentPage: 0
                                }, intervalPicker)
                                getIntervalSummaryForGraph(selectedStyle, 'DAILY', intervalPicker)
                            }}
                            onMonthlyClick={async () => {
                                await setActiveSubView('MONTHLY')
                                dispatch(toggleLoading())
                                getIntervalSummeryList(selectedStyle, 'MONTHLY', {
                                    page: 0,
                                    currentPage: 0
                                }, intervalPicker)
                                getIntervalSummaryForGraph(selectedStyle, 'MONTHLY', intervalPicker)
                            }}
                            onYearlyClick={async () => {
                                await setActiveSubView('YEARLY')
                                dispatch(toggleLoading())
                                getIntervalSummeryList(selectedStyle, 'YEARLY', {
                                    page: 0,
                                    currentPage: 0
                                }, intervalPicker)
                                getIntervalSummaryForGraph(selectedStyle, 'YEARLY', intervalPicker)
                            }}
                            dataList={intervalSummaryList}
                            picker={intervalPicker}
                            onCloseClick={() => {
                                dispatch(toggleLoading())
                                setIntervalPicker([])
                                getIntervalSummeryList(selectedStyle, activeSubView, {
                                    page: 0,
                                    currentPage: 0
                                }, [])
                                getIntervalSummaryForGraph(selectedStyle, activeSubView, [])
                            }}
                            onClosePicker={(selectedDates, dateStr, instance) => {
                                if (selectedDates.length === 1) {
                                    instance.setDate([intervalPicker[0], intervalPicker[1]], true)
                                }
                            }}
                            onChangeDateRange={date => {
                                if (date.length === 2) {
                                    setIntervalPicker(date)
                                    dispatch(toggleLoading())
                                    getIntervalSummeryList(selectStyleId, activeSubView, {
                                        page: 0,
                                        currentPage: 0
                                    }, date)
                                    getIntervalSummaryForGraph(selectStyleId, activeSubView, date)
                                }
                            }}
                            fetched={isFetched6}
                        />
                    </Col>
                </Row>
            )}


        </div>
    )
}

export default ProductionAnalysis
