import React, {Fragment, useEffect, useState} from "react";
import BreadCrumbs from "../../../@core/components/breadcrumbs";
import {Badge, Card, CardBody, Col, Input, InputGroup, InputGroupText, Row} from "reactstrap";
import {ArrowRight, ChevronDown, Hash} from "react-feather";
import Flatpickr from "react-flatpickr";
import {Link, useLocation} from "react-router-dom";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {customStyles, customToastMsg, emptyUI} from "../../../utility/Utils";
import logo from "../../../assets/images/logo/logo.png";
import * as CustomerResourcesServices from "../../../services/customer-resources";
import {defaultImageBinder, valueFormatEditor} from "../../../utility/commonFun";

const CustomerProfile = () => {
    const location = useLocation();
    const [store, setStore] = useState({
        data: [
            {
                id: 1,
                orderId: 'ORD12345',
                amount: '$200',
                status: 'Completed',
                date: '2024-02-10'
            },
            {
                id: 2,
                orderId: 'ORD12346',
                amount: '$150',
                status: 'Pending',
                date: '2024-02-12'
            },
            {
                id: 3,
                orderId: 'ORD12347',
                amount: '$300',
                status: 'Completed',
                date: '2024-02-15'
            },
            {
                id: 4,
                orderId: 'ORD12348',
                amount: '$450',
                status: 'Completed',
                date: '2024-02-18'
            },
            {
                id: 5,
                orderId: 'ORD12349',
                amount: '$100',
                status: 'Incomplete',
                date: '2024-02-20'
            }
        ],
        total: 1
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFetched, setIsFetched] = useState(false);
    const [val, setVal] = useState('')
    const [statusValue, setStatusValue] = useState('');
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const navigationParam = location.state;
        getUserDetails(navigationParam)
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


    const columns = [
        {name: 'Order Number', selector: row => row.orderId},
        {name: 'Amount', selector: row => row.amount},
        {
            name: 'Status',
            selector: row => <Badge
                color={row.status === 'Incomplete' ? 'danger' : row.status === 'Pending' ? 'warning' : 'success'}>{row.status}</Badge>
        },
        {name: 'Date', selector: row => row.date}
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
            return store.allData.slice(0, rowsPerPage)
        }
    }

    const handlePagination = page => {
        setCurrentPage(page.selected);
        // getCustomers();
    };

    const handleSearch = value => {
        setSearchQuery(value);
        // getCustomers();
    };


    return (
        <Fragment>
            <BreadCrumbs breadCrumbTitle='Customer' breadCrumbParent='Customer' breadCrumbActive={'Kavinda'}/>
            <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding'>
                    <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                        <div className='w-100'>
                            <div className='logo-wrapper d-flex d-inline mb-1 align-items-center'>
                                <img src={defaultImageBinder(userData?.profile_photo)} width={50} height={50} alt={'logo'} className="rounded-circle overflow-hidden"/>
                                <h3 className='text-primary invoice-logo ms-1 mt-25'>{valueFormatEditor(userData?.display_name)}</h3>
                            </div>
                            <Row className="align-items-center">
                                <Col lg={8}>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Name: </span> {valueFormatEditor(userData?.display_name)}</p>
                                    <p className='card-text mb-25'><span className="fw-bold text-black">Address: </span>San
                                        Diego County, CA 91905, USA</p>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Email: </span> {valueFormatEditor(userData.email)}</p>
                                    <p className='card-text mb-0'><span
                                        className="fw-bold text-black">Mobile: </span> {valueFormatEditor(userData.contact)}</p>
                                </Col>
                                <Col lg={4}>
                                    <div>
                                        <p className='card-text mb-25'><span className="fw-bold text-black">Recent purchase: </span> 2024/05/06
                                        </p>
                                        <p className='card-text mb-25'><span className="fw-bold text-black">Top payment method: </span> Crypto
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


        </Fragment>
    )
}

export default CustomerProfile;
