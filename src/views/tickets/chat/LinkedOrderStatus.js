// ** Subscription status lines for a ticket's order, shown in the ticket info
// ** under "Order Number" — exactly as the customer sees it on their order page
// ** (Active / Expired / payment status).
import React from 'react'
import {Badge} from 'reactstrap'
import {tableDataDateTimeConverter} from '../../../utility/commonFun'
import {getItemSubscriptionStatus, paymentBadgeColor} from '../../../utility/orderSubscriptionStatus'

const LinkedOrderStatus = ({order, items}) => {
    if (!order || !items || !items.length) return null

    // Product name only needed to tell items apart when the order has several.
    const showName = items.length > 1

    return (
        <>
            {items.map((item, index) => {
                const status = getItemSubscriptionStatus(order, item)
                if (!status) return null
                const name = item?.contribution_product?.name || item?.bulk_product?.name || 'Product'
                const prefix = showName ? `${name} — ` : ''

                if (status.type === 'payment') {
                    return (
                        <p className='card-text mb-25' key={index}><span className="fw-bold text-black">Order Status: </span>
                            {prefix}<Badge color={paymentBadgeColor(status.label)}>{status.label}</Badge>
                        </p>
                    )
                }

                return (
                    <React.Fragment key={index}>
                        <p className='card-text mb-25'><span className="fw-bold text-black">Subscription: </span>
                            {prefix}
                            {status.isExpired ? (
                                <><Badge color='warning'>Expired</Badge> Expired on {tableDataDateTimeConverter(status.expiryDate)}</>
                            ) : (
                                <><Badge color='success'>Active</Badge> {status.daysRemaining} days remaining</>
                            )}
                        </p>
                        <p className='card-text mb-25'><span className="fw-bold text-black">Expiry Date: </span>
                            {tableDataDateTimeConverter(status.expiryDate)}
                        </p>
                    </React.Fragment>
                )
            })}
        </>
    )
}

export default LinkedOrderStatus
