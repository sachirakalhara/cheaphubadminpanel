import React, {Fragment, useEffect, useState} from "react";
import {Badge, Button, Card, Col, Input, Label, Row} from "reactstrap";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {ArrowRight, ChevronDown, Plus, X} from "react-feather";
import {customStyles, customToastMsg, emptyUI, getCustomDateTimeStamp} from "../../utility/Utils";
import {Link} from "react-router-dom";
import Flatpickr from "react-flatpickr";
import * as OrderResourcesServices from "../../services/order-resources";
import {filterOrderList} from "../../services/order-resources";
import {formDataDateConverter} from "../../utility/commonFun";
import Modal from "../../@core/components/modal";


const CustomHeader = ({
                          onSearchQueryChange,
                          searchQuery,
                          onClearQuery,
                          productCategory,
                          selectProductCategory,
                          onChangeDateRange,
                          onCloseDateRange,
                          statusValue,
                          selectStatusValue,
                          picker,
                          onClearPicker
                      }) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo mb-2'>Orders</h3>
                <Row>
                    <Col lg='4' className='d-flex align-items-center'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label' for='default-picker'>
                                Name
                            </Label>
                            <div className='inputWithButton'>
                                <Input
                                    id='name'
                                    className='ms-50 w-100'
                                    type='text'
                                    value={searchQuery}
                                    onChange={onSearchQueryChange}
                                    placeholder='Search Order Number'
                                    autoComplete="off"
                                />
                                {searchQuery.length !== 0 && (
                                    <X size={18}
                                       className='cursor-pointer close-btn'
                                       onClick={onClearPicker}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col lg='3' className='d-flex align-items-center'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label me-2' for='default-picker'>
                                Product Type
                            </Label>
                            <Input
                                type='select'
                                id='rows-per-page'
                                value={productCategory}
                                onChange={selectProductCategory}
                            >
                                <option value='all'>All</option>
                                <option value='bulk'>Bulk Product</option>
                                <option value='contribution'>Subscription Products</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg='3' className='d-flex align-items-center'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label ms-3 me-2' for='default-picker'>
                                Payment Status
                            </Label>
                            <Input
                                type='select'
                                id='rows-per-page'
                                value={statusValue}
                                onChange={selectStatusValue}
                            >
                                <option value='all'>All</option>
                                <option value='pending'>Pending</option>
                                <option value='failed'>Failed</option>
                                <option value='paid'>Paid</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg='10' className='d-flex align-items-center mt-2'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label me-2' for='default-picker'>
                                Transaction Range
                            </Label>
                            <div className='inputWithButton'>
                                <Flatpickr
                                    id='range-picker'
                                    className='form-control'
                                    onChange={onChangeDateRange}
                                    style={{width: 300}}
                                    options={{
                                        mode: 'range',
                                        showMonths: 2
                                    }}
                                    onClose={onCloseDateRange}
                                />

                                {picker.length !== 0 && (
                                    <X size={18}
                                       className='cursor-pointer close-btn me-1'
                                       onClick={onClearQuery}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>

    )
}

const OrdersScreen = () => {
    const [store, setStore] = useState({
        data: [],
        total: 0
    });

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFetched, setIsFetched] = useState(false);
    const [val, setVal] = useState('')

    const [statusValue, setStatusValue] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [productCategory, setProductCategory] = useState('all');
    const [picker, setPicker] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        getAllOrders(productCategory, statusValue, searchQuery);
    }, []);


    const getAllOrders = async (type, status, searchKey, startDate = null, endDate = null) => {
        const body = {
            "all": 0,
            "type": type,
            "order_id": searchKey,
            "payment_status": status === "all" ? null : status,
            "transaction_id": null,
            "from_date": formDataDateConverter(startDate) === "N/A" ? null : formDataDateConverter(startDate),
            "to_date": formDataDateConverter(endDate) === "N/A" ? null : formDataDateConverter(endDate),
        }
        OrderResourcesServices.filterOrderList(body)
            .then(response => {
                console.log(response)
                if (response.success) {
                    setStore({
                        data: response.data.order_list,
                        total: response.data.meta.last_page
                    })
                } else {
                    customToastMsg(response.message, response.status)
                }
            })


    }

    const columns = [
        {name: 'Order Number', selector: row => row.order_id},
        {name: 'Amount', selector: row => row.amount},
        {
            name: 'Status',
            selector: row => <Badge
                color={row.payment_status === 'paid' ? 'success' : row.payment_status === 'pending' ? 'warning' : 'danger'}>{row.payment_status}</Badge>
        },
        {name: 'Date', selector: row => formDataDateConverter(row.created_at)},
        // {
        //     name: 'Action',
        //     cell: row => (
        //         <button className="btn btn-primary btn-sm" onClick={() => handleView(row)}>
        //             View
        //         </button>
        //     )
        // }

        {
            name: "",
            minWidth: "100px",
            cell: row => (
                <Link to={{pathname: `order/${row.order_id}`, state: row}} state={row}>
                    <ArrowRight size={18} className="cursor-pointer"/>
                </Link>

            )
        }
    ];

    const handleView = (row) => {
        setSelectedRow(row);
        setModalOpen(true);
    };

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
            return store.data.slice(0, rowsPerPage)
        }
    }


    const handlePagination = page => {
        setCurrentPage(page.selected);
        // getCustomers();
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        const [startDate, endDate] = picker.length === 2 ? picker : [null, null];
        getAllOrders(productCategory, statusValue, value, startDate, endDate);
    };


    return (
        <Fragment>
            <Card className='mt-2'>
                <CustomHeader
                    value={val}
                    onClearQuery={() => handleSearch("", 'order_key')}
                    onSearchQueryChange={e => handleSearch(e.target.value, 'order_key')}
                    searchQuery={searchQuery}
                    productCategory={productCategory}
                    statusValue={statusValue}
                    selectStatusValue={e => setStatusValue(e.target.value)}
                    selectProductCategory={e => setProductCategory(e.target.value)}
                    picker={picker}
                    onClearPicker={() => setPicker([])}
                    onChangeDateRange={async (date) => {
                        if (date.length === 2) {
                            setPicker(date);
                            const [startDate, endDate] = date;
                            getAllOrders(productCategory, statusValue, searchQuery, startDate, endDate);
                        }
                    }}
                    onCloseDateRange={(selectedDates, dateStr, instance) => {
                        if (selectedDates.length === 1) {
                            instance.setDate([picker[0], picker[1]], true)
                        }
                    }}
                />

                <div className='invoice-list-dataTable react-dataTable'>
                    <DataTable
                        noHeader={true}
                        pagination
                        sortServer
                        paginationServer
                        subHeader={true}
                        columns={columns}
                        responsive={true}
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

            <Modal show={modalOpen} toggle={() => setModalOpen(!modalOpen)} headTitle={"Order Detail"} size={'lg'}>
                <div className="p-3">
                    {selectedRow && (
                        <>
                            <div className="mb-2">
                                <label className="form-label">Order Number</label>
                                <Input type="text" value={selectedRow.order_id} readOnly/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Amount</label>
                                <Input type="text" value={selectedRow.amount} readOnly/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Status</label>
                                <Input type="text" value={selectedRow.payment_status} readOnly/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Date</label>
                                <Input type="text" value={formDataDateConverter(selectedRow.created_at)} readOnly/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Description</label>
                                <Input type="text-area" value={selectedRow.description} readOnly/>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </Fragment>
    )
}

export default OrdersScreen;
