import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"


const ColorsModal = (props) => {

    return (
        <Modal show={props.show} toggle={props.toggle} headTitle={props.isEditMode ? "Update Color" : "Add Color"}>
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='colorName'>
                        Color Name
                    </Label>
                    <Controller
                        name='colorName'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='colorName' placeholder='Color Name' value={field.value}
                                   invalid={props.errors.colorName && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.colorName && <FormFeedback>Please enter a valid color name</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='colorCode'>
                        Color Code
                    </Label>
                    <Controller
                        name='colorCode'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='colorCode' placeholder='Color Code' value={field.value}
                                   autoComplete="off"/>
                        )}
                    />
                    {/* {props.errors.colorCode && <FormFeedback>Please enter a valid color code</FormFeedback>} */}
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

export default ColorsModal
