// ** React Imports
import React, {Fragment, useEffect} from 'react'

// ** Reactstrap Imports
import {Card, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap'

import {Link} from "react-router-dom"
import img1 from '@src/assets/images/tabs/analytics-black.svg'
import img1White from '@src/assets/images/tabs/analytics-white.svg'
import ProductionAnalysis from "./analytics-details/ProductionAnalytisis"
import OrderAnalysis from "./analytics-details/OrderAnalysis"
import YarnAnalysis from "./analytics-details/YarnAnalysis"


// eslint-disable-next-line no-unused-vars
const AnalyticsTab = ({active, toggleTab}) => {

    useEffect(async () => {

    }, [])


    return (
        <Fragment>
            <Nav pills className='mt-3 mb-0 pb-0 ms-2'>
                <NavItem>
                    <NavLink active={active === '1'} onClick={() => toggleTab('1')}
                             tag={Link}
                             to={`/analytics/production-analysis`}
                    >
                        <img src={active === '1' ? img1White : img1} alt="img" height={20} width={20} className="me-1"/>
                        <span className='fw-bold'>Production Analysis</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '2'} onClick={async () => toggleTab('2')}
                             tag={Link}
                             to={`/analytics/yarn-analysis`}
                    >
                        <img src={active === '2' ? img1White : img1} alt="img" height={20} width={20} className="me-1"/>
                        <span className='fw-bold'>Yarn Analysis</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '3'} onClick={async () => toggleTab('3')}
                             tag={Link}
                             to={`/analytics/order-analysis`}
                    >
                        <img src={active === '3' ? img1White : img1} alt="img" height={20} width={20} className="me-1"/>
                        <span className='fw-bold'>Order Analysis</span>
                    </NavLink>
                </NavItem>
            </Nav>

            <hr className='invoice-spacing mt-0 pt-0'/>

            <TabContent activeTab={active}>
                <TabPane tabId='1'>
                    <ProductionAnalysis/>
                </TabPane>
                <TabPane tabId='2'>
                    <YarnAnalysis/>
                </TabPane>
                <TabPane tabId='3'>
                    <OrderAnalysis/>
                </TabPane>
            </TabContent>
        </Fragment>
    )
}
export default AnalyticsTab
