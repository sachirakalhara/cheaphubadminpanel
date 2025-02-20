import React, {useState, useEffect, Fragment} from 'react';
import ReactPaginate from 'react-paginate';
import {ChevronDown, Eye, Plus, Trash, X} from 'react-feather';
import DataTable from 'react-data-table-component';
import {useDispatch} from 'react-redux';
import {Button, Input, Row, Col, Card, Label, Badge} from 'reactstrap';
import {toggleLoading} from '@store/loading';
import {useForm} from 'react-hook-form';
// import CouponsModal from '../../@core/components/modal/couponsModal/couponsModal';
// import * as CouponsServices from '../../services/coupons';
import {customToastMsg, emptyUI, getCustomDateTimeStamp} from '../../utility/Utils';
import CouponCreationModal from "../../@core/components/modal/couponCreationModal";

const defaultValues = {
    couponCode: '',
    discount: '',
    expirationDate: null,
    maxDiscount: '',
    bulkProducts:false,
    subscriptionProducts:false,
};

const CouponList = () => {
    const dispatch = useDispatch();
    const [couponCode, setCouponCode] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [show, setShow] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [isFetched, setIsFetched] = useState(false);
    const [store, setStore] = useState({
        allData: [],
        data: [{
            couponCode: 'asadkl',
            discount: '10%',
            expirationDate: '2021/03/05',
            maxDiscount: '200',
            productType: 'Bulk'
        }],
        total: 0
    });

    const {control, handleSubmit, reset, setValue, setError, formState: {errors}} = useForm({defaultValues});

    const getCoupons = () => {
        // dispatch(toggleLoading());
        // CouponsServices.getAllCoupons()
        //     .then(res => {
        //         if (res.success) {
        //             setStore({ allData: res.data.coupon_list, data: res.data.coupon_list, total: res.data.total || 0 });
        //         } else {
        //             customToastMsg(res.message, res.status);
        //         }
        //         dispatch(toggleLoading());
        //         setIsFetched(true);
        //     });
    };

    useEffect(() => {
        getCoupons();
    }, []);

    const handlePagination = page => {
        setCurrentPage(page.selected);
        getCoupons();
    };

    const handleSearch = value => {
        setCouponCode(value);
        getCoupons();
    };

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
        if (Object.values(data).every(field => field.length > 0)) {
            dispatch(toggleLoading());
            const body = {couponCode: data.couponCode, discount: data.discount, expirationDate: data.expirationDate};

            if (isEditMode) {
                body.id = selectedId;
                await CouponsServices.updateCoupon(body).then(res => {
                    if (res.success) {
                        customToastMsg('Coupon updated successfully!', 1);
                        setShow(false);
                        getCoupons();
                    } else {
                        customToastMsg(res.message, res.status);
                    }
                    dispatch(toggleLoading());
                });
            } else {
                await CouponsServices.createCoupon(body).then(res => {
                    if (res.success) {
                        customToastMsg('New coupon added successfully!', 1);
                        setShow(false);
                        getCoupons();
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
        {name: 'Coupon Code', selector: row => row.couponCode, sortable: true},
        {name: 'Discount', selector: row => row.discount, sortable: true},
        {name: 'Max Discount', selector: row => row.maxDiscount, sortable: true},
        {name: 'Expiration Date', selector: row => row.expirationDate, sortable: true},
        {
            name: 'Production Type',
            cell: row => <Badge color={row.productType === 'Bulk' ? 'danger' : 'success'}>{row.productType}</Badge>,
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
                    <Button color='danger' className="ms-1" outline onClick={() => removeCoupon(row.id)}
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
        setValue('couponCode', data.couponCode);
        setValue('discount', data.discount);
        setValue('discount', data.discount);
        setValue('expirationDate', data.expirationDate);
        setValue('productType', data.productType);
        setShow(true);
        setIsEditMode(true);
    };

    const removeCoupon = async id => {
        // await CouponsServices.deleteCoupon(id).then(res => {
        //     if (res.success) {
        //         customToastMsg('Coupon deleted successfully!', 1);
        //         getCoupons();
        //     } else {
        //         customToastMsg(res.message, res.status);
        //     }
        // });
    };

    return (
        <Fragment>

            <Card>
                <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                    <h3 className='text-primary invoice-logo mb-2'>Coupon Code Management</h3>
                    <Row>
                        <Col lg='4' className='d-flex align-items-center px-0 px-lg-1'>
                            <div className='d-flex align-items-center'>
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
                        <Col
                            lg='8'
                            className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0'
                        >
                            <Button onClick={() => setShow(true)}>
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
                                     setShow(!show);
                                     reset();
                                 }}
                                 onSubmit={handleSubmit(onSubmit)}
                                 control={control}
                                 errors={errors}
                                 isEditMode={isEditMode}
                setValue={setValue}
            />
        </Fragment>
    );
};

export default CouponList;
