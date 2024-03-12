// eslint-disable-next-line no-unused-vars
import React, {Fragment, useEffect, useState} from "react"

import {
    Button,
    Card,
    CardBody,
    Col,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Table
} from "reactstrap"
import {Controller, useForm} from "react-hook-form"
import Select from "react-select"
import {Check, Edit3, X} from "react-feather"
// import {selectThemeColors} from '@utils'
import Flatpickr from "react-flatpickr"
import {SIZES} from "../../../const/constant"
import OrderModal from "../../../@core/components/modal/orderModal"
import * as orderService from "../../../services/order-resources"
import * as stylesService from "../../../services/style-resources"
import * as colorServices from "../../../services/color-resources"
import {customToastMsg, emptyUI, isEmpty, roundNumber} from "../../../utility/Utils"
import {Link, useParams} from "react-router-dom"
import ReactPaginate from "react-paginate"
// eslint-disable-next-line no-unused-vars
import {useDispatch} from 'react-redux'
import {toggleLoading} from '@store/loading'

function padTo2Digits(num) {
    return num.toString().padStart(2, '0')
}

function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear()
    ].join('-')
}

const defaultValues = {
    style: '',
    qty: '',
    selectedSize: '',
    color: '',
    price: '',
    deliveryDate: formatDate(new Date())
    // destination: ''
}

