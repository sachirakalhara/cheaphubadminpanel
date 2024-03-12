import React from "react"
import Modal from "../index"
import {Button, CardBody, CardText, Col, Input, Row} from "reactstrap"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import {SlideDown} from "react-slidedown"
import {Plus, X} from "react-feather"
import Repeater from '@components/repeater'

const ComponentModal = (props) => {
    const customStyles = {
        placeholder: base => ({
            ...base,
            position: 'absolute'
        }),
        container: base => ({
            ...base,
            alignItems: 'flex-end'
        })
    }

    // ** Deletes form
    const deleteForm = e => {
        e.preventDefault()
        e.target.closest('.repeater-wrapper').remove()
        console.log(e.target)
    }

    return (
        <Modal show={props.show} toggle={props.toggle} headTitle="Add Components">
            <Row className='gy-1 pt-3 justify-content-center'>
                <Row>
                    <Col md={8} className="d-flex justify-content-start ps-0">
                        <h4>Component</h4>
                    </Col>
                    <Col md={4} className="d-flex justify-content-start ps-0">
                        <h4>Ratio</h4>
                    </Col>
                </Row>
                {props.allowedComponents.map((item, i) => (
                    <div key={i} className='repeater-wrapper mt-2'>
                        <Col className='d-flex align-items-center'>
                            <Row className="w-100">
                                <Col md={8}>
                                    <Input
                                        value={item.component}
                                        onChange={props.onChangeText}
                                        disabled
                                    />
                                </Col>
                                <Col md={4}>
                                    <Input
                                        id='ratio'
                                        placeholder='Ratio'
                                        onChange={props.onChangeText}
                                        autoComplete="off"
                                        // value={field.value}
                                        // invalid={props.errors.qty && true}
                                    />
                                </Col>
                            </Row>
                            <div
                                className='ms-2'>
                                <X size={18} className='cursor-pointer' color={'transparent'}/>
                            </div>
                        </Col>
                    </div>
                ))}


                <Repeater count={props.count}>
                    {i => {
                        const Tag = i === 0 ? 'div' : SlideDown
                        return (
                            <Tag key={i} className='repeater-wrapper mt-2'>
                                <Col className='d-flex align-items-center'>
                                    <Row className="w-100">
                                        <Col md={8}>
                                            <Select
                                                styles={customStyles}
                                                className='react-select'
                                                classNamePrefix='select'
                                                options={props.list}
                                                theme={selectThemeColors}
                                                placeholder="Select Component"
                                                // value={props.colorsList.find((c) => c.value === value)}
                                                onChange={props.onSelect}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Input
                                                id='ratio'
                                                placeholder='Ratio'
                                                onChange={props.onChangeText}
                                                autoComplete="off"
                                                // value={field.value}
                                                // invalid={props.errors.qty && true}
                                            />
                                        </Col>
                                    </Row>
                                    <div
                                        className='ms-2'>
                                        <X size={18} className='cursor-pointer' onClick={deleteForm}/>
                                    </div>
                                </Col>
                            </Tag>
                        )
                    }}
                </Repeater>

                <Button className="w-75 mt-3" onClick={() => props.setCount(props.count + 1)}>
                    <Plus size={14} className='me-25'></Plus> <span className='align-middle'>Add More Components</span>
                </Button>


                <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                    <Button className='me-1' color='success'>
                        Save
                    </Button>
                    <Button type='reset' color='secondary' outline>
                        Clear
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default ComponentModal
