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
    ArrowDownCircle, ShoppingCart, Edit3
} from 'react-feather'
import {roundNumber} from "../../utility/Utils"

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
        name: 'Style Number',
        sortable: false,
        width: '30%',
        center: true,
        // selector: row => row.id,
        cell: row => (
            <div className='d-flex align-items-center w-100 justify-content-around'>
                <span style={{maxWidth:90}}>{row.styleNumber}</span>
                <Button
                    color='success' outline
                    tag={Link} to={`/styles/styles-details/${row.styleId}/components`}
                    style={{height: 35, paddingTop: 9, paddingBottom: 0}}
                >
                    <Eye size={15} style={{marginRight: 5}}/>
                    View
                </Button>
            </div>
        )
    },
    {
        sortable: false,
        width: '25%',
        name: 'Style Description',
        center: true,
        cell: row => row.description
    },
    {
        sortable: false,
        width: '25%',
        name: <span className="text-center">Fallout Percentage (%)</span>,
        center: true,
        cell: row => roundNumber(row.falloutPercentage)
    },
    {
        sortable: false,
        width: '20%',
        name: <span className="text-center">Base Size</span>,
        center: true,
        cell: row => row.baseSize
    }
    // {
    //     sortable: false,
    //     minWidth: '550px',
    //     name: 'Types Of Components',
    //     center: true,
    //     cell: row => (
    //         <span className="text-center">{row.components?.replace(/,/g, '\xa0\xa0\xa0\xa0\xa0\xa0\xa0')}</span>
    //     )
    // }
]
