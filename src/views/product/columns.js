// ** React Imports
import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
// import { store } from '@store/store'
// import { deleteInvoice } from '../apps/invoice/store'

// ** Reactstrap Imports
import {Badge, Button} from 'reactstrap'

// ** Third Party Components
import {
    Eye,
    Send,
    Edit,
    Copy,
    Save,
    Info,
    Trash,
    PieChart,
    Download,
    TrendingUp,
    CheckCircle,
    MoreVertical,
    ArrowDownCircle, ShoppingCart
} from 'react-feather'
import {roundNumber} from "../../utility/Utils"

const moment = require('moment')


export const columns = [
    {
        name: 'name',
        width: '240px',
        center: true,
        cell: row => (
            <div className='align-items-center d-flex w-100'>
                <img
                    src={"https://st.depositphotos.com/2274151/3518/i/450/depositphotos_35186549-stock-photo-sample-grunge-red-round-stamp.jpg"}
                    style={{width: 35, height: 35}}
                    alt='swiper 1'
                    className='me-1'
                />
                <h6 className='user-name text-truncate' style={{marginTop: 8}}>{row.name}</h6>
            </div>
        )
    },
    {
        name: 'Stock',
        center: true,
        // minWidth: '220px',
        cell: row => {
            return (
                <div className='d-flex justify-content-left align-items-center'>
                    <div className='d-flex flex-column'>
                        <Badge color='light-success'>{row.stock}</Badge>
                        {/*<h6 className='user-name text-truncate mb-0'>{row.stock}</h6>*/}
                    </div>
                </div>
            )
        }
    },
    {
        center: true,
        maxWidth: '80px',
        name: 'Price $',
        cell: row => row.price
    },
    {
        center: true,
        // minWidth: '160px',
        name: <span className="text-center">Category</span>,
        cell: row => row.category
    },
    {
        center: true,
        // minWidth: '180px',
        name: 'Tags',
        cell: row => row.tags
    },
    {
        center: true,
        // minWidth: '120px',
        name: <span className="text-center">Date</span>,
        cell: row => moment(row.date).format('YYYY-MM-DD')
    }
]

export const consumption = [
    {
        sortable: false,
        minWidth: '170px',
        name: 'Style Number',
        sortField: 'styleNumber',
        center: true,
        cell: row => row.styleNumber //change to be response entity
    },
    {
        sortable: false,
        minWidth: '90px',
        name: 'Size',
        sortField: 'size',
        center: true,
        cell: row => row.garmentSize //change to be response entity
    },
    {
        sortable: false,
        minWidth: '90px',
        name: 'Color',
        sortField: 'colorName',
        center: true,
        cell: row => row.colorName //change to be response entity
    },
    {
        sortable: false,
        minWidth: '130px',
        name: 'Order Qty',
        sortField: 'orderQty',
        center: true,
        cell: row => row.quantity //change to be response entity
    },
    {
        sortable: false,
        minWidth: '150px',
        name: <span className="text-center">Total Style Weight<span className="text-lowercase">(g)</span></span>,
        sortField: 'sizeWise',
        center: true,
        cell: row => roundNumber(row.totalWeight) //change to be response entity
    },
    {
        sortable: false,
        minWidth: '250px',
        name: 'Article Description',
        sortField: 'articleDes',
        center: true,
        cell: row => row.articleName //change to be response entity
    },
    {
        sortable: false,
        minWidth: '170px',
        name: 'Yarn Supplier',
        sortField: 'yarnSupplier',
        center: true,
        cell: row => row.supplierName //change to be response entity
    },
    {
        sortable: false,
        minWidth: '150px',
        name: <span className="text-center">Consumption Ratio</span>,
        sortField: 'consumption Ratio',
        center: true,
        cell: row => roundNumber(row.ratio) //change to be response entity
    },
    {
        sortable: false,
        minWidth: '200px',
        name: <span className="text-center">Articlewise Yarn Consumption <span
            className="text-lowercase">(kg)</span></span>,
        sortField: 'articleWise',
        center: true,
        cell: row => roundNumber(Number(row.articleWeightWithFallout) / 1000) //change to be response entity
    }
]

export const yarnRequirement = [
    {
        sortable: false,
        width: '180px',
        name: 'Supplier',
        sortField: 'supplierName',
        center: true,
        cell: row => row.supplierName //change to be response entity
    },
    {
        sortable: false,
        minWidth: '100px',
        name: 'Yarn Article',
        sortField: 'articleName',
        center: true,
        cell: row => row.articleName //change to be response entity
    },
    {
        sortable: false,
        width: '150px',
        name: 'Yarn Twist',
        sortField: 'twist',
        center: true,
        cell: row => row.twist //change to be response entity
    },
    {
        sortable: false,
        minWidth: '100px',
        name: <span>Weight With Fallout <span className="text-lowercase">(kg)</span></span>,
        sortField: 'articleWeightWithFallout',
        center: true,
        cell: row => roundNumber(Number(row.articleWeightWithFallout) / 1000) //change to be response entity
    }
]
