// eslint-disable-next-line no-unused-vars
import React, {Fragment, useEffect, useState} from "react"

import {
    Button, Card,
    CardBody, Col, Input, Label, Row,
    Table
} from "reactstrap"
import DataTable from "react-data-table-component"
import {yarnRequirement} from "../columns"
import {ChevronDown} from "react-feather"
import ReactPaginate from "react-paginate"
import PickerDefault from "../../forms/form-elements/datepicker/PickerDefault"
import {Link, useParams} from "react-router-dom"
// import {dataOrder} from "../../../@fake-db/apps/orders"
import * as OrderServices from "../../../services/order-resources"
import {customToastMsg, emptyUI, getCustomDateTimeStamp, roundNumber} from "../../../utility/Utils"
import {CSVLink} from "react-csv"


const CustomHeader = ({
                          // eslint-disable-next-line no-unused-vars
                          handleFilter,
                          value
                          // handleStatusValue,
                          // statusValue
                      }) => {
    return (
        <div className='invoice-list-table-header w-100 py-2' style={{whiteSpace: 'nowrap'}}>
            <Row>
                <Col lg='5' className='d-flex align-items-center px-0 px-lg-1'>
                    <div className='d-flex align-items-center'>
                        {/*<label htmlFor='search-invoice'>PO Number</label>*/}
                        <Label className='form-label' for='default-picker'>
                            Style Number
                        </Label>
                        <Input
                            id='PONumber'
                            className='ms-50 me-2 w-100'
                            type='text'
                            value={value}
                            // onChange={e => handleFilter(e.target.value)}
                            onChange={e => console.log(e)}
                            placeholder='Search Style Number'
                        />
                    </div>

                </Col>

                <Col
                    lg='7'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0'
                >
                    <div className='d-flex w-100 align-items-center'>
                        <Label className='form-label' for='default-picker'>
                            Article Description
                        </Label>
                        <Input
                            id='search-invoice'
                            className='ms-50 me-2 w-100'
                            type='text'
                            value={value}
                            // onChange={e => handleFilter(e.target.value)}
                            onChange={e => console.log(e)}
                            placeholder='Search Article Description'
                        />
                    </div>
                    <Button tag={Link} to='/apps/invoice/add'>
                        Filter
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

const YarnRequirement = () => {

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
        await OrderServices.getAllEstimatedYarnRequirements(id, params.page)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data.content, data: res.data.content, params, total: res.data.totalPages})  // please add
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                setIsFetched(true)
            })
    }

    const getCsvData = async () => {
        await OrderServices.getAllEstimatedYarnRequirementsForCsv(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map((item) => {
                        list.push({
                            supplier: item.supplierName,
                            yarnArticle: item.articleName,
                            yarnTwist: item.twist,
                            fallout: roundNumber(Number(item.articleWeightWithFallout) / 1000)
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
        await getData({
            sort,
            q: value,
            sortColumn,
            status: statusValue,
            perPage: rowsPerPage,
            page: page.selected
        })
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

    return (
        <div className='invoice-list-wrapper'>
            <Card>
                {csvData.length !== 0 && (
                    <div className="d-flex align-items-center justify-content-end w-100 pt-0 pb-0 m-0">
                        <CSVLink
                            headers={[
                                {label: "Supplier", key: "supplier"},
                                {label: "Yarn Article", key: "yarnArticle"},
                                {label: "Yarn Twist", key: "yarnTwist"},
                                {label: "Weight With Fallout (kg)", key: "fallout"}
                            ]}
                            target="_blank"
                            data={csvData}
                            className="btn btn-primary"
                            asyncOnClick={true}
                            onClick={() => setCurrentDateTime(getCustomDateTimeStamp)}
                            filename={`Total_Yarn_Requirement_Report_${currentDateTime}.csv`}
                        >
                            Export CSV
                        </CSVLink>
                    </div>
                )}

                <div className='invoice-list-dataTable react-dataTable'>
                    <DataTable
                        grow={3}
                        noHeader
                        pagination
                        sortServer
                        paginationServer
                        subHeader={true}
                        columns={yarnRequirement}
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

export default YarnRequirement
