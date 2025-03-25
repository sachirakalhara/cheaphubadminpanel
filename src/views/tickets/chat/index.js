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

const AppChat = () => {
    // ** Store Vars
    const dispatch = useDispatch()
    const store = useSelector(state => state.chat)

    // ** States
    const [user, setUser] = useState({})
    const [sidebar, setSidebar] = useState(false)
    const [userSidebarRight, setUserSidebarRight] = useState(false)
    const [userSidebarLeft, setUserSidebarLeft] = useState(false)

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

    return (
        <Fragment>
            <Sidebar
                store={store}
                sidebar={sidebar}
                handleSidebar={handleSidebar}
                userSidebarLeft={userSidebarLeft}
                handleUserSidebarLeft={handleUserSidebarLeft}
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
                            chatDetails={{
                                "chat": {
                                    "id": 1,
                                    "chat": [
                                        {
                                            "message": "Hi",
                                            "time": "Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)",
                                            "senderId": 11
                                        }, {
                                            "message": "Hello. How can I help You?",
                                            "time": "Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)",
                                            "senderId": 2
                                        }, {
                                            "message": "Can I get details of my last transaction I made last month?",
                                            "time": "Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)",
                                            "senderId": 11
                                        }, {
                                            "message": "We need to check if we can provide you such information.",
                                            "time": "Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)",
                                            "senderId": 2
                                        }, {
                                            "message": "I will inform you as I get update on this.",
                                            "time": "Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)",
                                            "senderId": 2
                                        }, {
                                            "message": "If it takes long you can mail me at my mail address.",
                                            "time": "2025-02-19T18:36:51.629Z",
                                            "senderId": 11
                                        }]
                                },
                                "customer": {
                                    "id": 1,
                                    "fullName": "Felecia Rower",
                                    "avatar": "/static/media/avatar-s-2.d21f2121.jpg"
                                }
                            }}
                            handleUser={handleUser}
                            handleSidebar={handleSidebar}
                            userSidebarLeft={userSidebarLeft}
                            handleUserSidebarRight={handleUserSidebarRight}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AppChat
