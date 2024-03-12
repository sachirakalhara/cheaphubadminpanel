// ** React Imports
import React, {Fragment, useState} from 'react'

// ** Reactstrap Imports
import {Label} from 'reactstrap'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import {getData} from "../../../apps/invoice/store"
import {useDispatch} from "react-redux"

const PickerDefault = () => {

    const dispatch = useDispatch()

    // ** State
    const [picker, setPicker] = useState(new Date())
    const [sort] = useState('desc')
    const [sortColumn] = useState('id')
    const [currentPage] = useState(1)
    const [statusValue] = useState('')
    const [rowsPerPage] = useState(10)

    const handleFilter = val => {
        setPicker(val)

        dispatch(
            getData({
                sort,
                q: new Date(val).toDateString(),
                sortColumn,
                page: currentPage,
                perPage: rowsPerPage,
                status: statusValue
            })
        )
    }

    return (
        <Fragment>
            <Label className='form-label' for='default-picker'>
                Delivery Date
            </Label>
            {/*<label htmlFor='search-invoice'>Delivery Date</label>*/}

            <Flatpickr className='form-control ms-50 me-2 w-100' value={picker} onChange={date => handleFilter(date)} id='default-picker'/>
        </Fragment>
    )
}

export default PickerDefault
