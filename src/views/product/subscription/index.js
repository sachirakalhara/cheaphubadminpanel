// ** React Imports
import {Link} from 'react-router-dom'
import React, {useState, useEffect, Fragment} from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import {Calendar, ChevronDown, Eye, Plus, Settings, Trash, X} from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import {Button, Input, Row, Col, Card, Label, Badge, CardHeader, CardTitle, CardBody, CardSubtitle} from 'reactstrap'

// ** Store & Actions
import {useDispatch} from 'react-redux'
import {selectThemeColors} from '@utils'

// ** Styles
import '@styles/react/apps/app-invoice.scss'

import {
    customSweetAlert,
    customToastMsg,
    emptyUI,
    fileReader,
    getCroppedImg,
    isImageFile,
    searchValidation
} from "../../../utility/Utils"


import {toggleLoading} from '@store/loading'
import {Controller, useForm} from "react-hook-form"
import Select from "react-select";

import * as CategoryServices from '../../../services/categories';
import * as TagsServices from '../../../services/tags';
import SubscriptionCreationModal from "../../../@core/components/modal/product/subscription-create-modal";
import * as ContributionProductService from "../../../services/contribution-products";
import * as BulkProductService from "../../../services/bulk-products";
import BulCreationModal from "../../../@core/components/modal/product/bulk-create-modal";


let prev = 0

const customStyles = {
    container: provided => ({
        ...provided,
        minWidth: 150
        // minWidth: "100%"
    })
}


const types = {
    PRODUCT_IMAGE: 'program-modal-banner'
}

const CustomHeader = (props) => {

    return (
        <Card className="mb-0">
            <Col className='invoice-list-table-header w-100 py-2 px-2' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo ms-0 mb-2'>Subscription Products</h3>
                <Row>
                    <Col lg='5' className='d-flex align-items-center'>
                        <Label className='form-label' for='default-picker'>
                            Product Name
                        </Label>
                        <div className='inputWithButton w-100'>
                            <Input
                                className='ms-1 w-100'
                                type='text'
                                value={props.searchKey}
                                onChange={props.onChangeName}
                                placeholder='Product Name'
                                autoComplete="off"
                            />
                            {props.searchKey.length !== 0 && (
                                <X size={18}
                                   className='cursor-pointer close-btn'
                                   onClick={async () => props.onClearProductName()}
                                />
                            )}
                        </div>
                    </Col>
                    <Col lg='4' className='d-flex align-items-center  ms-1'>
                        <Label className='form-label' for='default-picker'>
                            Category
                        </Label>
                        <Select
                            id='category'
                            className='react-select w-100 ms-1'
                            classNamePrefix='select'
                            placeholder='Category'
                            options={props.categoryList}
                            theme={selectThemeColors}
                            value={props.selectedCategory !== "" ? props.categoryList.find((c) => c.value === props.selectedCategory) : null}
                            isClearable={true}
                            onChange={props.onChangeCategory}
                            styles={customStyles}
                        />
                    </Col>

                </Row>
            </Col>
        </Card>
    )
}

