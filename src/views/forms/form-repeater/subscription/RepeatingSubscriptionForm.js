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

const RepeatingSubscriptionForm = (props) => {

    const getFormatterRepeatArray = (array) => {
        let list = [];

        if (props.isManageMode) {
            if (array.length === 0) {
                list = [{id: null, name: '', gateway_fee: '', serials: '', errors: {}}]
            } else {
                array.map(item => {
                    list.push({
                        id: item.id,
                        name: item.name,
                        gateway_fee: item.gateway_fee.toString(),
                        serials: item.serial,
                        errors: {}
                    })
                })
            }
        } else {
            list = [{id: null, name: '', gateway_fee: '', serials: '', errors: {}}]
        }
        console.log("list???????????????????????", list)
        return list;
    }

    const [count, setCount] = useState(1);
    const [subscriptions, setSubscriptions] = useState(getFormatterRepeatArray(props.subscriptionList));

    useEffect(() => {
        getContributionProductDetails(false);
    }, [])

    const getContributionProductDetails = (isIncreased = false) => {
        ContributionProductService.getContributionDetailsById(props.productId)
            .then(res => {
                if (res.success) {
                    const formattedList = getFormatterRepeatArray(res.data.contribution_product.subscriptions);
                    setSubscriptions(formattedList)
                    if (isIncreased) {
                        increaseCount(formattedList);
                    }
                } else {
                    customToastMsg(res.message, res.status)
                }
            })
    }

    const increaseCount = (list) => {
        setCount(count + 1);
        setSubscriptions([...list, {id: null, name: '', gateway_fee: '', serials: '', errors: {}}]);
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
        const {name, gateway_fee, serials} = subscriptions[index];
        const errors = {};

        if (!name.trim()) {
            errors.name = 'Subscription Name is required';
        }

        if (!gateway_fee.trim()) {
            errors.gateway_fee = 'Gateway Fee is required'
        }

        if (!serials.trim()) {
            errors.serials = 'Serial List is required'
        }

        const isValid = Object.keys(errors).length === 0;
        const updatedSubscriptions = [...subscriptions];
        updatedSubscriptions[index].errors = errors;
        setSubscriptions(updatedSubscriptions);

        return isValid;
    };

    const saveForm = (e, index) => {
        e.preventDefault();
        if (validateFields(index)) {
            // Perform save operation (e.g., send data to backend)
            const formData = subscriptions[index];
            console.log('Submitting Form:', formData);


            let data = new FormData();
            data.append('contribution_product_id', props.productId)
            data.append('name', formData.name)
            data.append('serial', formData.serials)
            // data.append('refresh_count',props.productId)
            data.append('gateway_fee', formData.gateway_fee)

            ContributionProductService.createSubscription(data)
                .then(res => {
                    if (res.success) {
                        customToastMsg("Subscription was successfully created", 1);
                        getContributionProductDetails(true);
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
        }
    };

    return (
        <Card className="mt-2">
            <CardHeader>
                <h4 className='card-title'>Subscription</h4>
            </CardHeader>
            <CardBody>
                {subscriptions.map((subscription, index) => {
                    const Tag = index === 0 ? 'div' : SlideDown;
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
                                    <Col md={8} className='mb-md-0 mb-1'>
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
                                    <Col md={1}>
                                        <Button color='primary' className='text-nowrap mt-2'
                                                onClick={(e) => saveForm(e, index)} outline>
                                            <Save size={14} className='me-50'/>
                                            <span>{subscription.id === null ? "Save" : "Update"}</span>
                                        </Button>
                                    </Col>
                                    <Col md={2}>
                                        <Button color='danger' className='text-nowrap mt-2'
                                                onClick={(e) => deleteForm(e, index, subscription.id)} outline>
                                            <X size={14} className='me-50'/>
                                            <span>{subscription.id !== null ? "Delete" : "Remove"}</span>
                                        </Button>
                                    </Col>
                                    <Col sm={12}>
                                        <hr/>
                                    </Col>
                                </Row>
                            </Form>
                        </Tag>
                    );
                })}
                <Button className='btn-icon' color='primary' onClick={() => increaseCount(subscriptions)}>
                    <Plus size={14}/>
                    <span className='align-middle ms-25'>Add New</span>
                </Button>
            </CardBody>
        </Card>
    );
};

export default RepeatingSubscriptionForm;
