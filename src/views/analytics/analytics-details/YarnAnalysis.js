// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react"
import {Card, CardBody, Col, Row, Table, Button} from "reactstrap"
import * as OrderServices from '../../../services/order-resources'
import ReactPaginate from "react-paginate"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import * as stylesService from "../../../services/style-resources"
import * as productionRejectionServices from "../../../services/productionRejection-resources"
import {customToastMsg, emptyUI, getCustomDateTimeStamp, isEmpty, roundNumber} from "../../../utility/Utils"
import {CSVLink} from "react-csv"

let data2 = null
const YarnAnalysis = () => {

    const [ordersList, setOrdersList] = useState([])
    const [selectedOrder, setSelectedOrder] = useState('')
    const [styleList, setStyleList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [selectedStyle, setSelectedStyle] = useState('')
    const [productionWeight, setProductionWeight] = useState(null)
    const [rejectionWeight, setRejectionWeight] = useState(null)
    const [rejectionPercentage, setRejectionPercentage] = useState(null)
    const [totalConsumption, setTotalConsumption] = useState(null)
    // eslint-disable-next-line no-unused-vars
    const [selectedPONum, setSelectedPONum] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const [currentDateTime, setCurrentDateTime] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [csvDataList, setCsvDataList] = useState([])

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


    function actualWeightCalculation(totalConsumption, ratio) {
        return roundNumber(totalConsumption * ratio)
    }

    const getYarnAnalysisList = async (params, orderId, styleId) => {
        await productionRejectionServices.getYarnAnalysisList(params.page, orderId, styleId)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                }
                setIsFetched(true)
            })
    }

    // eslint-disable-next-line no-unused-vars
    const getCsvDataList = async (order, style) => {
        const list = []
        await productionRejectionServices.getYarnAnalysisListForCsv(order, style)
            .then(async res => {
                if (res.success) {
                    res.data.content.map(item => {
                        list.push({
                            supplier: item.supplier,
                            article: item.article,
                            twist: item.twist,
                            actualWeight: !isEmpty(data2) ? actualWeightCalculation(Number(data2), Number(item.ratio)) : "",
                            estimatedWeight: !isEmpty(item.estimatedWeight) ? roundNumber(item.estimatedWeight) : ""
                        })
                    })
                    await setCsvDataList(list)
                }
            })
    }

    const getYarnAnalysisDetails = async (poNumber, styleId) => {

        const body = {
            poNumber,
            styleId
        }

        let value = null

        await productionRejectionServices.getYarnAnalysisDetails(body)
            .then(res => {
                if (res.success) {
                    setProductionWeight(res.data.productionWeight)
                    setRejectionWeight(res.data.rejectionWeight)
                    setRejectionPercentage(res.data.rejectionPercentage)
                    setTotalConsumption(res.data.totalConsumption)
                    value = res.data.totalConsumption
                } else {
                    customToastMsg(res.data.title, res.status)
                }
            })
        data2 = value
    }

    const getStylesComponents = async (id, poNum) => {
        await stylesService.getStylesByOrderId(id)
            .then(async res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.styleNumber,
                            value: item.styleId
                        })
                    })
                    if (list.length !== 0) {
                        setStyleList(list)
                        if (poNum !== undefined) {
                            setSelectedStyle(list[0].value)
                            await getYarnAnalysisDetails(id, list[0].value)
                            await getYarnAnalysisList({page: 0, currentPage: 0}, id, list[0].value)
                            await getCsvDataList(id, list[0].value)
                        } else {
                            setSelectedStyle(null)
                        }
                    } else {
                        setStyleList([])
                        setSelectedStyle(null)
                    }
                }
            })
    }

    const getAllOrders = async () => {
        await OrderServices.getOrders()
            .then(async res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.poNumber,
                            value: item.id
                        })
                    })
                    if (list.length !== 0) {
                        setOrdersList(list)
                        setSelectedOrder(list[0].value)
                        setSelectedPONum(list[0].label)
                        await getStylesComponents(list[0].value, list[0].label)
                    }

                }
            })
    }

    useEffect(async () => {
        await getAllOrders()
    }, [])

    const handleStyleSelection = async (e) => {
        setSelectedStyle(e.value)
        await getYarnAnalysisDetails(selectedOrder, e.value)
        await getYarnAnalysisList({page: 0, currentPage: 0}, selectedOrder, e.value)
        await getCsvDataList(selectedOrder, e.value)
    }

    const handleOrderSelection = async (e) => {
        setSelectedOrder(e.value)
        setSelectedPONum(e.label)
        setProductionWeight('')
        setRejectionWeight('')
        setRejectionPercentage('')
        setTotalConsumption('')
        const params = {page: 0, currentPage: 0}
        setStore({allData: [], data: [], params, total: 0})
        setCsvDataList([])
        await getStylesComponents(e.value, e.label)
    }

    const tableBodyItems = store.data.map((item, i) => (
        <tr key={i} style={{fontSize: 12}}>
            <td>
                <p className='text-center'>{item.supplier}</p>
            </td>
            <td>
                <p className='text-center'>{item.article}</p>
            </td>
            <td>
                <p className='text-center'>{!isEmpty(item.twist) ? item.twist : ""}</p>
            </td>
            <td>
                <p className='text-center'>{!isEmpty(totalConsumption) ? actualWeightCalculation(Number(totalConsumption), Number(item.ratio)) : ""}</p>
            </td>
            <td>
                <p className='text-center'>{!isEmpty(item.estimatedWeight) ? roundNumber(item.estimatedWeight) : ""}</p>
            </td>
        </tr>
    ))

    const handlePagination = async (page) => {
        await getYarnAnalysisList({page: page.selected, currentPage: page.selected + 1}, selectedOrder, selectedStyle)
    }

    const customStyles = {
        container: provided => ({
            ...provided,
            width: 180
            // minWidth: "100%"
        })
    }

    return (
        <div className='invoice-list-table-header w-100 py-2' style={{whiteSpace: 'nowrap'}}>
            <Row>
                <Col lg='12' className='d-flex align-items-center mb-1'>
                    <div className='d-flex w-100 justify-content-between align-items-center'>
                        <div className="d-flex w-100 align-items-center">
                            <div className="d-flex align-items-center">
                                <label htmlFor='rows-per-page'>Order To Analyse</label>
                                <Select
                                    className='react-select ms-1'
                                    classNamePrefix='select'
                                    placeholder='PO Number'
                                    options={ordersList}
                                    theme={selectThemeColors}
                                    value={ordersList.find((c) => c.value === selectedOrder)}
                                    onChange={handleOrderSelection}
                                    styles={customStyles}
                                />
                            </div>
                            <div className="d-flex align-items-center ms-2">
                                <label htmlFor='rows-per-page'>Style</label>
                                <Select
                                    className='react-select ms-1'
                                    classNamePrefix='select'
                                    placeholder='Style'
                                    options={styleList}
                                    theme={selectThemeColors}
                                    value={selectedStyle !== null ? styleList.find((c) => c.value === selectedStyle) : selectedStyle}
                                    onChange={handleStyleSelection}
                                    styles={customStyles}
                                />
                            </div>
                        </div>

                        {csvDataList.length !== 0 && (
                            <CSVLink
                                headers={[
                                    {label: "Supplier", key: "supplier"},
                                    {label: "Article", key: "article"},
                                    {label: "Twist", key: "twist"},
                                    {label: "Actual Weight", key: "actualWeight"},
                                    {label: "Estimated Weight", key: "estimatedWeight"}
                                ]}
                                target="_blank"
                                data={csvDataList}
                                className="btn btn-primary"
                                asyncOnClick={true}
                                onClick={() => {
                                    setCurrentDateTime(getCustomDateTimeStamp)
                                }}
                                filename={`YarnAnalysisReport_${currentDateTime}.csv`}
                            >
                                Export CSV
                            </CSVLink>
                        )}

                    </div>
                </Col>
                <Col lg='12' className='py-2'>
                    <Card className='invoice-preview-card'>
                        <CardBody className='invoice-padding'>
                            <Row className="mt-1">
                                <Col lg={4}>
                                    <div className='d-flex'>
                                        <p className='invoice-date-title'>Total Production Weight</p>
                                        <p>:</p>
                                        <p className='ms-1 fw-bold fw-bolder'>{!isEmpty(productionWeight) ? `${roundNumber(productionWeight)}Kg` : ""}</p>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className='d-flex'>
                                        <p className='invoice-date-title'>Total Rejection Weight</p>
                                        <p>:</p>
                                        <p className='ms-1 fw-bold fw-bolder'>{!isEmpty(rejectionWeight) ? `${roundNumber(rejectionWeight)}Kg` : ""}</p>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className='d-flex'>
                                        <p className='invoice-date-title'>Total Yarn Consumption</p>
                                        <p>:</p>
                                        <p className='ms-1 fw-bold fw-bolder'>{!isEmpty(totalConsumption) ? `${roundNumber(totalConsumption)}Kg` : ""}</p>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={4}>
                                    <div className='d-flex'>
                                        <p className='invoice-date-title'>Rejection Percentage</p>
                                        <p>:</p>
                                        <p className='ms-1 fw-bold fw-bolder'>{!isEmpty(rejectionPercentage) ? `${roundNumber(rejectionPercentage)}%` : ""}</p>
                                    </div>
                                </Col>
                            </Row>

                            {store.data?.length !== 0 ? (
                                <>
                                    <div className='invoice-list-dataTable react-dataTable my-2'>
                                        <Table responsive bordered size="sm"
                                               className="invoice-list-dataTable react-dataTable">
                                            <thead>
                                            <tr>
                                                <th className='text-center' rowSpan="2" colSpan="1"
                                                    style={{paddingTop: 18}}>Supplier
                                                </th>
                                                <th className='text-center' rowSpan="2" colSpan="1"
                                                    style={{paddingTop: 18}}>Article
                                                </th>
                                                <th className='text-center' rowSpan="2" colSpan="1"
                                                    style={{paddingTop: 18}}>Twist
                                                </th>
                                                <th className='text-center' colSpan="2">Weight <span
                                                    className="text-lowercase">(Kg)</span></th>
                                            </tr>
                                            <tr className="mt-2">
                                                <th className="text-center">Actual</th>
                                                <th className="text-center">Estimated</th>
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
                                        containerClassName={'pagination react-paginate justify-content-end pt-1'}
                                    />
                                </>
                            ) : emptyUI(isFetched)}

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default YarnAnalysis
