// ** React Imports
import React, {useEffect, useState} from 'react';

// ** Third Party Components
import {X, Plus, Save} from 'react-feather';
import {SlideDown} from 'react-slidedown';
import {selectThemeColors} from '@utils';

// ** Reactstrap Imports
import {Row, Col, Card, CardHeader, CardBody, Label, Input, Button, FormFeedback, Form} from 'reactstrap';
import Select from 'react-select';
import * as ContributionProductService from '../../../../services/contribution-products';
import {customToastMsg} from "../../../../utility/Utils";
import qs from "qs";
import {formDataToJson} from "../../../../utility/commonFun";

const customStyle = (error) => ({
    control: (styles) => ({
        ...styles,
        borderColor: error ? '#EA5455' : styles.borderColor,
        '&:hover': {
            borderColor: error ? '#EA5455' : styles['&:hover'].borderColor,
        },
    }),
});

let selectedObj = 0;

const RepeatingPackageForm = (props) => {

    // "packages": [
    //     {
    //         "id": 1,
    //         "name": "wwww",
    //         "price": 1500,
    //         "replace_count": 3,
    //         "expiry_duration": 13,
    //         "payment_method": "card",
    //         "subscription": {
    //             "id": 1,
    //             "contribution_product_id": 1,
    //             "name": "UK",
    //             "serial": "giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]giacomomason@hotmail.it:Plutino88 : Country = IT \n: Subscription = [Livesport Instalment Charge ITA]",
    //             "available_serial_count": 3,
    //             "gateway_fee": 12,
    //             "created_at": "2025-04-03T20:28:31.000000Z",
    //             "updated_at": "2025-04-11T13:18:38.000000Z"
    //         }
    //     }
    // ]

    const getFormatterRepeatArray = (array) => {

        console.log("array???????????????????????", array)
        let list = [];

        if (props.isManageMode) {
            if (array.length === 0) {
                list = [{
                    id: null,
                    subscription: '',
                    packageName: '',
                    duration: '',
                    quantity: '',
                    replaceCount: '',
                    paymentMethods: [],
                    price: '',
                    errors: {},
                }]
            } else {
                array.map(item => {
                    list.push({
                        id: item.id,
                        subscription: item.subscription.id,
                        packageName: item.name,
                        duration: item.expiry_duration,
                        quantity: item?.subscription?.available_serial_count ?? 0,
                        replaceCount: item.replace_count,
                        paymentMethods: item.payment_method.split(',').map((method) => ({
                            value: method,
                            label: method
                        })),
                        price: item.price.toString(),
                        errors: {},
                    })
                })
            }
        } else {
            list = [{
                id: null,
                subscription: '',
                packageName: '',
                duration: '',
                quantity: '',
                replaceCount: '',
                paymentMethods: [],
                price: '',
                errors: {},
            }]
        }
        console.log("list???????????????????????", list)
        return list;
    }


    // ** State
    const [packages, setPackages] = useState(getFormatterRepeatArray(props.packageList));
    const [count, setCount] = useState(1);
    const [durationOptions, setDurationOptions] = useState([
        {value: 1, label: '1 month'},
        {value: 2, label: '2 months'},
        {value: 3, label: '3 months'},
        {value: 4, label: '4 months'},
        {value: 5, label: '5 months'},
        {value: 6, label: '6 months'},
        {value: 7, label: '7 months'},
        {value: 8, label: '8 months'},
        {value: 9, label: '9 months'},
        {value: 10, label: '10 months'},
        {value: 11, label: '11 months'},
        {value: 12, label: '12 months'},
    ]);

    const [paymentMethodOptions, setPaymentMethodOptions] = useState([
        {value: 'card', label: 'Card'},
        {value: 'cash', label: 'Cash'},
    ]);

    const [subscriptionList, setSubscriptionList] = useState([]);

    useEffect(() => {
        getAllSubscriptionList();
    }, []);

    const getAllSubscriptionList = () => {
        const body = {
            all: 1,
            contribution_product_id: props.productId,
        };
        ContributionProductService.getAllSubscriptionPackages(body).then((res) => {
            if (res.success) {
                if (res.data?.subscription_list){
                    const list = res.data?.subscription_list.map((item) => ({
                        value: item.id,
                        label: item.name,
                        availableCount:item.available_serial_count
                    })) ?? []

                    setSubscriptionList(list);
                }

            }
        });
    };

    const addNewPackage = (list, index) => {

        if (packages.length === 0) {
            setPackages([
                ...list,
                {
                    id: null,
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
        }else {
            if (validateFields(index)) {
                setCount(count + 1);
                setPackages([
                    ...list,
                    {
                        id: null,
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
            }
        }

    };

    const handleInputChange = (index, key, value) => {
        const updatedPackages = [...packages];
        updatedPackages[index][key] = value;

        const updatedErrors = {...updatedPackages[index].errors};
        delete updatedErrors[key];

        updatedPackages[index].errors = updatedErrors;
        setPackages(updatedPackages);
    };

    const validateFields = (index) => {
        const {subscription, packageName, duration, quantity,replaceCount, paymentMethods, price} = packages[index];
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

        // if (!quantity) {
        //     errors.quantity = 'Quantity is required';
        // }

        if (!replaceCount) {
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

    const saveForm = (e, index, pkg) => {
        e.preventDefault();
        if (validateFields(index)) {
            const formData = packages[index];
            console.log('Submitting Form:', formData);

            let data = new FormData()

            data.append('name', formData.packageName);
            data.append('expiry_duration', formData.duration);
            data.append('qty', 0);
            data.append('replace_count', formData.replaceCount);
            data.append('payment_method', formData.paymentMethods.map((method) => method.value).join(','));
            data.append('price', formData.price);

            if (pkg.id !== null) {
                data.append('id', pkg.id)
            } else {
                data.append('subscription_id', formData.subscription);
            }

            const FetchAPI = pkg.id !== null ? ContributionProductService.updatePackage : ContributionProductService.createPackage;

            FetchAPI(pkg.id !== null ? qs.stringify(formDataToJson(data)) : data)
                .then((res) => {
                    if (res.success) {
                        if (pkg.id === null) {

                            // const newPackage = {
                            //     id: res.data.package.id,
                            //     subscription: res.data.package.contributionProduct.subscription.id,
                            //     packageName: res.data.package.name,
                            //     duration: res.data.package.expiry_duration.toString(),
                            //     quantity: res.data.package.contributionProduct.subscription.available_serial_count.toString(),
                            //     replaceCount: res.data.package.replace_count.toString(),
                            //     paymentMethods: res.data.package.payment_method.split(',').map((method) => ({
                            //         value: method,
                            //         label: method
                            //     })),
                            //     price: res.data.package.price.toString(),
                            //     errors: {},
                            // }
                            const updatedPackages = [...packages];

                            //array should be update when pkg. id  === res.data.package.id

                            console.log("selectedObj", selectedObj)
                            updatedPackages[selectedObj].id = res.data.package.id;
                            // updatedPackages[selectedObj].subscription = res.data.package.subscription.id;
                            updatedPackages[selectedObj].subscription = formData.subscription;
                            updatedPackages[selectedObj].packageName = res.data.package.name;
                            updatedPackages[selectedObj].duration = res.data.package.expiry_duration;
                            // updatedPackages[selectedObj].quantity = res.data.package.subscription.available_serial_count.toString();
                            // updatedPackages[selectedObj].quantity = formData.quantity;
                            updatedPackages[selectedObj].replaceCount = res.data.package.replace_count;
                            updatedPackages[selectedObj].paymentMethods = res.data.package.payment_method.split(',').map((method) => ({
                                value: method,
                                label: method
                            }));
                            updatedPackages[selectedObj].price = res.data.package.price.toString();
                            updatedPackages[selectedObj].errors = {};


                            addNewPackage(packages, selectedObj);


                            // updatedPackages[selectedObj] = newPackage;
                            // console.log(updatedPackages);
                            // setPackages(updatedPackages);
                        }

                        customToastMsg(`Package was successfully ${pkg.id !== null ? 'updated' : 'created'}`, 1);
                    } else {
                        customToastMsg(res.message, res.status)
                    }
                });
        }
    };

    const deleteForm = (e, index, id) => {
        e.preventDefault();

        if (id !== null) {
            removePackage(id, index)
        } else {
            const updatedPackages = [...packages];
            updatedPackages.splice(index, 1);
            setPackages(updatedPackages);
        }
    };

    const removePackage = (id, index) => {
        ContributionProductService.deletePackage(id)
            .then(res => {
                if (res.success) {
                    const updatedPackages = [...packages];
                    updatedPackages.splice(index, 1);
                    setPackages(updatedPackages);

                    customToastMsg("Package was successfully deleted!", 1)
                } else {
                    customToastMsg(res.message, res.status)
                }
            })
    }

    return (
        <div>
            <Card className="mt-2">
                <CardHeader>
                    <h4 className="card-title">Package</h4>
                </CardHeader>
                <CardBody>
                    {packages.map((pkg, i) => {
                        const Tag = i === 0 ? 'div' : SlideDown;
                        selectedObj = i;
                        return (
                            <Tag key={i}>
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
                                                <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>
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
                                                <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>
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
                                                value={subscriptionList.find((c) => c.value === pkg.subscription)?.availableCount ?? 0}
                                                invalid={pkg.errors.quantity && true}
                                                autoComplete="off"
                                                disabled={true}
                                            />
                                        </Col>
                                        <Col md={4} className="mb-md-0 mb-1">
                                            <Label className="form-label" for={`replaceCount-${i}`}>
                                                Available Replace Count
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
                                                <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>
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
                                            {pkg.errors.price &&
                                                <FormFeedback>Please enter a valid price</FormFeedback>}
                                        </Col>
                                        <Col md={8}/>
                                        <Row>
                                            <Col md={2} className='me-3'>
                                                <Button
                                                    color="primary"
                                                    className="text-nowrap mt-2"
                                                    onClick={(e) => saveForm(e, i, pkg)}
                                                    outline
                                                >
                                                    <Save size={14} className="me-50"/>
                                                    <span>{pkg.id === null ? "Save" : "Update"}</span>
                                                </Button>
                                            </Col>

                                            {(i !== 0 || props.isManageMode) && (
                                                <Col md={2}>
                                                    <Button
                                                        color="danger"
                                                        type="reset"
                                                        className="text-nowrap mt-2"
                                                        onClick={(e) => deleteForm(e, i, pkg.id)}
                                                        outline
                                                    >
                                                        <X size={14} className="me-50"/>
                                                        <span>{pkg.id !== null ? "Delete" : "Remove"}</span>
                                                    </Button>
                                                </Col>
                                            )}
                                        </Row>

                                        <Col sm={12}>
                                            <hr/>
                                        </Col>
                                    </Row>
                                </Form>
                            </Tag>
                        )
                    })}

                    {/*{props.isManageMode && (*/}
                        <Button className="btn-icon" color="primary"
                                onClick={() => addNewPackage(packages, selectedObj)}>
                            <Plus size={14}/>
                            <span className="align-middle ms-25">Add New</span>
                        </Button>
                    {/*)}*/}

                </CardBody>
            </Card>

            <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                <Button type='reset' color='secondary' outline onClick={props.toggle}>
                    Close
                </Button>
            </Col>
        </div>

    );
};

export default RepeatingPackageForm;
