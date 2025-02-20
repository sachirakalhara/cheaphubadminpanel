import React, {useState, useEffect, Fragment} from 'react';
import ReactPaginate from 'react-paginate';
import {ArrowRight, Box, ChevronDown, DollarSign, Eye, Plus, Trash, TrendingUp, User, X} from 'react-feather';
import DataTable from 'react-data-table-component';
import {Button, Input, Row, Col, Card, Label, Badge, CardTitle, CardText, CardBody} from 'reactstrap';
import {customStyles, emptyUI} from "../../utility/Utils";
import {Link} from "react-router-dom";
import classnames from "classnames";
import Avatar from "../../@core/components/avatar";

const CustomerList = () => {
    const data = [
        // {
        //     title: '230k',
        //     subtitle: 'Sales',
        //     color: 'light-primary',
        //     icon: <TrendingUp size={24} />
        // },
        {
            title: '8.549k',
            subtitle: 'Total Customers',
            color: 'light-info',
            icon: <User size={24}/>
        },
        // {
        //     title: '1.423k',
        //     subtitle: 'Products',
        //     color: 'light-danger',
        //     icon: <Box size={24} />
        // },
        {
            title: '$9745',
            subtitle: 'Total Spend',
            color: 'light-success',
            icon: <DollarSign size={24}/>
        }
    ]

    const [val, setVal] = useState('')
    const [statusValue, setStatusValue] = useState('')

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFetched, setIsFetched] = useState(false);

    const [store, setStore] = useState({
        data: [
            {id: 1, name: 'John Doe', email: 'john@example.com', balance: '$200', totalSpend: '$1500', purchases: 10},
            {id: 2, name: 'Jane Smith', email: 'jane@example.com', balance: '$50', totalSpend: '$800', purchases: 5},
        ],
        total: 1
    });


    useEffect(() => {
        // Fetch customers from API
        // getCustomers();
    }, []);

    const handlePagination = page => {
        setCurrentPage(page.selected);
        // getCustomers();
    };

    const handleSearch = value => {
        setSearchQuery(value);
        // getCustomers();
    };

    const columns = [
        {name: 'Customer Name', selector: row => row.name},
        {name: 'Email', selector: row => row.email},
        {name: 'Balance', selector: row => row.balance},
        {name: 'Total Spend', selector: row => row.totalSpend},
        {name: 'Purchases', selector: row => row.purchases, center: true},
        {
            name: "",
            minWidth: "100px",
            cell: row => (
                <Link to={`customers/${row.name}`} state={row}>
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

    const renderData = () => {
        return data.map((item, index) => {
            const colMargin = Object.keys({md: '3', sm: '6', xs: '12'})
            const margin = index === 2 ? 'sm' : colMargin[0]
            return (
                <Col
                    key={index}
                    {...{md: '3', sm: '6', xs: '12'}}
                    className={classnames({
                        [`mb-2 mb-${margin}-0`]: index !== data.length - 1
                    })}
                >
                    <div className='d-flex align-items-center'>
                        <Avatar color={item.color} icon={item.icon} className='me-2'/>
                        <div className='my-auto'>
                            <h4 className='fw-bolder mb-0'>{item.title}</h4>
                            <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
                        </div>
                    </div>
                </Col>
            )
        })
    }

    return (
        <Fragment>
            <Card>
                <div className='table-header w-100 py-2 px-1 m-0'>
                    <h3 className='text-primary mb-2'>Customer Management</h3>
                    <Row>
                        <Col lg='12' className='d-flex align-items-center px-0 px-lg-1'>
                            <div className='d-flex align-items-center'>

                                <Label className='form-label' for='search'>
                                    Search
                                </Label>
                                <div className='inputWithButton'>
                                    <Input
                                        id='search'
                                        className='ms-50 me-2 w-100'
                                        type='text'
                                        value={searchQuery}
                                        onChange={e => handleSearch(e.target.value)}
                                        placeholder='Search Customer'
                                        autoComplete="off"
                                    />
                                    {searchQuery.length !== 0 && (
                                        <X size={18} className='cursor-pointer close-btn'
                                           onClick={() => handleSearch('')}/>
                                    )}
                                </div>
                            </div>
                            <CardBody className='statistics-body ms-2'>
                                <Row>{renderData()}</Row>
                            </CardBody>
                        </Col>
                    </Row>
                </div>
            </Card>

            <Card className='mt-2'>
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
        </Fragment>
    );
};

export default CustomerList;
