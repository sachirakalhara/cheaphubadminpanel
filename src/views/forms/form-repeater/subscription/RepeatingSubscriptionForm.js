// ** React Imports
import React, {useEffect, useState} from 'react'

// ** Custom Components
import Repeater from '@components/repeater'

// ** Third Party Components
import {X, Plus, Save} from 'react-feather'
import {SlideDown} from 'react-slidedown'

// ** Reactstrap Imports
import {Row, Col, Card, CardHeader, CardBody, CardText, Form, Label, Input, Button, FormFeedback} from 'reactstrap'
import * as ContributionProductService from "../../../../services/contribution-products";
import {customToastMsg} from "../../../../utility/Utils";
import qs from "qs";
import {formDataToJson} from "../../../../utility/commonFun";

let selectedObj = 0;

const RepeatingSubscriptionForm = (props) => {

    const getFormatterRepeatArray = (array) => {
        let list = [];

        // if (props.isManageMode) {
        //     if (array.length === 0) {
        //         list = [{id: null, name: '', gateway_fee: '', serials: '', errors: {}}]
        //     } else {
        //         array.map(item => {
        //             list.push({
        //                 id: item.id,
        //                 name: item.name,
        //                 gateway_fee: item.gateway_fee.toString(),
        //                 serials: item.serial,
        //                 errors: {}
        //             })
        //         })
        //     }
        // } else {
        //     list = [{id: null, name: '', gateway_fee: '', serials: '', errors: {}}]
        // }

        if (array.length === 0) {
            list = [{id: null, name: '', gateway_fee: '', serials: '', delivery_type: 'serial_based', service_qty: '', service_info: '', errors: {}}]
        } else {
            array.map(item => {
                list.push({
                    id: item.id,
                    name: item.name,
                    gateway_fee: item.gateway_fee.toString(),
                    serials: item.serial,
                    delivery_type: item.delivery_type || 'serial_based',
                    service_qty: (item.service_qty ?? 0).toString(),
                    service_info: item.service_info || '',
                    errors: {}
                })
            })
        }

        console.log("list???????????????????????", list)
        return list;
    }

    const [count, setCount] = useState(1);
    const [subscriptions, setSubscriptions] = useState(getFormatterRepeatArray(props.subscriptionList));
    const [isNextEnabled, setIsNextEnabled] = useState(!!props.isManageMode);

    useEffect(() => {
        getContributionProductDetails(false);
    }, [])

    const getContributionProductDetails = (isIncreased = false) => {
        ContributionProductService.getContributionDetailsById(props.productId)
            .then(res => {
                if (res.success) {
                    const formattedList = getFormatterRepeatArray(res.data.contribution_product.subscriptions);
                    console.log("formattedList", formattedList)

                    if (isIncreased) {
                        increaseCount(formattedList, selectedObj);
                    }else {
                        setSubscriptions(formattedList)
                    }
                } else {
                    customToastMsg(res.message, res.status)
                }
            })
    }

    const increaseCount = (list, index) => {
        if (subscriptions.length === 0) {
            setSubscriptions([...list, {id: null, name: '', gateway_fee: '', serials: '', delivery_type: 'serial_based', service_qty: '', service_info: '', errors: {}}]);
        } else {
            if (validateFields(index)) {
                setCount(count + 1);
                setSubscriptions([...list, {id: null, name: '', gateway_fee: '', serials: '', delivery_type: 'serial_based', service_qty: '', service_info: '', errors: {}}]);
            }
        }
    };

    const handleInputChange = (index, key, value) => {
        // Create a copy of the subscriptions array
        const updatedSubscriptions = [...subscriptions];
        // Update the value of the specified field for the given subscription
        updatedSubscriptions[index][key] = value;

        // Reset the validation error for the updated field
        const updatedErrors = {...updatedSubscriptions[index].errors};
        delete updatedErrors[key]; // Remove the error for the updated field

        // Update the errors object within the subscription
        updatedSubscriptions[index].errors = updatedErrors;

        // Update the state with the modified subscriptions array
        setSubscriptions(updatedSubscriptions);
    };

    const validateFields = (index) => {
        const {name, gateway_fee, serials, delivery_type, service_qty} = subscriptions[index];
        const errors = {};

        if (!name.trim()) {
            errors.name = 'Subscription Name is required';
        }

        if (!gateway_fee.trim()) {
            errors.gateway_fee = 'Gateway Fee is required'
        }

        if (delivery_type === 'service_based') {
            if (service_qty === undefined || service_qty === null || service_qty.toString().trim() === '') {
                errors.service_qty = 'Available Quantity is required'
            } else if (Number(service_qty) < 0) {
                errors.service_qty = 'Available Quantity cannot be negative'
            }
        } else {
            if (!serials.trim()) {
                errors.serials = 'Serial List is required'
            }
        }

        const isValid = Object.keys(errors).length === 0;
        const updatedSubscriptions = [...subscriptions];
        updatedSubscriptions[index].errors = errors;
        setSubscriptions(updatedSubscriptions);

        return isValid;
    };

    const updateNextButtonState = () => {
        const hasSavedSubscriptions = subscriptions.some(subscription => subscription.id !== null);
        setIsNextEnabled(hasSavedSubscriptions);
    };

    const saveForm = (e, index, subscription) => {
        e.preventDefault();
        if (validateFields(index)) {
            // Perform save operation (e.g., send data to backend)
            const formData = subscriptions[index];
            console.log('Submitting Form:', formData);


            let data = new FormData();

            data.append('name', formData.name)
            data.append('gateway_fee', formData.gateway_fee)
            data.append('delivery_type', formData.delivery_type || 'serial_based')

            if ((formData.delivery_type || 'serial_based') === 'service_based') {
                data.append('service_qty', formData.service_qty)
                data.append('service_info', formData.service_info || '')
            } else {
                data.append('serial', formData.serials)
            }

            if (subscription.id !== null) {
                data.append('id', formData.id)
            } else {
                data.append('contribution_product_id', props.productId)
            }

            const FetchAPI = subscription.id !== null ? ContributionProductService.updateSubscription : ContributionProductService.createSubscription;

            FetchAPI(subscription.id !== null ? qs.stringify(formDataToJson(data)) : data)
                .then(res => {
                    if (res.success) {
                        customToastMsg("Subscription was successfully created", 1);
                        getContributionProductDetails(true);

                        // if (subscription.id !== null){
                        //     props.toggle();
                        // }else {
                        //     updateNextButtonState();
                        // }

                    } else {
                        customToastMsg(res.message, res.status)
                    }
                })
        }
    };

    const deleteItemByServer = (id) => {
        const data = {
            "all": 1,
            "contribution_product_id": props.productId
        }
        ContributionProductService.removeSubscriptionItemById(data, id)
            .then(res => {
                console.log("res", res)
                if (res.success) {
                    customToastMsg("Subscription was successfully deleted", 1);
                    getContributionProductDetails(false);
                } else {
                    customToastMsg(res.message, res.status)
                }
            })
    }

    const deleteForm = (e, index, id) => {

        if (id !== null) {
            deleteItemByServer(id);
        } else {
            e.preventDefault();
            const updatedSubscriptions = [...subscriptions];
            updatedSubscriptions.splice(index, 1);
            setSubscriptions(updatedSubscriptions);
            setCount(count - 1);
            updateNextButtonState(); // Update button state after deletion
        }
    };


    const onNextPage = () => {
        let isValid = true;
        subscriptions.forEach((subscription, index) => {
            if (!validateFields(index)) {
                isValid = false;
            }
        });

        if (isValid) {
            props.nextButtonAction()
        }
    }

    return (
        <div>
            <Card className="mt-2">
                <CardHeader>
                    <h4 className='card-title'>Subscription</h4>
                </CardHeader>
                <CardBody>
                    {subscriptions.map((subscription, index) => {
                        const Tag = index === 0 ? 'div' : SlideDown;
                        selectedObj = index;
                        return (
                            <Tag key={index}>
                                <Form>
                                    <Row className='justify-content-between align-items-center'>
                                        <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label' for={`animation-subscription-name-${index}`}>
                                                Subscription Name
                                            </Label>
                                            <Input
                                                type='text'
                                                id={`animation-subscription-name-${index}`}
                                                placeholder='Subscription Name'
                                                value={subscription.name}
                                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                invalid={subscription.errors.name && true}
                                            />
                                            {subscription.errors.name && (
                                                <FormFeedback>{subscription.errors.name}</FormFeedback>
                                            )}
                                        </Col>
                                        <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label' for={`gateway-fee-${index}`}>
                                                Gateway Fee
                                            </Label>
                                            <Input
                                                type='number'
                                                s id={`gateway-fee-${index}`}
                                                placeholder='Gateway Fee'
                                                value={subscription.gateway_fee}
                                                onChange={(e) => handleInputChange(index, 'gateway_fee', e.target.value)}
                                                invalid={subscription.errors.gateway_fee && true}
                                            />
                                            {subscription.errors.gateway_fee && (
                                                <FormFeedback>{subscription.errors.gateway_fee}</FormFeedback>
                                            )}
                                        </Col>
                                        <Col md={12} className='mb-md-0 mb-1 mt-1'>
                                            <Label className='form-label'>
                                                Delivery Type
                                            </Label>
                                            <div className='d-flex'>
                                                <div className='form-check me-2'>
                                                    <Input
                                                        type='radio'
                                                        id={`delivery-type-serial-${index}`}
                                                        name={`delivery-type-${index}`}
                                                        checked={(subscription.delivery_type || 'serial_based') === 'serial_based'}
                                                        disabled={subscription.id !== null}
                                                        onChange={() => handleInputChange(index, 'delivery_type', 'serial_based')}
                                                    />
                                                    <Label className='form-check-label' for={`delivery-type-serial-${index}`}>
                                                        Serial-based
                                                    </Label>
                                                </div>
                                                <div className='form-check'>
                                                    <Input
                                                        type='radio'
                                                        id={`delivery-type-service-${index}`}
                                                        name={`delivery-type-${index}`}
                                                        checked={subscription.delivery_type === 'service_based'}
                                                        disabled={subscription.id !== null}
                                                        onChange={() => handleInputChange(index, 'delivery_type', 'service_based')}
                                                    />
                                                    <Label className='form-check-label' for={`delivery-type-service-${index}`}>
                                                        Service-based
                                                    </Label>
                                                </div>
                                            </div>
                                        </Col>

                                        {subscription.delivery_type === 'service_based' ? (
                                            <>
                                            <Col md={7} className='mb-md-0 mb-1'>
                                                <Label className='form-label' for={`service-qty-${index}`}>
                                                    Available Quantity
                                                </Label>
                                                <Input
                                                    type='number'
                                                    min='0'
                                                    id={`service-qty-${index}`}
                                                    placeholder='Available Quantity'
                                                    value={subscription.service_qty}
                                                    onChange={(e) => handleInputChange(index, 'service_qty', e.target.value)}
                                                    invalid={subscription.errors.service_qty && true}
                                                />
                                                {subscription.errors.service_qty && (
                                                    <FormFeedback>{subscription.errors.service_qty}</FormFeedback>
                                                )}
                                            </Col>
                                            <Col md={12} className='mb-md-0 mb-1 mt-1'>
                                                <Label className='form-label' for={`service-info-${index}`}>
                                                    Service Info
                                                </Label>
                                                <Input
                                                    type='textarea'
                                                    rows='4'
                                                    id={`service-info-${index}`}
                                                    placeholder='Enter service information that will be shown to the customer'
                                                    value={subscription.service_info}
                                                    onChange={(e) => handleInputChange(index, 'service_info', e.target.value)}
                                                />
                                            </Col>
                                            </>
                                        ) : (
                                            <Col md={7} className='mb-md-0 mb-1'>
                                                <Label className='form-label' for={`serial-list-${index}`}>
                                                    Serial List
                                                </Label>
                                                <Input
                                                    type="textarea"
                                                    rows='4'
                                                    id={`serial-list-${index}`}
                                                    placeholder='Serial List'
                                                    value={subscription.serials}
                                                    onChange={(e) => handleInputChange(index, 'serials', e.target.value)}
                                                    invalid={subscription.errors.serials && true}
                                                />
                                                {subscription.errors.serials && (
                                                    <FormFeedback>{subscription.errors.serials}</FormFeedback>
                                                )}
                                            </Col>
                                        )}
                                        <Col md={2}>
                                            <Button color='primary' className='text-nowrap mt-2'
                                                    onClick={(e) => saveForm(e, index, subscription)} outline>
                                                <Save size={14} className='me-50'/>
                                                <span>{subscription.id === null ? "Save" : "Update"}</span>
                                            </Button>
                                        </Col>
                                        {(index !== 0 || props.isManageMode) && (
                                            <Col md={2}>
                                                <Button color='danger' className='text-nowrap mt-2'
                                                        onClick={(e) => deleteForm(e, index, subscription.id)} outline>
                                                    <X size={14} className='me-50'/>
                                                    <span>{subscription.id !== null ? "Delete" : "Remove"}</span>
                                                </Button>
                                            </Col>

                                        )}


                                        <Col sm={12}>
                                            <hr/>
                                        </Col>
                                    </Row>
                                </Form>
                            </Tag>
                        );
                    })}

                    {/*{props.isManageMode && (*/}
                        <Button className='btn-icon' color='primary'
                                onClick={() => increaseCount(subscriptions, selectedObj)}>
                            <Plus size={14}/>
                            <span className='align-middle ms-25'>Add New</span>
                        </Button>
                    {/*)}*/}

                </CardBody>
            </Card>

            <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                <Button className='me-1' color='success'
                        onClick={() => onNextPage()}
                >
                    Next
                </Button>
                <Button type='reset' color='secondary' outline onClick={props.toggle}>
                    Discard
                </Button>
            </Col>
        </div>

    );
};

export default RepeatingSubscriptionForm;
