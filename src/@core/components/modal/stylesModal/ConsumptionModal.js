import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'

const ConsumptionModal = (props) => {

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
        <Modal show={props.show} toggle={props.toggle}
               headTitle={!props.isEditMode ? "Add Yarn Consumption" : "Edit Yarn Consumption"}>

            <div className="d-flex mt-2 pt-1">
                <div className="d-flex w-25 justify-content-between">
                    <p className='invoice-date-title'>Style Number</p>
                    <p className='invoice-date-title'>:</p>
                </div>
                <p className='invoice-date-title ms-2'>{props.styleData.styleNumber}</p>
            </div>
            <div className="d-flex pt-1">
                <div className="d-flex w-25 justify-content-between">
                    <p className='invoice-date-title'>Size</p>
                    <p className='invoice-date-title'>:</p>
                </div>
                <p className='invoice-date-title ms-2'>{props.selectedSize}</p>
            </div>

            <Row tag='form' onSubmit={props.onSubmit}>
                <Col md={12} xs={12} className="d-flex align-items-center">
                    <div className="d-flex w-25 justify-content-between pt-1">
                        <p className='invoice-date-title'>Component</p>
                        <p className='invoice-date-title'>:</p>
                    </div>
                    <div>
                        <Controller
                            control={props.control}
                            name='component'
                            render={({field: {onChange, value, name, ref}}) => {
                                return (
                                    <Select
                                        id='component'
                                        className='react-select ms-2'
                                        classNamePrefix='select'
                                        placeholder='Component'
                                        options={props.componentList}
                                        theme={selectThemeColors}
                                        value={props.componentList.find((c) => c.value === value)}
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

                        <div className="position-absolute ms-2">
                            {props.errors.component && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a component</span>}
                        </div>

                    </div>

                </Col>
                <h5 className="mt-3 mb-2">Yarn Details</h5>
                {props.renderDropDown1}
                {props.renderDropDown2}
                {props.renderInput1}
                <div className="mt-2"/>

                <Col md={4} xs={12}>
                    <Label className='form-label mb-1' for='yarnTwist'>
                        Dependant Color
                    </Label>
                    <Controller
                        control={props.control}
                        name='dependantColor'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='dependantColor'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Dependency Color'
                                    options={props.dependantColorList}
                                    theme={selectThemeColors}
                                    value={props.dependantColorList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.dependantColor)}
                                />
                            )
                        }}
                    />

                    {props.errors.dependantColor && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a dependant color</span>}
                </Col>

                <Col md={4} xs={12}>
                    <Label className='form-label mb-1' for='consumption'>
                        Consumption
                    </Label>
                    <Controller
                        name='consumption'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='consumption' placeholder='Consumption' value={field.value}
                                   onChange={props.onConsumptionChange}
                                   invalid={props.errors.consumption && true} autoComplete="off" type="number"/>
                        )}
                    />
                    {props.errors.consumption && <FormFeedback>Please enter a valid consumption</FormFeedback>}
                </Col>

                <Col md={4} xs={12}>
                    <Label className='form-label mb-1' for='consumptionFallOut'>
                        Consumption with Fallout
                    </Label>
                    <Controller
                        name='consumptionFallOut'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='consumptionFallOut' placeholder='Consumption FallOut'
                                   value={field.value} disabled
                                   invalid={props.errors.consumptionFallOut && true}/>
                        )}
                    />
                    {props.errors.consumptionFallOut && <FormFeedback>Please enter a valid consumption fallout</FormFeedback>}
                </Col>
                <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                    <Button className='me-1' color='success'>
                        {!props.isEditMode ? 'Save' : 'Update'}
                    </Button>
                    <Button type='reset' color='secondary' outline onClick={props.toggle}>
                        Discard
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default ConsumptionModal
