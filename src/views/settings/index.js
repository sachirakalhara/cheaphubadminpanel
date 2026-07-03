import React, {useState, useEffect, Fragment} from 'react'
import {Card, CardBody, Col, Row, Label, Input, Button, Spinner} from 'reactstrap'
import {useDispatch} from 'react-redux'
import {toggleLoading} from '@store/loading'
import {customToastMsg} from '../../utility/Utils'
import * as SettingsService from '../../services/settings'

const StoreSettings = () => {
    const dispatch = useDispatch()

    const [cashbackEnabled, setCashbackEnabled] = useState(false)
    const [cashbackPercent, setCashbackPercent] = useState('')
    const [saving, setSaving] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = () => {
        dispatch(toggleLoading())
        SettingsService.getSettings()
            .then(res => {
                dispatch(toggleLoading())
                if (res.success) {
                    const percent = Number(res.data?.settings?.cashback_percent ?? 0)
                    setCashbackEnabled(percent > 0)
                    setCashbackPercent(percent > 0 ? String(percent) : '')
                    setLoaded(true)
                } else {
                    customToastMsg(res.message, res.status)
                }
            })
    }

    const handleSave = async () => {
        const percent = cashbackEnabled ? Number(cashbackPercent) : 0

        if (cashbackEnabled && (!cashbackPercent || isNaN(percent) || percent <= 0 || percent > 100)) {
            customToastMsg('Please enter a cashback percentage between 0 and 100', 0)
            return
        }

        setSaving(true)
        dispatch(toggleLoading())
        await SettingsService.updateSettings({cashback_percent: percent})
            .then(res => {
                dispatch(toggleLoading())
                setSaving(false)
                if (res.success) {
                    customToastMsg('Settings updated successfully', 1)
                    loadSettings()
                } else {
                    customToastMsg(res.message, res.status)
                }
            })
    }

    return (
        <Fragment>
            <Card>
                <div className='w-100 py-2 px-1'>
                    <h3 className='text-primary invoice-logo'>Store Settings</h3>
                </div>
            </Card>

            <Card className='mt-2'>
                <CardBody>
                    <h5 className='fw-bold mb-2'>Wallet Cashback</h5>
                    <Row>
                        <Col md='6' className='mb-2'>
                            <div className='form-check form-switch'>
                                <Input
                                    type='switch'
                                    id='cashback-enabled'
                                    checked={cashbackEnabled}
                                    disabled={!loaded}
                                    onChange={e => setCashbackEnabled(e.target.checked)}
                                />
                                <Label for='cashback-enabled' className='form-check-label fw-bold'>
                                    Enable cashback on purchases
                                </Label>
                            </div>
                            <small className='text-muted'>
                                Customers earn a percentage of every paid order back as wallet credit.
                                Wallet top-ups never earn cashback.
                            </small>
                        </Col>

                        {cashbackEnabled && (
                            <Col md='6' className='mb-2'>
                                <Label className='form-label' for='cashback-percent'>
                                    Cashback Percentage <span className='text-danger'>*</span>
                                </Label>
                                <Input
                                    id='cashback-percent'
                                    type='number'
                                    min='0'
                                    max='100'
                                    step='0.1'
                                    placeholder='e.g. 5'
                                    value={cashbackPercent}
                                    onChange={e => setCashbackPercent(e.target.value)}
                                />
                                <small className='text-muted'>Percent of the paid amount credited to the customer's wallet (0–100).</small>
                            </Col>
                        )}

                        <Col xs='12' className='mt-1'>
                            <Button color='primary' disabled={!loaded || saving} onClick={handleSave}>
                                {saving ? (<Fragment><Spinner size='sm' className='me-50'/> Saving...</Fragment>) : 'Save Settings'}
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default StoreSettings
