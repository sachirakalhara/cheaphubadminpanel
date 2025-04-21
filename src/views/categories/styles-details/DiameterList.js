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
import {Check, Edit3, Eye, User, X} from "react-feather"
import {SIZES} from "../../../const/constant"
import {customToastMsg, emptyUI, roundNumber} from "../../../utility/Utils"
import {Link, useParams} from "react-router-dom"
import ReactPaginate from "react-paginate"
// eslint-disable-next-line no-unused-vars
import {loadingHandler} from '@store/layout'
import {useDispatch} from 'react-redux'
import DiameterModal from "../../../@core/components/modal/categoryModal/DiameterModal"
import * as stylesService from "../../../services/style-resources"
import * as knittingDiaServices from "../../../services/knittingDia-resources"
import {toggleLoading} from '@store/loading'
import {selectThemeColors} from '@utils'
import Select from "react-select"


const defaultValues = {
    size: '',
    knittingDia: '',
    components: '',
    smv: '',
    weight: ''
}

// eslint-disable-next-line no-unused-vars
const DiameterList = ({componentList, components}) => {

    const [show, setShow] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [data, setData] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [stylesList, setStylesList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [colorsList, setColorsList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [stylesFull, setStylesFull] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [colorsFull, setColorsFull] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [knittingDiaList, setKnittingDiaList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [knittingDiaData, setKnittingDiaData] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedId, setSelectedId] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [isCheckEditPermission, setIsCheckEditPermission] = useState(false)

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
    const {id} = useParams()
    // eslint-disable-next-line no-unused-vars
    const dispatch = useDispatch()


    const getData = async (page) => {
        await stylesService.getDiameterConfirmationByStyleId(id, page)
            .then(res => {
                if (res.success) {
                    setData(res.data.content)
                    setTotalPages(res.data.totalPages)
                } else {
                    customToastMsg(res.message, res.status)
                }
                setIsFetched(true)
            })
    }

    const getAllKnittingDia = async () => {
        await knittingDiaServices.getAllKnittingDia()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            value: item.id,
                            label: item.knittingDiameter
                        })
                    })
                    setKnittingDiaList(list.sort((a, b) => Number(a.label) - Number(b.label)))
                    setKnittingDiaData(res.data)
                }
            })
    }

    useEffect(async () => {

        await getData(currentPage)
        await getAllKnittingDia()
    }, [])

    const onSubmit = async data => {
        console.log(data)
        if (Object.values(data).every(field => field.length > 0)) {
            dispatch(toggleLoading())
            const body = {
                garmentSize: data.size,
                smv: data.smv,
                weight: data.weight,
                deleted: false,
                styleComponent: components.find(obj => obj.component.id === data.components),
                knittingDiameter: knittingDiaData.find(obj => obj.id === data.knittingDia)
            }
            if (!isEditMode) {
                await stylesService.saveDiameterConfirmation(body)
                    .then(res => {
                        if (res.success) {
                            customToastMsg('Record added', 1)
                            setIsCheckEditPermission(false)
                            setCurrentPage(0)
                            getData(0)
                            setShow(false)
                        } else {
                            customToastMsg(res.message, res.status)
                        }
                        dispatch(toggleLoading())
                    })
            } else {
                Object.assign(body, {
                    id: selectedId
                })
                await stylesService.updateDiameterConfirmation(body, isCheckEditPermission)
                    .then(res => {
                        if (res.success) {
                            customToastMsg('Record updated', 1)
                            setIsCheckEditPermission(false)
                            setCurrentPage(0)
                            getData(0)
                            setShow(false)
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

    const updateForm = (item) => {
        console.log(item)
        setValue("components", item.styleComponent.component.id.toString())
        setValue("knittingDia", item.knittingDiameter.id.toString())
        setValue("smv", item.smv.toString())
        setValue("weight", item.weight.toString())
        setValue("size", item.garmentSize)

        setSelectedId(item.id)
        setIsEditMode(true)
        setShow(!show)
    }

    const customStyle = (error) => ({
        control: styles => ({
            ...styles,
            borderColor: error ? '#EA5455' : styles.borderColor,
            '&:hover': {
                borderColor: error ? '#EA5455' : styles['&:hover'].borderColor
            }
        })
    })

    const tableBodyItems = data.map((item, i) => (
        <tr key={i} align={'center'}>
            {/*<td className='py-1 d-flex align-items-center w-100 justify-content-between'>*/}
            <td className='py-1'>
                <p className='card-text fw-bold mb-25'>{item.garmentSize}</p>
                {/*<Button*/}
                {/*    color='success'  outline*/}
                {/*    // tag={Link} to={`/style/style-details/1`}*/}
                {/*>*/}
                {/*    <Eye className='font-medium-1 me-50'/>*/}
                {/*    View*/}
                {/*</Button>*/}
            </td>
            <td className='py-1'>
                <span
                    className='fw-bold'>{item.knittingDiameter !== null ? item.knittingDiameter.knittingDiameter : null}</span>
            </td>
            <td className='py-1'>
                <span className='fw-bold'>{item.styleComponent.component.type}</span>
            </td>
            <td className='py-1'>
                <span className='fw-bold'>{roundNumber(item.smv)}</span>
            </td>
            <td className='py-1'>
                <span className='fw-bold'>{roundNumber(item.weight)}</span>
            </td>
            <td className='py-1'>
                <Button
                    color='primary' outline
                    onClick={() => updateForm(item)}
                >
                    <Edit3 className='font-medium-1 me-50'/>
                    Edit
                </Button>
            </td>
        </tr>
    ))

    const handlePagination = async page => {
        await getData(page.selected)
        setCurrentPage(page.selected + 1)
    }


    const onSelect = async (selectedOption, type) => {
        console.log(selectedOption, type)

        if (type === 'size') {
            setValue("size", await selectedOption.value)
        } else {
            setValue("components", await selectedOption.value)
        }

    }


    return (
        <div>
            <CardBody className='justify-content-end pb-0 pt-0'>
                <div className='d-flex justify-content-end invoice-spacing mt-0'>
                    <div className='mt-md-0'>
                        <Button block onClick={() => {
                            reset()
                            setIsEditMode(false)
                            setShow(!show)
                        }}>
                            + Add Diameter Confirmation
                        </Button>
                    </div>
                </div>
            </CardBody>

            {data.length !== 0 ? (
                <>
                    <Table responsive>
                        <thead align={'center'}>
                        <tr>
                            <th className='py-1'>Size</th>
                            <th className='py-1'>Knitting Dia</th>
                            <th className='py-1'>Components</th>
                            <th className='py-1'>SMV</th>
                            <th className='py-1'>Weight <span className="text-lowercase">(g)</span></th>
                            <th className='py-1'>Action</th>
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

            <DiameterModal
                show={show}
                toggle={() => {
                    setShow(!show)
                    setIsCheckEditPermission(false)
                    reset()
                }}
                onSubmit={handleSubmit(onSubmit)}
                control={control}
                errors={errors}
                sizeList={SIZES}
                knittingDiaList={knittingDiaList}
                componentsList={componentList}
                isEditMode={isEditMode}
                dropDown1={
                    <Col md={6} xs={12}>
                        <Label className='form-label mb-1' for='size'>
                            Size
                        </Label>
                        <Controller
                            control={control}
                            name='size'
                            render={({field: {onChange, value, name, ref}}) => {
                                return (
                                    <Select
                                        id='size'
                                        className='react-select'
                                        classNamePrefix='select'
                                        placeholder='Size'
                                        options={SIZES}
                                        theme={selectThemeColors}
                                        value={SIZES.find((c) => c.value === value)}
                                        onChange={(selectedOption) => {
                                            onChange(onSelect(selectedOption, 'size'))
                                            if (value === selectedOption.value) {
                                                setIsCheckEditPermission(false)
                                            } else {
                                                setIsCheckEditPermission(true)
                                            }
                                        }}
                                        name={name}
                                        inputRef={ref}
                                        required={true}
                                        errorText={true}
                                        styles={customStyle(errors.size)}
                                    />
                                )
                            }}
                        />

                        {errors.size &&
                        <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a size</span>}
                    </Col>
                }
                dropdown2={
                    <Col md={6} xs={12}>
                        <Label className='form-label mb-1' for='components'>
                            Components
                        </Label>
                        <Controller
                            control={control}
                            name='components'
                            render={({field: {onChange, value, name, ref}}) => {
                                return (
                                    <Select
                                        id='components'
                                        className='react-select'
                                        classNamePrefix='select'
                                        placeholder='Components'
                                        options={componentList}
                                        theme={selectThemeColors}
                                        value={componentList.find((c) => c.value === value)}
                                        onChange={(selectedOption) => {
                                            onChange(onSelect(selectedOption, 'components'))
                                            if (value === selectedOption.value) {
                                                setIsCheckEditPermission(false)
                                            } else {
                                                setIsCheckEditPermission(true)
                                            }
                                        }}
                                        name={name}
                                        inputRef={ref}
                                        required={true}
                                        errorText={true}
                                        styles={customStyle(errors.components)}
                                    />
                                )
                            }}
                        />

                        {errors.components &&
                        <span
                            style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a component</span>}
                    </Col>
                }
            />
        </div>
    )
}

export default DiameterList
