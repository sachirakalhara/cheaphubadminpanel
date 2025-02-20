// ** Icons Import
import {Home, Circle, Layers, Umbrella, File, FileText, CloudRain, Printer} from 'react-feather'
import React from "react"
import img from '@src/assets/images/sideBar/orders.svg'
import img1 from '@src/assets/images/sideBar/customer.svg'
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
        children: [
            {
                id: 'bulk',
                title: 'Bulk Products',
                icon: <Circle size={12} />,
                navLink: '/products/bulk/list'
            },
            {
                id: 'subscription',
                title: 'Subscription Products',
                icon: <Circle size={12} />,
                navLink: '/products/subscription/list'
            }
        ]
    },
    {
        id: 'categories',
        title: 'Categories',
        icon: <img src={img5} alt="img" height={20} width={20} style={{marginRight:15}}/>,
        navLink: '/categories/list'
    },
    {
        id: 'tags',
        title: 'Tags',
        icon: <img src={img2} alt="img" height={20} width={20} style={{marginRight:15}}/>,
        navLink: '/tags/list'
    },
    {
        id: 'coupon',
        title: 'Coupon Management',
        icon: <img src={img3} alt="img" height={20} width={20} className="me-1" style={{marginRight:5}}/>,
        navLink: '/coupon/list'
    },
    {
        id: 'Customers',
        title: 'Customers Management',
        icon: <img src={img1} alt="img" height={20} width={20} className="me-1" style={{marginRight:5}}/>,
        navLink: '/customer/list'
    },
    // {
    //     id: 'colors',
    //     title: 'Colors',
    //     icon: <img src={img6} alt="img" height={20} width={20} style={{marginRight:15}}/>,
    //     navLink: '/colors/list'
    // }

]
