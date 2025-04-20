import React, {useEffect, useState} from "react";
import {Badge, Button, Card, Col, Input, Label, Row} from "reactstrap";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {ArrowRight, ChevronDown, Plus, X} from "react-feather";
import {customStyles, customToastMsg, emptyUI, getCustomDateTimeStamp} from "../../utility/Utils";
import {Link} from "react-router-dom";
import * as TicketServices from "../../services/tickets";
import {toggleLoading} from "../../redux/loading";
import {useDispatch} from "react-redux";
import {tableDataDateTimeConverter} from "../../utility/commonFun";

const CustomHeader = ({
                          onOrderTextChange,
                          searchKey,
                          OnClearOrderText
                      }) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo mb-2'>Tickets</h3>
                <Row>
                    <Col lg='3' className='d-flex align-items-center'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label' for='default-picker'>
                                Name
                            </Label>
                            <div className='inputWithButton'>
                                <Input
                                    id='name'
                                    className='ms-50 me-2 w-100'
                                    type='text'
                                    value={searchKey}
                                    onChange={onOrderTextChange}
                                    placeholder='Search Ticket Number'
                                    autoComplete="off"
                                />
                                {searchKey.length !== 0 && (
                                    <X size={18}
                                       className='cursor-pointer close-btn'
                                       onClick={OnClearOrderText}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>

    )
}

const TicketScreen = () => {
    const dispatch = useDispatch();
    const [store, setStore] = useState({
        data: [],
        total: 0
    });

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFetched, setIsFetched] = useState(false);
    const [val, setVal] = useState('')
    const [statusValue, setStatusValue] = useState('');
    const [searchKey, setSearchKey] = useState('');


    useEffect(() => {
        setSearchKey('');
        setCurrentPage(1);
        getAllTickets('', 1);
    }, []);

    const getAllTickets = async (val, page) => {
        dispatch(toggleLoading());
        const body = {
            "all": 0,
            "ticket_number": val
        }

        TicketServices.getAllTickets(body, page)
            .then(res => {
                if (res.success) {
                    dispatch(toggleLoading());
                    console.log(res)
                    setStore({data: res.data.data, total: res.data?.meta?.last_page ?? 0});
                } else {
                    dispatch(toggleLoading());
                    customToastMsg(res.message, res.status)
                }
            })
    }

    const columns = [
        {name: 'Ticket Number', selector: row => row.ticket_number},
        {name: 'Subject', selector: row => row.subject},
        {
            name: 'Status',
            selector: row => <Badge
                color={row.status === "closed" ? 'danger' : row.status === 'open' ? 'success' : 'secondary'}>{row.status}</Badge>
        },
        {name: 'Date', selector: row => tableDataDateTimeConverter(row.created_at)},
        {
            name: "",
            minWidth: "100px",
            cell: row => (
                <Link to={`ticket/${row.ticket_number}`} state={row}>
                    <ArrowRight size={18} className="cursor-pointer"/>
                </Link>

            )
        }
    ];

    const CustomPagination = () => {

        return (
            <ReactPaginate
                nextLabel=''
                breakLabel='...'
                previousLabel=''
                pageCount={store.total || 1}
                activeClassName='active'
                breakClassName='page-item'
                pageClassName={'page-item'}
                breakLinkClassName='page-link'
                nextLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousLinkClassName={'page-link'}
                previousClassName={'page-item prev'}
                onPageChange={page => handlePagination(page)}
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                containerClassName={'pagination react-paginate justify-content-end p-1'}
            />
        )
    }

    const dataToRender = () => {
        const filters = {
            q: val,
            status: statusValue
        }

        const isFiltered = Object.keys(filters).some(function (k) {
            return filters[k].length > 0
        })

        if (store.data?.length > 0) {
            return store.data
        } else if (store.data?.length === 0 && isFiltered) {
            return []
        } else {
            return store.data.slice(0, rowsPerPage)
        }
    }


    const handlePagination = page => {
        setCurrentPage(page.selected);
        const pageNumber = page.selected + 1;
        getAllTickets(searchKey, pageNumber);
    };

    const handleSearch = value => {
        setSearchKey(value);
        getAllTickets(value,currentPage);
    };


    return (
        <Card className='mt-2'>
            <CustomHeader
                value={val}
                OnClearOrderText={() => handleSearch("", 'order_key')}
                onOrderTextChange={e => handleSearch(e.target.value, 'order_key')}
                searchKey={searchKey}
            />

            <div className='invoice-list-dataTable react-dataTable'>
                <DataTable
                    noHeader={true}
                    pagination
                    sortServer
                    paginationServer
                    subHeader={true}
                    columns={columns}
                    responsive={true}
                    data={dataToRender()}
                    sortIcon={<ChevronDown/>}
                    className="dataTables_wrapper"
                    paginationDefaultPage={currentPage}
                    paginationComponent={CustomPagination}
                    customStyles={customStyles}
                    noDataComponent={emptyUI(isFetched)}
                />
            </div>
        </Card>
    )
}

export default TicketScreen;
