// ** React Imports
import React, {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'

// ** Reactstrap Imports
import {Row, Col, Alert} from 'reactstrap'

// ** Invoice Preview Components
import PreviewStyles from './PreviewStyles'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import * as stylesService from "../../../services/style-resources"
import {customToastMsg} from "../../../utility/Utils"

import {toggleLoading} from '@store/loading'
import {useDispatch} from "react-redux"

// import * as orderService from '../../../services/order'
// import {customToastMsg} from "../../../utility/Utils"

const InvoicePreview = () => {
    // ** HooksVars
    const {id} = useParams()
    const dispatch = useDispatch()

    // ** States
    // eslint-disable-next-line no-unused-vars
    const [data, setData] = useState([])
    const [componentList, setComponentList] = useState([])
    const [components, setComponents] = useState([])

    const getAllStyleComponents = async () => {
        dispatch(toggleLoading())
        await stylesService.getAllStyleComponents()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map((item, i) => {
                        list.push({
                            value: item.component.id,
                            label: item.component.type,
                            ratio: '',
                            name: `newObj${i}`
                        })
                    })
                    setComponentList(list)
                    setComponents(res.data)
                } else {
                    customToastMsg(res.data.title, res.status)
                }
                dispatch(toggleLoading())
            })
    }

    // ** Get invoice on mount based on id
    useEffect(async () => {
        await stylesService.getStyleById(id)
            .then(res => {
                if (!res.success) {
                    setData(null)
                }
            })
        await getAllStyleComponents()
    }, [])

    return data !== null ? (
        <div className='invoice-preview-wrapper'>
            <Row className='invoice-preview'>
                <Col>
                    <PreviewStyles data={data} componentList={componentList} components={components}/>
                </Col>
            </Row>
        </div>
    ) : (
        <Alert color='danger'>
            <h4 className='alert-heading'>Style not found</h4>
            <div className='alert-body'>
                Style with id: {id} doesn't exist. Check list of all Styles:{' '}
                <Link to='/styles/list'>Styles List</Link>
            </div>
        </Alert>
    )
}

export default InvoicePreview
