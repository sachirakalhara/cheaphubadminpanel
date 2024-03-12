import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'

const DiameterModal = (props) => {

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
        <Modal show={props.show} toggle={props.toggle} headTitle={props.isEditMode ? "Edit Diameter" : "Add Diameter"}>
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                {props.dropDown1}
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='knittingDia'>
                        Knitting Diameter
                    </Label>
                    <Controller
                        control={props.control}
                        name='knittingDia'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='knittingDia'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Knitting Diameter'
                                    options={props.knittingDiaList}
                                    theme={selectThemeColors}
                                    value={props.knittingDiaList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.knittingDia)}
                                />
                            )
                        }}
                    />

                    {props.errors.knittingDia && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a knitting diameter</span>}
                </Col>
                {props.dropdown2}
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='smv'>
                        SMV
                    </Label>
                    <Controller
                        name='smv'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='smv' placeholder='SMV' value={field.value}
                                   invalid={props.errors.smv && true} type="number" autoComplete="off"/>
                        )}
                    />
                    {props.errors.smv && <FormFeedback>Please enter a valid smv</FormFeedback>}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='weight'>
                        Weight (g)
                    </Label>
                    <Controller
                        name='weight'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='weight' placeholder='Weight' value={field.value}
                                   invalid={props.errors.weight && true} autoComplete="off" type="number"
                                   onChange={(e) => {
                                       if (/^(?:\d*\.\d{1,4}|\d+)$/.test(e.target.value) || e.target.value.length === 0) {
                                           field.onChange(e)
                                       }
                                   }}
                            />
                        )}
                    />
                    {props.errors.weight && <FormFeedback>Please enter a valid weight</FormFeedback>}
                </Col>
                <Col xs={12} className='d-flex justify-content-end mt-2 pt-3'>
                    <Button type='submit' className='me-1' color='success'>
                        {props.isEditMode ? 'Edit' : 'Submit'}
                    </Button>
                    <Button type='reset' color='secondary' outline onClick={props.toggle}>
                        Discard
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default DiameterModal
