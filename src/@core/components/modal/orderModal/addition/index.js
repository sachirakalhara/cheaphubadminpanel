import React, {useState} from "react"
import Modal from "../../index"
import {Button, Col, FormFeedback, Input, Label, Row, UncontrolledTooltip} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import Flatpickr from "react-flatpickr"
import {PRICE_TERMS} from "../../../../../const/constant"
import {AlertCircle} from "react-feather";
import ReactFilesMini from "../../../../../custom-components/file-picker/ReactFiles-Mini";
import Cropper from "react-easy-crop";
import {fileReader, getCroppedImg, isImageFile} from "../../../../../utility/Utils";
import "../../styles.scss";

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
                <Col md={4} xs={12}>
                    <Label className='form-label mb-1' for='productName'>
                        Product Name <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name='productName'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='productName' placeholder='Product Name' value={field.value}
                                   invalid={props.errors.productName && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.productName && <FormFeedback>Please enter a valid name</FormFeedback>}
                </Col>

                <Col md={4} xs={12}>
                    <Label className='form-label mb-1' for='customer'>
                        Product Category <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        control={props.control}
                        name='category'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='category'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Product Category'
                                    options={props.categoryList}
                                    theme={selectThemeColors}
                                    value={props.categoryList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.category)}
                                />
                            )
                        }}
                    />
                    {props.errors.category &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select category</span>}
                </Col>

                <Col md={4} xs={12}>
                    <Label className='form-label mb-1' for='price'>
                        Price <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name='price'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='price' placeholder='Price' value={field.value}
                                   invalid={props.errors.price && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.price && <FormFeedback>Please enter a price</FormFeedback>}
                </Col>


                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='Gateway Fee'>
                        Gateway Fee <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name='gatewayFee'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='gatewayFee' placeholder='Gateway Fee' value={field.value}
                                   invalid={props.errors.gatewayFee && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.gatewayFee && <FormFeedback>Please enter a valid gateway fee</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='tag'>
                        Tag <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        control={props.control}
                        name='tag'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='tag'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Tags'
                                    options={props.tagList}
                                    theme={selectThemeColors}
                                    value={props.tagList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.tag)}
                                />
                            )
                        }}
                    />
                    {props.errors.tag &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a Tag</span>}
                </Col>


                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='description'>
                        Description <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name='description'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='description' placeholder='Description' value={field.value}
                                   type="textarea" rows='4'
                                   invalid={props.errors.description && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.description && <FormFeedback>Please enter a valid description</FormFeedback>}
                </Col>


                {/*<Col md={6} xs={12}>*/}
                {/*    <Label className='form-label mb-1' for='poDate'>*/}
                {/*        PO Date*/}
                {/*    </Label>*/}
                {/*    <Controller*/}
                {/*        control={props.control}*/}
                {/*        name='poDate'*/}
                {/*        render={({field: {onChange, value, name}}) => {*/}
                {/*            return (*/}
                {/*                <Flatpickr*/}
                {/*                    className='form-control w-100'*/}
                {/*                    id='poDate'*/}
                {/*                    options={options}*/}
                {/*                    value={value}*/}
                {/*                    onChange={([date], dateStr) => {*/}
                {/*                        onChange(dateStr)*/}
                {/*                    }}*/}
                {/*                    name={name}*/}
                {/*                />*/}
                {/*            )*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    {props.errors.poDate && <FormFeedback>Please select a po date</FormFeedback>}*/}
                {/*</Col>*/}

                {/*<Col md={6} xs={12}>*/}
                {/*    <Label className='form-label mb-1' for='deliveryDate'>*/}
                {/*        Delivery Date*/}
                {/*    </Label>*/}
                {/*    <Controller*/}
                {/*        control={props.control}*/}
                {/*        name='deliveryDate'*/}
                {/*        render={({field: {onChange, value, name}}) => {*/}
                {/*            return (*/}
                {/*                <Flatpickr*/}
                {/*                    className='form-control w-100'*/}
                {/*                    id='deliveryDate'*/}
                {/*                    options={options}*/}
                {/*                    value={value}*/}
                {/*                    onChange={([date], dateStr) => {*/}
                {/*                        onChange(dateStr)*/}
                {/*                    }}*/}
                {/*                    name={name}*/}
                {/*                />*/}
                {/*            )*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    {props.errors.deliveryDate && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a delivery date</span>}*/}
                {/*</Col>*/}

                {props.renderImageUploader}


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
