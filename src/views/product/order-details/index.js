// ** React Imports
import React, {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'

// ** Reactstrap Imports
import {Row, Col, Alert} from 'reactstrap'

// ** Invoice Preview Components
import PreviewOrder from './PreviewOrder'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

import * as orderService from '../../../services/order-resources'
import {customToastMsg} from "../../../utility/Utils"
import {toggleLoading} from '@store/loading'
import {useDispatch} from "react-redux"

const InvoicePreview = () => {
    // ** HooksVars
    const {id} = useParams()
    const dispatch = useDispatch()

    // ** States
    const [data, setData] = useState([])

    // ** Get invoice on mount based on id
    useEffect(async () => {
        dispatch(toggleLoading())
        await orderService.getOrderById(id)
            .then(res => {
                if (res.success) {
                    setData(res.data)
                    dispatch(toggleLoading())
                } else {
                    dispatch(toggleLoading())
                    setData(null)
                    customToastMsg(res.data.title, res.status)
                }
            })
    }, [])

    return data !== null ? (
        <div className='invoice-preview-wrapper'>
            <Row className='invoice-preview'>
                <Col>
                    <PreviewOrder data={data}/>
                </Col>
            </Row>
        </div>
    ) : (
        <Alert color='danger'>
            <h4 className='alert-heading'>Order not found</h4>
            <div className='alert-body'>
                Order with id: {id} doesn't exist. Check list of all order:{' '}
                <Link to='/products/list'>Order List</Link>
            </div>
        </Alert>
    )
}

export default InvoicePreview
