import React, {useState} from "react";
import {Badge, Button, Card, Col, Input, Label, Row} from "reactstrap";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {ArrowRight, ChevronDown, Plus, X} from "react-feather";
import {customStyles, emptyUI, getCustomDateTimeStamp} from "../../utility/Utils";
import {Link} from "react-router-dom";

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
    const [store, setStore] = useState({
        data: [
            {
                id: 1,
                ticketId: 'Tick12345',
                email: 'gebush48@gmail.com',
                status: 'Completed',
                date: '2024-02-10'
            },
            {
                id: 2,
                ticketId: 'Tick12346',
                email: 'samplegmail.com',
                status: 'Pending',
                date: '2024-02-12'
            },
            {
                id: 3,
                ticketId: 'Tick12347',
                email: 'gebush48@gmail.com',
                status: 'Completed',
                date: '2024-02-15'
            },
            {
                id: 4,
                ticketId: 'Tick12348',
                email: 'popogebush4568@gmail.com',
                status: 'Completed',
                date: '2024-02-18'
            },
            {
                id: 5,
                ticketId: 'Tick12349',
                email: 'sadsdgsdsdebush48@gmail.com',
                status: 'Closed',
                date: '2024-02-20'
            }
        ],
        total: 1
    });

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFetched, setIsFetched] = useState(false);
    const [val, setVal] = useState('')
    const [statusValue, setStatusValue] = useState('');
    const [searchKey, setSearchKey] = useState('')

    const columns = [
        {name: 'Ticket Number', selector: row => row.ticketId},
        {name: 'email', selector: row => row.email},
        {
            name: 'Status',
            selector: row => <Badge
                color={row.status === 'Incomplete' ? 'danger' : row.status === 'Pending' ? 'warning' : 'success'}>{row.status}</Badge>
        },
        {name: 'Date', selector: row => row.date},
        {
            name: "",
            minWidth: "100px",
            cell: row => (
                <Link to={`ticket/${row.ticketId}`} state={row}>
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
            return store.allData.slice(0, rowsPerPage)
        }
    }


    const handlePagination = page => {
        setCurrentPage(page.selected);
        // getCustomers();
    };

    const handleSearch = value => {
        setSearchKey(value);
        // getCustomers();
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
