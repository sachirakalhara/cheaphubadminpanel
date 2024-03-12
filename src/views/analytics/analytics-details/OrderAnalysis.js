import React, {useEffect, useState} from "react"
import {Button, Card, CardBody, Col, Input, Label, Row, Table} from "reactstrap"
import ReactPaginate from "react-paginate"
import * as ProductionRejectionServices from '../../../services/productionRejection-resources'
// eslint-disable-next-line no-unused-vars
import {customToastMsg, emptyUI, getCustomDateTimeStamp, roundNumber, searchValidation} from "../../../utility/Utils"
import {Sliders, X} from "react-feather"
import {useDispatch} from "react-redux"
import {toggleLoading} from '@store/loading'
import {CSVLink} from "react-csv"

let prev = 0

const OrderAnalysis = () => {

    const dispatch = useDispatch()
    const [store, setStore] = useState({
        allData: [],
        data: [],
        params: {
            page: 0,
            currentPage: 0
        },
        total: 0
    })
    const [poNumber, setPoNumber] = useState('')
    const [styleNumber, setStyleNumber] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const [csvDataList, setCsvDataList] = useState([])
    const [currentDateTime, setCurrentDateTime] = useState('')

    const getOrderAnalysis = async (params) => {
        dispatch(toggleLoading())
        await ProductionRejectionServices.getOrderSummary(params.page)
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

    const getAllCsvData = async () => {
        await ProductionRejectionServices.getOrderSummaryForCsv()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map(item => {
                        list.push({
                            poNumber:item.poNumber,
                            styleNumber:item.styleNumber,
                            productionWeight:roundNumber(item.productionWeight),
                            rejectionWeight:roundNumber(item.rejectionWeight),
                            rejectionPercentage:item.rejectionPercentage
                        })
                    })
                    setCsvDataList(list)
                }
            })
    }

    const searchOrderAnalysis = async (params) => {
        const body = {
            poNumber: searchValidation(params.poNumber),
            styleNumber: searchValidation(params.styleNumber)
        }
        await ProductionRejectionServices.searchOrderAnalysis(body, params.page)
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
            poNumber: searchValidation(params.poNumber),
            styleNumber: searchValidation(params.styleNumber)
        }
        await ProductionRejectionServices.searchOrderAnalysisForCsv(body)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map(item => {
                        list.push({
                            poNumber:item.poNumber,
                            styleNumber:item.styleNumber,
                            productionWeight:roundNumber(item.productionWeight),
                            rejectionWeight:roundNumber(item.rejectionWeight),
                            rejectionPercentage:item.rejectionPercentage
                        })
                    })
                    setCsvDataList(list)
                }
            })
    }

    useEffect(async () => {
        await getOrderAnalysis({page: 0, currentPage: 0})
        await getAllCsvData()
    }, [])

    const tableBodyItems = store.data.map((item, i) => (
        <tr key={i} style={{fontSize: 12}}>
            <td className='py-1'>
                <p className='card-text fw-bold mb-25 text-center'>{item.poNumber}</p>
            </td>
            <td className='py-1'>
                <p className='card-text fw-bold mb-25 text-center'>{item.styleNumber}</p>
            </td>
            <td className='py-1'>
                <p className='card-text fw-bold mb-25 text-center'>{roundNumber(item.productionWeight)}</p>
            </td>
            <td className='py-1'>
                <p className='card-text fw-bold mb-25 text-center'>{roundNumber(item.rejectionWeight)}</p>
            </td>
            {/*<td className='py-1'>*/}
            {/*    <p className='card-text fw-bold mb-25 text-center'>{item.totalConsumption}</p>*/}
            {/*</td>*/}
            <td className='py-1'>
                <p className='card-text fw-bold mb-25 text-center'>{item.rejectionPercentage}</p>
            </td>
        </tr>
    ))

    const handlePagination = async page => {
        if (styleNumber.length === 0 && poNumber.length === 0) {
            await getOrderAnalysis({page: page.selected, currentPage: page.selected + 1})
        } else {
            await searchOrderAnalysis({
                page: page.selected,
                currentPage: page.selected + 1,
                poNumber,
                styleNumber
            })
            await getAllSearchedCsvData({
                poNumber,
                styleNumber
            })
        }

    }

    const onSearch = async (value, type) => {
        let id = poNumber
        let style = styleNumber
        switch (type) {
            case 'PO_NUMBER':
                setPoNumber(value)
                id = value
                break
            case 'STYLE':
                setStyleNumber(value)
                style = value
                break
            default:
                break
        }

        prev = new Date().getTime()
        setTimeout(async () => {
            const now = new Date().getTime()
            if (now - prev >= 1000) {
                if (id.length === 0 && style.length === 0) {
                    await getOrderAnalysis({page: 0, currentPage: 0})
                    await getAllCsvData()
                } else {
                    dispatch(toggleLoading())
                    await searchOrderAnalysis({
                        page: 0,
                        currentPage: 0,
                        poNumber: id,
                        styleNumber: style
                    })
                    await getAllSearchedCsvData({
                        poNumber: id,
                        styleNumber: style
                    })
                }
            }
        }, 1000)
    }

    return (
        <div className='invoice-list-table-header w-100 py-1' style={{whiteSpace: 'nowrap'}}>
            <Row>
                <Col lg='12' className='d-flex align-items-center mb-1 justify-content-between w-100'>
                    <div className="d-flex align-items-center">
                        <Col className='d-flex align-items-center'>
                            <div className='d-flex align-items-center'>
                                <Label className='form-label' for='poNumber'>
                                    PO Number
                                </Label>
                                <div className='inputWithButton'>
                                    <Input
                                        id='poNumber'
                                        className='ms-50 me-2 w-100'
                                        type='text'
                                        value={poNumber}
                                        onChange={async e => {
                                            await onSearch(e.target.value, 'PO_NUMBER')
                                        }}
                                        placeholder='Search PO Number'
                                        autoComplete="off"
                                    />
                                    {poNumber.length !== 0 && (
                                        <X size={18}
                                           className='cursor-pointer close-btn'
                                           onClick={async () => await onSearch('', 'PO_NUMBER')}
                                        />
                                    )}
                                </div>
                            </div>

                        </Col>
                        <Col className='d-flex align-items-center ms-1'>
                            <div className='d-flex align-items-center'>
                                <Label className='form-label' for='styleNumber'>
                                    Style Number
                                </Label>
                                <div className='inputWithButton'>
                                    <Input
                                        id='styleNumber'
                                        className='ms-50 me-2 w-100'
                                        type='text'
                                        value={styleNumber}
                                        onChange={async e => {
                                            await onSearch(e.target.value, 'STYLE')
                                        }}
                                        placeholder='Search Style Number'
                                        autoComplete="off"
                                    />
                                    {styleNumber.length !== 0 && (
                                        <X size={18}
                                           className='cursor-pointer close-btn'
                                           onClick={async () => await onSearch('', 'STYLE')}
                                        />
                                    )}
                                </div>
                            </div>

                        </Col>
                    </div>
                    {csvDataList.length !== 0 && (
                        <CSVLink
                            headers={[
                                {label: "PO Number", key: "poNumber"},
                                {label: "Style Number", key: "styleNumber"},
                                {label: "Total Production Weight (kg)", key: "productionWeight"},
                                {label: "Total Rejection Weight", key: "rejectionWeight"},
                                {label: "Rejection Percentage", key: "rejectionPercentage"}
                            ]}
                            target="_blank"
                            data={csvDataList}
                            className="btn btn-primary"
                            asyncOnClick={true}
                            onClick={() => {
                                setCurrentDateTime(getCustomDateTimeStamp)
                            }}
                            filename={`OrderAnalysisReport_${currentDateTime}.csv`}
                        >
                            Export CSV
                        </CSVLink>
                    )}
                </Col>

            </Row>

            <Card className="mt-2">
                {store.data?.length !== 0 ? (
                    <>
                        <div className='invoice-list-dataTable react-dataTable'>
                            <Table responsive size="sm" className="invoice-list-dataTable react-dataTable">
                                <thead>
                                <tr>
                                    <th className='text-center' style={{borderTopLeftRadius: 8}}>PO Number</th>
                                    <th className='text-center'>Style Number</th>
                                    <th className='px-2 text-center'><span>Total Production</span> <br/>
                                        <span>Weight <span className="text-lowercase">(Kg)</span></span></th>
                                    <th className='px-2 text-center'><span>Total Rejection</span> <br/>
                                        <span>Weight <span className="text-lowercase">(Kg)</span></span>
                                    </th>
                                    {/*<th className='px-2 text-center'><span>Total</span> <br/> <span>Consumption</span></th>*/}
                                    <th className='text-center' style={{borderTopRightRadius: 8}}><span>Rejection</span>
                                        <br/>
                                        <span>Percentage</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                {tableBodyItems}
                                </tbody>
                            </Table>
                        </div>
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
                            forcePage={store.params.currentPage !== 0 ? store.params.currentPage - 1 : 0}
                            containerClassName={'pagination react-paginate justify-content-end p-1'}
                        />
                    </>
                ) : emptyUI(isFetched)}

            </Card>
            {/*    </CardBody>*/}
            {/*</Card>*/}
        </div>
    )
}

export default OrderAnalysis
