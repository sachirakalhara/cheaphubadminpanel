import {Badge, Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, FormGroup, Input, Label, Row} from "reactstrap";
import React, {Fragment, useEffect, useState} from "react";
import BreadCrumbs from "../../../@core/components/breadcrumbs";
import DataTable from "react-data-table-component";
import {ArrowRight, ChevronDown} from "react-feather";
import {customStyles, customSweetAlert, customToastMsg, dataBinder, emptyUI} from "../../../utility/Utils";
import {Link, useLocation, useParams} from "react-router-dom";
import * as OrderResourcesServices from "../../../services/order-resources";
import {useDispatch} from "react-redux";
import {toggleLoading} from "../../../redux/loading";
import {formDataDateConverter, formDataDateTimeConverter, tableDataDateTimeConverter} from "../../../utility/commonFun";
import * as TicketServices from "../../../services/tickets";
import {getAllTicketsByOrders} from "../../../services/tickets";
import {CURRENCY} from "../../../const/constant";
import PersonalNotes from './notes/index'
import Modal from "../../../@core/components/modal";


const OrderDetails = () => {
    const location = useLocation();
    const navigationParam = location.state;
    const dispatch = useDispatch()

    const [store, setStore] = useState({
        data: []
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFetched, setIsFetched] = useState(false);
    const [val, setVal] = useState('')
    const [statusValue, setStatusValue] = useState('');
    const [orderDetails, setOrderDetails] = useState({});
    const [productItems, setProductItems] = useState([]);
    const [refundModalOpen, setRefundModalOpen] = useState(false);
    const [refundType, setRefundType] = useState('wallet');

    useEffect(() => {
        getOrderDetails()
        getAllTickets()
    }, [])


    const getOrderDetails = async () => {
        dispatch(toggleLoading())
        OrderResourcesServices.getOrderByOrderId(navigationParam.id)
            .then((res) => {
                if (res.success) {
                    dispatch(toggleLoading())
                    setOrderDetails(res.data.order)
                    setProductItems(res.data.order.order_items);
                } else {
                    dispatch(toggleLoading())
                    customToastMsg(res.message, 0)
                }
            })
    }

    const getAllTickets = async () => {
        dispatch(toggleLoading());
        setIsFetched(false);
        const body = {
            "all": 1
        }

        TicketServices.getAllTicketsByOrders(body)
            .then(res => {
                if (res.success) {
                    dispatch(toggleLoading());
                    const list = [];
                    res.data.map((item) => {
                        if (item.order_id === navigationParam.id) {
                            list.push(item);
                        }
                    })

                    console.log(list)

                    setStore({data: list ?? []});
                } else {
                    dispatch(toggleLoading());
                    customToastMsg(res.message, res.status)
                }
                setIsFetched(true);
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
        {name: 'Ticket Number', selector: row => row.ticket_number},
        {name: 'Subject', selector: row => row.subject},
        {
            name: 'Status',
            selector: row => <Badge
                color={row.status === "closed" ? 'danger' : row.status === 'open' ? 'success' : 'secondary'}>{row.status}</Badge>
        },
        {name: 'Date', selector: row => tableDataDateTimeConverter(row.created_at)},
        {
            name: "",
            minWidth: "100px",
            cell: row => (
                <Link to={{pathname: `/tickets/chat-box/${row.ticket_number}`}}>
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

    const confirmRefund = async () => {
        const message = refundType === 'wallet'
            ? 'This will credit the order amount back to the customer’s wallet balance and mark the order as refunded. Serials already delivered will NOT be reclaimed.'
            : 'This will only MARK the order as refunded. No money is sent automatically — you must process the actual refund yourself from the Marx dashboard or your crypto wallet. Serials already delivered will NOT be reclaimed.';

        await customSweetAlert(
            message,
            2,
            async () => {
                setRefundModalOpen(false);
                refundOrderHandler();
            },
            'Refund Order'
        )
    }

    const refundOrderHandler = () => {
        dispatch(toggleLoading())
        const body = {
            "id": navigationParam.id, // order id
            "refund_type": refundType // 'wallet' or 'gateway'
        }
        OrderResourcesServices.refundOrder(body)
            .then(async (res) => {
                console.log(res)
                if (res.success) {
                    dispatch(toggleLoading())
                    customToastMsg(res.message, 1)
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
                                <CardText tag="h6"
                                          className='text-black-50'>{orderDetails.transaction_id ?? 'N/A'}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Payment</CardText>
                                <CardText tag="h6" className='text-black-50'>{orderDetails.payment_method}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Currency</CardText>
                                <CardText tag="h6" className='text-black-50'>{CURRENCY}</CardText>
                            </div>

                            <div className="d-inline-flex w-100 align-items-center justify-content-between">
                                <CardText tag="h5">Payment Status</CardText>
                                {/*<CardText tag="h6" className='text-black-50'>{orderDetails.payment_status}</CardText>*/}
                                <CardText tag="h6" className='text-black-50'>
                                    <Badge
                                        color={orderDetails.payment_status === 'paid' ? 'success' : orderDetails.payment_status === 'pending' ? 'warning' : orderDetails.payment_status === 'refunded' ? 'info' : 'danger'}>{orderDetails.payment_status}
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

                                <Link to={{pathname: `/product-details/${navigationParam.order_id}`, state: orderDetails}} state={orderDetails}>
                                    <Button color='success' className="mt-2 d-flex align-self-center ms-1" outline>
                                        Product Details
                                    </Button>
                                </Link>

                                <Button color='danger' className="mt-2 d-flex align-self-center ms-1" outline
                                        disabled={orderDetails.payment_status !== 'paid'}
                                        onClick={() => {
                                            setRefundType('wallet');
                                            setRefundModalOpen(true);
                                        }}>
                                    Refund
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


                <Card className='invoice-preview-card h-100 mt-1'>
                    <CardHeader>
                        <CardTitle tag='h4'>Special Notes</CardTitle>
                    </CardHeader>
                    <CardBody className='invoice-padding pb-0'>

                        <PersonalNotes orderId={navigationParam.id}/>

                    </CardBody>
                </Card>

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

            <Modal show={refundModalOpen} toggle={() => setRefundModalOpen(!refundModalOpen)}
                   headTitle={"Refund Order"} size={'md'}>
                <div className="p-2">
                    <p className="mb-2">
                        Refund <strong>{CURRENCY} {orderDetails.amount_paid ?? orderDetails.amount}</strong> for
                        order <strong>{orderDetails.order_id}</strong>. Choose how to refund:
                    </p>

                    <FormGroup check className="mb-1">
                        <Input
                            type="radio"
                            name="refundType"
                            id="refund-wallet"
                            value="wallet"
                            checked={refundType === 'wallet'}
                            onChange={() => setRefundType('wallet')}
                        />
                        <Label check for="refund-wallet">
                            <strong>Refund to customer wallet</strong>
                            <span className="d-block text-muted" style={{fontSize: 12}}>
                                Credits the amount back to the customer’s wallet balance instantly.
                            </span>
                        </Label>
                    </FormGroup>

                    <FormGroup check className="mb-2">
                        <Input
                            type="radio"
                            name="refundType"
                            id="refund-gateway"
                            value="gateway"
                            checked={refundType === 'gateway'}
                            onChange={() => setRefundType('gateway')}
                        />
                        <Label check for="refund-gateway">
                            <strong>Payment gateway refund (mark only)</strong>
                            <span className="d-block text-muted" style={{fontSize: 12}}>
                                Only marks the order as refunded. You process the actual refund manually
                                from the Marx dashboard or your crypto wallet.
                            </span>
                        </Label>
                    </FormGroup>

                    <div className="d-flex justify-content-end mt-2">
                        <Button color='secondary' outline className="me-1"
                                onClick={() => setRefundModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button color='danger'
                                onClick={async () => {
                                    await confirmRefund()
                                }}>
                            Continue
                        </Button>
                    </div>
                </div>
            </Modal>
        </Fragment>

    )
}

export default OrderDetails;
