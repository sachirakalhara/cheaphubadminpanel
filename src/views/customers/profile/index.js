import React, {Fragment, useEffect, useState} from "react";
import BreadCrumbs from "../../../@core/components/breadcrumbs";
import {Badge, Card, CardBody, Col, Input, InputGroup, InputGroupText, Row} from "reactstrap";
import {ArrowRight, ChevronDown, Hash} from "react-feather";
import Flatpickr from "react-flatpickr";
import {Link, useLocation} from "react-router-dom";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {customStyles, customToastMsg, emptyUI} from "../../../utility/Utils";
import * as CustomerResourcesServices from "../../../services/customer-resources";
import * as OrderResourcesServices from "../../../services/order-resources";
import {defaultImageBinder, formDataDateConverter, valueFormatEditor} from "../../../utility/commonFun";

import Modal from "../../../@core/components/modal";

const CustomerProfile = () => {
    const location = useLocation();
    const navigationParam = location.state;

    const [store, setStore] = useState({
        data: [],
        total: 0
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [isFetched, setIsFetched] = useState(false);

    const [val, setVal] = useState('')
    const [statusValue, setStatusValue] = useState('');

    const [userData, setUserData] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        getUserDetails(navigationParam);
        getOrderDetails(navigationParam, currentPage);
    }, []);

    const getUserDetails = async (navigationParam) => {
        CustomerResourcesServices.getCustomerDetails(navigationParam.id)
            .then(response => {
                if (response.success) {
                    setUserData(response.data.user);
                } else {
                    customToastMsg(response.message, response.status)
                }
                console.log(response)
            })
    }

    const getOrderDetails = async (navigationParam, page) => {
        OrderResourcesServices.getOrdersByCustomerId(navigationParam.id, page)
            .then(response => {
                if (response.success) {
                    setStore({
                        data: response.data?.order_list,
                        total: response.data.meta?.last_page
                    })
                } else {
                    customToastMsg(response.message, response.status)
                }
            })
    }

    const handleView = (row) => {
        setSelectedRow(row);
        setModalOpen(true);
    };

    const columns = [
        {name: 'Order Number', selector: row => row.order_id},
        {name: 'Amount', selector: row => row.amount},
        {
            name: 'Status',
            selector: row => <Badge
                color={row.payment_status === 'paid' ? 'success' : row.payment_status === 'pending' ? 'warning' : 'danger'}>{row.payment_status}</Badge>
        },
        {name: 'Date', selector: row => formDataDateConverter(row.created_at)},
        {
            name: 'Action',
            cell: row => (
                <button className="btn btn-primary btn-sm" onClick={() => handleView(row)}>
                    View
                </button>
            )
        }
    ];

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
        const pageNumber = page.selected + 1;
        setCurrentPage(pageNumber);
        getOrderDetails(navigationParam, pageNumber);
    };


    return (
        <Fragment>
            <BreadCrumbs breadCrumbTitle='Customer' breadCrumbParent='Customer' breadCrumbActive={'Kavinda'}/>
            <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding'>
                    <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                        <div className='w-100'>
                            <div className='logo-wrapper d-flex d-inline mb-1 align-items-center'>
                                <img src={defaultImageBinder(userData?.profile_photo)} width={50} height={50}
                                     alt={'logo'} className="rounded-circle overflow-hidden"/>
                                <h3 className='text-primary invoice-logo ms-1 mt-25'>{valueFormatEditor(userData?.display_name)}</h3>
                            </div>
                            <Row className="align-items-center">
                                <Col lg={8}>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Name: </span> {valueFormatEditor(userData?.display_name)}
                                    </p>
                                    <p className='card-text mb-25'><span className="fw-bold text-black">Address: </span>San
                                        Diego County, CA 91905, USA</p>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Email: </span> {valueFormatEditor(userData.email)}
                                    </p>
                                    <p className='card-text mb-0'><span
                                        className="fw-bold text-black">Mobile: </span> {valueFormatEditor(userData.contact)}
                                    </p>
                                </Col>
                                <Col lg={4}>
                                    <div>
                                        <p className='card-text mb-25'><span className="fw-bold text-black">Recent purchase: </span>
                                            {formDataDateConverter(userData?.order_history?.created_at)}
                                        </p>
                                        <p className='card-text mb-25'><span className="fw-bold text-black">Top payment method: </span> Marx
                                        </p>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card className='mt-2'>
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

export default CustomerProfile;
