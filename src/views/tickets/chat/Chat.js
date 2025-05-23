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

    // ** Formats chat data based on sender
    const formattedChatData = () => {
        let chatLog = []
        if (chatDetails.chat) {
            chatLog = chatDetails.chat.chat
        }

        const formattedChatLog = []
        let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined
        let msgGroup = {
            senderId: chatMessageSenderId,
            messages: []
        }
        chatLog.forEach((msg, index) => {
            if (chatMessageSenderId === msg.senderId) {
                msgGroup.messages.push({
                    msg: msg.message,
                    time: msg.time
                })
            } else {
                chatMessageSenderId = msg.senderId
                formattedChatLog.push(msgGroup)
                msgGroup = {
                    senderId: msg.senderId,
                    messages: [
                        {
                            msg: msg.message,
                            time: msg.time
                        }
                    ]
                }
            }
            if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
        })
        return formattedChatLog
    }

    // ** Renders user chat
    const renderChats = () => {
        return formattedChatData().map((item, index) => {
            return (
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
                        {item.messages.map(chat => (
                            <div key={chat.msg} className='chat-content'>
                                <p>{chat.msg}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        })
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
