// ** Reactstrap Imports
import {Card, CardBody, CardText, Row, Col, Table, Button} from 'reactstrap'
import React, {useEffect, useState} from "react"
import UserTabs from "../../apps/user/view/Tabs"
import OrderDetailsTab from "./OrderDetailsTabs"
import {ArrowLeft, ChevronLeft} from "react-feather"
import {Link} from "react-router-dom"

const moment = require('moment')

const PreviewOrder = ({data}) => {
    const [active, setActive] = useState()
    const toggleTab = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    useEffect(() => {
        const lastParam = window.location.href.split("/").pop()
        switch (lastParam) {
            case 'order-details':
                setActive('1')
                break
            case 'estimated-consumption':
                setActive('2')
                break
            case 'total-yarn-requirement':
                setActive('3')
                break
            default:
                setActive('1')
                break
        }
    }, [])

    return data !== null ? (
        <Card className='invoice-preview-card'>
            <CardBody className='invoice-padding pb-0'>
                {/* Header */}
                <div className='d-flex align-items-center mb-2'>
                    <Link to='/products/list'>
                        <span className='go-back cursor-pointer'><ArrowLeft size={25}/></span>
                    </Link>
                    <h2 className='text-primary invoice-logo ms-1' style={{marginTop: 5}}>Order Info</h2>
                </div>
                <div
                    className='d-flex align-items-center flex-md-row flex-column invoice-spacing mt-0'>
                    <div>
                        <div className='invoice-date-wrapper'>
                            <p className='invoice-date-title'>PO Number:</p>
                            <p className='invoice-date'>{data.poNumber}</p>
                        </div>
                        <div className='invoice-date-wrapper mt-1'>
                            <p className='invoice-date-title'>Customer:</p>
                            <p className='invoice-date'>{data.customer ? data.customer.name : null}</p>
                        </div>
                    </div>
                    <div className='mt-md-0 ms-5 ps-5'>
                        <div className='invoice-date-wrapper w-100'>
                            <p className='invoice-date-title width-100 me-2'>Delivery Date:</p>
                            <p className='invoice-date'>{moment(data.deliveryDate).format('YYYY-MM-DD')}</p>
                        </div>
                        {/*<div className='invoice-date-wrapper w-100'>*/}
                        {/*    <p className='invoice-date-title text-truncate text-hide'>.</p>*/}
                        {/*</div>*/}
                        <div className='invoice-date-wrapper mt-1'>
                            <p className='invoice-date-title'>Destination:</p>
                            <p className='invoice-date'>{data.destination ? data.destination.name : null}</p>
                        </div>
                    </div>
                    <div className="ms-5 ps-5">
                        <div className='invoice-date-wrapper w-100'>
                            <p className='invoice-date-title'>PO Date:</p>
                            <p className='invoice-date'>{moment(data.poDate).format('YYYY-MM-DD')}</p>
                        </div>
                        <div className='invoice-date-wrapper w-100'>
                            <p className='invoice-date-title text-truncate text-hide'>.</p>
                        </div>
                    </div>
                </div>

                <OrderDetailsTab active={active} toggleTab={toggleTab} orderInfo={data}/>

            </CardBody>

            {/*<CardBody className='invoice-padding pt-0'>*/}
            {/*  <Row>*/}
            {/*    <Col sm='12'>*/}
            {/*      <span className='fw-bold'>Note: </span>*/}
            {/*      <span>*/}
            {/*        It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance*/}
            {/*        projects. Thank You!*/}
            {/*      </span>*/}
            {/*    </Col>*/}
            {/*  </Row>*/}
            {/*</CardBody>*/}
            {/* /Invoice Note */}
        </Card>
    ) : null
}

export default PreviewOrder
