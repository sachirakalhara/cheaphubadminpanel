// ** React Imports
import ReactDOM from 'react-dom'
import React, {useState, useEffect, useRef} from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import {sendMsg} from './store'
import {useDispatch} from 'react-redux'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {MessageSquare, Menu, PhoneCall, Video, Search, MoreVertical, Mic, Image, Send} from 'react-feather'
import {useParams} from "react-router-dom";

// ** Reactstrap Imports
import {
    Form,
    Input,
    Button,
    InputGroup
} from 'reactstrap'

const ChatLog = props => {
    // ** Props & Store
    const {handleUser, handleUserSidebarRight, handleSidebar, chatDetails, userSidebarLeft, replyCallback} = props

    // ** Refs & Dispatch
    const chatArea = useRef(null);
    const dispatch = useDispatch();

    // ** State
    const [msg, setMsg] = useState('')

    // ** Scroll to chat bottom
    const scrollToBottom = () => {
        const chatContainer = ReactDOM.findDOMNode(chatArea.current)
        chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
    }

    // ** If user chat is not empty scrollToBottom
    useEffect(() => {
        const chatDetailsLen = Object.keys(chatDetails).length
        console.log(chatDetails)
        if (chatDetailsLen) {
            scrollToBottom()
        }
    }, [chatDetails])

    // ** Formats chat data based on sender and groups by date
    const formattedChatData = () => {
        let chatLog = []
        if (chatDetails.chat) {
            chatLog = chatDetails.chat.chat
        }

        const formattedChatLog = []
        let currentDate = null
        let dateGroup = {
            date: null,
            messages: []
        }

        chatLog.forEach((msg, index) => {
            const messageDate = new Date(msg.time).toDateString()
            if (currentDate === messageDate) {
                dateGroup.messages.push({
                    senderId: msg.senderId,
                    msg: msg.message,
                    time: msg.time
                })
            } else {
                if (dateGroup.messages.length) formattedChatLog.push(dateGroup)
                currentDate = messageDate
                dateGroup = {
                    date: messageDate,
                    messages: [
                        {
                            senderId: msg.senderId,
                            msg: msg.message,
                            time: msg.time
                        }
                    ]
                }
            }
            if (index === chatLog.length - 1) formattedChatLog.push(dateGroup)
        })
        return formattedChatLog
    }

    // ** Renders user chat with date grouping
    const renderChats = () => {
        return formattedChatData().map((group, groupIndex) => (
            <div key={groupIndex}>
                <div className='chat-date'>
                    <h6 className='text-black-50 text-center font-small-3'>{new Date(group.date).toLocaleDateString()}</h6>
                </div>
                {group.messages.map((item, index) => (
                    <div
                        key={index}
                        className={classnames('chat', {
                            'chat-left': item.senderId !== 11
                        })}
                    >
                        <div className='chat-avatar'>
                            <Avatar
                                imgWidth={36}
                                imgHeight={36}
                                className='box-shadow-1 cursor-pointer'
                                img={"https://thumbs.dreamstime.com/b/braka-avatar-fotografii-placeholder-profilowa-ikona-124557887.jpg"}
                            />
                        </div>

                        <div className='chat-body'>
                            <div className='chat-content'>
                                <p>{item.msg}</p>
                                <small className={`${item.senderId !== 11 ? 'text-muted' : 'text-white'}`}>
                                    {new Date(item.time).toLocaleTimeString()}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ))
    }

    // ** On mobile screen open left sidebar on Start Conversation Click
    const handleStartConversation = () => {
        if (!Object.keys(chatDetails).length && !userSidebarLeft && window.innerWidth < 992) {
            handleSidebar()
        }
    }

    // ** Sends New Msg
    const handleSendMsg = e => {
        e.preventDefault()
        if (msg.length) {
            // dispatch(sendMsg({...chatDetails, message: msg}))
            console.log('msg', msg)
            replyCallback(msg)
            setMsg('')
        }
    }

    // ** ChatWrapper tag based on chat's length
    const ChatWrapper = Object.keys(chatDetails).length && chatDetails.chat ? PerfectScrollbar : 'div'

    return (
        <div className='chat-app-window'>
            <div className={classnames('start-chat-area', {'d-none': Object.keys(chatDetails).length})}>
                <div className='start-chat-icon mb-1'>
                    <MessageSquare/>
                </div>
                <h4 className='sidebar-toggle start-chat-text' onClick={handleStartConversation}>
                    Start Conversation
                </h4>
            </div>
            {Object.keys(chatDetails).length ? (
                <div className={classnames('active-chat', {'d-none': chatDetails === null})}>
                    <ChatWrapper ref={chatArea} className='user-chats' style={{height: '85%'}}
                                 options={{wheelPropagation: false}}>
                        {chatDetails.chat ? <div className='chats'>{renderChats()}</div> : null}
                    </ChatWrapper>

                    <Form className='chat-app-form' onSubmit={e => handleSendMsg(e)}>
                        <InputGroup className='input-group-merge me-1 form-send-message'>
                            <Input
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                                placeholder='Type your message or use speech to text'
                            />
                        </InputGroup>
                        <Button className='send' color='primary'
                                disabled={props.ticketDetails.status !== "open"}
                        >
                            <Send size={14} className='d-lg-none'/>
                            <span className='d-none d-lg-block'>Send</span>
                        </Button>
                    </Form>
                </div>
            ) : null}
        </div>
    )
}

export default ChatLog

