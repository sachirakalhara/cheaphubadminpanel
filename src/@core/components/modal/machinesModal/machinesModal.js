import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'


const MachinesModal = (props) => {

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
        <Modal show={props.show} toggle={props.toggle} headTitle={props.isEditMode ? "Update Machinery" : "Add Machinery"}>
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='modelNumber'>
                        Model Number
                    </Label>
                    <Controller
                        name='modelNumber'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='modelNumber' placeholder='Model Number' value={field.value}
                                   invalid={props.errors.modelNumber && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.modelNumber && <FormFeedback>Please enter a valid model number</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='knittingDiameter'>
                        Knitting Diameter
                    </Label>
                    <Controller
                        control={props.control}
                        name='knittingDiameter'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='knittingDiameter'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Knitting Diameter'
                                    options={props.list}
                                    theme={selectThemeColors}
                                    value={props.list.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.knittingDiameter)}
                                />
                            )
                        }}
                    />
                    {props.errors.knittingDiameter && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a knitting diameter</span>}
                </Col>

                <div className="gy-2"/>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='name'>
                        Name
                    </Label>
                    <Controller
                        name='name'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='name' placeholder='Name' value={field.value}
                                   invalid={props.errors.name && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.name && <FormFeedback>Please enter a valid name</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='number'>
                        Number
                    </Label>
                    <Controller
                        name='number'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='number' placeholder='Number' value={field.value}
                                   invalid={props.errors.number && true} autoComplete="off" type="number"/>
                        )}
                    />
                    {props.errors.number && <FormFeedback>Please enter a valid number</FormFeedback>}
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

export default MachinesModal
