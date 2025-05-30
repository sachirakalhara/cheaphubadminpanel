// ** React Imports
import {useContext, Fragment} from 'react'
import {Link, useHistory} from 'react-router-dom'

// ** Custom Hooks
import {useSkin} from '@hooks/useSkin'
// eslint-disable-next-line no-unused-vars
// import useJwt from '@src/auth/jwt/useJwt'

// ** Third Party Components
import {useDispatch} from 'react-redux'
import {useForm, Controller} from 'react-hook-form'
import {Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee} from 'react-feather'

// ** Actions
// eslint-disable-next-line no-unused-vars
import {handleLogin} from '@store/authentication'

// ** Context
import {AbilityContext} from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Utils
// eslint-disable-next-line no-unused-vars
import {getHomeRouteForLoggedInUser} from '@utils'

// ** Reactstrap Imports
import {Row, Col, Form, Input, Label, Alert, Button, CardText, CardTitle, UncontrolledTooltip} from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import * as UserAuthService from "../../../services/auth"
// eslint-disable-next-line no-unused-vars
import {customToastMsg} from "../../../utility/Utils"
import {PROJ_NAME, StorageStrings} from "../../../const/constant"

// eslint-disable-next-line no-unused-vars
import {toggleLoading} from '@store/loading'

const defaultValues = {
    password: '',
    loginEmail: ''
}

