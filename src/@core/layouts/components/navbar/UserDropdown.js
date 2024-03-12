// ** React Imports
import {Link, useHistory} from 'react-router-dom'
import React, {useEffect, useState} from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import {isUserLoggedIn} from '@utils'

// ** Store & Actions
import {useDispatch} from 'react-redux'
import {handleLogout} from '@store/authentication'

// ** Third Party Components
import {User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power} from 'react-feather'

// ** Reactstrap Imports
import {UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem} from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/adminIcon.svg'
import {customSweetAlert} from "../../../../utility/Utils"

const UserDropdown = () => {
    // ** Store Vars
    const dispatch = useDispatch()
    const history = useHistory()

    // ** State
    const [userData, setUserData] = useState(null)

    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            setUserData(JSON.parse(localStorage.getItem('userData')))
        }
    }, [])

    //** Vars
    const userAvatar = (userData && userData.avatar) || defaultAvatar

    const handledUserLogout = async () => {
        await customSweetAlert(
            'Are you sure you want to logout?',
            2,
            () => {
                dispatch(handleLogout())
                history.push('/login')
            }
        )
    }

    return (
        <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
            <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
                <div className='user-nav d-sm-flex d-none'>
                    <span className='user-name fw-bold'>Admin</span>
                    {/*<span className='user-status'>{(userData && userData.role) || 'Admin'}</span>*/}
                </div>
                <Avatar img={userAvatar} className="bg-white" imgHeight='40' imgWidth='40' status='online'/>
            </DropdownToggle>
            <DropdownMenu end>
                {/*<DropdownItem tag={Link} to='/pages/profile'>*/}
                {/*  <User size={14} className='me-75' />*/}
                {/*  <span className='align-middle'>Profile</span>*/}
                {/*</DropdownItem>*/}
                {/*<DropdownItem tag={Link} to='/apps/email'>*/}
                {/*  <Mail size={14} className='me-75' />*/}
                {/*  <span className='align-middle'>Inbox</span>*/}
                {/*</DropdownItem>*/}
                {/*<DropdownItem tag={Link} to='/apps/todo'>*/}
                {/*  <CheckSquare size={14} className='me-75' />*/}
                {/*  <span className='align-middle'>Tasks</span>*/}
                {/*</DropdownItem>*/}
                {/*<DropdownItem tag={Link} to='/apps/chat'>*/}
                {/*  <MessageSquare size={14} className='me-75' />*/}
                {/*  <span className='align-middle'>Chats</span>*/}
                {/*</DropdownItem>*/}
                {/*<DropdownItem divider />*/}
                <DropdownItem tag={Link} to='/pages/account-settings'>
                    <Settings size={14} className='me-75'/>
                    <span className='align-middle'>Settings</span>
                </DropdownItem>
                {/*<DropdownItem tag={Link} to='/pages/pricing'>*/}
                {/*  <CreditCard size={14} className='me-75' />*/}
                {/*  <span className='align-middle'>Pricing</span>*/}
                {/*</DropdownItem>*/}
                {/*<DropdownItem tag={Link} to='/pages/faq'>*/}
                {/*  <HelpCircle size={14} className='me-75' />*/}
                {/*  <span className='align-middle'>FAQ</span>*/}
                {/*</DropdownItem>*/}
                <DropdownItem className="w-100" onClick={() => handledUserLogout()}>
                    <Power size={14} className='me-75'/>
                    <span className='align-middle'>Logout</span>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default UserDropdown
