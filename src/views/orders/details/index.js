import {Badge, Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Row} from "reactstrap";
import React, {Fragment, useEffect, useState} from "react";
import BreadCrumbs from "../../../@core/components/breadcrumbs";
import DataTable from "react-data-table-component";
import {ArrowRight, ChevronDown} from "react-feather";
import {customStyles, customSweetAlert, customToastMsg, dataBinder, emptyUI} from "../../../utility/Utils";
import {Link, useLocation, useParams} from "react-router-dom";
import * as OrderResourcesServices from "../../../services/order-resources";
import {useDispatch} from "react-redux";
import {toggleLoading} from "../../../redux/loading";
import {formDataDateConverter, formDataDateTimeConverter} from "../../../utility/commonFun";


const OrderDetails = () => {
    const location = useLocation();
    const navigationParam = location.state;
    const dispatch = useDispatch()

    const [store, setStore] = useState({
        data: [
            {
                id: 1,
                ticketId: 'Tick12345',
                email: 'gebush48@gmail.com',
                status: 'Completed',
                date: '2024-02-10'
            },
        ],
        total: 1
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFetched, setIsFetched] = useState(false);
    const [val, setVal] = useState('')
    const [statusValue, setStatusValue] = useState('');
    const [orderDetails, setOrderDetails] = useState({});

    useEffect(() => {
        getOrderDetails()
    }, [])


    const getOrderDetails = async () => {
        dispatch(toggleLoading())
        OrderResourcesServices.getOrderByOrderId(navigationParam.id)
            .then((res) => {
                if (res.success) {
                    dispatch(toggleLoading())
                    setOrderDetails(res.data.order)
                } else {
                    dispatch(toggleLoading())
                    customToastMsg(res.message, 0)
                }
            })
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

    const columns = [
        {name: 'Ticket Number', selector: row => row.ticketId},
        {name: 'email', selector: row => row.email},
        {
            name: 'Status',
            selector: row => <Badge
                color={row.status === 'Incomplete' ? 'danger' : row.status === 'Pending' ? 'warning' : 'success'}>{row.status}</Badge>
        },
        {name: 'Date', selector: row => row.date},
        {
            name: "",
            minWidth: "100px",
            cell: row => (
                <Link to={`ticket/${row.ticketId}`} state={row}>
                    <ArrowRight size={18} className="cursor-pointer"/>
                </Link>

            )
        }
    ];

    const proceedOrder = async () => {
        await customSweetAlert(
            'You are about to process this order manually. Once you confirm below, we’ll mark this order paid and deliver the product to the customer.',
            2,
            async () => {
                changeOrderStatus();
            },
            'Proceed Order'
        )
    }

    const changeOrderStatus = () => {
        dispatch(toggleLoading())
        const body = {
            "id": navigationParam.id,//order id
            "status": "paid"  // pending', 'paid', 'failed
        }
        OrderResourcesServices.changeOrderStatus(body)
            .then(async (res) => {
                console.log(res)
                if (res.success) {
                    dispatch(toggleLoading())
                    await getOrderDetails();
                } else {
                    dispatch(toggleLoading())
                    customToastMsg(res.message, 0)
                }
            })
    }

    return (
        <Fragment>
            <BreadCrumbs breadCrumbTitle='Order' breadCrumbParent='Order' breadCrumbActive={'ORD0001'}/>
            <Row>
                <Col lg={6}>
                    <Card className='invoice-preview-card h-100'>
                        <CardHeader>
                            <CardTitle tag='h4'>Payment Details</CardTitle>
                        </CardHeader>
                        <CardBody className='invoice-padding pb-0'>
                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Order Number</CardText>
                                <CardText tag="h6" className='text-black-50'>{orderDetails.order_id}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Total</CardText>
                                <CardText tag="h6" className='text-black-50'>$ {orderDetails.amount}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Transaction Id</CardText>
                                <CardText tag="h6" className='text-black-50'>{orderDetails.transaction_id}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Payment</CardText>
                                <CardText tag="h6" className='text-black-50'>Marx</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Currency</CardText>
                                <CardText tag="h6" className='text-black-50'>USD</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Payment Status</CardText>
                                {/*<CardText tag="h6" className='text-black-50'>{orderDetails.payment_status}</CardText>*/}
                                <CardText tag="h6" className='text-black-50'>
                                    <Badge
                                        color={orderDetails.payment_status === 'paid' ? 'success' : orderDetails.payment_status === 'pending' ? 'warning' : 'danger'}>{orderDetails.payment_status}
                                    </Badge>
                                </CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Date</CardText>
                                <CardText tag="h6"
                                          className='text-black-50'>{formDataDateTimeConverter(orderDetails.created_at)}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-center">
                                <Button color='primary' className="mt-2 d-flex align-self-center" outline
                                        disabled={orderDetails.payment_status === 'paid'}
                                        onClick={async () => {
                                            await proceedOrder()
                                        }}>
                                    Process Order
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className='invoice-preview-card h-100'>
                        <CardHeader>
                            <CardTitle tag='h4'>Customer Details</CardTitle>
                        </CardHeader>
                        <CardBody className='invoice-padding'>
                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Name</CardText>
                                <CardText tag="h6"
                                          className='text-black-50'>{dataBinder(orderDetails?.user_id?.display_name)}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Email</CardText>
                                <CardText tag="h6"
                                          className='text-black-50'>{dataBinder(orderDetails?.user_id?.email)}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Email Verified At</CardText>
                                <CardText tag="h6"
                                          className='text-black-50'>{formDataDateTimeConverter(orderDetails?.user_id?.email_verified_at)}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Mobile Number</CardText>
                                <CardText tag="h6"
                                          className='text-black-50'>{dataBinder(orderDetails?.user_id?.contact_no)}</CardText>
                            </div>


                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Country</CardText>
                                <CardText tag="h6" className='text-black-50'>Sri Lanka</CardText>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Card className="mt-1">
                <CardHeader>
                    <CardTitle tag='h4'>Ticket Details</CardTitle>
                </CardHeader>
                <div className='invoice-list-dataTable react-dataTable'>
                    <DataTable
                        noHeader={true}
                        pagination={false}
                        sortServer={false}
                        paginationServer={false}
                        subHeader={true}
                        columns={columns}
                        responsive={true}
                        data={dataToRender()}
                        sortIcon={<ChevronDown/>}
                        className="dataTables_wrapper"
                        paginationDefaultPage={currentPage}
                        customStyles={customStyles}
                        noDataComponent={emptyUI(isFetched)}
                    />
                </div>
            </Card>
        </Fragment>

    )
}

export default OrderDetails;
