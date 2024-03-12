import React, {useEffect, useState} from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import Flatpickr from "react-flatpickr"
import {SHIFT} from "../../../../const/constant"
import * as stylesService from "../../../../services/style-resources"
import * as machineService from "../../../../services/machine-resources"
// eslint-disable-next-line no-unused-vars
import * as orderServices from "../../../../services/order-resources"

const options = {
    enableTime: false,
    dateFormat: 'Y-m-d'
}

const ProductionRejectionModal = (props) => {

    const [stylesList, setStylesList] = useState([])
    const [stylesComponentList, setStylesComponentList] = useState([])
    const [machineList, setMachineList] = useState([])
    const [orderList, setOrderList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [orderItemsList, setOrderItemsList] = useState([])

    // eslint-disable-next-line no-unused-vars
    const getStylesDetails = async () => {
        await stylesService.getAllStyles()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.styleNumber,
                            value: item.id
                        })
                    })
                    setStylesList(list)
                }
            })
    }

    const getStylesComponents = async (id) => {
        await stylesService.getComponentsByStyleId(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.component.type,
                            value: item.component.id
                        })
                    })
                    setStylesComponentList(list)
                }
            })
    }

    const getMachines = async () => {
        await machineService.getMachines()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.name,
                            value: item.id
                        })
                    })
                    setMachineList(list)
                }
            })
    }

    const getAllOrders = async () => {
        await orderServices.getOrders()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.poNumber,
                            value: item.id
                        })
                    })
                    setOrderList(list)
                }
            })
    }

    // eslint-disable-next-line no-unused-vars
    const getOrderItems = async (id) => {
        await orderServices.getOrderItems(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.content.map(item => {
                        list.push({
                            label: item.orderItemId,
                            value: item.orderItemId
                        })
                    })
                    setOrderItemsList(list)
                }
            })
    }

    const getStylesByOrderId = async (id) => {
        await stylesService.getStylesByOrderId(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.styleNumber,
                            value: item.styleId
                        })
                    })
                    setStylesList(list)
                }
            })
    }

    useEffect(async () => {
        // await getStylesDetails()
        await getMachines()
        await getAllOrders()
        if (props.isEditMode) {
            // await getOrderItems(props.orderId)
            await getStylesByOrderId(props.orderId)
            await getStylesComponents(props.styleId)
        }
    }, [])

    const customStyle = (error) => ({
        control: styles => ({
            ...styles,
            borderColor: error ? '#EA5455' : styles.borderColor,
            '&:hover': {
                borderColor: error ? '#EA5455' : styles['&:hover'].borderColor
            }
        })
    })

    return (
        <Modal show={props.show} toggle={props.toggle} headTitle="Production and Rejections">
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='date'>
                        Date
                    </Label>
                    <Controller
                        control={props.control}
                        name='date'
                        render={({field: {onChange, value, name}}) => {
                            return (
                                <Flatpickr
                                    className='form-control w-100'
                                    id='date'
                                    options={options}
                                    value={value}
                                    /* eslint-disable-next-line no-unused-vars */
                                    onChange={([date], dateStr) => {
                                        onChange(dateStr)
                                    }}
                                    name={name}
                                />
                            )
                        }}
                    />
                    {props.errors.date && <FormFeedback>Please select a date</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='shift'>
                        Shift
                    </Label>
                    <Controller
                        control={props.control}
                        name='shift'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='shift'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Shift'
                                    options={SHIFT}
                                    theme={selectThemeColors}
                                    value={SHIFT.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.shift)}
                                />
                            )
                        }}
                    />
                    {props.errors.shift &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a shift</span>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='orderId'>
                        Order
                    </Label>
                    <Controller
                        control={props.control}
                        name='orderId'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='orderId'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Order'
                                    options={orderList}
                                    theme={selectThemeColors}
                                    value={orderList.find((c) => c.value === value)}
                                    onChange={async (selectedOption) => {
                                        onChange(selectedOption.value)
                                        await getStylesByOrderId(selectedOption.value)
                                        // await getOrderItems(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.orderId)}
                                />
                            )
                        }}
                    />
                    {props.errors.orderId &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a order</span>}
                </Col>

                {/*<Col md={6} xs={12}>*/}
                {/*    <Label className='form-label mb-1' for='orderId'>*/}
                {/*        Order Item*/}
                {/*    </Label>*/}
                {/*    <Controller*/}
                {/*        control={props.control}*/}
                {/*        name='orderItemId'*/}
                {/*        render={({field: {onChange, value, name, ref}}) => {*/}
                {/*            return (*/}
                {/*                <Select*/}
                {/*                    id='orderItemId'*/}
                {/*                    className='react-select'*/}
                {/*                    classNamePrefix='select'*/}
                {/*                    placeholder='Order Item'*/}
                {/*                    options={orderItemsList}*/}
                {/*                    theme={selectThemeColors}*/}
                {/*                    value={orderItemsList.find((c) => c.value === value)}*/}
                {/*                    onChange={async (selectedOption) => {*/}
                {/*                        onChange(selectedOption.value)*/}
                {/*                    }}*/}
                {/*                    name={name}*/}
                {/*                    inputRef={ref}*/}
                {/*                    required={true}*/}
                {/*                    errorText={true}*/}
                {/*                    styles={customStyle(props.errors.orderItemId)}*/}
                {/*                />*/}
                {/*            )*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    {props.errors.orderItemId &&*/}
                {/*    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select Order Item</span>}*/}
                {/*</Col>*/}

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='style'>
                        Style
                    </Label>
                    <Controller
                        control={props.control}
                        name='style'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='style'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Style'
                                    options={stylesList}
                                    theme={selectThemeColors}
                                    value={stylesList.find((c) => c.value === value)}
                                    onChange={async (selectedOption) => {
                                        onChange(selectedOption.value)
                                        await getStylesComponents(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.style)}
                                />
                            )
                        }}
                    />
                    {props.errors.style &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a style</span>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='component'>
                        Component
                    </Label>
                    <Controller
                        control={props.control}
                        name='component'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='component'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Component'
                                    options={stylesComponentList}
                                    theme={selectThemeColors}
                                    value={stylesComponentList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.component)}
                                />
                            )
                        }}
                    />
                    {props.errors.component &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a component</span>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='machine'>
                        Machine
                    </Label>
                    <Controller
                        control={props.control}
                        name='machine'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='machine'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Machine'
                                    options={machineList}
                                    theme={selectThemeColors}
                                    value={machineList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.machine)}
                                />
                            )
                        }}
                    />
                    {props.errors.machine &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a machine</span>}
                </Col>

                {/*<div className="gy-2"/>*/}

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='production'>
                        Production PCS
                    </Label>
                    <Controller
                        name='production'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='production' placeholder='Production PCS' value={field.value}
                                   invalid={props.errors.production && true} autoComplete="off" type="number"/>
                        )}
                    />
                    {props.errors.production && <FormFeedback>Please enter a valid production (PCS)</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='productionWeight'>
                        Production Weight (Kg)
                    </Label>
                    <Controller
                        name='productionWeight'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='productionWeight' placeholder='Production Weight' value={field.value}
                                   invalid={props.errors.productionWeight && true} autoComplete="off" type="number"
                                   onChange={(e) => {
                                       if (/^(?:\d*\.\d{1,4}|\d+)$/.test(e.target.value) || e.target.value.length === 0) {
                                           field.onChange(e)
                                       }
                                   }}
                            />
                        )}
                    />
                    {props.errors.productionWeight &&
                    <FormFeedback>Please enter a valid production weight</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='rejection'>
                        Rejection Weight (Kg)
                    </Label>
                    <Controller
                        name='rejection'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='rejection' placeholder='Rejection Weight' value={field.value}
                                   invalid={props.errors.rejection && true} autoComplete="off" type="number"
                                   onChange={(e) => {
                                       if (/^(?:\d*\.\d{1,4}|\d+)$/.test(e.target.value) || e.target.value.length === 0) {
                                           field.onChange(e)
                                       }
                                   }}
                            />
                        )}
                    />
                    {props.errors.rejection && <FormFeedback>Please enter a valid rejection weight</FormFeedback>}
                </Col>
                <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                    <Button type='submit' className='me-1' color='success'>
                        {props.isEditMode ? 'Update' : 'Submit'}
                    </Button>
                    <Button type='reset' color='secondary' outline onClick={props.toggle}>
                        Discard
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default ProductionRejectionModal
