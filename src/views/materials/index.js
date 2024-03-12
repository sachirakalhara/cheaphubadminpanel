import React, {Fragment, useEffect, useState} from "react"
import {Button, Card, Col, Input, Label, Row} from "reactstrap"
import Flatpickr from "react-flatpickr"
import DataTable from "react-data-table-component"
import {ChevronDown, Edit3} from "react-feather"
import ReactPaginate from "react-paginate"
import * as MaterialResources from '../../services/material-requirement-resources'
// eslint-disable-next-line no-unused-vars
import {customToastMsg, emptyUI, getCustomDateTimeStamp, roundNumber} from "../../utility/Utils"
import {useDispatch} from "react-redux"
import {toggleLoading} from '@store/loading'
import {CSVLink} from "react-csv"

const moment = require('moment')

// eslint-disable-next-line no-unused-vars
const CustomHeader = ({picker, onChange, onClose, csvList, csvAction, fileName}) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo mb-2'>Material Requirements Planing</h3>
                <Row>
                    <Col lg='6'
                         className='d-flex align-items-center px-0 px-lg-1 justify-content-between w-100 align-items-center'>
                        <div className='d-flex align-items-center w-100'>
                            <Label className='form-label' for='default-picker'>
                                Requirements for upcoming due orders
                            </Label>
                            <Flatpickr
                                // value={picker}
                                id='range-picker'
                                className='form-control ms-1'
                                onChange={onChange}
                                style={{width: 210}}
                                options={{
                                    mode: 'range',
                                    showMonths: 2,
                                    defaultDate: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1))]
                                }}
                                onClose={onClose}
                            />
                        </div>
                        {csvList.length !== 0 && (
                            <CSVLink
                                headers={[
                                    {label: "Supplier", key: "supplier"},
                                    {label: "Article", key: "article"},
                                    {label: "Twist", key: "twist"},
                                    {label: "Weight (kg)", key: "weight"}
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

                    </Col>
                </Row>
            </div>
        </Card>
    )
}

const columns = [
    {
        name: 'Supplier',
        width: '30%',
        center: true,
        cell: row => row.supplierName
    },
    {
        name: 'Article',
        width: '30%',
        center: true,
        cell: row => row.articleName
    },
    {
        width: '20%',
        name: 'Twist',
        center: true,
        cell: row => row.twist
    },
    {
        width: '20%',
        name: <span>Weight <span className="text-lowercase">(Kg)</span></span>,
        center: true,
        cell: row => roundNumber(Number(row.articleWeightWithFallout) / 1000)
    }
]

const MaterialsRequirements = () => {
    const dispatch = useDispatch()
    // eslint-disable-next-line no-unused-vars
    const [val, setVal] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [currentPage, setCurrentPage] = useState(0)
    // eslint-disable-next-line no-unused-vars
    const [statusValue, setStatusValue] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [picker, setPicker] = useState([])
    const [currentDateTime, setCurrentDateTime] = useState('')

    const [store, setStore] = useState({
        allData: [],
        data: [],
        params: {
            page: 0,
            currentPage: 0
        },
        total: 0
    })
    const [csvData, setCsvData] = useState([])
    const [isFetched, setIsFetched] = useState(false)

    const getData = async (dateRange, params) => {
        dispatch(toggleLoading())
        await MaterialResources.getAllMachines(params.page, moment(dateRange[0]).format('YYYY-MM-DD'), moment(dateRange[1]).format('YYYY-MM-DD'))
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

    const getCsvData = async (dateRange) => {
        await MaterialResources.getAllMaterialsForCsv(moment(dateRange[0]).format('YYYY-MM-DD'), moment(dateRange[1]).format('YYYY-MM-DD'))
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map(item => {
                        list.push({
                            supplier: item.supplierName,
                            article: item.articleName,
                            twist: item.twist,
                            weight: roundNumber(Number(item.articleWeightWithFallout) / 1000).toString()
                        })
                    })
                    console.log(list)
                    setCsvData(list)
                }
            })
    }

    useEffect(async () => {
        const today = new Date()
        const monthLater = new Date(today.setMonth(today.getMonth() + 1))
        const dateRange = [new Date(), monthLater]

        setPicker(dateRange)

        await getData(dateRange, {page: 0, currentPage: 0})
        await getCsvData(dateRange)
    }, [])

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

    const customStyles = {
        subHeader: {
            style: {
                display: 'none'
            }
        }
    }

    const handlePagination = async (page) => {
        await getData(picker, {page: page.selected, currentPage: page.selected + 1})
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
                forcePage={store.params.currentPage !== 0 ? store.params.currentPage - 1 : 0}
                containerClassName={'pagination react-paginate justify-content-end p-1'}
            />
        )
    }
    const handleSort = () => {

    }

    return (
        <Fragment>
            <div>
                <CustomHeader
                    picker={picker}
                    onChange={async (date) => {
                        if (date.length === 2) {
                            setPicker(date)
                            await getData(date, {page: 0, currentPage: 0})
                            await getCsvData(date)
                        }
                    }}
                    onClose={(selectedDates, dateStr, instance) => {
                        if (selectedDates.length === 1) {
                            instance.setDate([picker[0], picker[1]], true)
                        }
                    }}
                    csvList={csvData}
                    csvAction={() => setCurrentDateTime(getCustomDateTimeStamp)}
                    fileName={`MaterialRequirementReport_${currentDateTime}.csv`}
                />
                <Card className="mt-2">
                    <h4 className='text-primary invoice-logo m-2'>Yarn Requirement</h4>
                    <div className='invoice-list-dataTable react-dataTable'>
                        <DataTable
                            noHeader={false}
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
        </Fragment>
    )
}

export default MaterialsRequirements
