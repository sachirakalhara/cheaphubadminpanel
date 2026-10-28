import moment from "moment";

// Subscription status of an order item, as the customer sees it.
//
// This MUST match the customer site exactly — keep in sync with
// cheaphub-front-end: src/utils/utils.ts `checkOrderValidStatus` and
// src/components/CustomizedUIs/order/orderCard.tsx `getStatusBadge` (subscription
// items) / orderCard2.tsx (bulk items). Same inputs (order/{id} data), same
// moment rules: expiry = order created_at + package.expiry_duration months.

// Payment statuses that are shown as-is instead of Active / Expired.
const PAYMENT_LABELS = {
    canceled: 'Canceled',
    failed: 'Failed',
    refunded: 'Refunded',
    pending: 'Pending',
    completed: 'Completed'
}

const PAYMENT_COLORS = {
    Canceled: 'secondary',
    Failed: 'danger',
    Refunded: 'info',
    Pending: 'warning',
    Completed: 'success',
    Paid: 'success'
}

export const paymentBadgeColor = label => PAYMENT_COLORS[label] || 'secondary'

// Subscription items have a package with a duration; bulk items don't.
const isSubscriptionItem = item => {
    const months = item?.package?.expiry_duration
    return !!item && item.contribution_product !== null && months !== null && months !== undefined && months !== ''
}

// Returns null when there isn't enough data, otherwise either
// {type: 'payment', label} or
// {type: 'subscription', isExpired, expiryDate, daysRemaining}
export const getItemSubscriptionStatus = (order, item) => {
    if (!order || !item) return null

    const paymentStatus = order.payment_status
    if (PAYMENT_LABELS[paymentStatus]) return {type: 'payment', label: PAYMENT_LABELS[paymentStatus]}

    if (!isSubscriptionItem(item)) return {type: 'payment', label: 'Paid'}
    if (!order.created_at) return null

    const purchaseDate = moment(order.created_at)
    const expiryDate = purchaseDate.clone().add(item.package.expiry_duration, 'months')
    const now = moment()

    return {
        type: 'subscription',
        isExpired: now.isAfter(expiryDate),
        expiryDate: expiryDate.toISOString(),
        daysRemaining: Math.max(0, expiryDate.diff(now, 'days'))
    }
}

// One badge for a whole order (ticket list): the payment label for
// canceled/failed/refunded/pending/completed orders; otherwise Active if any
// subscription item is still active, Expired if all have expired, and null if
// the order has no subscription items.
export const getOrderSubscriptionSummary = (order, items) => {
    if (!order) return null
    if (PAYMENT_LABELS[order.payment_status]) return {label: PAYMENT_LABELS[order.payment_status], color: paymentBadgeColor(PAYMENT_LABELS[order.payment_status])}

    const statuses = (items || [])
        .map(item => getItemSubscriptionStatus(order, item))
        .filter(status => status && status.type === 'subscription')

    if (!statuses.length) return null
    return statuses.some(status => !status.isExpired)
        ? {label: 'Active', color: 'success'}
        : {label: 'Expired', color: 'warning'}
}
