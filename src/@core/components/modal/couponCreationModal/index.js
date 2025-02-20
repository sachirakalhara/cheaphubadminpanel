import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, InputGroup, InputGroupText, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import Flatpickr from "react-flatpickr";


const CouponCreationModal = (props) => {

    return (
        <Modal show={props.show} toggle={props.toggle}
               headTitle={props.isEditMode ? "Update Coupon Code" : "Add Coupon Code"} size={'lg'}>
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='couponCode'>
                        Product Type
                    </Label>
                    <div className="d-inline d-flex">
                        <Controller
                            name="bulkProducts"
                            control={props.control}
                            render={({ field }) => (
                                <div className="form-check form-check-inline">
                                    <Input
                                        type="checkbox"
                                        id="bulkProducts"
                                        checked={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.checked)
                                            if (e.target.checked) {
                                                props.setValue("subscriptionProducts", false);
                                            }
                                        }}
                                    />
                                    <Label for="bulkProducts" className="form-check-label">
                                        Bulk Products
                                    </Label>
                                </div>
                            )}
                        />

                        <Controller
                            name="subscriptionProducts"
                            control={props.control}
                            render={({ field }) => (
                                <div className="form-check form-check-inline">
                                    <Input
                                        type="checkbox"
                                        id="subscriptionProducts"
                                        checked={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.checked)
                                            if (e.target.checked) {
                                                props.setValue("bulkProducts", false);
                                            }
                                        }}
                                    />
                                    <Label for="subscriptionProducts" className="form-check-label">
                                        Subscription Products
                                    </Label>
                                </div>
                            )}
                        />
                    </div>
                </Col>

                <Col md={6} xs={6}>
                    <Label className='form-label mb-1' for='couponCode'>
                        Coupon Code
                    </Label>
                    <Controller
                        name='couponCode'
                        control={props.control}
                        render={({field}) => (
                            <InputGroup className='input-group-merge'>
                                <Input {...field} id='couponCode' placeholder='Coupon Code' value={field.value}
                                       invalid={props.errors.couponCode && true} autoComplete="off"/>
                                <InputGroupText onClick={e => e.preventDefault()}
                                                className="bg-success text-white cursor-pointer">
                                    Generate
                                </InputGroupText>
                            </InputGroup>
                        )}
                    />
                    {props.errors.couponCode && <FormFeedback>Please enter a valid coupon code</FormFeedback>}
                </Col>

                <Col md={6} xs={6}>
                    <Label className='form-label mb-1' for='discount'>
                        Discount
                    </Label>
                    <Controller
                        name='discount'
                        control={props.control}
                        render={({field}) => (
                            <InputGroup className='input-group-merge'>
                                <Input {...field} id='discount' placeholder='Coupon Code' value={field.value}
                                       invalid={props.errors.discount && true} autoComplete="off"/>
                                <InputGroupText>
                                    %
                                </InputGroupText>
                            </InputGroup>
                        )}
                    />
                    {props.errors.discount &&
                    <FormFeedback>Please enter a discount</FormFeedback>}
                </Col>

                <Col md={6} xs={6}>
                    <Label className='form-label mb-1' for='description'>
                        Expiration Date
                    </Label>
                <Controller
                    control={props.control}
                    name="expirationDate"
                    render={({ field: { onChange, value, name } }) => {
                        return (
                            <Flatpickr
                                className="form-control w-100"
                                placeholder="Select date"
                                id="expirationDate"
                                value={value}
                                onChange={([date], dateStr) => {
                                    onChange(dateStr);
                                }}
                                name={name}
                                // options={getDatePickerOptions()}
                            />
                        );
                    }}
                />
                {props.errors.expirationDate && <FormFeedback>Please select the expiration date</FormFeedback>}
                </Col>

                <Col md={6} xs={6}>
                    <Label className='form-label mb-1' for='maxDiscount'>
                        Max Discount
                    </Label>
                    <Controller
                        name='maxDiscount'
                        control={props.control}
                        render={({field}) => (
                            <InputGroup className='input-group-merge'>
                                <Input {...field} id='maxDiscount' placeholder='Max Discount' value={field.value}
                                       invalid={props.errors.maxDiscount && true} autoComplete="off"/>
                                <InputGroupText>
                                    $
                                </InputGroupText>
                            </InputGroup>
                        )}
                    />
                    {props.errors.maxDiscount &&
                    <FormFeedback>Please enter a max discount</FormFeedback>}
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

export default CouponCreationModal
