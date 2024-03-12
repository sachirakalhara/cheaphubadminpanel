import React from "react"
import {Col, Row} from "reactstrap"
import ComponentsTable from "./ComponentsTable"

const ComponentsList = ({componentList, components, styleComponent}) => {
    return (
        <div id='dashboard-ecommerce'>
            <Row className='match-height'>
                <Col lg='2' xs='1'/>
                <Col lg='8' xs='10'>
                    <ComponentsTable
                        componentList={componentList}
                        components={components}
                        styleComponent={styleComponent}
                    />
                </Col>
                <Col lg='2' xs='1'/>
            </Row>
        </div>
    )
}

export default ComponentsList
