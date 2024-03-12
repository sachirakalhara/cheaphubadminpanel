// ** React Imports
import React, {Fragment, useState, useRef} from 'react'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Vertical Menu Components
import VerticalMenuHeader from './VerticalMenuHeader'
import VerticalNavMenuItems from './VerticalNavMenuItems'
import {Power} from "react-feather"
import {Link, useHistory} from "react-router-dom"
import {handleLogout} from '@store/authentication'
import {useDispatch} from "react-redux"
import {customSweetAlert} from "../../../../../utility/Utils"

const Sidebar = props => {
    // ** Props
    const {menuCollapsed, routerProps, menu, currentActiveItem, skin, menuData} = props

    // ** States
    const [groupOpen, setGroupOpen] = useState([])
    const [groupActive, setGroupActive] = useState([])
    const [currentActiveGroup, setCurrentActiveGroup] = useState([])
    const [activeItem, setActiveItem] = useState(null)
    const dispatch = useDispatch()

    // ** Menu Hover State
    const [menuHover, setMenuHover] = useState(false)
    const [bottomItemHover, setBottomItemHover] = useState(false)

    // ** Ref
    const shadowRef = useRef(null)
    const history = useHistory()

    // ** Function to handle Mouse Enter
    const onMouseEnter = () => {
        setMenuHover(true)
    }

    // ** Scroll Menu
    const scrollMenu = container => {
        if (shadowRef && container.scrollTop > 0) {
            if (!shadowRef.current.classList.contains('d-block')) {
                shadowRef.current.classList.add('d-block')
            }
        } else {
            if (shadowRef.current.classList.contains('d-block')) {
                shadowRef.current.classList.remove('d-block')
            }
        }
    }

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
        <Fragment>
            <div
                className={classnames('main-menu menu-fixed menu-accordion menu-shadow bg-dark', {
                    expanded: menuHover || menuCollapsed === false,
                    'menu-light': skin !== 'semi-dark' && skin !== 'dark',
                    'menu-dark': skin === 'semi-dark' || skin === 'dark'
                })}
                onMouseEnter={onMouseEnter}
                onMouseLeave={() => setMenuHover(false)}
            >
                {menu ? (
                    menu({...props})
                ) : (
                    <Fragment>
                        {/* Vertical Menu Header */}
                        <VerticalMenuHeader setGroupOpen={setGroupOpen} menuHover={menuHover} {...props} />
                        {/* Vertical Menu Header Shadow */}
                        <div className='shadow-bottom' ref={shadowRef}></div>
                        {/* Perfect Scrollbar */}
                        <PerfectScrollbar
                            className='main-menu-content'
                            options={{wheelPropagation: false}}
                            onScrollY={container => scrollMenu(container)}
                        >
                            <ul className='navigation navigation-main bg-dark'>
                                <VerticalNavMenuItems
                                    items={menuData}
                                    menuData={menuData}
                                    menuHover={menuHover}
                                    groupOpen={groupOpen}
                                    activeItem={activeItem}
                                    groupActive={groupActive}
                                    currentActiveGroup={currentActiveGroup}
                                    routerProps={routerProps}
                                    setGroupOpen={setGroupOpen}
                                    menuCollapsed={menuCollapsed}
                                    setActiveItem={setActiveItem}
                                    setGroupActive={setGroupActive}
                                    setCurrentActiveGroup={setCurrentActiveGroup}
                                    currentActiveItem={currentActiveItem}
                                />
                            </ul>
                            <ul
                                style={{bottom: 0, position: 'absolute', height: 100}}
                                className='navigation navigation-main bg-dark w-100'
                            >
                                <li className={bottomItemHover ? "nav-item active" : "nav-item"}
                                    onMouseEnter={() => setBottomItemHover(true)}
                                    onMouseLeave={() => setBottomItemHover(false)}
                                >
                                    <Link className="d-flex align-items-center text-white mini-tile" tag={Link}
                                          to='#' onClick={() => handledUserLogout()}>
                                        <Power size={20} style={{marginRight: 15}}/>
                                        <span className="menu-item custom-nav-txt">Logout</span>
                                    </Link>
                                </li>
                            </ul>
                        </PerfectScrollbar>
                    </Fragment>
                )}
            </div>
        </Fragment>
    )
}

export default Sidebar