const OrderDetailsList = ({orderInfo}) => {

    const [show, setShow] = useState(false)
    const [data, setData] = useState([])
    const [stylesList, setStylesList] = useState([])
    const [colorsList, setColorsList] = useState([])
    const [stylesFull, setStylesFull] = useState([])
    const [colorsFull, setColorsFull] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [headerTitle, setHeaderTitle] = useState('')
    const [selectedId, setSelectedId] = useState('')
    const [isFetched, setIsFetched] = useState(false)

    // ** Hooks
    const {
        control,
        setError,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        reset
    } = useForm({defaultValues})
    const {id} = useParams()
    // eslint-disable-next-line no-unused-vars
    const dispatch = useDispatch()

    // eslint-disable-next-line no-unused-vars
    const getAllStyles = async () => {
        await stylesService.getAllStyles()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(items => {
                        list.push({
                            value: items.id,
                            label: items.styleNumber
                        })
                    })
                    setStylesList(list)
                    setStylesFull(res.data)
                } else {
                    customToastMsg(res.data.title, res.status)
                }
            })
    }

    // eslint-disable-next-line no-unused-vars
    const getAllColors = async () => {
        await colorServices.getAllColors()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(items => {
                        list.push({
                            value: items.id,
                            label: items.name
                        })
                    })
                    setColorsList(list)
                    setColorsFull(res.data)
                } else {
                    customToastMsg(res.data.title, res.status)
                }
            })
    }

    const getOrderInfos = async (page) => {
        await orderService.getOrderInfosByPONumber(id, page)
            .then(res => {
                if (res.success) {
                    // console.log(res)
                    setData(res.data.content)
                    setTotalPages(res.data.totalPages)
                } else {
                    console.log(res)
                    customToastMsg(res.message, res.status)
                }
                setIsFetched(true)
            })
    }

    useEffect(async () => {
        await getAllStyles()
        await getAllColors()
        await getOrderInfos(0)
    }, [])

    const onSubmit = async data => {
        console.log(data)
        if (Object.values(data).every(field => field.length > 0)) {
            dispatch(toggleLoading())
            const body = {
                color: colorsFull.find(items => items.id === data.color),
                deleted: false,
                garmentSize: data.selectedSize,
                order: orderInfo,
                price: data.price,
                quantity: data.qty,
                style: stylesFull.find(item => item.id === data.style)
            }

            if (headerTitle !== "Edit Order Item") {
                await orderService.createOrderInfos(body)
                    .then(async res => {
                        if (!res.success) {
                            customToastMsg(res.message, res.status)
                        } else {
                            customToastMsg('Order Item Added', 1)
                            await getOrderInfos(0)
                            setCurrentPage(0)
                            setShow(false)
                        }
                        dispatch(toggleLoading())
                    })
            } else {
                Object.assign(body, {
                    id: selectedId
                })
                await orderService.updateOrderInfos(body, selectedId)
                    .then(async res => {
                        if (!res.success) {
                            customToastMsg(res.message, res.status)
                        } else {
                            customToastMsg('Order Item Updated', 1)
                            await getOrderInfos(currentPage - 1)
                            setShow(false)
                        }
                        // setCurrentPage(0)
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

    const onOpenEditModal = (item) => {
        setValue("style", item.style.id)
        setValue("qty", item.quantity.toString())
        setValue("selectedSize", item.garmentSize)
        setValue("color", item.color.id)
        setValue("price", item.price.toString())
        setValue("deliveryDate", formatDate(new Date(item.order.deliveryDate)))
        // setValue("destination", 'LK')

        setSelectedId(item.id)

        console.log(item)

        setHeaderTitle("Edit Order Item")
        setShow(!show)
    }


    const tableBodyItems = data.map((item, i) => (
        <tr key={i}>
            <td className='py-1 text-hover-underline'>
                <Link
                    to={`/styles/styles-details/${item.style.id}/components`} target="_blank"
                    rel="noopener noreferrer">
                    <p className='card-text fw-bold mb-25 text-center text-body'>{item.style.styleNumber}</p>
                </Link>
            </td>
            <td className='py-1'>
                <p className='card-text fw-bold mb-25 text-center'>{item.style.styleDescription}</p>
            </td>
            <td className='py-1'>
                <p className='card-text fw-bold text-center'>{item.garmentSize}</p>
            </td>
            <td className='py-1'>
                <p className='card-text fw-bold text-center'>{item.color.name}</p>
            </td>
            <td className='py-1'>
                <p className='card-text fw-bold text-center'>{item.quantity}</p>
            </td>
            <td className='py-1'>
                <p className='card-text fw-bold text-center'>{roundNumber(item.price)}</p>
            </td>
            <td className='py-1 justify-content-center d-flex' onClick={() => onOpenEditModal(item)}>
                <Button
                    color='success' outline
                    style={{height: 30, paddingTop: 0, paddingBottom: 0}}
                >
                    <Edit3 size={15} style={{marginRight: 5}}/>
                    Edit
                </Button>
            </td>
        </tr>
    ))

    const handlePagination = async page => {
        await getOrderInfos(page.selected)
        setCurrentPage(page.selected + 1)
    }


    return (
        <div>
            <CardBody className='justify-content-end pb-0 pt-0'>
                <div className='d-flex justify-content-end invoice-spacing mt-0'>
                    <div className='mt-md-0'>
                        <Button block onClick={() => {
                            reset()
                            setShow(!show)
                            setHeaderTitle("Add New Order Item")
                        }}>
                            Add
                        </Button>
                    </div>
                </div>
            </CardBody>

            {data.length !== 0 ? (
                <>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th className='py-1 text-center'>Style</th>
                            <th className='py-1 text-center'>Style Description</th>
                            <th className='py-1 text-center'>Size</th>
                            <th className='py-1 text-center'>Color</th>
                            <th className='py-1 text-center'>Quantity</th>
                            <th className='py-1 text-center'>Price {!isEmpty(orderInfo.priceTerm) ? `(${orderInfo.priceTerm})` : ''}</th>
                            <th className='py-1 text-center'>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableBodyItems}
                        </tbody>
                    </Table>

                    <ReactPaginate
                        nextLabel=''
                        breakLabel='...'
                        previousLabel=''
                        pageCount={totalPages || 1}
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
                </>
            ) : emptyUI(isFetched)}


            {show && (
                <OrderModal
                    show={show}
                    stylesList={stylesList}
                    colorsList={colorsList}
                    toggle={() => {
                        setShow(!show)
                        reset()
                    }}
                    onSubmit={handleSubmit(onSubmit)}
                    control={control}
                    errors={errors}
                    headTitle={headerTitle}
                    setValue={setValue}
                    isEditMode={headerTitle === "Edit Order Item"}
                    styleId={getValues("style")}
                />
            )}

        </div>
    )
}

export default OrderDetailsList
