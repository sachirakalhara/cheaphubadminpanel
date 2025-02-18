// ** React Imports
import React, { useEffect, useState } from 'react';

// ** Third Party Components
import { X, Plus, Save } from 'react-feather';
import { SlideDown } from 'react-slidedown';
import { selectThemeColors } from '@utils';

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardBody, Label, Input, Button, FormFeedback, Form } from 'reactstrap';
import Select from 'react-select';
import * as ContributionProductService from '../../../../services/contribution-products';
import {customToastMsg} from "../../../../utility/Utils";

const customStyle = (error) => ({
    control: (styles) => ({
        ...styles,
        borderColor: error ? '#EA5455' : styles.borderColor,
        '&:hover': {
            borderColor: error ? '#EA5455' : styles['&:hover'].borderColor,
        },
    }),
});

const RepeatingPackageForm = (props) => {
    // ** State
    const [packages, setPackages] = useState([
        {
            subscription: '',
            packageName: '',
            duration: '',
            quantity: '',
            replaceCount: '',
            paymentMethods: [],
            price: '',
            errors: {},
        },
    ]);

    const [durationOptions, setDurationOptions] = useState([
        { value: 1, label: '1 month' },
        { value: 2, label: '2 months' },
        { value: 3, label: '3 months' },
        { value: 4, label: '4 months' },
        { value: 5, label: '5 months' },
        { value: 6, label: '6 months' },
        { value: 7, label: '7 months' },
        { value: 8, label: '8 months' },
        { value: 9, label: '9 months' },
        { value: 10, label: '10 months' },
        { value: 11, label: '11 months' },
        { value: 12, label: '12 months' },
    ]);

    const [paymentMethodOptions, setPaymentMethodOptions] = useState([
        { value: 'card', label: 'Card' },
        { value: 'cash', label: 'Cash' },
    ]);

    const [subscriptionList, setSubscriptionList] = useState([]);

    useEffect(() => {
        getAllSubscriptionPackages();
    }, []);

    const getAllSubscriptionPackages = () => {
        const body = {
            all: 1,
            contribution_product_id: props.productId,
        };
        ContributionProductService.getAllSubscriptionPackages(body).then((res) => {
            if (res.success) {
                const list = res.data.subscription_list.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setSubscriptionList(list);
            }
        });
    };

    const addNewPackage = () => {
        setPackages([
            ...packages,
            {
                subscription: '',
                packageName: '',
                duration: '',
                quantity: '',
                replaceCount: '',
                paymentMethods: [],
                price: '',
                errors: {},
            },
        ]);
    };

    const handleInputChange = (index, key, value) => {
        const updatedPackages = [...packages];
        updatedPackages[index][key] = value;

        const updatedErrors = { ...updatedPackages[index].errors };
        delete updatedErrors[key];

        updatedPackages[index].errors = updatedErrors;
        setPackages(updatedPackages);
    };

    const validateFields = (index) => {
        const { subscription, packageName, duration, quantity, replaceCount, paymentMethods, price } = packages[index];
        const errors = {};

        if (!subscription) {
            errors.subscription = 'Subscription is required';
        }

        if (!packageName.trim()) {
            errors.packageName = 'Package Name is required';
        }

        if (!duration) {
            errors.duration = 'Duration is required';
        }

        if (!quantity.trim()) {
            errors.quantity = 'Quantity is required';
        }

        if (!replaceCount.trim()) {
            errors.replaceCount = 'Replace Count is required';
        }

        if (!paymentMethods.length) {
            errors.paymentMethods = 'At least one payment method is required';
        }

        if (!price.trim()) {
            errors.price = 'Price is required';
        }

        const isValid = Object.keys(errors).length === 0;
        const updatedPackages = [...packages];
        updatedPackages[index].errors = errors;
        setPackages(updatedPackages);

        return isValid;
    };

    const saveForm = (e, index) => {
        e.preventDefault();
        if (validateFields(index)) {
            const formData = packages[index];
            console.log('Submitting Form:', formData);

            let data = new FormData()
            data.append('subscription_id', formData.subscription);
            data.append('name', formData.packageName);
            data.append('expiry_duration', formData.duration);
            data.append('qty', formData.quantity);
            data.append('replace_count', formData.replaceCount);
            data.append('payment_method', formData.paymentMethods.map((method) => method.value).join(','));
            data.append('price', formData.price);

            ContributionProductService.createPackage(data).then((res) => {
                if (res.success) {
                    customToastMsg("Package was successfully created", 1);
                } else {
                    customToastMsg(res.message, res.status)
                }
            });
        }
    };

    const deleteForm = (e, index) => {
        e.preventDefault();
        const updatedPackages = [...packages];
        updatedPackages.splice(index, 1);
        setPackages(updatedPackages);
    };

    return (
        <Card className="mt-2">
            <CardHeader>
                <h4 className="card-title">Package</h4>
            </CardHeader>
            <CardBody>
                {packages.map((pkg, i) => (
                    <SlideDown key={i}>
                        <Form>
                            <Row className="justify-content-between align-items-center">
                                <Col md={4} className="mb-md-0 mb-1">
                                    <Label className="form-label" for={`subscription-${i}`}>
                                        Subscription
                                    </Label>
                                    <Select
                                        id={`subscription-${i}`}
                                        className="react-select"
                                        classNamePrefix="select"
                                        placeholder="Select Subscription"
                                        options={subscriptionList}
                                        theme={selectThemeColors}
                                        value={subscriptionList.find((c) => c.value === pkg.subscription)}
                                        onChange={(selectedOption) => handleInputChange(i, 'subscription', selectedOption.value)}
                                        styles={customStyle(pkg.errors.subscription)}
                                    />
                                    {pkg.errors.subscription && (
                                        <span style={{ fontSize: '12px', color: '#EA5455', marginTop: 4 }}>
                      Please select a Subscription
                    </span>
                                    )}
                                </Col>
                                <Col md={4} className="mb-md-0 mb-1">
                                    <Label className="form-label" for={`packageName-${i}`}>
                                        Package Name
                                    </Label>
                                    <Input
                                        id={`packageName-${i}`}
                                        placeholder="Package Name"
                                        value={pkg.packageName}
                                        onChange={(e) => handleInputChange(i, 'packageName', e.target.value)}
                                        invalid={pkg.errors.packageName && true}
                                        autoComplete="off"
                                    />
                                    {pkg.errors.packageName && (
                                        <FormFeedback>Please enter a valid package name</FormFeedback>
                                    )}
                                </Col>
                                <Col md={4} className="mb-md-0 mb-1">
                                    <Label className="form-label" for={`duration-${i}`}>
                                        Duration
                                    </Label>
                                    <Select
                                        id={`duration-${i}`}
                                        className="react-select"
                                        classNamePrefix="select"
                                        placeholder="Select Duration"
                                        options={durationOptions}
                                        theme={selectThemeColors}
                                        value={durationOptions.find((c) => c.value === pkg.duration)}
                                        onChange={(selectedOption) => handleInputChange(i, 'duration', selectedOption.value)}
                                        styles={customStyle(pkg.errors.duration)}
                                    />
                                    {pkg.errors.duration && (
                                        <span style={{ fontSize: '12px', color: '#EA5455', marginTop: 4 }}>
                      Please select a Duration
                    </span>
                                    )}
                                </Col>
                                <Col md={4} className="mb-md-0 mb-1">
                                    <Label className="form-label" for={`quantity-${i}`}>
                                        Quantity
                                    </Label>
                                    <Input
                                        id={`quantity-${i}`}
                                        placeholder="Quantity"
                                        type="number"
                                        value={pkg.quantity}
                                        onChange={(e) => handleInputChange(i, 'quantity', e.target.value)}
                                        invalid={pkg.errors.quantity && true}
                                        autoComplete="off"
                                    />
                                    {pkg.errors.quantity && <FormFeedback>Please enter a valid quantity</FormFeedback>}
                                </Col>
                                <Col md={4} className="mb-md-0 mb-1">
                                    <Label className="form-label" for={`replaceCount-${i}`}>
                                        Replace Count
                                    </Label>
                                    <Input
                                        id={`replaceCount-${i}`}
                                        placeholder="Replace Count"
                                        type="number"
                                        value={pkg.replaceCount}
                                        onChange={(e) => handleInputChange(i, 'replaceCount', e.target.value)}
                                        invalid={pkg.errors.replaceCount && true}
                                        autoComplete="off"
                                    />
                                    {pkg.errors.replaceCount && (
                                        <FormFeedback>Please enter a valid replace count</FormFeedback>
                                    )}
                                </Col>
                                <Col md={4} className="mb-md-0 mb-1">
                                    <Label className="form-label" for={`paymentMethods-${i}`}>
                                        Payment Method
                                    </Label>
                                    <Select
                                        id={`paymentMethods-${i}`}
                                        isMulti
                                        className="react-select"
                                        classNamePrefix="select"
                                        placeholder="Select Payment Method"
                                        options={paymentMethodOptions}
                                        theme={selectThemeColors}
                                        value={pkg.paymentMethods}
                                        onChange={(selectedOption) => handleInputChange(i, 'paymentMethods', selectedOption)}
                                        styles={customStyle(pkg.errors.paymentMethods)}
                                    />
                                    {pkg.errors.paymentMethods && (
                                        <span style={{ fontSize: '12px', color: '#EA5455', marginTop: 4 }}>
                      Please select any payment method
                    </span>
                                    )}
                                </Col>
                                <Col md={4} className="mb-md-0 mb-1">
                                    <Label className="form-label" for={`price-${i}`}>
                                        Price
                                    </Label>
                                    <Input
                                        id={`price-${i}`}
                                        placeholder="Price"
                                        type="number"
                                        value={pkg.price}
                                        onChange={(e) => handleInputChange(i, 'price', e.target.value)}
                                        invalid={pkg.errors.price && true}
                                        autoComplete="off"
                                    />
                                    {pkg.errors.price && <FormFeedback>Please enter a valid price</FormFeedback>}
                                </Col>
                                <Col md={8} />
                                <Row>
                                    <Col md={1} className='me-3'>
                                        <Button
                                            color="primary"
                                            className="text-nowrap mt-2"
                                            onClick={(e) => saveForm(e, i)}
                                            outline
                                        >
                                            <Save size={14} className="me-50" />
                                            <span>Save</span>
                                        </Button>
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            color="danger"
                                            type="reset"
                                            className="text-nowrap mt-2"
                                            onClick={(e) => deleteForm(e, i)}
                                            outline
                                        >
                                            <X size={14} className="me-50" />
                                            <span>Delete</span>
                                        </Button>
                                    </Col>
                                </Row>

                                <Col sm={12}>
                                    <hr />
                                </Col>
                            </Row>
                        </Form>
                    </SlideDown>
                ))}
                <Button className="btn-icon" color="primary" onClick={addNewPackage}>
                    <Plus size={14} />
                    <span className="align-middle ms-25">Add New</span>
                </Button>
            </CardBody>
        </Card>
    );
};

export default RepeatingPackageForm;
