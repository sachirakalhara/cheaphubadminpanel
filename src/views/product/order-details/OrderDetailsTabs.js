// ** React Imports
import React, { Fragment } from 'react'

// ** Reactstrap Imports
import {Card, ListGroupItem, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap'

import {Link, useParams} from 'react-router-dom'
import OrderDetailsList from "./OrderDetailsList"
import ConsumptionList from "./ConsumptionList"
import img from '@src/assets/images/sideBar/orders.svg'
import imgWhite from '@src/assets/images/sideBar/orders-black.svg'
import img2 from '@src/assets/images/tabs/estimated.svg'
import img2White from '@src/assets/images/tabs/edtimated-white.svg'
import YarnRequirement from './YarnRequirement'

// ** Order Components

const OrderDetailsTab = ({ active, toggleTab, orderInfo }) => {
    const {id} = useParams()
  return (
    <Fragment>
      <Nav pills className='mt-4 mb-0 pb-0 ms-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')} tag={Link} to={`/order/order-details/${id}/order-details`}>
            {/*<User className='font-medium-3 me-50' />*/}
              <img src={active === '1' ? img : imgWhite} alt="img" height={20} width={20} className="me-1"/>
            <span className='fw-bold'>Order Details</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')} tag={Link} to={`/order/order-details/${id}/estimated-consumption`}>
            {/*<Lock className='font-medium-3 me-50' />*/}
              <img src={active === '2' ? img2White : img2} alt="img" height={20} width={20} className="me-1"/>
            <span className='fw-bold'>Estimated Consumption</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')} tag={Link} to={`/order/order-details/${id}/total-yarn-requirement`}>
            {/*<Lock className='font-medium-3 me-50' />*/}
              <img src={active === '3' ? img2White : img2} alt="img" height={20} width={20} className="me-1"/>
            <span className='fw-bold'>Total Yarn Requirement</span>
          </NavLink>
        </NavItem>
      </Nav>

      <hr className='invoice-spacing mt-0 pt-0'/>

      <TabContent activeTab={active}>
        <TabPane tabId='1'>
            <OrderDetailsList orderInfo={orderInfo}/>
        </TabPane>
        <TabPane tabId='2'>
            <ConsumptionList/>
        </TabPane>
        <TabPane tabId='3'>
            <YarnRequirement/>
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default OrderDetailsTab
