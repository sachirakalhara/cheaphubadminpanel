import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, InputGroup, InputGroupText, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Flatpickr from "react-flatpickr";
import {editDateFormatter} from "../../../../utility/commonFun";


const CouponCreationModal = (props) => {

    const generatePromoCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let promoCode = '';
        for (let i = 0; i < 10; i++) {
            promoCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        props.setValue('couponCode', promoCode);
        props.clearErrors('couponCode');
    };

    const watchCampaignEnabled = props.watch ? props.watch('campaignEnabled') : false;
    const watchCampaignAudience = props.watch ? props.watch('campaignAudience') : '';

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
                            render={({field}) => (
                                <div className="form-check form-check-inline">
                                    <Input
                                        type="checkbox"
                                        id="bulkProducts"
                                        checked={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.checked)
                                            if (e.target.checked) {
                                                props.clearErrors("subscriptionProducts");
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
                            render={({field}) => (
                                <div className="form-check form-check-inline">
                                    <Input
                                        type="checkbox"
                                        id="subscriptionProducts"
                                        checked={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.checked)
                                            if (e.target.checked) {
                                                props.clearErrors("bulkProducts");
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

                    {(props.errors.bulkProducts || props.errors.subscriptionProducts) &&
                        <FormFeedback className="d-block">At least one product type must be selected.</FormFeedback>}

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
                                       invalid={props.errors.couponCode && true} autoComplete="off"
                                       disabled={props.isEditMode}/>
                                <InputGroupText onClick={e => {
                                    e.preventDefault();
                                    generatePromoCode();
                                }}
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
                                <Input {...field} id='discount' type="number" placeholder='Discount' value={field.value}
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
                        render={({field: {onChange, value, name}}) => {
                            return (
                                <Flatpickr
                                    className="form-control w-100"
                                    placeholder="Select date"
                                    id="expirationDate"
                                    value={value!==null?editDateFormatter(value):value}
                                    onChange={([date], dateStr) => {
                                        onChange(dateStr);
                                    }}
                                    // Pin to d-m-Y so the field holds ONE format everywhere:
                                    // what the API returns, what editDateFormatter expects, and
                                    // what the backend saves. Without this, flatpickr defaults to
                                    // Y-m-d and picking a date produced an unparseable value.
                                    options={{dateFormat: 'd-m-Y'}}
                                    name={name}
                                />
                            );
                        }}
                    />
                    {props.errors.expirationDate &&
                        <FormFeedback className="d-block">Please select the expiration date</FormFeedback>}
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
                                <Input {...field} id='maxDiscount' type="number" placeholder='Max Discount'
                                       value={field.value}
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

                {/* ── Schedule Section ── */}
                <Col xs={12} className="mt-2">
                    <hr/>
                    <h6 className="text-primary fw-bold">Schedule</h6>
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1'>Activation Date & Time</Label>
                    <Controller
                        control={props.control}
                        name="scheduledStart"
                        render={({field: {onChange, value}}) => (
                            <Flatpickr
                                className="form-control w-100"
                                placeholder="Select activation date & time"
                                value={value || null}
                                onChange={([date], dateStr) => onChange(dateStr)}
                                options={{enableTime: true, dateFormat: 'Y-m-d H:i', time_24hr: true}}
                            />
                        )}
                    />
                    <small className="text-muted">Coupon will auto-activate at this time</small>
                </Col>

                <Col md={6} xs={12}>
                    <Label className='form-label mb-1'>Scheduled End Date & Time</Label>
                    <Controller
                        control={props.control}
                        name="scheduledEnd"
                        render={({field: {onChange, value}}) => (
                            <Flatpickr
                                className="form-control w-100"
                                placeholder="Select end date & time"
                                value={value || null}
                                onChange={([date], dateStr) => onChange(dateStr)}
                                options={{enableTime: true, dateFormat: 'Y-m-d H:i', time_24hr: true}}
                            />
                        )}
                    />
                    {props.errors.scheduledEnd &&
                        <FormFeedback className="d-block">{props.errors.scheduledEnd.message || 'End must be after start'}</FormFeedback>}
                    <small className="text-muted">Coupon will auto-deactivate at this time</small>
                </Col>

                {/* ── Email Campaign Section ── */}
                <Col xs={12} className="mt-2">
                    <hr/>
                    <div className="d-flex align-items-center gap-2">
                        <Controller
                            name="campaignEnabled"
                            control={props.control}
                            render={({field}) => (
                                <div className="form-check form-switch">
                                    <Input
                                        type="switch"
                                        id="campaignEnabled"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                    <Label for="campaignEnabled" className="form-check-label fw-bold">
                                        Send Email Campaign
                                    </Label>
                                </div>
                            )}
                        />
                    </div>
                </Col>

                {watchCampaignEnabled && (
                    <>
                        <Col md={6} xs={12}>
                            <Label className='form-label mb-1'>Audience</Label>
                            <Controller
                                name="campaignAudience"
                                control={props.control}
                                render={({field}) => (
                                    <Input type="select" {...field} id="campaignAudience"
                                           invalid={props.errors.campaignAudience && true}>
                                        <option value="">Select audience...</option>
                                        <option value="all_customers">All registered customers</option>
                                        <option value="purchased_customers">Customers with at least one purchase</option>
                                        <option value="inactive_customers">Inactive customers (no orders in N days)</option>
                                    </Input>
                                )}
                            />
                            {props.errors.campaignAudience &&
                                <FormFeedback className="d-block">Please select an audience</FormFeedback>}
                        </Col>

                        {watchCampaignAudience === 'inactive_customers' && (
                            <Col md={6} xs={12}>
                                <Label className='form-label mb-1'>Inactive Days</Label>
                                <Controller
                                    name="campaignInactiveDays"
                                    control={props.control}
                                    render={({field}) => (
                                        <Input {...field} type="number" min={1} placeholder="60"
                                               invalid={props.errors.campaignInactiveDays && true}
                                               autoComplete="off"/>
                                    )}
                                />
                                {props.errors.campaignInactiveDays &&
                                    <FormFeedback className="d-block">Please enter the number of inactive days</FormFeedback>}
                                <small className="text-muted">Customers who purchased before but not in the last N days</small>
                            </Col>
                        )}

                        <Col md={6} xs={12}>
                            <Label className='form-label mb-1'>Email Subject</Label>
                            <Controller
                                name="campaignSubject"
                                control={props.control}
                                render={({field}) => (
                                    <Input {...field} placeholder="🎉 Exclusive Coupon Just for You!"
                                           invalid={props.errors.campaignSubject && true} autoComplete="off"/>
                                )}
                            />
                            {props.errors.campaignSubject &&
                                <FormFeedback className="d-block">Please enter an email subject</FormFeedback>}
                        </Col>
                    </>
                )}

                {/* Campaign status (read-only, edit mode only) */}
                {props.isEditMode && props.campaignStatus && (
                    <Col xs={12} className="mt-1">
                        <div className="d-flex gap-3">
                            <small>
                                <strong>Activation Email:</strong>{' '}
                                <span className={props.campaignStatus.activationSent ? 'text-success' : 'text-muted'}>
                                    {props.campaignStatus.activationSent ? '✓ Sent' : 'Pending'}
                                </span>
                            </small>
                            <small>
                                <strong>Reminder Email:</strong>{' '}
                                <span className={props.campaignStatus.reminderSent ? 'text-success' : 'text-muted'}>
                                    {props.campaignStatus.reminderSent ? '✓ Sent' : 'Pending'}
                                </span>
                            </small>
                        </div>
                    </Col>
                )}

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
