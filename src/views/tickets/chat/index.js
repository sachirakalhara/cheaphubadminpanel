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

import {useParams} from "react-router-dom";
import * as TicketServices from "../../../services/tickets";
import {toggleLoading} from "../../../redux/loading";
import {notifyMessage} from "../../../utility/commonFun";
import {getTicketChat} from "../../../services/tickets";

const AppChat = () => {
    // ** Store Vars
    const dispatch = useDispatch();
    const {id} = useParams();
    const store = useSelector(state => state.chat)

    // ** States
    const [user, setUser] = useState({})
    const [sidebar, setSidebar] = useState(false)
    const [userSidebarRight, setUserSidebarRight] = useState(false)
    const [userSidebarLeft, setUserSidebarLeft] = useState(false)
    const [chatList, setChatList] = useState({});
    const [ticketDetails, setTicketDetails] = useState({});

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
        const body = {
            "all": 1,
            "ticket_number": id
        }
        TicketServices.getTicketChat(body)
            .then((res) => {
                if (res.success) {
                    dispatch(toggleLoading())
                    setTicketDetails(res.data[0]);

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

    return (
        <Fragment>
            <Sidebar
                store={store}
                ticketDetails={ticketDetails}
            />
            <div className='content-right'>
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
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AppChat
