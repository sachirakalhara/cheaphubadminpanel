// eslint-disable-next-line no-unused-vars
import React, {Fragment, useEffect, useState} from "react"

import {
    Button, Card,
    CardBody, Col, Input, Label, Row,
    Table
} from "reactstrap"
import DataTable from "react-data-table-component"
import {consumption} from "../columns"
import {ChevronDown, X} from "react-feather"
import ReactPaginate from "react-paginate"
import PickerDefault from "../../forms/form-elements/datepicker/PickerDefault"
import {Link, useParams} from "react-router-dom"
// import {dataOrder} from "../../../@fake-db/apps/orders"
import * as OrderServices from "../../../services/order-resources"
import {customToastMsg, emptyUI, getCustomDateTimeStamp, roundNumber, searchValidation} from "../../../utility/Utils"
import {useDispatch} from "react-redux"
import {toggleLoading} from '@store/loading'
import {CSVLink} from "react-csv"

let prev = 0

const CustomHeader = ({styleNumber, article, onChangeStyle, onChangeArticle, onClearStyle, onClearArticle, csvList, csvAction, fileName}) => {
    return (
        <div className='invoice-list-table-header pt-2' style={{whiteSpace: 'nowrap'}}>
            <div className="d-flex align-items-center justify-content-between w-100">
                <Row>
                    <Col className='d-flex align-items-center'>
                        <Label className='form-label' for='default-picker'>
                            Style Number
                        </Label>
                        <div className='inputWithButton'>
                            <Input
                                id='styleNumber'
                                className='ms-50 me-2 w-100 '
                                type='text'
                                value={styleNumber}
                                onChange={onChangeStyle}
                                placeholder='Search Style Number'
                                autoComplete="off"
                            />
                            {styleNumber.length !== 0 && (
                                <X size={18}
                                   className='cursor-pointer close-btn'
                                   onClick={onClearStyle}
                                />
                            )}
                        </div>
                    </Col>

                    <Col className='d-flex align-items-center ms-2'>
                        <Label className='form-label' for='default-picker'>
                            Article
                        </Label>

                        <div className='inputWithButton'>
                            <Input
                                id='article'
                                className='ms-50 me-2 px-2 w-100'
                                type='text'
                                value={article}
                                onChange={onChangeArticle}
                                placeholder='Search Article'
                                autoComplete="off"
                            />
                            {article.length !== 0 && (
                                <X size={18}
                                   className='cursor-pointer close-btn'
                                   onClick={onClearArticle}
                                />
                            )}
                        </div>
                    </Col>
                </Row>

                {csvList.length !== 0 && (
                    <CSVLink
                        headers={[
                            {label: "Style Number", key: "styleNumber"},
                            {label: "Size", key: "size"},
                            {label: "Color", key: "color"},
                            {label: "Order Qty", key: "orderQty"},
                            {label: "Total Style Weight", key: "totalStyleWeight"},
                            {label: "Article Description", key: "articleDescription"},
                            {label: "Yarn Supplier", key: "yarnSupplier"},
                            {label: "Consumption Ratio", key: "consumptionRatio"},
                            {label: "Article Wise Yarn Consumption (kg)", key: "articleWiseYarnConsumption"}
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
                )}
            </div>
        </div>
    )
}

const ConsumptionList = () => {

    const dispatch = useDispatch()

    // eslint-disable-next-line no-unused-vars
    const [statusValue, setStatusValue] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [rowsPerPage, setRowsPerPage] = useState(10)
    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [sort, setSort] = useState('desc')
    // eslint-disable-next-line no-unused-vars
    const [sortColumn, setSortColumn] = useState('id')
    // eslint-disable-next-line no-unused-vars
    const [currentPage, setCurrentPage] = useState(1)
    const [styleNumber, setStyleNumber] = useState('')
    const [articleNumber, setArticleNumber] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const [currentDateTime, setCurrentDateTime] = useState('')
    const [csvData, setCsvData] = useState([])

    const [store, setStore] = useState({
        allData: [],
        data: [],
        params: {
            page: currentPage,
            perPage: rowsPerPage,
            q: value,
            status: statusValue
        },
        total: 0
    })

    const {id} = useParams()

    const getData = async (params) => {
        dispatch(toggleLoading())
        await OrderServices.getAllEstimatedConsumptions(id, params.page)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})  // please add
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
                setIsFetched(true)
            })
    }

    const getCsvData = async () => {
        await OrderServices.getOrderItems(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map((item) => {
                        list.push({
                            styleNumber: item.styleNumber,
                            size: item.garmentSize,
                            color: item.colorName,
                            orderQty: item.quantity,
                            totalStyleWeight: roundNumber(item.totalWeight),
                            articleDescription: item.articleName,
                            yarnSupplier: item.supplierName,
                            consumptionRatio: roundNumber(item.ratio),
                            articleWiseYarnConsumption: roundNumber(Number(item.articleWeightWithFallout) / 1000)
                        })
                    })
                    setCsvData(list)
                }
            })
    }

    const searchData = async (params) => {
        const body = {
            styleNo: searchValidation(params.style),
            articleName: searchValidation(params.article)
        }
        dispatch(toggleLoading())
        await OrderServices.searchEstimatedYarnRequirements(id, body, params.page)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
            })
    }

    const searchCsvData = async (params) => {
        const body = {
            styleNo: searchValidation(params.style),
            articleName: searchValidation(params.article)
        }
        await OrderServices.searchEstimatedYarnRequirementsForCsv(id, body)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map((item) => {
                        list.push({
                            styleNumber: item.styleNumber,
                            size: item.garmentSize,
                            color: item.colorName,
                            orderQty: item.quantity,
                            totalStyleWeight: roundNumber(item.totalWeight),
                            articleDescription: item.articleName,
                            yarnSupplier: item.supplierName,
                            consumptionRatio: roundNumber(item.ratio),
                            articleWiseYarnConsumption: roundNumber(Number(item.articleWeightWithFallout) / 1000)
                        })
                    })
                    setCsvData(list)
                }
            })
    }


    useEffect(async () => {
        await getData({
            sort,
            q: value,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage,
            status: statusValue
        })
        await getCsvData()
    }, [])

    const dataToRender = () => {
        const filters = {
            q: value,
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

    const handlePagination = async page => {
        if (styleNumber.length === 0 && articleNumber.length === 0) {
            await getData({
                sort,
                q: value,
                sortColumn,
                status: statusValue,
                perPage: rowsPerPage,
                page: page.selected
            })
        } else {
            await searchData({
                sort,
                q: value,
                sortColumn,
                status: statusValue,
                perPage: rowsPerPage,
                page: page.selected,
                style: styleNumber,
                article: articleNumber
            })
        }

        setCurrentPage(page.selected)
    }

    const CustomPagination = () => {
        // const count = Number((store.total / rowsPerPage).toFixed(0))

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
                forcePage={currentPage !== 0 ? currentPage : 0}
                containerClassName={'pagination react-paginate justify-content-end p-1'}
            />
        )
    }

    const handleFilter = async val => {
        setValue(val)
        await getData({
            sort,
            q: val,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage,
            status: statusValue
        })
    }

    const handlePerPage = async e => {
        await getData({
            sort,
            q: value,
            sortColumn,
            page: currentPage,
            status: statusValue,
            perPage: parseInt(e.target.value)
        })
        setRowsPerPage(parseInt(e.target.value))
    }

    const handleStatusValue = async e => {
        setStatusValue(e.target.value)
        await getData({
            sort,
            q: value,
            sortColumn,
            page: currentPage,
            perPage: rowsPerPage,
            status: e.target.value
        })
    }

    const onSearch = (val, type) => {

        setCurrentPage(0)
        let style = styleNumber
        let article = articleNumber

        switch (type) {
            case 'STYLE':
                setStyleNumber(val)
                style = val
                break
            case 'ARTICLE':
                setArticleNumber(val)
                article = val
                break
            default:
                break
        }

        prev = new Date().getTime()

        setTimeout(async () => {
            const now = new Date().getTime()
            if (now - prev >= 1000) {
                if (style.length === 0 && article.length === 0) {
                    await getData({
                        sort,
                        q: value,
                        sortColumn,
                        page: 0,
                        perPage: 0,
                        status: statusValue
                    })
                    await getCsvData()
                } else {
                    await searchData({
                        sort,
                        q: value,
                        sortColumn,
                        page: 0,
                        perPage: 0,
                        status: statusValue,
                        style,
                        article
                    })
                    await searchCsvData({
                        style,
                        article
                    })
                }
            }

        }, 1000)

    }

    return (
        <div className='invoice-list-wrapper'>
            <Card>
                <CustomHeader
                    value={value}
                    statusValue={statusValue}
                    rowsPerPage={rowsPerPage}
                    handleFilter={handleFilter}
                    handlePerPage={handlePerPage}
                    handleStatusValue={handleStatusValue}
                    styleNumber={styleNumber}
                    article={articleNumber}
                    onChangeStyle={(e) => onSearch(e.target.value, 'STYLE')}
                    onChangeArticle={(e) => onSearch(e.target.value, 'ARTICLE')}
                    onClearStyle={() => onSearch("", 'STYLE')}
                    onClearArticle={() => onSearch("", 'ARTICLE')}
                    csvList={csvData}
                    csvAction={() => setCurrentDateTime(getCustomDateTimeStamp)}
                    fileName={`Estimated_Consumption_Report_${currentDateTime}.csv`}
                />
                <div className='invoice-list-dataTable react-dataTable'>
                    <DataTable
                        grow={3}
                        noHeader
                        pagination
                        sortServer
                        paginationServer
                        subHeader={true}
                        columns={consumption}
                        responsive={true}
                        wrap={true}
                        omit={true}
                        // onSort={handleSort}
                        data={dataToRender()}
                        sortIcon={<ChevronDown/>}
                        className='react-dataTable'
                        defaultSortField='invoiceId'
                        paginationDefaultPage={currentPage}
                        paginationComponent={CustomPagination}
                        noDataComponent={emptyUI(isFetched)}
                    />
                </div>
            </Card>
        </div>

    )
}

export default ConsumptionList