const SubscriptionProductList = () => {
    // ** Store vars
    const dispatch = useDispatch()

    // ** States
    // eslint-disable-next-line no-unused-vars
    const [value1, setValue1] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [show, setShow] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [categoryList, setCategoryList] = useState([])
    const [tagsList, setTagsList] = useState([])
    const [searchKey, setSearchKey] = useState('')
    const [isFetched, setIsFetched] = useState(false)

    const [isEditMode, setIsEditMode] = useState(false)
    const [isManageMode, setIsManageMode] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [selectedData, setSelectedData] = useState({})

    const [store, setStore] = useState({
        allData: [],
        data: [],
        params: {
            page: currentPage,
            perPage: rowsPerPage,
            q: value1
        },
        total: 0
    })


    const getDataList = (params) => {
        dispatch(toggleLoading());
        ContributionProductService.getAllContributionProduct()
            .then(res => {
                if (res.success) {
                    setStore({
                        allData: res.data,
                        data: res.data.contribution_product_list,
                        params,
                        total: 0
                    });
                } else {
                    customToastMsg(res.message, res.status);
                }
                dispatch(toggleLoading());
                setIsFetched(true);
            });
    }

    const searchContributionProduct = (params) => {
        dispatch(toggleLoading())
        const body = {
            "products_name": params.searchKey,
            "product_category_id": params.category,
            "all": 1,
        }
        BulkProductService.filterContributionProduct(body)
            .then(res => {
                if (res.success) {
                    setStore({
                        allData: res.data.contribution_product_list,
                        data: res.data.contribution_product_list,
                        params,
                        total: 0
                    })
                } else {
                    customToastMsg(res.message, 0, '', () => {
                        setStore({allData: [], data: [], params, total: 0})
                    })
                }
                dispatch(toggleLoading())
            })
    }

    const getAllCategories = async () => {
        await CategoryServices.getAllCategories()
            .then(res => {
                if (res.success) {
                    const list = []
                    const dataArray = res.data.category_list ?? []
                    dataArray.map((items, index) => {
                        list.push({
                            label: items.name,
                            value: items.id,
                            key: index
                        })
                    })
                    setCategoryList(list)
                }
            })
    }

    const getAllTags = async () => {
        await TagsServices.getAllTags()
            .then(res => {
                if (res.success) {
                    const list = []
                    // if (res.data.length>0)
                    res.data.tag_list.map((item, index) => {
                        list.push({
                            label: item.name,
                            value: item.id
                        })
                    })
                    setTagsList(list)
                }
            })
    }

    useEffect(async () => {
        getDataList({
            q: value1,
            page: currentPage,
            perPage: rowsPerPage
        })
        await getAllCategories()
        await getAllTags()
    }, [])

    const handlePagination = async page => {
        setCurrentPage(page.selected + 1)
    }

    const CustomPagination = () => {

        return (
            <ReactPaginate
                nextLabel=''
                breakLabel='...'
                previousLabel=''
                pageCount={store.total || 1}
                activeClassName='active'
                breakClassName='page-item'
                pageClassName={'page-item'}
                breakLinkClassName='page-link'
                nextLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousLinkClassName={'page-link'}
                previousClassName={'page-item prev'}
                onPageChange={page => handlePagination(page)}
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                containerClassName={'pagination react-paginate justify-content-end p-1'}
            />
        )
    }

    const dataToRender = () => {
        const filters = {
            q: value1
        }

        const isFiltered = Object.keys(filters).some(function (k) {
            return filters[k].length > 0
        })

        if (store.data?.length > 0) {
            return store.data
        } else if (store.data?.length === 0 && isFiltered) {
            return []
        } else {
            return store.allData.slice(0, rowsPerPage)
        }
    }

    const customStyles = {
        subHeader: {
            style: {
                display: 'none'
            }
        }
    }

    const editBtnHandler = (data) => {
        setShow(true)
        setIsEditMode(true)
        setIsManageMode(false)
        setSelectedData(data);
    }
    const manageBtnHandler = (data) => {
        setShow(true)
        setIsManageMode(true)
        setIsEditMode(false)
        setSelectedData(data);
    }

    const removeItem = async (id) => {
        await customSweetAlert(
            'Are you sure you want to remove this?',
            0,
            async () => {

            }
        )
    }


    const columns = [
        {
            name: 'Name',
            selector: 'name',
        },
        {
            name: 'Image',
            cell: row => <img src={row.image} alt={row.name} className="cell-fit"
                              style={{width: '40px', height: '40px', borderRadius: '50%'}}/>,
            center: true,
        },
        {
            name: 'Visibility',
            cell: row => <Badge color={row.visibility === 'onHold' ? 'danger' : 'success'}>{row.visibility}</Badge>,
            center: true,
        },
        {
            name: 'Tag',
            selector: 'tag_id',
            cell: row => tagsList.length > 0 ? tagsList.find(obj => obj.value === row.tag_id).label : '', // Assuming tag_id is the tag name
            center: true,
        },
        {
            name: 'Actions',
            width: '30%',
            center: true,
            cell: row => (
                <div className='d-flex align-items-center w-100 justify-content-evenly'>
                    <Button
                        color='success' outline
                        style={{width: 80, padding: 5, alignItems: 'center'}}
                        onClick={() => editBtnHandler(row)}
                    >
                        <Eye size={15} style={{marginRight: 5, marginBottom: 3}}/>
                        Edit
                    </Button>
                    <Button
                        color='secondary' outline
                        style={{width: 95, padding: 5, alignItems: 'center'}}
                        onClick={() => manageBtnHandler(row)}
                    >
                        <Settings size={15} style={{marginRight: 5, marginBottom: 3}}/>
                        Manage
                    </Button>
                    <Button
                        color='danger' outline
                        style={{width: 100, padding: 5, alignItems: 'center'}}
                        onClick={() => removeItem(row.id)}
                    >
                        <Trash size={15} style={{marginRight: 5, marginBottom: 3}}/>
                        Delete
                    </Button>
                </div>
            )
        },
    ];

    const onSearch = async (e) => {
        setCurrentPage(0)
        setSearchKey(e)

        prev = new Date().getTime()

        setTimeout(async () => {
            const now = new Date().getTime()
            if (now - prev >= 1000) {
                await searchContributionProduct({
                    searchKey: e,
                    category: selectedCategoryId,
                    page: 0,
                    perPage: 0
                })
            }
        }, 1000)
    }

    const onCategoryChange = async (e) => {
        setCurrentPage(0)
        setSelectedCategoryId(e);
        await searchContributionProduct({
            searchKey: searchKey,
            category: e,
            page: 0,
            perPage: 0
        })
    }


    return (
        <Fragment>
            <div className='invoice-list-wrapper'>
                <CustomHeader
                    rowsPerPage={rowsPerPage}
                    searchKey={searchKey}
                    categoryList={categoryList}
                    onChangeName={(e) => onSearch(e.target.value)}
                    onClearProductName={() => onSearch('')}
                    selectedCategory={selectedCategoryId}
                    onChangeCategory={(e) => onCategoryChange(e?.value ?? "")}
                />
                <Col
                    lg='4'
                    className='w-100 actions-right justify-content-end d-flex flex-lg-nowrap flex-wrap pe-1 my-1'
                >
                    <Button onClick={() => {
                        setIsEditMode(false)
                        setIsManageMode(false)
                        setShow(true)
                    }} style={{width: 100}}>
                        <Plus size={15} style={{marginRight: 5}}/>
                        Add
                    </Button>
                </Col>
                <Card>
                    <div className='invoice-list-dataTable react-dataTable'>
                        <DataTable
                            noHeader
                            pagination
                            sortServer
                            paginationServer
                            subHeader={true}
                            columns={columns}
                            responsive={true}
                            data={dataToRender()}
                            className='react-dataTable'
                            paginationDefaultPage={currentPage}
                            paginationComponent={CustomPagination}
                            customStyles={customStyles}
                            noDataComponent={emptyUI(isFetched)}
                        />
                    </div>
                </Card>
            </div>

            {show && (
                <SubscriptionCreationModal
                    show={show}
                    toggle={() => {
                        setShow(!show)
                        getDataList({
                            q: value1,
                            page: currentPage,
                            perPage: rowsPerPage
                        })
                    }}
                    tagList={tagsList}
                    categoryList={categoryList}
                    isEditMode={isEditMode}
                    isManageMode={isManageMode}
                    selectedData={selectedData}
                />
            )}

        </Fragment>
    )
}

export default SubscriptionProductList
