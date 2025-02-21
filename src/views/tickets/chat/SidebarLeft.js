// ** React Imports
import React, { useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { selectChat } from './store'
import { useDispatch } from 'react-redux'

// ** Utils
import { formatDateToMonthShort, isObjEmpty } from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { X, Search, CheckSquare, Bell, User, Trash } from 'react-feather'

// ** Reactstrap Imports
import {CardText, InputGroup, InputGroupText, Badge, Input, Button, Label, CardBody, Row, Col, Card} from 'reactstrap'
import logo from "../../../assets/images/logo/logo.png";

const SidebarLeft = props => {
  // ** Props & Store
  const { store, sidebar, handleSidebar, userSidebarLeft, handleUserSidebarLeft } = props
  const { chats, contacts, userProfile } = store

  // ** Dispatch
  const dispatch = useDispatch()

  // ** State
  const [query, setQuery] = useState('')
  const [about, setAbout] = useState('')
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState('online')
  const [filteredChat, setFilteredChat] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])

  // ** Handles User Chat Click
  const handleUserClick = id => {
    dispatch(selectChat(id))
    setActive(id)
    if (sidebar === true) {
      handleSidebar()
    }
  }

  useEffect(() => {
    if (!isObjEmpty(store.selectedUser)) {
      if (store.selectedUser.chat) {
        setActive(store.selectedUser.chat.id)
      } else {
        setActive(store.selectedUser.contact.id)
      }
    }
  }, [])

  return store ? (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('sidebar-content')}
        >
          <PerfectScrollbar className='chat-user-list-wrapper list-group' options={{ wheelPropagation: false }}>
            {/*<h4 className='chat-list-title'>Chats</h4>*/}
            <Card className='invoice-preview-card'>
              <CardBody className='invoice-padding'>
                <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                  <div className='w-100'>
                    <div className='logo-wrapper d-flex d-inline mb-1 align-items-center'>
                      <img src={logo} width={50} height={50} alt={'logo'}/>
                      <h3 className='text-primary invoice-logo ms-1 mt-25'>CheapHub</h3>
                    </div>
                    <Row className="align-items-center">
                      <Col lg={12}>
                        <p className='card-text mb-25'><span className="fw-bold text-black">Ticket Number: </span>Tick00001</p>
                        <p className='card-text mb-25'><span className="fw-bold text-black">Order Number: </span>ORD00001</p>
                        <p className='card-text mb-25'><span
                            className="fw-bold text-black">Customer Name: </span> Kavinda Dilshan</p>
                        <p className='card-text mb-25'><span
                            className="fw-bold text-black">Email: </span> kavindadilshan@gmail.com</p>
                        <p className='card-text mb-0'><span
                            className="fw-bold text-black">Created At: </span> 01 month ago</p>
                      </Col>
                    </Row>

                  </div>
                </div>
              </CardBody>
            </Card>



          </PerfectScrollbar>
        </div>
      </div>
    </div>
  ) : null
}

export default SidebarLeft
