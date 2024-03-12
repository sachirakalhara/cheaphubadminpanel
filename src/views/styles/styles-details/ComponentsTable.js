// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {Table, Card, Button, Row, Col, Input} from 'reactstrap'

// ** Icons Imports
import {Monitor, Coffee, Watch, TrendingUp, TrendingDown, X, Plus, Edit3} from 'react-feather'
import React, {useEffect, useState} from "react"
import ComponentModal from "../../../@core/components/modal/stylesModal/ComponentModal"
// eslint-disable-next-line no-unused-vars
import {customToastMsg, emptyUI} from "../../../utility/Utils"
// eslint-disable-next-line no-unused-vars
import {useParams} from "react-router-dom"
import {SlideDown} from "react-slidedown"
import Select from "react-select"
import Modal from "../../../@core/components/modal"
import Repeater from '@components/repeater'
import {selectThemeColors} from '@utils'
import * as styleServices from '../../../services/style-resources'
import * as componentServices from '../../../services/component-resources'
// eslint-disable-next-line no-unused-vars
import {toggleLoading} from '@store/loading'
import {useDispatch} from "react-redux"

// eslint-disable-next-line no-unused-vars
const ComponentsTable = ({componentList, components}) => {

    // eslint-disable-next-line no-unused-vars
    const [modalVisible, setModalVisible] = useState(false)
    const [count, setCount] = useState(1)
    const {id} = useParams()
    // eslint-disable-next-line no-unused-vars
    const dispatch = useDispatch()

    // eslint-disable-next-line no-unused-vars
    const [inputFields, setInputFields] = useState([])

    // eslint-disable-next-line no-unused-vars
    const [selectedComponentList, setSelectedComponentList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [isEditorble, setIsEditorble] = useState(false)
    const [modifiedList, setModifiedList] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const [singleComEdit, setSingleComEdit] = useState(false)
    const [selectedSingleCompo, setSelectedSingleCompo] = useState({})

    // eslint-disable-next-line no-unused-vars
    const getAllStyleComponents = async (array) => {
        await styleServices.getAllStyleComponents()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map((item, i) => {
                        list.push({
                            value: item.component.id,
                            label: item.component.type,
                            ratio: '',
                            name: `newObj${i}`
                        })
                    })

                    // console.log(array)

                    // const nonMatched = list.filter(function (val) {
                    //     return array.map(function (e) {
                    //         return e.label
                    //     }).indexOf(val.label) === -1
                    // })

                    // setModifiedList([])
                    setModalVisible(false)

                } else {
                    customToastMsg(res.data.title, res.status)
                }
            })
    }

    const getAllComponents = (array) => {
        componentServices.getAllComponents()
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map((item, i) => {
                        list.push({
                            value: item.id,
                            label: item.type,
                            // ratio: '1:',
                            ratio: '',
                            name: `newObj${i}`
                        })
                    })

                    const nonMatched = list.filter(function (val) {
                        return array.map(function (e) {
                            return e.label
                        }).indexOf(val.label) === -1
                    })

                    setModifiedList(nonMatched)
                    // setModalVisible(false)

                } else {
                    customToastMsg(res.data.title, res.status)
                }
            })
    }

    const getStyleComponentById = async () => {
        await styleServices.getComponentsByStyleId(id)
            .then(res => {
                if (res.success) {
                    const list = []
                    res.data.map(item => {
                        list.push({
                            id: item.id,
                            value: item.component.id,
                            label: item.component.type,
                            ratio: item.ratio.slice(2)
                        })
                    })
                    setInputFields(list)
                    getAllComponents(list)
                    setIsFetched(true)
                    // getAllStyleComponents(list)
                } else {
                    customToastMsg(res.data.title, res.status)
                }
            })
    }

    useEffect(async () => {
        await getStyleComponentById()
    }, [])

    const renderData = () => {
        return inputFields.map((col, i) => {
            return (
                <tr key={i}>
                    <td>{col.label}</td>
                    <td>1:{col.ratio}</td>
                    <td className='py-1'>
                        <Button
                            color='primary' outline
                            onClick={() => {
                                console.log(col)
                                setSelectedSingleCompo(col)
                                setSingleComEdit(true)
                            }}
                        >
                            <Edit3 className='font-medium-1 me-50'/>
                            Edit
                        </Button>
                    </td>
                </tr>
            )
        })
    }

    const onSelectItem = (selectedItem) => {
        const removeIndex = selectedComponentList.findIndex(function (e) {
            return e.label === selectedItem.label
        })


        if (removeIndex !== -1) {
            customToastMsg('You already selected', 0)
        } else {
            const list = [...selectedComponentList]
            list.push(selectedItem)
            setSelectedComponentList(list)
        }


        const updateIndex = modifiedList.findIndex(function (e) {
            return e.label === selectedItem.label
        })

        if (updateIndex !== -1) {
            modifiedList[updateIndex].isDisabled = true
            modifiedList[updateIndex].isSelected = true
        }
    }

    const customStyles = {
        placeholder: base => ({
            ...base,
            position: 'absolute'
        }),
        container: base => ({
            ...base,
            alignItems: 'flex-end'
        })
    }

    // ** Deletes form
    // eslint-disable-next-line no-unused-vars
    const deleteForm = e => {
        e.preventDefault()
        e.target.closest('.repeater-wrapper').remove()
    }

    const handleFormChange = (index, event) => {
        const val = [...inputFields]
        // const lastDigit = event.target.value.slice(-1)
        // if (event.target.value.length >= 2 &&
        //     !isNaN(lastDigit !== ':' ? lastDigit : '') &&
        //     lastDigit !== '0') {
        val[index].ratio = event.target.value
        setInputFields(val)
        // }
        setIsEditorble(true)
    }

    const handleFormChange2 = (index, event) => {
        const val = [...selectedComponentList]
        // const lastDigit = event.target.value.slice(-1)
        // if (val[index] !== undefined && event.target.value.length >= 2 &&
        //     !isNaN(lastDigit !== ':' ? lastDigit : '') &&
        //     lastDigit !== '0'
        // ) {
        if (val[index] !== undefined) {
            val[index].ratio = event.target.value
            setSelectedComponentList(val)
        }

        // }
        // console.log(event.target.value)
        // console.log(val[index])
    }

    // eslint-disable-next-line no-unused-vars
    function calculationRatioHandler(ratio) {
        return ((Number(ratio.split(":")[0]) / Number(ratio.split(":")[1])).toFixed(2)).toString()
    }


    const saveStyleComponent = async () => {
        let endpointAsFetched = false
        if (selectedComponentList.length !== 0) {

            let access = true

            for (const item of selectedComponentList) {
                console.log(item)

                if (item.ratio === "") {
                    console.log('not access')
                    access = false
                }
            }

            if (access) {
                const list = []
                selectedComponentList.map(item => {
                    list.push({
                        ration: `1:${item.ratio}`,
                        // calculatedRation: calculationRatioHandler(item.ratio),
                        calculatedRation: (1 / Number(item.ratio)).toFixed(2).toString(),
                        styleId: id,
                        componentId: item.value
                    })
                })

                dispatch(toggleLoading())
                await styleServices.saveStyleComponent(list)
                    .then(async res => {
                        if (res.success) {
                            customToastMsg(res.data, res.status)
                            setSelectedComponentList([])
                            setModalVisible(false)
                            if (!endpointAsFetched) {
                                setSelectedComponentList([])
                                setModifiedList([])
                                await getStyleComponentById()
                                endpointAsFetched = true
                            }
                        } else {
                            customToastMsg(res.message, res.status)
                        }
                        dispatch(toggleLoading())
                    })
            } else {
                customToastMsg('Please enter a valid ratio', 0)
            }
        }

        if (inputFields.length !== 0 && isEditorble) {
            const list = []
            inputFields.map(item => {
                list.push({
                    ration: `1:${item.ratio}`,
                    // calculatedRation: calculationRatioHandler(item.ratio),
                    calculatedRation: (1 / Number(item.ratio)).toFixed(2).toString(),
                    id: item.id
                })
            })
            dispatch(toggleLoading())
            await styleServices.updateStyleComponent(list)
                .then(async res => {
                    if (res.success) {
                        customToastMsg(res.data, res.status)
                        setModalVisible(false)
                        setSingleComEdit(false)
                        if (!endpointAsFetched) {
                            setSelectedComponentList([])
                            setModifiedList([])
                            await getStyleComponentById()
                            endpointAsFetched = true
                        }
                    } else {
                        customToastMsg(res.message, res.status)
                    }
                    dispatch(toggleLoading())
                })

        }
    }

    return (
        <div className="custom-box-border my-2">
            <Card className='card-company-table'>
                {inputFields.length !== 0 ? (
                    <Table responsive className="text-center">
                        <thead>
                        <tr>
                            <th>Components</th>
                            <th>Ratio</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>{renderData()}</tbody>
                    </Table>
                ) : emptyUI(isFetched)}

                <div className='d-flex align-items-center w-100 justify-content-center mt-3'>
                    <Button onClick={() => {
                        setModalVisible(true)
                        setIsEditorble(false)
                        setCount(1)
                    }}>
                        + Add More Components
                    </Button>
                </div>

            </Card>

            <Modal show={modalVisible} toggle={async () => {
                setModalVisible(!modalVisible)
                setSelectedComponentList([])
                setModifiedList([])
                await getStyleComponentById()
            }} headTitle="Add Components">
                <Row className='gy-1 pt-3 justify-content-center'>
                    <div className="repeater-wrapper justify-content-center ">
                        <Col className='d-flex align-items-center  justify-content-center'>
                            <Row className="w-100 justify-content-center ">
                                <Col md={8} className=" ps-3">
                                    <h4>Component</h4>
                                </Col>
                                <Col md={4} className="ps-3">
                                    <h4>Ratio</h4>
                                </Col>
                            </Row>
                        </Col>
                    </div>

                    {inputFields.map((item, index) => (
                        <div key={index} className='repeater-wrapper mt-2  justify-content-center'>
                            <Col className='d-flex align-items-center  justify-content-center'>
                                <Row className="w-100 justify-content-center">
                                    <Col md={8}>
                                        <Input
                                            value={item.label}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3} className="d-flex align-items-center">
                                        <span className="me-1">1:</span>
                                        <Input
                                            placeholder='Ratio'
                                            name={item.label}
                                            onChange={(event) => handleFormChange(index, event)}
                                            value={item.ratio}
                                            autoComplete="off"
                                            maxLength="2"
                                        />
                                    </Col>
                                </Row>
                                {/*<div*/}
                                {/*    className='ms-2'>*/}
                                {/*    <X size={18} className='cursor-pointer' color={'transparent'}/>*/}
                                {/*</div>*/}
                            </Col>
                        </div>
                    ))}

                    {modifiedList.length > count - 1 && (
                        <>
                            <Repeater count={count}>
                                {i => {
                                    const Tag = i === 0 ? 'div' : SlideDown
                                    return (
                                        <Tag key={i} className='repeater-wrapper mt-2'>
                                            <Col className='d-flex align-items-center justify-content-center'>
                                                <Row className="w-100 justify-content-center ">
                                                    <Col md={8}>
                                                        <Select
                                                            styles={customStyles}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={modifiedList}
                                                            theme={selectThemeColors}
                                                            placeholder="Select Component"
                                                            name={`newObj${i + 1}`}
                                                            // value={componentList.find((c) => c.value === value)}
                                                            onChange={(e) => onSelectItem(e)}
                                                            isOptionSelected={option => option.isSelected}
                                                            hideSelectedOptions={option => option.isSelected}
                                                            isDisabled={selectedComponentList[i] !== undefined}
                                                            components={selectedComponentList[i] !== undefined ? {
                                                                DropdownIndicator: () => null,
                                                                IndicatorSeparator: () => null
                                                            } : {}}
                                                        />
                                                    </Col>
                                                    <Col md={3} className="d-flex align-items-center">
                                                        <span className="me-1">1:</span>
                                                        <Input
                                                            placeholder='Ratio'
                                                            name={`newObj${i + 1}`}
                                                            onChange={(event) => handleFormChange2(i, event)}
                                                            maxLength="2"
                                                            // value={modifiedList.length !== 0 ? modifiedList[i].ratio : ''}
                                                            autoComplete="off"
                                                            disabled={selectedComponentList[i] === undefined}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/*<div*/}
                                                {/*    className='ms-2'>*/}
                                                {/*    <X size={18} className='cursor-pointer' onClick={deleteForm}/>*/}
                                                {/*</div>*/}
                                            </Col>
                                        </Tag>
                                    )
                                }}
                            </Repeater>

                            <Button className="w-50 mt-3" onClick={() => {
                                if (modifiedList.length > count) {
                                    setCount(count + 1)
                                } else {
                                    customToastMsg("Out of range", 0)
                                }

                            }}>
                                <Plus size={14} className='me-25'></Plus> <span
                                className='align-middle'>Add More Components</span>
                            </Button>
                        </>
                    )}


                    <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                        <Button className='me-1' color='success' onClick={() => saveStyleComponent()}>
                            Save
                        </Button>
                        <Button onClick={async () => {
                            setModalVisible(!modalVisible)
                            setSelectedComponentList([])
                            setModifiedList([])
                            await getStyleComponentById()
                        }} outline>
                            Discard
                        </Button>
                    </Col>
                </Row>
            </Modal>

            {/*<ComponentModal*/}
            {/*    show={modalVisible}*/}
            {/*    toggle={() => {*/}
            {/*        setModalVisible(!modalVisible)*/}
            {/*    }}*/}
            {/*    list={component}*/}
            {/*    onSelect={e => {*/}
            {/*        // setSelectedComponentList([])*/}
            {/*        // selectedComponentList.push({key: e.label})*/}
            {/*        removeSelectItem(e.label)*/}
            {/*    }}*/}
            {/*    onChangeText={e => console.log(e.target.value)}*/}
            {/*    count={count}*/}
            {/*    setCount={setCount}*/}
            {/*    selectedComponentList={selectedComponentList}*/}
            {/*    setSelectedComponentList={setSelectedComponentList}*/}
            {/*    allowedComponents={data}*/}
            {/*/>*/}

            <Modal show={singleComEdit} toggle={async () => {
                setSingleComEdit(!singleComEdit)
                setSelectedComponentList([])
                setModifiedList([])
                await getStyleComponentById()
            }} headTitle="Edit Components">
                <Row className='gy-1 pt-3 justify-content-center'>
                    <div className="repeater-wrapper justify-content-center ">
                        <Col className='d-flex align-items-center  justify-content-center'>
                            <Row className="w-100 justify-content-center ">
                                <Col md={8} className=" ps-3">
                                    <h4>Component</h4>
                                </Col>
                                <Col md={4} className="ps-3">
                                    <h4>Ratio</h4>
                                </Col>
                            </Row>
                        </Col>
                    </div>

                    {inputFields.map((item, index) => (
                        item.label === selectedSingleCompo.label &&
                        <div key={index} className='repeater-wrapper mt-2  justify-content-center'>
                            <Col className='d-flex align-items-center  justify-content-center'>
                                <Row className="w-100 justify-content-center">
                                    <Col md={8}>
                                        <Input
                                            value={item.label}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3} className="d-flex align-items-center">
                                        <span className="me-1">1:</span>
                                        <Input
                                            placeholder='Ratio'
                                            name={item.label}
                                            onChange={(event) => handleFormChange(index, event)}
                                            value={item.ratio}
                                            autoComplete="off"
                                            maxLength="2"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </div>
                    ))}


                    <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                        <Button className='me-1' color='success' onClick={() => saveStyleComponent()}>
                            Edit
                        </Button>
                        <Button onClick={async () => {
                            setSingleComEdit(!singleComEdit)
                            setSelectedComponentList([])
                            setModifiedList([])
                            await getStyleComponentById()
                        }} outline>
                            Discard
                        </Button>
                    </Col>
                </Row>
            </Modal>

        </div>

    )
}

export default ComponentsTable
