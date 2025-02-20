import React, {useState} from "react";
import {Badge, Button, Card, Col, Input, Label, Row} from "reactstrap";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {ArrowRight, ChevronDown, Plus, X} from "react-feather";
import {customStyles, emptyUI, getCustomDateTimeStamp} from "../../utility/Utils";
import {Link} from "react-router-dom";
import Flatpickr from "react-flatpickr";

const CustomHeader = ({
                          onOrderTextChange,
                          orderKey,
                          OnClearOrderText,
                          productCategory,
                          selectProductCategory,
                          onChangeDateRange,
                          onCloseDateRange
                      }) => {
    return (
        <Card>
            <div className='invoice-list-table-header w-100 py-2 px-1 m-0' style={{whiteSpace: 'nowrap'}}>
                <h3 className='text-primary invoice-logo mb-2'>Orders</h3>
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
                                    value={orderKey}
                                    onChange={onOrderTextChange}
                                    placeholder='Search Order Number'
                                    autoComplete="off"
                                />
                                {orderKey.length !== 0 && (
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
                            <Label className='form-label me-25' for='default-picker'>
                                Product Type
                            </Label>
                            <Input
                                type='select'
                                id='rows-per-page'
                                value={productCategory}
                                onChange={selectProductCategory}
                            >
                                <option value='ALL'>All</option>
                                <option value='BULK'>Bulk Product</option>
                                <option value='SUBSCRIPTION'>Subscription Products</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg='5' className='d-flex align-items-center'>
                        <div className='d-flex align-items-center'>
                            <Label className='form-label me-25' for='default-picker'>
                                Transaction Range
                            </Label>
                            <Flatpickr
                                id='range-picker'
                                className='form-control'
                                onChange={onChangeDateRange}
                                style={{width: 210}}
                                options={{
                                    mode: 'range',
                                    showMonths: 2,
                                    defaultDate: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1))]
                                }}
                                onClose={onCloseDateRange}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>

    )
}

const OrdersScreen = () => {
    const [store, setStore] = useState({
        data: [
            {
                id: 1,
                orderId: 'ORD12345',
                amount: '$200',
                status: 'Completed',
                date: '2024-02-10'
            },
            {
                id: 2,
                orderId: 'ORD12346',
                amount: '$150',
                status: 'Pending',
                date: '2024-02-12'
            },
            {
                id: 3,
                orderId: 'ORD12347',
                amount: '$300',
                status: 'Completed',
                date: '2024-02-15'
            },
            {
                id: 4,
                orderId: 'ORD12348',
                amount: '$450',
                status: 'Completed',
                date: '2024-02-18'
            },
            {
                id: 5,
                orderId: 'ORD12349',
                amount: '$100',
                status: 'Incomplete',
                date: '2024-02-20'
            }
        ],
        total: 1
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFetched, setIsFetched] = useState(false);
    const [val, setVal] = useState('')
    const [statusValue, setStatusValue] = useState('');
    const [orderKey, setOrderKey] = useState('')
    const [productCategory, setProductCategory] = useState('ALL');
    const [picker, setPicker] = useState([])

    const columns = [
        {name: 'Order Number', selector: row => row.orderId},
        {name: 'Amount', selector: row => row.amount},
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
                <Link to={`orders/${row.orderId}`} state={row}>
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
        setSearchQuery(value);
        // getCustomers();
    };


    return (
        <Card className='mt-2'>
            <CustomHeader
                value={val}
                OnClearOrderText={() => handleSearch("", 'order_key')}
                onOrderTextChange={e => handleSearch(e.target.value, 'order_key')}
                orderKey={orderKey}
                productCategory={productCategory}
                selectProductCategory={e => setProductCategory(e.target.value)}
                picker={picker}
                onChangeDateRange={async (date) => {
                    if (date.length === 2) {
                        setPicker(date)
                    }
                }}
                onCloseDateRange={(selectedDates, dateStr, instance) => {
                    if (selectedDates.length === 1) {
                        instance.setDate([picker[0], picker[1]], true)
                    }
                }}
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

export default OrdersScreen;
