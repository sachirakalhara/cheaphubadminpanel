// ** React Imports
import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
// import { store } from '@store/store'
// import { deleteInvoice } from '../apps/invoice/store'

// ** Reactstrap Imports
import {Button} from 'reactstrap'

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

// ** Vars
// const invoiceStatusObj = {
//   Sent: { color: 'light-secondary', icon: Send },
//   Paid: { color: 'light-success', icon: CheckCircle },
//   Draft: { color: 'light-primary', icon: Save },
//   Downloaded: { color: 'light-info', icon: ArrowDownCircle },
//   'Past Due': { color: 'light-danger', icon: Info },
//   'Partial Payment': { color: 'light-warning', icon: PieChart }
// }

// ** renders client column
// const renderClient = row => {
//   const stateNum = Math.floor(Math.random() * 6),
//     states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
//     color = states[stateNum]
//
//   if (row.avatar.length) {
//     return <Avatar className='me-50' img={row.avatar} width='32' height='32' />
//   } else {
//     return <Avatar color={color} className='me-50' content={row.client ? row.client.name : 'John Doe'} initials />
//   }
// }

// ** Table columns
export const columns = [
    {
        name: 'PO Number',
        width: '250px',
        center: true,
        cell: row => (
            <div className='d-flex align-items-center w-100 justify-content-between'>
                <span style={{maxWidth:102}}>{row.poNumber}</span>
                <Button
                    color='success' outline
                    tag={Link} to={`/order/order-details/${row.id}/order-details`}
                    style={{height: 35, paddingTop: 9, paddingBottom: 0}}
                >
                    <Eye size={15} style={{marginRight: 5}}/>
                    View
                </Button>
            </div>
        )
    },
    {
        name: 'Customer',
        center: true,
        minWidth: '220px',
        cell: row => {
            const name = row.customer.name
            return (
                <div className='d-flex justify-content-left align-items-center'>
                    <div className='d-flex flex-column'>
                        <h6 className='user-name text-truncate mb-0'>{name}</h6>
                    </div>
                </div>
            )
        }
    },
    {
        center: true,
        minWidth: '120px',
        name: 'PO Date',
        cell: row => moment(row.poDate).format('YYYY-MM-DD')
    },
    {
        center: true,
        minWidth: '160px',
        name: <span className="text-center">Total Quantity</span>,
        cell: row => row.quantity
    },
    {
        center: true,
        minWidth: '120px',
        name: <span className="text-center">Delivery Date</span>,
        cell: row => moment(row.deliveryDate).format('YYYY-MM-DD')
    },
    {
        center: true,
        minWidth: '180px',
        name: 'Destination',
        cell: row => (row.destination ? row.destination.name : null)
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
        name: <span className="text-center">Articlewise Yarn Consumption <span className="text-lowercase">(kg)</span></span>,
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
