// ** React Imports
import React, {Fragment, useEffect, useState} from 'react'

// ** Reactstrap Imports
import {Card, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap'


import DiameterList from "./DiameterList"
import ConsumptionList from "./ConsumptionList"
import ComponentsList from "./ComponentsList"
import * as stylesService from "../../../services/style-resources"
import {customToastMsg} from "../../../utility/Utils"
import {Link, useParams} from "react-router-dom"
import img1 from '@src/assets/images/tabs/component.svg'
import img1White from '@src/assets/images/tabs/component-white.svg'
import img2 from '@src/assets/images/tabs/diameter-calculation.svg'
import img2White from '@src/assets/images/tabs/diameter-calculation-white.svg'


// eslint-disable-next-line no-unused-vars
const OrderDetailsTab = ({active, toggleTab, componentList, components, data, baseSize}) => {

    const [styleComponent, setStyleComponent] = useState([])
    const [stylComponentList, setStyleComponentList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [selectedSize, setSelectedSize] = useState('')
    const [sizesList, setSizesList] = useState([])

    const {id} = useParams()


    const getAllStyleComponents = async (array) => {
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
                    console.log(list)
                    console.log(array)

                    const nonmatched = list.filter(function (val) {
                        return array.map(function (e) {
                            return e.label
                        }).indexOf(val.label) === -1
                    })

                    console.log(nonmatched)

                } else {
                    customToastMsg(res.data.title, res.status)
                }
            })
    }

    const getStyleComponentById = async () => {
        await stylesService.getComponentsByStyleId(id)
            .then(async res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            value: item.component.id,
                            label: item.component.type,
                            ratio: item.ratio
                        })
                    })
                    setStyleComponentList(list)
                    setStyleComponent(res.data)
                    await getAllStyleComponents(list)

                } else {
                    customToastMsg(res.data.title, res.status)
                }
            })
    }

    // eslint-disable-next-line no-unused-vars
    const getSizesById = async () => {
        await stylesService.getSizesByStyleId(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.garmentSize,
                            value: item.garmentSize
                        })
                    })
                    setSizesList(list)
                    if (list.length !== 0) {
                        setSelectedSize(list[0].value)
                    }

                }
            })
    }

    useEffect(async () => {
        await getStyleComponentById()
        // await getSizesById()
    }, [])

    return (
        <Fragment>
            <Nav pills className='mt-3 mb-0 pb-0 ms-2'>
                <NavItem>
                    <NavLink active={active === '1'} onClick={() => toggleTab('1')} tag={Link}
                             to={`/styles/styles-details/${id}/components`}>
                        <img src={active === '1' ? img1White : img1} alt="img" height={20} width={20} className="me-1"/>
                        <span className='fw-bold'>Components</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '2'} onClick={async () => {
                        toggleTab('2')
                        await getStyleComponentById()
                    }} tag={Link} to={`/styles/styles-details/${id}/diameter-confirmation`}>
                        <img src={active === '2' ? img2White : img2} alt="img" height={20} width={20} className="me-1"/>
                        <span className='fw-bold'>Diameter Confirmation</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '3'} onClick={async () => {
                        toggleTab('3')
                        // await getSizesById()
                    }} tag={Link} to={`/styles/styles-details/${id}/consumption-confirmation`}>
                        <img src={active === '3' ? img2White : img2} alt="img" height={20} width={20} className="me-1"/>
                        <span className='fw-bold'>Consumption Confirmation</span>
                    </NavLink>
                </NavItem>
            </Nav>

            <hr className='invoice-spacing mt-0 pt-0'/>

            <TabContent activeTab={active}>
                <TabPane tabId='1'>
                    <ComponentsList
                        componentList={componentList}
                        components={components}
                        styleComponent={stylComponentList}
                    />
                </TabPane>
                <TabPane tabId='2'>
                    <DiameterList
                        componentList={stylComponentList}
                        components={styleComponent}
                    />
                </TabPane>
                <TabPane tabId='3'>
                    {active === '3' && (
                        <ConsumptionList
                            componentList={stylComponentList}
                            components={styleComponent}
                            styleData={data}
                            sizesList={sizesList}
                            selectedSizeValue={baseSize}
                        />
                    )}
                </TabPane>
            </TabContent>
        </Fragment>
    )
}
export default OrderDetailsTab
