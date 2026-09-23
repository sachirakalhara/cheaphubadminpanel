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
import {MessageSquare, Menu, PhoneCall, Video, Search, MoreVertical, Mic, Image, Send, Paperclip, X} from 'react-feather'
import {useParams} from "react-router-dom";

// ** Reactstrap Imports
import {
    Form,
    Input,
    Button,
    InputGroup
} from 'reactstrap'

// Image attachments: must match the backend rule on ticket/comment.
const ATTACHMENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024
const ATTACHMENT_ERROR = 'Please select an image under 5MB (jpg, png, webp, gif)'

const ChatLog = props => {
    // ** Props & Store
    const {handleUser, handleUserSidebarRight, handleSidebar, chatDetails, userSidebarLeft, replyCallback, replyWithAttachmentCallback} = props

    // ** Refs & Dispatch
    const chatArea = useRef(null);
    const dispatch = useDispatch();

    // ** State
    const [msg, setMsg] = useState('')
    const textareaRef = useRef(null)

    const fileInputRef = useRef(null)
    const [attachment, setAttachment] = useState(null)
    const [attachmentPreview, setAttachmentPreview] = useState(null)
    const [attachmentError, setAttachmentError] = useState('')
    const [sending, setSending] = useState(false)
    const [lightboxUrl, setLightboxUrl] = useState(null)

    // Free the preview's object URL when it is replaced or the chat unmounts.
    useEffect(() => {
        return () => {
            if (attachmentPreview) URL.revokeObjectURL(attachmentPreview)
        }
    }, [attachmentPreview])

    // Lightbox closes on Escape.
    useEffect(() => {
        if (!lightboxUrl) return
        const onKey = e => {
            if (e.key === 'Escape') setLightboxUrl(null)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightboxUrl])

    // ** Scroll to chat bottom
    const scrollToBottom = () => {
        const chatContainer = ReactDOM.findDOMNode(chatArea.current)
        chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
    }

    // ** If user chat is not empty scrollToBottom
    useEffect(() => {
        const chatDetailsLen = Object.keys(chatDetails).length
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
                    time: msg.time,
                    attachmentUrl: msg.attachmentUrl
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
                            time: msg.time,
                            attachmentUrl: msg.attachmentUrl
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
                                {item.attachmentUrl && (
                                    <img
                                        src={item.attachmentUrl}
                                        alt='Attachment'
                                        onClick={() => setLightboxUrl(item.attachmentUrl)}
                                        className='d-block rounded mb-1'
                                        style={{maxWidth: '240px', maxHeight: '240px', objectFit: 'contain', cursor: 'zoom-in'}}
                                    />
                                )}
                                {item.msg ? (
                                    <p className='mb-1' style={{
                                        wordWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        overflowWrap: 'break-word',
                                        hyphens: 'auto',
                                        whiteSpace: 'pre-wrap'
                                    }}>{renderWithLinks(item.msg)}</p>
                                ) : null}
                                <small className={`${item.senderId !== 11 ? 'text-muted' : 'text-white'} d-block`}>
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

    const handleMsgChange = (e) => {
        setMsg(e.target.value)
        const el = e.target
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    }

    const renderWithLinks = (text) => {
        if (!text) return text
        const parts = text.split(/(https?:\/\/[^\s]+|www\.[^\s]+)/gi)
        return parts.map((part, i) => {
            if (/^(https?:\/\/|www\.)/i.test(part)) {
                const href = /^www\./i.test(part) ? `https://${part}` : part
                return (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                       style={{color: '#7367f0', textDecoration: 'underline'}}>
                        {part}
                    </a>
                )
            }
            return part
        })
    }

    const clearAttachment = () => {
        setAttachment(null)
        setAttachmentPreview(null)
        setAttachmentError('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleAttachmentChange = e => {
        const file = e.target.files && e.target.files[0]
        // Reset so picking the same file again still fires onChange.
        e.target.value = ''
        if (!file) return

        if (!ATTACHMENT_TYPES.includes(file.type) || file.size > ATTACHMENT_MAX_BYTES) {
            setAttachmentError(ATTACHMENT_ERROR)
            return
        }

        setAttachmentError('')
        setAttachment(file)
        setAttachmentPreview(URL.createObjectURL(file))
    }

    // ** Sends New Msg
    const handleSendMsg = async e => {
        e.preventDefault()
        if (sending) return

        // Image message: wait for the upload; only clear the input on success,
        // so a failed upload keeps the preview for a retry.
        if (attachment) {
            setSending(true)
            const ok = await replyWithAttachmentCallback(msg, attachment)
            setSending(false)
            if (ok) {
                setMsg('')
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto'
                }
                clearAttachment()
            }
            return
        }

        if (msg.trim().length) {
            replyCallback(msg)
            setMsg('')
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
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

                    {/* Attachment preview / validation error — zero-height anchor so it
                        overlays the bottom of the chat log instead of pushing the
                        fixed-height form out of view. */}
                    {(attachmentPreview || attachmentError) && (
                        <div style={{position: 'relative', height: 0}}>
                            <div className='bg-white border-top px-1 py-50'
                                 style={{position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2}}>
                                {attachmentPreview && (
                                    <div style={{position: 'relative', display: 'inline-block'}}>
                                        <img
                                            src={attachmentPreview}
                                            alt='Selected attachment'
                                            className='rounded border'
                                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                        />
                                        <Button
                                            type='button'
                                            color='dark'
                                            size='sm'
                                            className='btn-icon rounded-circle p-25'
                                            onClick={clearAttachment}
                                            disabled={sending}
                                            aria-label='Remove image'
                                            style={{position: 'absolute', top: '-8px', right: '-8px'}}
                                        >
                                            <X size={12}/>
                                        </Button>
                                    </div>
                                )}
                                {attachmentError && (
                                    <small className='text-danger d-block'>{attachmentError}</small>
                                )}
                            </div>
                        </div>
                    )}

                    <Form className='chat-app-form' onSubmit={e => handleSendMsg(e)}>
                        <InputGroup className='input-group-merge me-1 form-send-message'>
                            <Input
                                type='textarea'
                                value={msg}
                                onChange={handleMsgChange}
                                placeholder='Type your message or use speech to text'
                                disabled={props.ticketDetails.status !== "open"}
                                rows={1}
                                innerRef={textareaRef}
                                style={{resize: 'none', maxHeight: '200px', overflowY: 'auto'}}
                            />
                        </InputGroup>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept={ATTACHMENT_TYPES.join(',')}
                            onChange={handleAttachmentChange}
                            className='d-none'
                        />
                        <Button type='button' color='primary' outline className='btn-icon me-1'
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                disabled={props.ticketDetails.status !== "open" || sending}
                                aria-label='Attach image' title='Attach image'
                        >
                            <Paperclip size={14}/>
                        </Button>
                        <Button className='send' color='primary'
                                disabled={props.ticketDetails.status !== "open" || (!msg.trim() && !attachment) || sending}
                        >
                            <Send size={14} className='d-lg-none'/>
                            <span className='d-none d-lg-block'>{sending ? 'Sending...' : 'Send'}</span>
                        </Button>
                    </Form>
                </div>
            ) : null}

            {/* Full-size image viewer */}
            {lightboxUrl && ReactDOM.createPortal(
                <div
                    onClick={() => setLightboxUrl(null)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 2000, padding: '1rem',
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Button
                        type='button'
                        color='light'
                        className='btn-icon rounded-circle'
                        onClick={() => setLightboxUrl(null)}
                        aria-label='Close'
                        style={{position: 'absolute', top: '1rem', right: '1rem'}}
                    >
                        <X size={20}/>
                    </Button>
                    <img
                        src={lightboxUrl}
                        alt='Attachment'
                        onClick={e => e.stopPropagation()}
                        className='rounded'
                        style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
                    />
                </div>,
                document.body
            )}
        </div>
    )
}

export default ChatLog

