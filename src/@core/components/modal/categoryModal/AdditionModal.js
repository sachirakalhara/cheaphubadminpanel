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
        <Modal show={props.show} toggle={props.toggle} headTitle="Add Category" size={'lg'}>
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='name'>
                        Category Name
                    </Label>
                    <Controller
                        name='name'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='name' placeholder='Category Name' value={field.value}
                                   invalid={props.errors.name && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.name && <FormFeedback>Please enter a valid category name</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='description'>
                        Category Description
                    </Label>
                    <Controller
                        name='description'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='description' placeholder='Category Description' value={field.value}
                                   type="textarea" rows='4'
                                   invalid={props.errors.description && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.description &&
                    <FormFeedback>Please enter a valid category description</FormFeedback>}
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