const Login = () => {
    // ** Hooks
    const {skin} = useSkin()
    // eslint-disable-next-line no-unused-vars
    const dispatch = useDispatch()
    // eslint-disable-next-line no-unused-vars
    const history = useHistory()
    // eslint-disable-next-line no-unused-vars
    const ability = useContext(AbilityContext)
    const {
        control,
        setError,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues})
    const illustration = skin === 'dark' ? 'login-v2.svg' : 'login-v2.svg',
        source = require(`@src/assets/images/pages/${illustration}`).default


    const onSubmit = async data => {
        if (Object.values(data).every(field => field.length > 0)) {

            const body = {
                email: data.loginEmail,
                password: data.password,
                userLevel:"super_admin"
            }
            // eslint-disable-next-line no-unused-vars
            let accessToken
            dispatch(toggleLoading())
            await UserAuthService.authUser(body)
                .then(async res => {
                    console.log(res);
                    if (!res.success) {
                        customToastMsg(res.message, 0)
                        dispatch(toggleLoading())
                    } else {

                        accessToken = res.data.accessToken
                        localStorage.setItem(StorageStrings.ACCESS_TOKEN, res.data.accessToken)

                        res.ability = [{action: "manage", subject: "all"}]
                        const data = {...res, accessToken, refreshToken: accessToken}
                        dispatch(handleLogin(data))
                        ability.update(res.ability)
                        history.push(getHomeRouteForLoggedInUser(res.login))
                        dispatch(toggleLoading())
                        customToastMsg(`Welcome,${PROJ_NAME}`, 1, `You have successfully logged in ${PROJ_NAME}. Now you can start to explore. Enjoy!`)
                    }
                })
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
        <div className='auth-wrapper auth-cover'>
            <Row className='auth-inner m-0'>
                <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
                    {/*<svg viewBox='0 0 139 95' version='1.1' height='28'>*/}
                    {/*    <defs>*/}
                    {/*        <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>*/}
                    {/*            <stop stopColor='#000000' offset='0%'></stop>*/}
                    {/*            <stop stopColor='#FFFFFF' offset='100%'></stop>*/}
                    {/*        </linearGradient>*/}
                    {/*        <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%'*/}
                    {/*                        id='linearGradient-2'>*/}
                    {/*            <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>*/}
                    {/*            <stop stopColor='#FFFFFF' offset='100%'></stop>*/}
                    {/*        </linearGradient>*/}
                    {/*    </defs>*/}
                    {/*    <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>*/}
                    {/*        <g id='Artboard' transform='translate(-400.000000, -178.000000)'>*/}
                    {/*            <g id='Group' transform='translate(400.000000, 178.000000)'>*/}
                    {/*                <path*/}
                    {/*                    d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'*/}
                    {/*                    id='Path'*/}
                    {/*                    className='text-primary'*/}
                    {/*                    style={{fill: 'currentColor'}}*/}
                    {/*                ></path>*/}
                    {/*                <path*/}
                    {/*                    d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'*/}
                    {/*                    id='Path'*/}
                    {/*                    fill='url(#linearGradient-1)'*/}
                    {/*                    opacity='0.2'*/}
                    {/*                ></path>*/}
                    {/*                <polygon*/}
                    {/*                    id='Path-2'*/}
                    {/*                    fill='#000000'*/}
                    {/*                    opacity='0.049999997'*/}
                    {/*                    points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'*/}
                    {/*                ></polygon>*/}
                    {/*                <polygon*/}
                    {/*                    id='Path-2'*/}
                    {/*                    fill='#000000'*/}
                    {/*                    opacity='0.099999994'*/}
                    {/*                    points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'*/}
                    {/*                ></polygon>*/}
                    {/*                <polygon*/}
                    {/*                    id='Path-3'*/}
                    {/*                    fill='url(#linearGradient-2)'*/}
                    {/*                    opacity='0.099999994'*/}
                    {/*                    points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'*/}
                    {/*                ></polygon>*/}
                    {/*            </g>*/}
                    {/*        </g>*/}
                    {/*    </g>*/}
                    {/*</svg>*/}
                    {/*<h2 className='brand-text text-primary ms-1'>{PROJ_NAME}</h2>*/}
                </Link>
                <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
                    <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
                        <img className='img-fluid' src={source} alt='Login Cover'/>
                    </div>
                </Col>
                <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
                    <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
                        <div className="justify-content-center d-flex mb-5">
                            <img src={require(`@src/assets/images/logo/new-logo.png`).default} alt="logo" width={139}
                                 height={131}/>
                        </div>
                        {/*<CardTitle tag='h2' className='fw-bold mb-1'>*/}
                        {/*    {`Welcome to ${PROJ_NAME}!`}*/}
                        {/*</CardTitle>*/}
                        {/*<CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>*/}
                        {/*<Alert color='primary'>*/}
                        {/*  <div className='alert-body font-small-2'>*/}
                        {/*    <p>*/}
                        {/*      <small className='me-50'>*/}
                        {/*        <span className='fw-bold'>Admin:</span> admin@demo.com | admin*/}
                        {/*      </small>*/}
                        {/*    </p>*/}
                        {/*    <p>*/}
                        {/*      <small className='me-50'>*/}
                        {/*        <span className='fw-bold'>Client:</span> client@demo.com | client*/}
                        {/*      </small>*/}
                        {/*    </p>*/}
                        {/*  </div>*/}
                        {/*  <HelpCircle*/}
                        {/*      id='login-tip'*/}
                        {/*      className='position-absolute'*/}
                        {/*      size={18}*/}
                        {/*      style={{ top: '10px', right: '10px' }}*/}
                        {/*  />*/}
                        {/*  <UncontrolledTooltip target='login-tip' placement='left'>*/}
                        {/*    This is just for ACL demo purpose.*/}
                        {/*  </UncontrolledTooltip>*/}
                        {/*</Alert>*/}
                        <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                            <div className='mb-1'>
                                <Label className='form-label' for='login-email'>
                                    User Name
                                </Label>
                                <Controller
                                    id='loginEmail'
                                    name='loginEmail'
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            autoFocus
                                            placeholder='User Name'
                                            invalid={errors.loginEmail && true}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            <div className='mb-1'>
                                <div className='d-flex justify-content-between'>
                                    <Label className='form-label' for='login-password'>
                                        Password
                                    </Label>
                                    {/*<Link to='/forgot-password'>*/}
                                    {/*    <small>Forgot Password?</small>*/}
                                    {/*</Link>*/}
                                </div>
                                <Controller
                                    id='password'
                                    name='password'
                                    control={control}
                                    render={({field}) => (
                                        <InputPasswordToggle className='input-group-merge'
                                                             invalid={errors.password && true} {...field} />
                                    )}
                                />
                            </div>
                            <div className='form-check mb-1'>
                                <Input type='checkbox' id='remember-me'/>
                                <Label className='form-check-label' for='remember-me'>
                                    Remember Me
                                </Label>
                            </div>
                            <Button type='submit' color='primary' block>
                                Sign in
                            </Button>
                        </Form>
                        {/*<p className='text-center mt-2'>*/}
                        {/*    <span className='me-25'>New on our platform?</span>*/}
                        {/*    <Link to='/register'>*/}
                        {/*        <span>Create an account</span>*/}
                        {/*    </Link>*/}
                        {/*</p>*/}
                        {/*<div className='divider my-2'>*/}
                        {/*  <div className='divider-text'>or</div>*/}
                        {/*</div>*/}
                        {/*<div className='auth-footer-btn d-flex justify-content-center'>*/}
                        {/*  <Button color='facebook'>*/}
                        {/*    <Facebook size={14} />*/}
                        {/*  </Button>*/}
                        {/*  <Button color='twitter'>*/}
                        {/*    <Twitter size={14} />*/}
                        {/*  </Button>*/}
                        {/*  <Button color='google'>*/}
                        {/*    <Mail size={14} />*/}
                        {/*  </Button>*/}
                        {/*  <Button className='me-0' color='github'>*/}
                        {/*    <GitHub size={14} />*/}
                        {/*  </Button>*/}
                        {/*</div>*/}
                    </Col>
                </Col>
            </Row>
        </div>
    )
}

export default Login
