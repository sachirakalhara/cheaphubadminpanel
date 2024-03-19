// ** Reactstrap Imports
import {Card, CardBody, CardText, Row, Col, Table, Button} from 'reactstrap'
import React, {useEffect, useState} from "react"
import UserTabs from "../../apps/user/view/Tabs"
import StyleDetailsTab from "./StyleDetailsTabs"
import {Link, useParams} from "react-router-dom"
import * as stylesService from "../../../services/style-resources"
import {customToastMsg} from "../../../utility/Utils"
import {ArrowLeft} from "react-feather"

const PreviewStyles = ({styleDetails, componentList, components}) => {
    const [active, setActive] = useState()
    const [data, setData] = useState({})
    const {id} = useParams()
    const toggleTab = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    useEffect(async () => {
        const lastParam = window.location.href.split("/").pop()
        switch (lastParam) {
            case 'components':
                setActive('1')
                break
            case 'diameter-confirmation':
                setActive('2')
                break
            case 'consumption-confirmation':
                setActive('3')
                break
            default:
                setActive('1')
                break
        }

        await stylesService.getStyleById(id)
            .then(res => {
                if (res.success) {
                    setData(res.data)
                } else {
                    customToastMsg(res.data?.title, res.status)
                }
            })
    }, [])

    return styleDetails !== null ? (
        <Card className='invoice-preview-card'>
            <CardBody className='invoice-padding pb-0'>
                {/* Header */}
                <div className='d-flex align-items-center mb-2'>
                    <Link to='/categories/list'>
                    <span className='go-back cursor-pointer'><ArrowLeft size={25}/></span>
                    </Link>
                    <h2 className='text-primary invoice-logo ms-1' style={{marginTop: 5}}>Style Details</h2>
                </div>
                <div
                    className='d-flex align-items-center flex-md-row flex-column invoice-spacing mt-0'>
                    <div>
                        <div className='invoice-date-wrapper w-100'>
                            <p className='invoice-date-title w-100'>Style Number:</p>
                            <p className='invoice-date'>{data.styleNumber}</p>
                        </div>
                    </div>
                    <div className="ms-5 me-5">
                        <div className='invoice-date-wrapper w-100'>
                            <p className="mt-1">Style Description:</p>
                            <p className='invoice-date'>{data.styleDescription}</p>
                        </div>
                    </div>
                    {/*<div className='mt-md-0 ms-0'>*/}
                    {/*    <div className='invoice-date-wrapper w-100'>*/}
                    {/*        <p className='invoice-date-title'>Created Date:</p>*/}
                    {/*        <p className='invoice-date'>{new Date().toLocaleDateString()}</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className='ms-5 me-5'>
                        <div className='invoice-date-wrapper w-100'>
                            <p className='invoice-date-title w-100'>Fallout Percentage:</p>
                            <p className='invoice-date'>{data.falloutPercentage !== null && data.falloutPercentage !== undefined ? `${data.falloutPercentage}%` : null}</p>
                        </div>
                    </div>
                    <div className='ms-5 me-5'>
                        <div className='invoice-date-wrapper w-100'>
                            <p className='invoice-date-title w-100'>Base Size:</p>
                            <p className='invoice-date'>{data.baseSize !== null && data.baseSize !== undefined ? data.baseSize : null}</p>
                        </div>
                    </div>
                </div>

                <StyleDetailsTab active={active} toggleTab={toggleTab} orderInfo={styleDetails}
                                 componentList={componentList}
                                 components={components}
                                 data={data}
                                 baseSize={data.baseSize !== null && data.baseSize !== undefined ? data.baseSize : null}
                />

            </CardBody>
        </Card>
    ) : null
}

export default PreviewStyles
