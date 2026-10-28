// ** Linked order of a ticket, with each item's subscription status exactly as
// ** the customer sees it on their order page (Active / Expired / payment status).
import React from 'react'
import {Link} from 'react-router-dom'
import {Badge, Col} from 'reactstrap'
import {tableDataDateTimeConverter} from '../../../utility/commonFun'
import {getItemSubscriptionStatus, paymentBadgeColor} from '../../../utility/orderSubscriptionStatus'

const LinkedOrderStatus = ({order, items}) => {
    if (!order) return null

    return (
        <Col lg={12} className="mt-2 pt-2 separator">
            <h4 className="text-md font-bold">Linked Order</h4>
            <p className='card-text mb-25'><span className="fw-bold text-black">Order Number: </span>
                {order.id ? (
                    <Link to={`/order/${order.order_id}?id=${order.id}`} target='_blank' rel='noopener noreferrer'>
                        {order.order_id}
                    </Link>
                ) : order.order_id}
            </p>

            {(items || []).map((item, index) => {
                const status = getItemSubscriptionStatus(order, item)
                const name = item?.contribution_product?.name || item?.bulk_product?.name || 'Product'

                return (
                    <div key={index} className="mt-1">
                        <p className='card-text mb-25'><span className="fw-bold text-black">Product: </span>{name}</p>
                        {status?.type === 'subscription' ? (
                            <>
                                <p className='card-text mb-25'>
                                    <span className="fw-bold text-black">Subscription: </span>
                                    {status.isExpired ? (
                                        <>
                                            <Badge color='warning'>Expired</Badge>{' '}
                                            <span>Expired on {tableDataDateTimeConverter(status.expiryDate)}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Badge color='success'>Active</Badge>{' '}
                                            <span>{status.daysRemaining} days remaining</span>
                                        </>
                                    )}
                                </p>
                                <p className='card-text mb-25'><span className="fw-bold text-black">Expiry Date: </span>
                                    {tableDataDateTimeConverter(status.expiryDate)}
                                </p>
                            </>
                        ) : status?.type === 'payment' ? (
                            <p className='card-text mb-25'><span className="fw-bold text-black">Order Status: </span>
                                <Badge color={paymentBadgeColor(status.label)}>{status.label}</Badge>
                            </p>
                        ) : null}
                    </div>
                )
            })}
        </Col>
    )
}

export default LinkedOrderStatus
