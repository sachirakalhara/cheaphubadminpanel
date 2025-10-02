// ** React Imports
import React, {Fragment, useState, useEffect} from 'react'

// ** Chat App Component Imports
import Chat from './Chat'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import {useDispatch, useSelector} from 'react-redux'

import '@styles/base/pages/app-chat.scss'
import '@styles/base/pages/app-chat-list.scss'

import {toggleLoading} from "../../../../redux/loading";
import {notifyMessage, setCurrencyWithSymbol, tableDataDateTimeConverter} from "../../../../utility/commonFun";
import * as OrderResourcesServices from "../../../../services/order-resources";
import PerfectScrollbar from "react-perfect-scrollbar";

const AppChat = ({orderId}) => {
    // ** Store Vars
    const dispatch = useDispatch();


    // ** States
    const [user, setUser] = useState({})
    const [sidebar, setSidebar] = useState(false)
    const [userSidebarRight, setUserSidebarRight] = useState(false)
    const [userSidebarLeft, setUserSidebarLeft] = useState(false)
    const [chatList, setChatList] = useState({});

    // ** Sidebar & overlay toggle functions
    const handleSidebar = () => setSidebar(!sidebar)
    const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight)


    // ** Set user function for Right Sidebar
    const handleUser = obj => setUser(obj)

    useEffect(() => {
        getAllChatList();
    }, [])

    const getAllChatList = () => {
        dispatch(toggleLoading())

        OrderResourcesServices.getOrderNotesByOrderId(orderId)
            .then(res=>{
                if (res.success) {
                    dispatch(toggleLoading())

                    const list = [];
                    if (res.data?.order_notes_list?.length > 0) {
                        res.data?.order_notes_list.map((item) => {
                            list.push({senderId: 11, message: item.note, time: item.created_at});
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
            "order_id": orderId,
            "note": msg
        }
        OrderResourcesServices.addNoteHandler(body)
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



                <PerfectScrollbar className='chat-user-list-wrapper list-group'>


                    <div className='content-wrapper'>


                        <div className='content-body'>
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

                </PerfectScrollbar>



        </Fragment>
    )
}

export default AppChat
