// eslint-disable-next-line no-unused-vars
import React, {Fragment, useEffect, useState} from "react"

import {
    Button, Card,
    CardBody, Col, FormFeedback, Input, Label, Row,
    Table
} from "reactstrap"
import DataTable from "react-data-table-component"
import {ChevronDown, Edit3, Trash} from "react-feather"
import ReactPaginate from "react-paginate"
import PickerDefault from "../../forms/form-elements/datepicker/PickerDefault"
import {Link, useParams} from "react-router-dom"
// eslint-disable-next-line no-unused-vars
import {dataOrder} from "../../../@fake-db/apps/orders"
// eslint-disable-next-line no-unused-vars
import {
    customSweetAlert,
    customToastMsg,
    emptyUI,
    getCustomDateTimeStamp,
    roundNumber2Decimals
} from "../../../utility/Utils"
import ConsumptionModal from "../../../@core/components/modal/stylesModal/ConsumptionModal"
import {Controller, useForm} from "react-hook-form"
import * as SupplierService from '../../../services/supplier'
import * as ColorServices from '../../../services/color-resources'
import * as StyleServices from '../../../services/style-resources'
import Select from "react-select"
import {selectThemeColors} from '@utils'
import {toggleLoading} from '@store/loading'
import {useDispatch} from "react-redux"
import {CSVLink} from "react-csv"

