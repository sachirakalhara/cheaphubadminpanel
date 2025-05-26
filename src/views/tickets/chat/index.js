// ** React Imports
import React, {Fragment, useState, useEffect} from 'react'

// ** Chat App Component Imports
import Chat from './Chat'
import Sidebar from './SidebarLeft'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import {useDispatch, useSelector} from 'react-redux'
import {getUserProfile, getChatContacts} from './store'

import '@styles/base/pages/app-chat.scss'
import '@styles/base/pages/app-chat-list.scss'

import {useLocation, useParams} from "react-router-dom";
import * as TicketServices from "../../../services/tickets";
import {toggleLoading} from "../../../redux/loading";
import {notifyMessage, setCurrencyWithSymbol, tableDataDateTimeConverter} from "../../../utility/commonFun";
import {getTicketChat} from "../../../services/tickets";
import * as OrderResourcesServices from "../../../services/order-resources";
import logo from "../../../assets/images/logo/logo.png";
import {Badge, Button, Col, Row} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {customSweetAlert} from "../../../utility/Utils";

const AppChat = () => {
    // ** Store Vars
    const dispatch = useDispatch();
    const location = useLocation();
    const {name} = useParams();
    const store = useSelector(state => state.chat)

    const ticketData = location.state;

    // ** States
    const [user, setUser] = useState({})
    const [sidebar, setSidebar] = useState(false)
    const [userSidebarRight, setUserSidebarRight] = useState(false)
    const [userSidebarLeft, setUserSidebarLeft] = useState(false)
    const [chatList, setChatList] = useState({});
    const [ticketDetails, setTicketDetails] = useState({});
    const [productItems, setProductItems] = useState([]);

    // ** Sidebar & overlay toggle functions
    const handleSidebar = () => setSidebar(!sidebar)
    const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft)
    const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight)
    const handleOverlayClick = () => {
        setSidebar(false)
        setUserSidebarRight(false)
        setUserSidebarLeft(false)
    }

    // ** Set user function for Right Sidebar
    const handleUser = obj => setUser(obj)

    // ** Get data on Mount
    useEffect(() => {
        dispatch(getChatContacts())
        dispatch(getUserProfile())
    }, [dispatch])

    useEffect(() => {
        getAllChatList();
    }, [])

    const getAllChatList = () => {
        dispatch(toggleLoading())
        console.log(ticketData)
        const body = {
            "all": 1,
            "ticket_number": ticketData.ticket_number
        }
        TicketServices.getTicketChat(body)
            .then((res) => {
                if (res.success) {
                    dispatch(toggleLoading())
                    setTicketDetails(res.data[0]);
                    getOrderDetails(res.data[0].order.id);

                    const list = [];
                    if (res.data[0]) {
                        res.data[0].comments.map((item) => {
                            if (item.user.user_level_id === 2) {
                                list.push({senderId: 2, message: item.message, time: item.created_at});
                            } else {
                                list.push({senderId: 11, message: item.message, time: item.created_at});
                            }
                        })
                    }

                    const chatObj = {
                        "chat": {
                            "id": 1,
                            chat: list
                        }
                    }

                    setChatList(chatObj);


                } else {
                    dispatch(toggleLoading())
                    notifyMessage(res.message, res.status);
                }
            })
    }

    const getOrderDetails = async (id) => {
        dispatch(toggleLoading());
        OrderResourcesServices.getOrderByOrderId(id)
            .then((res) => {
                if (res.success) {
                    console.log(res.data);
                    setProductItems(res.data.order.order_items);
                    dispatch(toggleLoading());
                } else {
                    dispatch(toggleLoading());
                    notifyMessage(res.message, res.status);
                }
            })
    }


    const replyHandler = (msg) => {
        dispatch(toggleLoading())
        const body = {
            "id": ticketDetails?.id,
            "message": msg
        }
        TicketServices.createTicketComment(body)
            .then((res) => {
                if (res.success) {
                    dispatch(toggleLoading())

                    setChatList({
                        "chat": {
                            "id": 1,
                            chat: [...chatList.chat.chat, {senderId: 11, message: msg, time: new Date()}]
                        }
                    })

                } else {
                    dispatch(toggleLoading())
                    notifyMessage(res.message, res.status);
                }
            })
    }

    const changeStatusOnTicket =async () => {

        await customSweetAlert(
            'Are you sure you did resolved this ticket?',
            0,
            () => {
                changeStatusOffTicket()
            }
        )
    }

    const changeStatusOffTicket = () => {
        dispatch(toggleLoading())
        const body = {
            "id": ticketDetails?.id,
            "status": "resolved"
        }

        TicketServices.changeTicketStatus(body)
            .then((res) => {
                console.log(res)
                if (res.success) {
                    dispatch(toggleLoading())
                    notifyMessage(res.message, 1);
                    getAllChatList();
                } else {
                    dispatch(toggleLoading())
                    notifyMessage(res.message, res.status);
                }
            })
    }

    return (
        <Fragment>
            <Sidebar
                store={store}
                ticketDetails={ticketDetails}
                changeStatusHandler={() => changeStatusOnTicket()}
                productItems={productItems}
            />

            <div className='content-right'>

                <PerfectScrollbar className='chat-user-list-wrapper list-group'>
                    <div
                        className='d-flex p-1 justify-content-between flex-md-row flex-column invoice-spacing mt-0 d-lg-none'>
                        <div className='w-100'>
                            <div className='logo-wrapper d-flex d-inline mb-1 align-items-center'>
                                <img src={logo} width={50} height={50} alt={'logo'}/>
                                <h3 className='text-primary invoice-logo ms-1 mt-25'>CheapHub</h3>
                            </div>
                            <Row className="align-items-center">
                                <Col lg={12}>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Ticket Number: </span>{ticketDetails?.ticket_number}
                                    </p>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Order Number: </span>{ticketDetails?.order?.order_id}
                                    </p>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Customer Name: </span> {ticketDetails?.customer?.display_name}
                                    </p>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Email: </span> {ticketDetails?.customer?.email}
                                    </p>
                                    <p className='card-text mb-25'><span
                                        className="fw-bold text-black">Created At: </span> {tableDataDateTimeConverter(ticketDetails?.created_at)}
                                    </p>

                                    <p className='card-text mb-0'><span
                                        className="fw-bold text-black">Status: </span> <Badge
                                        color={ticketDetails?.status === "closed" ? 'danger' : ticketDetails?.status === 'open' ? 'success' : 'secondary'}>{ticketDetails?.status}</Badge>
                                    </p>


                                    <Button color='primary' className="mt-2 d-flex align-self-center" outline
                                            disabled={ticketDetails.status !== 'open'}
                                            onClick={() => changeStatusOnTicket()}>
                                        {ticketDetails?.status === 'open' ? "Resolve" : "Resolved"}
                                    </Button>
                                </Col>

                                {productItems.map((item, index) => (
                                    <Col lg={12} className="mt-2 pt-2 separator" key={index}>
                                        {item.contribution_product !== null ? (
                                            <>
                                                <h4 className="text-md font-bold">Product Details</h4>
                                                <p className='card-text mb-25'><span
                                                    className="fw-bold text-black">Name: </span>{item.contribution_product.name}
                                                </p>
                                                <p className='card-text mb-25 three-lines'>
                          <span
                              className="fw-bold text-black">Description: </span>
                                                    {item.contribution_product.description}
                                                </p>

                                                <p className='card-text mb-25 three-lines'>
                          <span
                              className="fw-bold text-black">Package: </span>
                                                    {item.package.name}
                                                </p>

                                                <p className='card-text mb-25 three-lines'>
                          <span
                              className="fw-bold text-black">Subscription: </span>
                                                    {item.subscription.name}
                                                </p>

                                                <p className='card-text mb-0'>
                          <span
                              className="fw-bold text-black">Price: </span> {setCurrencyWithSymbol(item.package.price)}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="text-md font-bold">Product Details</h4>
                                                <p className='card-text mb-25'><span
                                                    className="fw-bold text-black">Name: </span>{item.bulk_product.name}
                                                </p>
                                                <p className='card-text mb-25 three-lines'>
                          <span
                              className="fw-bold text-black">Description: </span>
                                                    {item.bulk_product.description}
                                                </p>

                                                <p className='card-text mb-0'>
                          <span
                              className="fw-bold text-black">Price: </span> {setCurrencyWithSymbol(item.package.price)}
                                                </p>
                                            </>
                                        )}
                                    </Col>
                                ))}
                            </Row>

                        </div>
                    </div>

                    <div className='content-wrapper'>


                        <div className='content-body'>
                            <div
                                className={classnames('body-content-overlay', {
                                    show: userSidebarRight === true || sidebar === true || userSidebarLeft === true
                                })}
                                onClick={handleOverlayClick}
                            ></div>
                            <Chat
                                chatDetails={chatList}
                                handleUser={handleUser}
                                handleSidebar={handleSidebar}
                                userSidebarLeft={userSidebarLeft}
                                handleUserSidebarRight={handleUserSidebarRight}
                                replyCallback={(e) => {
                                    replyHandler(e)
                                }}
                                ticketDetails={ticketDetails}
                            />
                        </div>
                    </div>

                </PerfectScrollbar>


            </div>
        </Fragment>
    )
}

export default AppChat
