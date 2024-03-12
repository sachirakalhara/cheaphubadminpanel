// ** Icons Import
import {Home, Circle} from 'react-feather'
import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
// eslint-disable-next-line no-unused-vars
import {faLineChart} from "@fortawesome/free-solid-svg-icons"

import img from '@src/assets/images/sideBar/analytics.svg'

export default [
    {
        id: 'dashboards',
        title: 'Analytics',
        icon: <img src={img} alt="img" height={20} width={20} className="me-1"/>,
        navLink: '/dashboard'
    }
]