const CustomHeader = ({typeName, onButtonClick, csvList, csvAction, fileName}) => {
    return (
        <div className='invoice-list-table-header w-100 mt-3 mb-2'>
            <Row className="ms-0 me-0 w-100 align-items-center justify-content-center">
                <Col lg='5' className="ps-0">
                    <strong className="mt-1">{typeName}</strong>
                </Col>

                <Col
                    lg='7'
                    className='actions-right d-flex justify-content-lg-end pe-0'
                >
                    <CSVLink
                        headers={[
                            {label: "Yarn Supplier", key: "supplier"},
                            {label: "Yarn Article", key: "article"},
                            {label: "Yarn Twist", key: "twist"},
                            {label: "Color Dependency", key: "color"},
                            {label: "Consumption", key: "consumption"},
                            {label: "With Fallout", key: "fallout"}
                        ]}
                        target="_blank"
                        data={csvList}
                        className="btn btn-primary"
                        asyncOnClick={true}
                        onClick={csvAction}
                        filename={fileName}
                    >
                        Export CSV
                    </CSVLink>
                    <Button className="ms-1" onClick={onButtonClick}>
                        + Add
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

const defaultValues = {
    component: '',
    yarnSupplier: '',
    yarnArticle: '',
    yarnTwist: '',
    dependantColor: 'none',
    consumption: '',
    consumptionFallOut: ''
}

// eslint-disable-next-line no-unused-vars
const ConsumptionList = ({componentList, components, styleData, sizesList, selectedSizeValue}) => {

    // eslint-disable-next-line no-unused-vars
    const [statusValue, setStatusValue] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [rowsPerPage, setRowsPerPage] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [val, setVal] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [sort, setSort] = useState('desc')
    // eslint-disable-next-line no-unused-vars
    const [sortColumn, setSortColumn] = useState('id')
    // eslint-disable-next-line no-unused-vars
    const [currentPage, setCurrentPage] = useState(1)
    const [groupArrayList, setGroupArrayList] = useState([])
    const [show, setShow] = useState(false)
    const [supplierList, setSupplierList] = useState([])
    const [yarnArticleList, setYarnArticleList] = useState([])
    const [colorList, setColorList] = useState([{label: 'None', value: 'none'}])
    const [selectedSize, setSelectedSize] = useState('')
    const [colors, setColors] = useState([])
    // const [yarnSupplierDetails, setYarnSupplierDetails] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedId, setSelectedId] = useState('')
    const [isSelected, setIsSelected] = useState(false)
    const [isFetched, setIsFetched] = useState(false)
    const [currentDateTime, setCurrentDateTime] = useState('')

    // eslint-disable-next-line no-unused-vars
    const [store, setStore] = useState({
        allData: [],
        data: [],
        selectedSize: '',
        total: 0
    })

    // eslint-disable-next-line no-unused-vars
    const {id} = useParams()
    const dispatch = useDispatch()

    // ** Hooks
    const {
        control,
        setError,
        handleSubmit,
        formState: {errors},
        setValue,
        reset
    } = useForm({defaultValues})

    // eslint-disable-next-line no-unused-vars
    const groupList = (list) => {
        // this gives an object with dates as keys
        const groups = list.reduce((group, item) => {
            if (!item.deleted) {
                const componentTypeId = item.styleComponent.component.id
                if (!group[componentTypeId]) {
                    group[componentTypeId] = []
                }
                group[componentTypeId].push(item)
            }

            return group
        }, {})

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((componentTypeId) => {
            return {
                componentTypeId,
                componentType: list.find(obj => obj.styleComponent.component.id === componentTypeId).styleComponent.component.type,
                subList: groups[componentTypeId]
            }
        })

        setGroupArrayList(groupArrays)
    }

    const getData = async (params) => {
        const body = {
            styleId: id,
            size: params.selectedSize
        }
        dispatch(toggleLoading())
        await StyleServices.getConsumptionConfirmationByStyleId(body)
            .then(res => {
                if (res.success) {
                    setStore({allData: res.data, data: res.data, params, total: 1})
                    groupList(res.data)
                } else {
                    customToastMsg(res.message, res.status)
                }
                dispatch(toggleLoading())
                setIsFetched(true)
            })
    }

    // eslint-disable-next-line no-unused-vars
    const getAllSupplierDetails = async () => {
        await SupplierService.getAllSuppliers()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            label: item.name,
                            value: item.id
                        })
                    })
                    setSupplierList(list)
                }
            })
    }

    const getAllColors = async () => {
        await ColorServices.getColorsById(id)
            .then(res => {
                if (res.success) {
                    const list = [...colorList]
                    res.data.map(item => {
                        list.push({
                            label: item.color.name,
                            value: item.color.id
                        })
                    })
                    setColorList(list)
                    setColors(res.data)
                }
            })
    }

    // eslint-disable-next-line no-unused-vars
    const getSizesById = async () => {
        await StyleServices.getSizesByStyleId(id)
            .then(async res => {
                if (res.success) {
                    let select = ""
                    if (res.data.length !== 0) {
                        select = res.data[0].garmentSize
                    }
                    await getData({
                        sort,
                        q: val,
                        sortColumn,
                        page: currentPage,
                        selectedSize: select,
                        status: statusValue
                    })
                }
            })
    }

    useEffect(async () => {
        // await getSizesById()
        await getData({
            sort,
            q: val,
            sortColumn,
            page: currentPage,
            selectedSize: selectedSizeValue,
            status: statusValue
        })
        await getAllSupplierDetails()
        await getAllColors()
    }, [])

    const dataToRender = (list) => {
        const filters = {
            q: val,
            status: statusValue
        }

        const isFiltered = Object.keys(filters).some(function (k) {
            return filters[k].length > 0
        })

        if (list.length > 0) {
            return list
        } else if (list.length === 0 && isFiltered) {
            return []
        } else {
            return list.slice(0, rowsPerPage)
        }
    }

    const handlePagination = page => {
        getData({
            sort,
            q: val,
            sortColumn,
            status: statusValue,
            selectedSize,
            page: page.selected + 1
        })
    }

    const CustomPagination = () => {
        const count = Number((store.total / rowsPerPage).toFixed(0))

        return (
            <ReactPaginate
                nextLabel=''
                breakLabel='...'
                previousLabel=''
                pageCount={count || 1}
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

    // eslint-disable-next-line no-unused-vars
    const handlePerSize = e => {
        getData({
            sort,
            q: val,
            sortColumn,
            page: currentPage,
            status: statusValue,
            selectedSize: e.target.value
        })
        setSelectedSize(e.target.value)
        setIsSelected(true)
    }

    const onSubmit = async data => {
        console.log(colors)
        if (Object.values(data).every(field => field.length > 0)) {
            const body = {
                size: selectedSize,
                consumption: data.consumption,
                consumptionWithFallout: data.consumptionFallOut,
                colorId: data.dependantColor !== 'none' ? data.dependantColor : null,
                supplierArticleId: data.yarnArticle,
                styleId: components.find(obj => obj.component.id === data.component).style.id,
                componentId: components.find(obj => obj.component.id === data.component).component.id
            }

            dispatch(toggleLoading())

            if (!isEditMode) {
                await StyleServices.saveConsumptionConfirmation(body)
                    .then(async res => {
                        if (res.success) {
                            setShow(false)
                            customToastMsg(res.data, res.status)
                            await getData({
                                sort,
                                q: val,
                                sortColumn,
                                page: currentPage,
                                selectedSize,
                                status: statusValue
                            })
                        } else {
                            customToastMsg(res.message, res.status)
                        }
                        dispatch(toggleLoading())
                    })
            } else {
                Object.assign(body, {
                    id: selectedId
                })

                await StyleServices.updateConsumptionConfirmation(body)
                    .then(async res => {
                        if (res.success) {
                            setShow(false)
                            customToastMsg(res.data, res.status)
                            await getData({
                                sort,
                                q: val,
                                sortColumn,
                                page: currentPage,
                                selectedSize,
                                status: statusValue
                            })
                        } else {
                            customToastMsg(res.message, res.status)
                        }
                        dispatch(toggleLoading())
                    })

            }

        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: 'required'
                    })
                }
            }
        }
    }

    const getSupplierArticles = async (id, yarnId) => {
        setValue("yarnSupplier", await id)
        await SupplierService.getSupplierArticleById(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            value: item.id,
                            label: item.article.name,
                            twist: item.article.twist
                        })
                    })
                    setYarnArticleList(list)
                    // setYarnSupplierDetails(res.data)
                    if (yarnId !== undefined) {
                        setValue("yarnArticle", yarnId)
                    }
                }
            })
    }

    const updateForm = async (item) => {
        await getSupplierArticles(item.supplierArticle.supplier.id, item.supplierArticle.id)
        setValue("component", item.styleComponent.component.id.toString())
        setValue("yarnSupplier", item.supplierArticle.supplier.id.toString())
        setValue("yarnTwist", item.supplierArticle.article.twist)
        setValue("dependantColor", item.color !== null ? item.color.id : "none")
        setValue("consumption", item.consumption.toString())
        setValue("consumptionFallOut", item.consumptionWithFallout.toString())

        setIsEditMode(true)
        setSelectedSize(selectedSizeValue)
        setSelectedId(item.id)
        setShow(true)
    }

    const removeItem = async (data) => {
        await customSweetAlert(
            'Are you sure you want to remove this?',
            0,
            async () => {
                await StyleServices.removeConsumptionConfirmation(data.id)
                    .then(async res => {
                        if (res.success) {
                            customToastMsg(res.data, res.status)
                            setCurrentPage(0)
                            await getData({
                                sort,
                                q: val,
                                sortColumn,
                                page: currentPage,
                                selectedSize,
                                status: statusValue
                            })
                        } else {
                            customToastMsg(res.message, res.status)
                        }
                    })
            }
        )
    }

    function calculateFallout(val) {
        const data = Number(val) * Number(styleData.falloutPercentage) / 100
        return roundNumber2Decimals(Number(val) + data).toString()
    }

    const consumption = [
        {
            sortable: false,
            minWidth: '180px',
            name: 'Yarn Supplier',
            sortField: 'styleNumber',
            center: true,
            cell: row => row.supplierArticle.supplier.name
        },
        {
            sortable: false,
            minWidth: '240px',
            name: 'Yarn Article',
            sortField: 'articleDes',
            center: true,
            cell: row => row.supplierArticle.article.name
        },
        {
            sortable: false,
            minWidth: '100px',
            name: <span className="text-center">Yarn Twist</span>,
            sortField: 'yarnSupplier',
            center: true,
            cell: row => row.supplierArticle.article.twist
        },
        {
            sortable: false,
            minWidth: '140px',
            name: <span className="text-center">Color Dependency</span>,
            sortField: 'size',
            center: true,
            cell: row => (row.color !== null ? row.color.name : 'None')
        },
        {
            sortable: false,
            minWidth: '150px',
            name: 'Consumption',
            sortField: 'orderQty',
            center: true,
            cell: row => row.consumption
        },
        {
            sortable: false,
            minWidth: '130px',
            name: <span className="text-center">With Fallout</span>,
            sortField: 'consumption Ratio',
            center: true,
            cell: row => row.consumptionWithFallout
        },
        {
            sortable: false,
            minWidth: '280px',
            name: "Action",
            sortField: 'sizeWise',
            center: true,
            cell: row => (
                <div className="d-flex align-items-center justify-content-evenly w-100">
                    <Button
                        color='primary' outline
                        onClick={() => updateForm(row)}
                    >
                        <Edit3 className='font-medium-1 me-50'/>
                        Edit
                    </Button>
                    <Button
                        color='danger' outline
                        onClick={() => removeItem(row)}
                    >
                        <Trash className='font-medium-1 me-50'/>
                        Delete
                    </Button>
                </div>

            )
        }
    ]

    const customStyle = (error) => ({
        control: styles => ({
            ...styles,
            borderColor: error ? '#EA5455' : styles.borderColor,
            '&:hover': {
                borderColor: error ? '#EA5455' : styles['&:hover'].borderColor
            }
        })
    })

    const onArticleSelect = async (selectedOption) => {
        setValue("yarnTwist", await selectedOption.twist)
        setValue("yarnArticle", await selectedOption.value)
    }

    const subArrayMapFunc = (list) => {
        const data = []
        list.map((item) => {
            data.push({
                supplier: item.supplierArticle?.supplier.name,
                article: item.supplierArticle?.article.name,
                twist: item.supplierArticle?.article.twist,
                color: item.color !== null ? item.color?.name : 'None',
                consumption: item.consumption,
                fallout: item.consumptionWithFallout
            })
        })
        return data
    }

    return (
        <div className='invoice-list-wrapper'>
            <Card>
                <div className='invoice-list-dataTable react-dataTable'>
                    <div className='invoice-list-table-header w-100' style={{whiteSpace: 'nowrap'}}>
                        <Row>
                            <Col lg='5' className='d-flex align-items-center px-0 px-lg-1'>
                                {/*<div className='d-flex align-items-center me-2'>*/}
                                {/*    <label htmlFor='rows-per-page'>Size</label>*/}
                                {/*    <Input*/}
                                {/*        type='select'*/}
                                {/*        id='rows-per-page'*/}
                                {/*        value={selectedSize}*/}
                                {/*        onChange={handlePerSize}*/}
                                {/*        className='form-control ms-50 pe-3'*/}
                                {/*    >*/}
                                {/*        {sizesList.map((item, i) => (*/}
                                {/*            <option value={item.value} key={i}>{item.label}</option>*/}
                                {/*        ))}*/}
                                {/*    </Input>*/}
                                {/*</div>*/}
                            </Col>

                            <Col
                                lg='7'
                                className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0'
                            >
                                <Button onClick={() => {
                                    reset()
                                    setIsEditMode(false)
                                    setYarnArticleList([])
                                    setShow(!show)
                                    if (!isSelected) {
                                        setSelectedSize(selectedSizeValue)
                                    }
                                }}>
                                    + Add Yarn Consumption
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {groupArrayList.length !== 0 ? groupArrayList.map((item, i) => (
                        <DataTable
                            grow={3}
                            noHeader
                            pagination={false}
                            sortServer
                            paginationServer
                            subHeader={true}
                            columns={consumption}
                            responsive={true}
                            wrap={true}
                            omit={true}
                            data={dataToRender(item.subList)}
                            sortIcon={<ChevronDown/>}
                            className='react-dataTable'
                            defaultSortField='invoiceId'
                            paginationDefaultPage={currentPage}
                            paginationComponent={CustomPagination}
                            subHeaderComponent={
                                <CustomHeader
                                    value={val}
                                    statusValue={statusValue}
                                    rowsPerPage={rowsPerPage}
                                    typeName={item.componentType}
                                    onButtonClick={() => {
                                        reset()
                                        setYarnArticleList([])
                                        setIsEditMode(false)
                                        setShow(true)
                                        setValue("component", item.componentTypeId)
                                        if (!isSelected) {
                                            setSelectedSize(selectedSizeValue)
                                        }
                                    }}
                                    csvList={subArrayMapFunc(item.subList)}
                                    csvAction={() => setCurrentDateTime(getCustomDateTimeStamp)}
                                    fileName={`Consumption_Confirmation_Report_For_${item.componentType}_${currentDateTime}.csv`}
                                />
                            }
                            key={i}
                        />
                    )) : emptyUI(isFetched)}

                </div>
            </Card>
            <ConsumptionModal
                show={show}
                toggle={() => {
                    setShow(!show)
                    reset()
                }}
                onSubmit={handleSubmit(onSubmit)}
                control={control}
                errors={errors}
                componentList={componentList}
                supplierList={supplierList}
                // onChangeSupplier={selectedOption => console.log(selectedOption)}
                renderDropDown1={
                    <Col md={4} xs={12}>
                        <Label className='form-label mb-1' for='yarnSupplier'>
                            Yarn Supplier
                        </Label>
                        <Controller
                            control={control}
                            name='yarnSupplier'
                            render={({field: {onChange, value, name, ref}}) => {
                                return (
                                    <Select
                                        id='yarnSupplier'
                                        className='react-select'
                                        classNamePrefix='select'
                                        placeholder='Yarn Supplier'
                                        options={supplierList}
                                        theme={selectThemeColors}
                                        value={supplierList.find((c) => c.value === value)}
                                        onChange={selectedOption => {
                                            onChange(getSupplierArticles(selectedOption.value))
                                            setValue("yarnArticle", "")
                                            setValue("yarnTwist", "")
                                        }}
                                        name={name}
                                        inputRef={ref}
                                        required={true}
                                        errorText={true}
                                        styles={customStyle(errors.yarnSupplier)}
                                    />
                                )
                            }}
                        />
                        {errors.yarnSupplier && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a yarn supplier</span>}
                    </Col>
                }

                renderDropDown2={
                    <Col md={4} xs={12}>
                        <Label className='form-label mb-1' for='yarnArticle'>
                            Yarn Article
                        </Label>
                        <Controller
                            control={control}
                            name='yarnArticle'
                            render={({field: {onChange, value, name, ref}}) => {
                                return (
                                    <Select
                                        id='yarnArticle'
                                        className='react-select'
                                        classNamePrefix='select'
                                        placeholder='Yarn Article'
                                        options={yarnArticleList}
                                        theme={selectThemeColors}
                                        value={value !== '' ? yarnArticleList.find((c) => c.value === value) : null}
                                        onChange={selectedOption => onChange(onArticleSelect(selectedOption))}
                                        name={name}
                                        inputRef={ref}
                                        required={true}
                                        errorText={true}
                                        styles={customStyle(errors.yarnArticle)}
                                    />
                                )
                            }}
                        />

                        {errors.yarnArticle && <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a yarn article</span>}
                    </Col>
                }

                renderInput1={
                    <Col md={4} xs={12}>
                        <Label className='form-label mb-1' for='yarnTwist'>
                            Yarn Twist
                        </Label>
                        <Controller
                            control={control}
                            name='yarnTwist'
                            render={({field}) => (
                                <Input {...field} id='yarnTwist' placeholder='Yarn Twist' disabled
                                       value={field.value}
                                       invalid={errors.yarnTwist && true}/>
                            )}
                        />

                        {errors.yarnTwist && <FormFeedback>Please enter a yarn twist</FormFeedback>}
                    </Col>
                }

                // onchangeArticle={selectedOption => {
                //     setValue("yarnTwist", selectedOption.twist)
                //     setValue("yarnArticle", selectedOption.value)
                // }}
                yarnArticleList={yarnArticleList}
                dependantColorList={colorList}
                selectedSize={selectedSize}
                styleData={styleData}
                onConsumptionChange={(e) => {
                    if (e.target.value !== "0") {
                        setValue("consumption", e.target.value)
                        setValue("consumptionFallOut", calculateFallout(e.target.value))
                    }

                }}
                isEditMode={isEditMode}
            />
        </div>

    )
}

export default ConsumptionList
