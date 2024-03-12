import React from "react"
import {Col, ModalBody, ModalHeader, Row, Modal} from "reactstrap"

const ModalComponent = (props) => {
    return (
        <Modal isOpen={props.show} toggle={props.toggle} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={props.toggle}>{props.headTitle}</ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                {props.children}
            </ModalBody>
        </Modal>
    )
}

export default ModalComponent
