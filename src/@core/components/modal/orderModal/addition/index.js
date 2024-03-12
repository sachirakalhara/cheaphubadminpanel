import React from "react"
import Modal from "../../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import Flatpickr from "react-flatpickr"
import {PRICE_TERMS} from "../../../../../const/constant"

const options = {
    enableTime: false,
    dateFormat: 'Y-m-d'
}

const OrderAdditionModal = (props) => {

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
        <Modal show={props.show} toggle={props.toggle} headTitle="Add New Order">
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='poNumber'>
                        PO Number
                    </Label>
                    <Controller
                        name='poNumber'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='poNumber' placeholder='PO Number' value={field.value}
                                   invalid={props.errors.poNumber && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.poNumber && <FormFeedback>Please enter a valid po number</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='customer'>
                        Customer Name
                    </Label>
                    <Controller
                        control={props.control}
                        name='customer'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='customer'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Customer'
                                    options={props.customersList}
                                    theme={selectThemeColors}
                                    value={props.customersList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.customer)}
                                />
                            )
                        }}
                    />
                    {props.errors.customer && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please enter a valid customer name</span>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='poDate'>
                        PO Date
                    </Label>
                    <Controller
                        control={props.control}
                        name='poDate'
                        render={({field: {onChange, value, name}}) => {
                            return (
                                <Flatpickr
                                    className='form-control w-100'
                                    id='poDate'
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
                    {props.errors.poDate && <FormFeedback>Please select a po date</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='deliveryDate'>
                        Delivery Date
                    </Label>
                    <Controller
                        control={props.control}
                        name='deliveryDate'
                        render={({field: {onChange, value, name}}) => {
                            return (
                                <Flatpickr
                                    className='form-control w-100'
                                    id='deliveryDate'
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
                    {props.errors.deliveryDate && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a delivery date</span>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='destination'>
                        Destination
                    </Label>
                    <Controller
                        control={props.control}
                        name='destination'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='destination'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Destination'
                                    options={props.destinationList}
                                    theme={selectThemeColors}
                                    value={props.destinationList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.destination)}
                                />
                            )
                        }}
                    />
                    {props.errors.destination && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a destination</span>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='priceTerm'>
                        Price Term
                    </Label>
                    <Controller
                        control={props.control}
                        name='priceTerm'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='priceTerm'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Price Term'
                                    options={PRICE_TERMS}
                                    theme={selectThemeColors}
                                    value={PRICE_TERMS.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.priceTerm)}
                                />
                            )
                        }}
                    />
                    {props.errors.priceTerm && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a price term</span>}
                </Col>

                {/*<div className="gy-2"/>*/}

                {/*<Col md={6} xs={12}>*/}
                {/*    <Label className='form-label mb-1' for='name'>*/}
                {/*        Name*/}
                {/*    </Label>*/}
                {/*    <Controller*/}
                {/*        name='name'*/}
                {/*        control={props.control}*/}
                {/*        render={({field}) => (*/}
                {/*            <Input {...field} id='name' placeholder='Name' value={field.value}*/}
                {/*                   invalid={props.errors.name && true} autoComplete="off"/>*/}
                {/*        )}*/}
                {/*    />*/}
                {/*    {props.errors.name && <FormFeedback>Please enter a valid Name</FormFeedback>}*/}
                {/*</Col>*/}

                {/*<Col md={6} xs={12}>*/}
                {/*    <Label className='form-label mb-1' for='number'>*/}
                {/*        Number*/}
                {/*    </Label>*/}
                {/*    <Controller*/}
                {/*        name='number'*/}
                {/*        control={props.control}*/}
                {/*        render={({field}) => (*/}
                {/*            <Input {...field} id='number' placeholder='Number' value={field.value}*/}
                {/*                   invalid={props.errors.number && true} autoComplete="off" type="number"/>*/}
                {/*        )}*/}
                {/*    />*/}
                {/*    {props.errors.number && <FormFeedback>Please enter a valid Number</FormFeedback>}*/}
                {/*</Col>*/}
                <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                    <Button type='submit' className='me-1' color='success'>
                        Submit
                    </Button>
                    <Button type='reset' color='secondary' outline onClick={props.toggle}>
                        Discard
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default OrderAdditionModal
