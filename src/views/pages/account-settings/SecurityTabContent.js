// ** React Imports
import React, {Fragment} from 'react'

// ** Reactstrap Imports
import {Row, Col, Card, Form, Button, CardBody, CardTitle, CardHeader, FormFeedback} from 'reactstrap'

// ** Third Party Components
import * as yup from 'yup'
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

import * as AuthServices from '../../../services/auth'

// ** Demo Components
import ApiKeysList from './ApiKeysList'
import CreateApiKey from './CreateApikey'
import TwoFactorAuth from './TwoFactorAuth'
import RecentDevices from './RecentDevices'
import {customSweetAlert, customToastMsg} from "../../../utility/Utils"
import {Link} from "react-router-dom"


const showErrors = (field, valueLen, min) => {
    if (valueLen === 0) {
        return `${field} field is required`
    } else if (valueLen > 0 && valueLen < min) {
        return `${field} must be at least ${min} characters`
    } else {
        return ''
    }
}

const defaultValues = {
    newPassword: '',
    currentPassword: '',
    retypeNewPassword: ''
}

const SecurityTabContent = () => {
    const SignupSchema = yup.object().shape({
        currentPassword: yup
            .string()
            .min(1, obj => showErrors('Current Password', obj.value.length, obj.min))
            .required(),
        newPassword: yup
            .string()
            .min(8, obj => showErrors('New Password', obj.value.length, obj.min))
            .required(),
        retypeNewPassword: yup
            .string()
            .min(8, obj => showErrors('Retype New Password', obj.value.length, obj.min))
            .required()
            .oneOf([yup.ref(`newPassword`), null], 'Passwords must match')
    })
    // ** Hooks
    const {
        control,
        handleSubmit,
        setError,
        formState: {errors}
    } = useForm({
        defaultValues,
        resolver: yupResolver(SignupSchema)
    })

    const changePasswordHandler = async (data) => {
        const body = {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        }
        await AuthServices.changeUserPassword(body)
            .then(res => {
                console.log(res)
                if (res.success) {
                    customToastMsg("Password Changed!", 1, "Your password has been changed successfully.Use your new password to login.")
                } else {
                    customToastMsg(res.message, res.status, "Please enter valid current password")
                }
            })
    }

    const handleConfirmCancel = async (data) => {
        await customSweetAlert(
            'Are you sure you want to change password?',
            2,
            () => {
                changePasswordHandler(data)
            }
        )
    }

    const onSubmit = async data => {
        if (Object.values(data).every(field => field.length > 0)) {
            await handleConfirmCancel(data)
        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: 'manual'
                    })
                }
            }
        }
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Change Password</CardTitle>
                </CardHeader>
                <CardBody className='pt-1'>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Controller
                                    control={control}
                                    id='currentPassword'
                                    name='currentPassword'
                                    render={({field}) => (
                                        <InputPasswordToggle
                                            label='Current Password'
                                            htmlFor='currentPassword'
                                            className='input-group-merge'
                                            invalid={errors.currentPassword && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.currentPassword && (
                                    <FormFeedback className='d-block'>{errors.currentPassword.message}</FormFeedback>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Controller
                                    control={control}
                                    id='newPassword'
                                    name='newPassword'
                                    render={({field}) => (
                                        <InputPasswordToggle
                                            label='New Password'
                                            htmlFor='newPassword'
                                            className='input-group-merge'
                                            invalid={errors.newPassword && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.newPassword &&
                                <FormFeedback className='d-block'>{errors.newPassword.message}</FormFeedback>}
                            </Col>
                            <Col sm='6' className='mb-1'>
                                <Controller
                                    control={control}
                                    id='retypeNewPassword'
                                    name='retypeNewPassword'
                                    render={({field}) => (
                                        <InputPasswordToggle
                                            label='Retype New Password'
                                            htmlFor='retypeNewPassword'
                                            className='input-group-merge'
                                            invalid={errors.newPassword && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.retypeNewPassword && (
                                    <FormFeedback className='d-block'>{errors.retypeNewPassword.message}</FormFeedback>
                                )}
                            </Col>
                            <Col xs={12}>
                                <p className='fw-bolder'>Password requirements:</p>
                                <ul className='ps-1 ms-25'>
                                    <li className='mb-50'>Minimum 8 characters long - the more, the better</li>
                                    {/*<li className='mb-50'>At least one lowercase character</li>*/}
                                    {/*<li>At least one number, symbol, or whitespace character</li>*/}
                                </ul>
                            </Col>
                            <Col className='mt-1 d-flex' sm='12'>
                                <Button type='submit' className='me-1' color='primary'>
                                    Save changes
                                </Button>
                                <Button  tag={Link} to={`/`} className='me-1'>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            {/*<TwoFactorAuth />*/}
            {/*<CreateApiKey />*/}
            {/*<ApiKeysList />*/}
            {/*<RecentDevices />*/}
        </Fragment>
    )
}

export default SecurityTabContent
