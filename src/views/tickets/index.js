import React, {useEffect, useState} from "react";
import {Badge, Button, Card, Col, Input, Label, Row, FormGroup} from "reactstrap";
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
                          OnClearOrderText,
                          onStatusChange,
                          statusValue
                      }) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo mb-2'>Tickets</h3>
                <Row>
                    <Col lg='4' className='d-flex align-items-center'>
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
                    <Col lg='3' className='d-flex align-items-center'>
                    <div className='d-flex align-items-center'>
                            <Label className='form-label' for='status-filter'>
                                Status
                            </Label>
                            <Input
                                id='status-filter'
                                type='select'
                                value={statusValue}
                                onChange={onStatusChange}
                                className='ms-50'
                            >
                                <option value=''>All</option>
                                <option value='open'>Open</option>
                                <option value='resolved'>Resolved</option>
                            </Input>
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

    const [currentPage, setCurrentPage] = useState(1);
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

    const getAllTickets = async (val, page, status = '') => {
        dispatch(toggleLoading());
        setIsFetched(false);
        const body = {
            "all": 0,
            "ticket_number": val,
            "status": status
        }

        TicketServices.getAllTickets(body, page)
            .then(res => {
                if (res.success) {
                    dispatch(toggleLoading());
                    console.log(res)
                    setStore({data: res.data?.data ?? [], total: res.data?.last_page ?? 0});
                } else {
                    dispatch(toggleLoading());
                    customToastMsg(res.message, res.status)
                }
                setIsFetched(true);
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
                <Link to={{pathname: `/tickets/chat-box/${row.ticket_number}`}}>
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
        if (store.data?.length > 0) {
            return store.data
        } else {
            return []
        }
    }


    const handlePagination = page => {
        setCurrentPage(page.selected + 1);
        const pageNumber = page.selected + 1;
        getAllTickets(searchKey, pageNumber, statusValue);
    };

    const handleSearch = value => {
        setSearchKey(value);
        setCurrentPage(1);
        getAllTickets(value, 1, statusValue);
    };

    const handleStatusChange = e => {
        const status = e.target.value;
        setStatusValue(status);
        setCurrentPage(1);
        getAllTickets(searchKey, 1, status);
    };

    const handleClearSearch = () => {
        setSearchKey('');
        setCurrentPage(1);
        getAllTickets('', 1, statusValue);
    };


    return (
        <Card className='mt-2'>
            <CustomHeader
                value={val}
                OnClearOrderText={handleClearSearch}
                onOrderTextChange={e => handleSearch(e.target.value)}
                searchKey={searchKey}
                onStatusChange={handleStatusChange}
                statusValue={statusValue}
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
