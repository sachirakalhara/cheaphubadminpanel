import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {SIZES} from "../../../../const/constant"
import {selectThemeColors} from '@utils'

const AdditionModal = (props) => {
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
        <Modal show={props.show} toggle={props.toggle} headTitle="Add Style">
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='styleNumber'>
                        Style Number
                    </Label>
                    <Controller
                        name='styleNumber'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='styleNumber' placeholder='Style Number' value={field.value}
                                   invalid={props.errors.styleNumber && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.styleNumber && <FormFeedback>Please enter a valid style number</FormFeedback>}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='styleDescription'>
                        Style Description
                    </Label>
                    <Controller
                        name='styleDescription'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='styleDescription' placeholder='Style Description' value={field.value}
                                   invalid={props.errors.styleDescription && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.styleDescription &&
                    <FormFeedback>Please enter a valid style description</FormFeedback>}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='falloutPercentage'>
                        Fallout Percentage
                    </Label>
                    <Controller
                        name='falloutPercentage'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='falloutPercentage' placeholder='Fallout Percentage'
                                   value={field.value}
                                   invalid={props.errors.falloutPercentage && true} autoComplete="off" type="number"
                                   onChange={(e) => {
                                       if ((/^(?:\d*\.\d{1,2}|\d+)$/.test(e.target.value) || e.target.value.length === 0) && e.target.value < 100) {
                                           field.onChange(e)
                                       }
                                   }}
                            />
                        )}
                    />
                    {props.errors.falloutPercentage &&
                    <FormFeedback>Please enter a valid fallout percentage</FormFeedback>}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='baseSize'>
                        Base Size
                    </Label>
                    <Controller
                        control={props.control}
                        name='baseSize'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='baseSize'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Base Size'
                                    options={SIZES}
                                    theme={selectThemeColors}
                                    value={SIZES.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.baseSize)}
                                />
                            )
                        }}
                    />
                    {props.errors.baseSize &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a base size</span>}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='baseSize'>
                       Colors
                    </Label>
                    <Controller
                        control={props.control}
                        name='colors'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='colors'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Colors'
                                    options={props.colorsList}
                                    theme={selectThemeColors}
                                    value={props.colorsList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.colors)}
                                    isMulti
                                />
                            )
                        }}
                    />
                    {props.errors.colors &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select colors</span>}
                </Col>
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

export default AdditionModal
