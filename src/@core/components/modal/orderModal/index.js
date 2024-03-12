import React, {useEffect, useState} from "react"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import Select from "react-select"
import {SIZES} from "../../../../const/constant"
import Flatpickr from "react-flatpickr"
import {selectThemeColors} from '@utils'
import Modal from "../index"
import * as StyleServices from '../../../../services/style-resources'

// const options = {
//     enableTime: false,
//     dateFormat: 'd-m-Y'
// }

const OrderModal = (props) => {

    const [sizesList, setSizesList] = useState([])
    const [colorList, setColorList] = useState([])

    const customStyle = (error) => ({
        control: styles => ({
            ...styles,
            borderColor: error ? '#EA5455' : styles.borderColor,
            '&:hover': {
                borderColor: error ? '#EA5455' : styles['&:hover'].borderColor
            }
        })
    })

    const getStylesDetails = async (id) => {
        await StyleServices.getStyleDetailsById(id)
            .then(async res => {
                if (res.success) {
                    const list = []
                    const list2 = []
                    res.data.garmentSizeRawData.map(item => {
                        list.push({
                            label: item.garmentSize,
                            value: item.garmentSize
                        })
                    })

                    res.data.colorRawData.map(item => {
                        if (item.id !== null) {
                            list2.push({
                                label: item.name,
                                value: item.id
                            })
                        }

                    })

                    const sortSizeArray = await list.sort((a, b) => a.label.localeCompare(b.label))
                    const sortColorArray = await list2.sort((a, b) => a.label.localeCompare(b.label))

                    setSizesList(await sortSizeArray)
                    setColorList(await sortColorArray)
                }
            })
    }

    useEffect(async () => {
        if (props.isEditMode) {
            await getStylesDetails(props.styleId)
        }
    }, [props.show])

    return (
        <Modal show={props.show} toggle={props.toggle} headTitle={props.headTitle}>
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='style'>
                        Style
                    </Label>
                    <Controller
                        control={props.control}
                        name='style'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='style'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Style'
                                    options={props.stylesList}
                                    theme={selectThemeColors}
                                    value={props.stylesList.find((c) => c.value === value)}
                                    onChange={async (selectedOption) => {
                                        onChange(selectedOption.value)
                                        await getStylesDetails(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.style)}
                                />
                            )
                        }}
                    />

                    {props.errors.style &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a style</span>}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='selectedSize'>
                        Size
                    </Label>

                    <Controller
                        control={props.control}
                        name='selectedSize'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='selectedSize'
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder='Size'
                                    options={sizesList}
                                    theme={selectThemeColors}
                                    value={sizesList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.selectedSize)}
                                />
                            )
                        }}
                    />
                    {props.errors.selectedSize &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a size</span>}
                    {/*<Controller*/}
                    {/*    name='selectedSize'*/}
                    {/*    control={props.control}*/}
                    {/*    render={({field}) => (*/}
                    {/*        <Input {...field} id='selectedSize' placeholder='Size' value={field.value}*/}
                    {/*               invalid={props.errors.qty && true} autoComplete={"off"} disabled/>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*{props.errors.selectedSize && <FormFeedback>Please select a Size</FormFeedback>}*/}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='color'>
                        Color
                    </Label>
                    <Controller
                        control={props.control}
                        name='color'
                        render={({field: {onChange, value, name, ref}}) => {
                            return (
                                <Select
                                    id='color'
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={colorList}
                                    theme={selectThemeColors}
                                    value={colorList.find((c) => c.value === value)}
                                    onChange={(selectedOption) => {
                                        onChange(selectedOption.value)
                                    }}
                                    name={name}
                                    inputRef={ref}
                                    required={true}
                                    errorText={true}
                                    styles={customStyle(props.errors.color)}
                                />
                            )
                        }}
                    />
                    {props.errors.color &&
                    <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>Please select a color</span>}

                    {/*<Controller*/}
                    {/*    name='color'*/}
                    {/*    control={props.control}*/}
                    {/*    render={({field}) => (*/}
                    {/*        <Input {...field} id='color' placeholder='Color' value={field.value}*/}
                    {/*               invalid={props.errors.qty && true} autoComplete={"off"} disabled/>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*{props.errors.color && <FormFeedback>Please select a Color</FormFeedback>}*/}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='qty'>
                        Quantity
                    </Label>
                    <Controller
                        name='qty'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='qty' placeholder='Quantity' value={field.value}
                                   invalid={props.errors.qty && true} autoComplete={"off"} type={'number'}
                                   onChange={(e) => {
                                       if (/^(0|[1-9]\d*)$/.test(e.target.value) || e.target.value.length === 0) {
                                           field.onChange(e)
                                       }
                                   }}
                            />
                        )}
                    />
                    {props.errors.qty && <FormFeedback>Please enter a valid quantity</FormFeedback>}
                </Col>
                <Col md={6} xs={12}>
                    <Label className='form-label mb-1' for='price'>
                        Price
                    </Label>
                    <Controller
                        control={props.control}
                        name='price'
                        render={({field}) => {
                            return (
                                <Input
                                    {...field}
                                    id='price'
                                    placeholder='Price'
                                    value={field.value}
                                    invalid={props.errors.price && true}
                                    autoComplete={"off"}
                                    type={'number'}
                                    onChange={(e) => {
                                        if (/^(?:\d*\.\d{1,2}|\d+)$/.test(e.target.value) || e.target.value.length === 0) {
                                            field.onChange(e)
                                        }
                                    }}
                                />
                            )
                        }}
                    />
                    {props.errors.price && <FormFeedback>Please enter a valid price</FormFeedback>}
                </Col>

                <Col xs={12} className='d-flex justify-content-end mt-3 pt-50'>
                    <Button type='submit' className='me-1' color='success'>
                        Submit
                    </Button>
                    <Button type='reset' color='secondary' outline onClick={props.toggle}>
                        Discard
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default OrderModal
