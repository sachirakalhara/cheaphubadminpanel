import React, {useState, useEffect, Fragment} from 'react'
import {Card, CardBody, CardHeader, Col, Row, Label, Input, Button, Spinner, Badge} from 'reactstrap'
import Select from 'react-select'
import {useDispatch} from 'react-redux'
import {toggleLoading} from '@store/loading'
import {customSweetAlert, customToastMsg, selectThemeColors} from '../../utility/Utils'
import * as AnnouncementService from '../../services/announcements'
import {getAllBulkProducts} from '../../services/bulk-products'
import {getAllContributionProduct} from '../../services/contribution-products'

const announcementTypeOptions = [
    {value: '', label: 'Select type...'},
    {value: 'new_product', label: 'New Product'},
    {value: 'restock', label: 'Restock'}
]

const audienceOptions = [
    {value: '', label: 'Select audience...'},
    {value: 'all_customers', label: 'All Customers'},
    {value: 'purchased_customers', label: 'Customers Who Purchased'}
]

const Announcements = () => {
    const dispatch = useDispatch()

    const [announcementType, setAnnouncementType] = useState('')
    const [selectedProducts, setSelectedProducts] = useState([])
    const [audience, setAudience] = useState('')
    const [subject, setSubject] = useState('')
    const [productOptions, setProductOptions] = useState([])
    const [recipientCount, setRecipientCount] = useState(null)
    const [loadingCount, setLoadingCount] = useState(false)
    const [sending, setSending] = useState(false)
    const [loadingProducts, setLoadingProducts] = useState(true)

    // Load products on mount
    useEffect(() => {
        loadProducts()
    }, [])

    // Auto-fill subject when type or products change
    useEffect(() => {
        if (announcementType && selectedProducts.length > 0) {
            autoFillSubject()
        }
    }, [announcementType, selectedProducts])

    // Fetch recipient count when audience changes
    useEffect(() => {
        if (audience) {
            setLoadingCount(true)
            AnnouncementService.getRecipientCount(audience).then(res => {
                if (res.success) {
                    setRecipientCount(res.data?.count || 0)
                } else {
                    setRecipientCount(null)
                }
                setLoadingCount(false)
            }).catch(() => {
                setRecipientCount(null)
                setLoadingCount(false)
            })
        } else {
            setRecipientCount(null)
        }
    }, [audience])

    const loadProducts = async () => {
        setLoadingProducts(true)
        const options = []

        // Load bulk products
        try {
            const bulkRes = await getAllBulkProducts()
            if (bulkRes.success && bulkRes.data?.bulk_product_list) {
                bulkRes.data.bulk_product_list.forEach(p => {
                    options.push({
                        value: {id: p.id, type: 'bulk'},
                        label: `${p.name} ($${parseFloat(p.price).toFixed(2)})`
                    })
                })
            }
        } catch (e) {
            console.error('Failed to load bulk products', e)
        }

        // Load contribution products
        try {
            const contribRes = await getAllContributionProduct()
            if (contribRes.success && contribRes.data?.contribution_product_list) {
                contribRes.data.contribution_product_list.forEach(p => {
                    options.push({
                        value: {id: p.id, type: 'contribution'},
                        label: p.name
                    })
                })
            }
        } catch (e) {
            console.error('Failed to load contribution products', e)
        }

        setProductOptions(options)
        setLoadingProducts(false)
    }

    const autoFillSubject = () => {
        const isMultiple = selectedProducts.length > 1
        const productName = selectedProducts[0]?.label?.replace(/\s*\(\$[\d.]+\)$/, '') || ''

        if (announcementType === 'new_product') {
            setSubject(isMultiple
                ? '🆕 New Products Just Added!'
                : `🆕 New Product Alert — ${productName}`
            )
        } else if (announcementType === 'restock') {
            setSubject(isMultiple
                ? '🔄 Products Back in Stock!'
                : `🔄 Back in Stock — ${productName}`
            )
        }
    }

    const handleSubjectChange = (e) => {
        const val = e.target.value
        if (val.length <= 150) {
            setSubject(val)
        }
    }

    const isFormValid = announcementType && selectedProducts.length > 0 && audience && subject.trim()

    const resetForm = () => {
        setAnnouncementType('')
        setSelectedProducts([])
        setAudience('')
        setSubject('')
        setRecipientCount(null)
    }

    const handleSend = () => {
        const recipientText = recipientCount !== null ? recipientCount : '...'

        customSweetAlert(
            `You are about to send this email to ${recipientText} customers. This cannot be undone. Continue?`,
            0,
            async () => {
                setSending(true)
                dispatch(toggleLoading())

                const body = {
                    announcement_type: announcementType,
                    product_ids: selectedProducts.map(p => p.value),
                    audience,
                    subject
                }

                try {
                    const res = await AnnouncementService.sendAnnouncement(body)
                    if (res.success) {
                        customToastMsg(
                            `Announcement sent successfully to ${res.data?.total_sent || 0} customers!`,
                            1
                        )
                        resetForm()
                    } else {
                        customToastMsg(res.message || 'Failed to send announcement', 0)
                    }
                } catch (e) {
                    customToastMsg('Failed to send announcement. Please try again.', 0)
                }

                setSending(false)
                dispatch(toggleLoading())
            },
            'Confirm Send'
        )
    }

    return (
        <Fragment>
            <Card>
                <div className='w-100 py-2 px-1'>
                    <h3 className='text-primary invoice-logo'>Send Announcement</h3>
                </div>
            </Card>

            <Card className='mt-2'>
                <CardBody>
                    <Row>
                        {/* Announcement Type */}
                        <Col md='6' className='mb-2'>
                            <Label className='form-label' for='announcement-type'>
                                Announcement Type <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id='announcement-type'
                                type='select'
                                value={announcementType}
                                onChange={e => setAnnouncementType(e.target.value)}
                            >
                                <option value=''>Select type...</option>
                                <option value='new_product'>New Product</option>
                                <option value='restock'>Restock</option>
                            </Input>
                        </Col>

                        {/* Audience */}
                        <Col md='6' className='mb-2'>
                            <Label className='form-label' for='audience'>
                                Audience <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id='audience'
                                type='select'
                                value={audience}
                                onChange={e => setAudience(e.target.value)}
                            >
                                <option value=''>Select audience...</option>
                                <option value='all_customers'>All Customers</option>
                                <option value='purchased_customers'>Customers Who Purchased</option>
                            </Input>
                            {loadingCount && (
                                <small className='text-muted mt-25 d-block'>
                                    <Spinner size='sm' className='me-50'/> Loading recipient count...
                                </small>
                            )}
                            {!loadingCount && recipientCount !== null && (
                                <small className='text-muted mt-25 d-block'>
                                    <Badge color='light-primary' pill>~{recipientCount} recipients</Badge>
                                </small>
                            )}
                        </Col>

                        {/* Select Products */}
                        <Col xs='12' className='mb-2'>
                            <Label className='form-label' for='products'>
                                Select Products <span className='text-danger'>*</span>
                            </Label>
                            <Select
                                id='products'
                                isMulti
                                isSearchable
                                isLoading={loadingProducts}
                                options={productOptions}
                                value={selectedProducts}
                                onChange={val => setSelectedProducts(val || [])}
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                placeholder='Search and select products...'
                                noOptionsMessage={() => 'No products found'}
                                getOptionValue={option => `${option.value.type}-${option.value.id}`}
                            />
                            {selectedProducts.length > 0 && (
                                <small className='text-muted mt-25 d-block'>
                                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                                </small>
                            )}
                        </Col>

                        {/* Subject */}
                        <Col xs='12' className='mb-2'>
                            <Label className='form-label' for='subject'>
                                Email Subject <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id='subject'
                                type='text'
                                value={subject}
                                onChange={handleSubjectChange}
                                placeholder='Enter email subject line'
                                maxLength={150}
                            />
                            <div className='d-flex justify-content-end mt-25'>
                                <small className={subject.length > 140 ? 'text-danger fw-bold' : 'text-muted'}>
                                    {subject.length}/150
                                </small>
                            </div>
                        </Col>

                        {/* Send Button */}
                        <Col xs='12' className='mt-1'>
                            <Button
                                color='primary'
                                disabled={!isFormValid || sending}
                                onClick={handleSend}
                            >
                                {sending ? (
                                    <Fragment>
                                        <Spinner size='sm' className='me-50'/>
                                        Sending...
                                    </Fragment>
                                ) : (
                                    'Send Announcement'
                                )}
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default Announcements
