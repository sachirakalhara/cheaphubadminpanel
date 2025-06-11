// ** React Imports
import React, {useState, useEffect} from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import {selectChat} from './store'
import {useDispatch} from 'react-redux'

// ** Utils
import {formatDateToMonthShort, isObjEmpty} from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {X, Search, CheckSquare, Bell, User, Trash} from 'react-feather'

// ** Reactstrap Imports
import {CardText, InputGroup, InputGroupText, Badge, Input, Button, Label, CardBody, Row, Col, Card} from 'reactstrap'
import logo from "../../../assets/images/logo/logo.png";
import {setCurrencyWithSymbol, tableDataDateTimeConverter} from "../../../utility/commonFun"
import 'react-perfect-scrollbar/dist/css/styles.css';

const SidebarLeft = props => {
    // ** Props & Store
    const {ticketDetails} = props

    // ** Dispatch
    const dispatch = useDispatch()

    // ** State
    const [active, setActive] = useState(0)


    return  (
        <div className='sidebar-left'>
            <div className='sidebar p-0 bg-danger'>
                <div className={classnames('sidebar-content')}>
                    <PerfectScrollbar className='chat-user-list-wrapper list-group h-100'
                                      options={{wheelPropagation: false}}>
                        <div
                            className='d-flex p-1 justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
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
                                                onClick={props.changeStatusHandler}>
                                            {ticketDetails?.status === 'open' ? "Resolve" : "Resolved"}
                                        </Button>
                                    </Col>

                                    {props.productItems.map((item, index) => (
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
                    </PerfectScrollbar>
                </div>
            </div>
        </div>
    )
}

export default SidebarLeft

