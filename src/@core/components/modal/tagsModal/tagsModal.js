import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'


const TagsModal = (props) => {

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
        <Modal show={props.show} toggle={props.toggle} headTitle={props.isEditMode ? "Update Tag" : "Add Tag"} size={'lg'}>
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='name'>
                       Tag Name
                    </Label>
                    <Controller
                        name='name'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='name' placeholder='Tag Name' value={field.value}
                                   invalid={props.errors.name && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.name && <FormFeedback>Please enter a valid tag name</FormFeedback>}
                </Col>

                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='description'>
                        Category Description
                    </Label>
                    <Controller
                        name='description'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='description' placeholder='Tag Description' value={field.value}
                                   type="textarea" rows='4'
                                   invalid={props.errors.description && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.description &&
                    <FormFeedback>Please enter a valid tag description</FormFeedback>}
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

export default TagsModal
