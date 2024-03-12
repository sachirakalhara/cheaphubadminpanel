import React from "react"
import {Col, Row} from "reactstrap"
import PreviewAnalytics from "./PreviewAnalytics"

const AnalyticsView = () => {
    return (
        <div className='invoice-preview-wrapper'>
            <Row className='invoice-preview'>
                <Col>
                    <PreviewAnalytics/>
                </Col>
            </Row>
        </div>
    )
}

export default AnalyticsView
