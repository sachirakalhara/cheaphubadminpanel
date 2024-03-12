// ** Icons Import
import {Home, Circle, Layers, Umbrella, File, FileText, CloudRain, Printer} from 'react-feather'
import React from "react"
import img from '@src/assets/images/sideBar/orders.svg'
import img1 from '@src/assets/images/sideBar/styles.svg'
import img2 from '@src/assets/images/sideBar/machinery.svg'
import img3 from '@src/assets/images/sideBar/production-rejections.svg'
import img4 from '@src/assets/images/sideBar/analytics.svg'
import img5 from '@src/assets/images/sideBar/material.svg'
import img6 from '@src/assets/images/sideBar/colors.svg'

export default [
    // {
    //     id: 'analytics',
    //     title: 'Analytics',
    //     icon: <img src={img4} alt="img" height={20} width={20} style={{marginRight:15}}/>,
    //     navLink: '/analytics/production-analysis'
    // },
    {
        id: 'products',
        title: 'Products',
        icon: <img src={img} alt="img" height={20} width={20} style={{marginRight:15}}/>,
        navLink: '/products/list'
    },
    {
        id: 'styles',
        title: 'Styles',
        icon: <img src={img1} alt="img" height={20} width={20} style={{marginRight:15}}/>,
        navLink: '/styles/list'
    },
    {
        id: 'machinery',
        title: 'Machinery',
        icon: <img src={img2} alt="img" height={20} width={20} style={{marginRight:15}}/>,
        navLink: '/machinery/list'
    },
    {
        id: 'production',
        title: 'Production & Rejections',
        icon: <img src={img3} alt="img" height={20} width={20} className="me-1" style={{marginRight:5}}/>,
        navLink: '/production&Rejections/list'
    },
    {
        id: 'materials',
        title: 'Materials Requirements',
        icon: <img src={img5} alt="img" height={20} width={20} className="me-1" style={{marginRight:5}}/>,
        navLink: '/materials_requirements/list'
    },
    {
        id: 'colors',
        title: 'Colors',
        icon: <img src={img6} alt="img" height={20} width={20} style={{marginRight:15}}/>,
        navLink: '/colors/list'
    }

]
