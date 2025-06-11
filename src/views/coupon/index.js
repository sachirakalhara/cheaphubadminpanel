import React, {useState, useEffect, Fragment} from 'react';
import ReactPaginate from 'react-paginate';
import {ChevronDown, Eye, Plus, Trash, X} from 'react-feather';
import DataTable from 'react-data-table-component';
import {useDispatch} from 'react-redux';
import {Button, Input, Row, Col, Card, Label, Badge} from 'reactstrap';
import {toggleLoading} from '@store/loading';
import {useForm} from 'react-hook-form';
import {customSweetAlert, customToastMsg, emptyUI, getCustomDateTimeStamp} from '../../utility/Utils';
import CouponCreationModal from "../../@core/components/modal/couponCreationModal";
import * as CouponsServices from "../../services/coupon-code-resources";
import {backendDateFormatter, editDateFormatter} from "../../utility/commonFun";
import moment from "moment";

const defaultValues = {
    couponCode: '',
    discount: '',
    expirationDate: null,
    maxDiscount: '',
    bulkProducts: false,
    subscriptionProducts: false,
};

let prev = 0;

const CouponList = () => {
    const dispatch = useDispatch();


    const [couponCode, setCouponCode] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [show, setShow] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [selectedId, setSelectedId] = useState('');
    const [isFetched, setIsFetched] = useState(false);
    const [productType, setProductType] = useState(null); // Add state for productType
    const [store, setStore] = useState({
        data: [],
        total: 0
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        clearErrors,
        formState: {errors}
    } = useForm({defaultValues});

    const getCoupons = (searchKey, type, pageNumber) => {
        dispatch(toggleLoading());
        const body = {
            "all": 0,
            "coupon_code": searchKey,
            "product_type": type
        };
        CouponsServices.getAllCouponCodes(body)
            .then(res => {
                if (res.success) {
                    setStore({data: res.data?.coupon_list, total: res.data.meta?.last_page || 0});
                } else {
                    customToastMsg(res.message, res.status);
                }
                dispatch(toggleLoading());
                setIsFetched(true);
            });
    };

    useEffect(() => {
        getCoupons(couponCode, productType, currentPage);
    }, []);

    const handlePagination = page => {
        const pageNumber = page.selected + 1;
        setCurrentPage(pageNumber);
        getCoupons(couponCode, productType, pageNumber);
    };

    const handleSearch = value => {
        setCouponCode(value);
        prev = new Date().getTime()

        setTimeout(async () => {
            const now = new Date().getTime()
            if (now - prev >= 1000) {
                getCoupons(value, productType, currentPage);
            }
        }, 1000)
    };

    const handleProductTypeChange = value => {
        setProductType(value);
        getCoupons(couponCode, value, currentPage);
    };

    const getProductTypeStatus = data => {
        if (data.bulkProducts && data.subscriptionProducts) {
            return 'both';
        } else if (data.subscriptionProducts) {
            return 'subscription';
        } else {
            return 'bulk';
        }
    }

    const CustomPagination = () => (
        <ReactPaginate
            nextLabel=''
            breakLabel='...'
            previousLabel=''
            pageCount={store.total || 1}
            activeClassName='active'
            breakClassName='page-item'
            pageClassName={'page-item'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            onPageChange={handlePagination}
            forcePage={currentPage}
            containerClassName={'pagination react-paginate justify-content-end p-1'}
        />
    );

    const onSubmit = async data => {
        console.log("data", data);
        if (Object.values(data).every(field => typeof field === 'boolean' || field.length > 0)) {
            console.log("data", data);

            if (!data.bulkProducts && !data.subscriptionProducts) {
                setError('bulkProducts', {type: 'manual', message: 'At least one product type must be selected.'});
                setError('subscriptionProducts', {
                    type: 'manual',
                    message: 'At least one product type must be selected.'
                });
                return;
            }

            dispatch(toggleLoading());
            const body = {
                "product_type": getProductTypeStatus(data),//'bulk', 'subscription', 'both'
                "discount_percentage": Number(data.discount),//$table->decimal('discount_percentage', 5, 2);
                "max_discount_amount": Number(data.maxDiscount),//$table->decimal('max_discount_amount', 10, 2);
                "expiry_date": isEditMode ? backendDateFormatter(editDateFormatter(data.expirationDate)) : backendDateFormatter(data.expirationDate),//25-02-2025
                "coupon_code": data.couponCode
            };

            if (isEditMode) {
                body.id = selectedId;
                await CouponsServices.editCouponCodes(body).then(res => {
                    if (res.success) {
                        customToastMsg('Coupon updated successfully!', 1);
                        reset();
                        setShow(false);
                        setCurrentPage(1)
                        getCoupons(couponCode, productType, 1);
                    } else {
                        customToastMsg(res.message, res.status);
                    }
                    dispatch(toggleLoading());
                });
            } else {
                await CouponsServices.createCouponCodes(body).then(res => {
                    if (res.success) {
                        customToastMsg('New coupon added successfully!', 1);
                        setShow(false);
                        setCurrentPage(1)
                        getCoupons(couponCode, productType, 1);
                    } else {
                        customToastMsg(res.message, res.status);
                    }
                    dispatch(toggleLoading());
                });
            }
        } else {
            for (const key in data) {
                if (!data[key]) {
                    setError(key, {type: 'required'});
                }
            }
        }
    };

    const columns = [
        {name: 'Coupon Code', selector: row => row.coupon_code, sortable: true},
        {name: 'Discount', selector: row => row.discount_percentage, sortable: true},
        {name: 'Max Discount', selector: row => row.max_discount_amount, sortable: true},
        {name: 'Expiration Date', selector: row => row.expiry_date, sortable: true},
        {
            name: 'Production Type',
            cell: row => (
                <div>
                    {row.product_type === "both" ? (
                        <div className='d-inline-flex align-items-center'>
                            <Badge color={'success'}>subscription</Badge>
                            <Badge color={'danger'} className="ms-05">bulk</Badge>
                        </div>
                    ) : (
                        <Badge color={row.product_type === 'bulk' ? 'danger' : 'success'}>{row.product_type}</Badge>

                    )}
                </div>
            ),
            center: true,
        },
        {
            name: 'Actions',
            width: '30%',
            cell: row => (
                <div className='d-flex'>
                    <Button color='success' outline onClick={() => onUpdateHandler(row)}
                            style={{width: 80, padding: 5, alignItems: 'center'}}
                    >
                        <Eye size={15}/> Edit
                    </Button>
                    <Button color='danger' className="ms-1" outline onClick={async () => {
                        await customSweetAlert(
                            'Are you sure you want to remove this?',
                            0,
                            async () => {
                                await removeCoupon(row.id)
                            }
                        )

                    }}
                            style={{width: 80, padding: 5, alignItems: 'center'}}
                    >
                        <Trash size={15}/> Delete
                    </Button>
                </div>
            )
        }
    ];

    const onUpdateHandler = data => {
        setSelectedId(data.id);
        setValue('couponCode', data.coupon_code);
        setValue('discount', data.discount_percentage);
        setValue('maxDiscount', data.max_discount_amount);
        setValue('expirationDate', data.expiry_date);
        // setValue('expirationDate', editDateFormatter(data.expiry_date));

        if (data.product_type === 'bulk') {
            setValue('bulkProducts', true);
            setValue('subscriptionProducts', false);
        } else if (data.product_type === 'both') {
            setValue('bulkProducts', true);
            setValue('subscriptionProducts', true);
        } else {
            setValue('bulkProducts', false);
            setValue('subscriptionProducts', true);
        }
        setShow(true);
        setIsEditMode(true);
    };

    const removeCoupon = async id => {
        await CouponsServices.deleteCouponCodes(id)
            .then(res => {
                if (res.success) {
                    customToastMsg('Coupon successfully deleted!', 1);
                    setCurrentPage(1);
                    getCoupons(couponCode, productType, 1);
                } else {
                    customToastMsg(res.message, res.status);
                }
            });
    };

    return (
        <Fragment>

            <Card>
                <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                    <h3 className='text-primary invoice-logo'>Coupon Code Management</h3>
                    <Row>
                        <Col lg='4' className='d-flex align-items-center px-lg-1'>
                            <div className='d-flex align-items-center mt-2'>
                                <Label className='form-label' for='default-picker'>
                                    Name
                                </Label>
                                <div className='inputWithButton'>
                                    <Input
                                        id='name'
                                        className='ms-50 me-2 w-100'
                                        type='text'
                                        value={couponCode}
                                        onChange={e => handleSearch(e.target.value)}
                                        placeholder='Search Tag Name'
                                        autoComplete="off"
                                    />
                                    {couponCode.length !== 0 && (
                                        <X size={18}
                                           className='cursor-pointer close-btn'
                                           onClick={() => handleSearch('')}
                                        />
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col lg='4' className='d-flex align-items-center px-lg-1'>
                            <div className='d-flex align-items-center mt-2'>
                                <Label className='form-label' for='product-type'>
                                    Product Type
                                </Label>
                                <Input
                                    id='product-type'
                                    type='select'
                                    value={productType}
                                    onChange={e => handleProductTypeChange(e.target.value)}
                                    className='ms-50 me-2 w-100'
                                >
                                    <option value={null}>All</option>
                                    <option value='bulk'>Bulk</option>
                                    <option value='subscription'>Subscription</option>
                                </Input>
                            </div>
                        </Col>
                        <Col
                            lg='4'
                            className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1'
                        >
                            <Button onClick={() => {
                                setIsEditMode(false)
                                setShow(true)
                            }}>
                                <Plus size={15}/> Add Coupon
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>

            <Card className='mt-2'>
                <DataTable
                    noHeader
                    pagination
                    columns={columns}
                    data={store.data}
                    sortIcon={<ChevronDown/>}
                    paginationComponent={CustomPagination}
                    noDataComponent={emptyUI(isFetched)}
                />
            </Card>
            <CouponCreationModal
                show={show}
                toggle={() => {
                    reset();
                    setShow(!show);
                }}
                onSubmit={handleSubmit(onSubmit)}
                control={control}
                errors={errors}
                isEditMode={isEditMode}
                setValue={setValue}
                clearErrors={clearErrors}
            />
        </Fragment>
    );
};

export default CouponList;
