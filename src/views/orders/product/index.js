import BreadCrumbs from "../../../@core/components/breadcrumbs";
import React, {Fragment, useEffect, useState} from "react";
import {Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table} from "reactstrap";
import {useLocation} from "react-router-dom";
import {formDataDateTimeConverter} from "../../../utility/commonFun";
import {customSweetAlert, customToastMsg} from "../../../utility/Utils";
import {Copy} from "react-feather";
import * as OrderResourcesServices from "../../../services/order-resources";

const ProductDetails = () => {
    const location = useLocation();
    const navigationParam = location.state;

    const [orderItems, setOrderItems] = useState(navigationParam?.order_items ?? []);
    const [deliveryInputs, setDeliveryInputs] = useState({});

    useEffect(() => {
        if (navigationParam?.id) {
            fetchOrder();
        }
    }, []);

    const fetchOrder = () => {
        OrderResourcesServices.getOrderByOrderId(navigationParam.id)
            .then(res => {
                if (res.success) {
                    setOrderItems(res.data.order.order_items ?? []);
                }
            });
    };

    const handleDeliver = (item) => {
        const content = deliveryInputs[item.id];
        if (!content || content.trim() === '') {
            customToastMsg('Please enter the delivery content', 0);
            return;
        }

        customSweetAlert(
            'This delivery cannot be edited or removed once submitted. Continue?',
            2,
            () => {
                OrderResourcesServices.deliverOrderItem({
                    order_item_id: item.id,
                    delivery_content: content,
                }).then(res => {
                    if (res.success) {
                        customToastMsg('Service delivered successfully', 1);
                        setDeliveryInputs(prev => ({...prev, [item.id]: ''}));
                        fetchOrder();
                    } else {
                        customToastMsg(res.message, res.status);
                    }
                });
            },
            'Deliver Service'
        );
    };

    return (
        <Fragment>
            <Row>
                <Col lg={12}>
                    <Card className="shadow-sm border-0">
                        <CardHeader className="text-white">
                            <CardTitle tag="h4" className="mb-0">Product Details</CardTitle>
                        </CardHeader>
                        <CardBody className="px-4">
                            <Row>
                                {orderItems && orderItems.length > 0 ? orderItems.map((item, i) => (
                                    <Col lg={12} className="pt-3 border-top mb-3" key={i}>
                                        {item?.contribution_product !== null ? (
                                            <Row>
                                                <Col lg={12}>
                                                    <Row>
                                                        <Col lg={2}>
                                                            <img
                                                                src={item.contribution_product.image}
                                                                alt="Product"
                                                                className="img-fluid rounded shadow"
                                                                style={{width: "100%", height: 150, objectFit: "cover"}}
                                                            />
                                                        </Col>

                                                        <Col lg={10}>
                                                            <p className="card-text mb-2">
                                                                <span className="fw-bold text-dark">Name: </span>
                                                                {item?.contribution_product?.name}
                                                            </p>
                                                            <p className="card-text mb-2">
                                                                <span
                                                                    className="fw-bold text-dark">Subscription: </span>
                                                                {`${item?.subscription?.name} | ${item?.package?.name}`}
                                                            </p>
                                                            <p className="card-text mb-2 text-muted">
                                                                <span className="fw-bold text-dark">Description: </span>
                                                                {item?.contribution_product?.description}
                                                            </p>
                                                            <p className="card-text mb-2">
                                                                <span
                                                                    className="fw-bold text-dark">Product Type: </span>
                                                                <Badge color="success">Subscription Product</Badge>
                                                                {item?.is_service_based && (
                                                                    <Badge color="info" className="ms-1">Service-based</Badge>
                                                                )}
                                                            </p>
                                                        </Col>
                                                    </Row>

                                                    {item?.is_service_based ? (
                                                        <div className="mt-3">
                                                            {item?.delivery ? (
                                                                <div className="ms-1">
                                                                    <span className="fw-bold text-dark">Delivered Content: </span>
                                                                    <div className="border rounded p-2 mt-2 bg-light"
                                                                         style={{whiteSpace: 'pre-wrap'}}>
                                                                        {item.delivery.delivery_content}
                                                                    </div>
                                                                    <p className="card-text mt-2 text-muted">
                                                                        Delivered by <span className="fw-bold">{item.delivery.delivered_by || 'Admin'}</span> on {formDataDateTimeConverter(item.delivery.delivered_at)}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="ms-1">
                                                                    <span className="fw-bold text-dark">Delivery Content: </span>
                                                                    <Input
                                                                        type="textarea"
                                                                        rows="4"
                                                                        className="mt-2"
                                                                        placeholder="Enter license key, instructions, or any text to deliver to the customer"
                                                                        value={deliveryInputs[item.id] || ''}
                                                                        onChange={(e) => setDeliveryInputs(prev => ({...prev, [item.id]: e.target.value}))}
                                                                    />
                                                                    <Button color="primary" className="mt-2"
                                                                            onClick={() => handleDeliver(item)}>
                                                                        Deliver
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="mt-3">
                                                            <span
                                                                className="fw-bold text-dark">Replacement Activities: </span>
                                                            {item?.user_purchase_serials.map((serialItem, j) => (
                                                                <div key={j} className="ms-3 mt-2 separator pt-2">
                                                                    <p className="card-text mb-2">
                                                                        <span
                                                                            className="fw-bold text-dark">⦿ Active Serial: </span>
                                                                        {serialItem.serial}
                                                                    </p>
                                                                    {serialItem.removed_product_replacement_serials.length > 0 && (
                                                                        <div className="mt-2 px-2">
                                                                            <span className="fw-bold text-dark">➣ Replacement History: </span>
                                                                            <Table responsive bordered size="sm"
                                                                                   className="mt-2">
                                                                                <thead className="table-light">
                                                                                <tr>
                                                                                    <th className="text-center">Replaced
                                                                                        At
                                                                                    </th>
                                                                                    <th className="text-center">Serial</th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {/* Each row shows the serial RETIRED by that replacement:
                                                                                    the originally issued serial for the first event, then the
                                                                                    previous replacement's serial for later events. The currently
                                                                                    active serial is shown above, not in the history. */}
                                                                                {serialItem.removed_product_replacement_serials.map((historyItem, k) => (
                                                                                    <tr key={k}>
                                                                                        <td className="text-center">
                                                                                            {formDataDateTimeConverter(historyItem.created_at)}
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {k === 0
                                                                                                ? (serialItem.original_serial || '—')
                                                                                                : serialItem.removed_product_replacement_serials[k - 1]?.product_replacement_serial?.serial || '—'}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                                </tbody>
                                                                            </Table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </Col>
                                            </Row>
                                        ) : (
                                            <Col lg={12}>
                                                <Row>
                                                    <Row>
                                                        <Col lg={2}>
                                                            <img
                                                                src={item.bulk_product.image}
                                                                alt="Product"
                                                                className="img-fluid rounded shadow object-fit-cover"
                                                                style={{width: "100%", height: 150, objectFit: "cover"}}
                                                            />
                                                        </Col>
                                                        <Col lg={10}>
                                                            <p className="card-text mb-2">
                                                        <span
                                                            className="fw-bold text-dark">Name: </span>{item.bulk_product?.name}
                                                            </p>
                                                            <p className="card-text mb-2 text-muted">
                                                                <span className="fw-bold text-dark">Description: </span>
                                                                {item.bulk_product?.description}
                                                            </p>
                                                            <p className="card-text mb-2 text-muted">
                                                                <span
                                                                    className="fw-bold text-dark">Service Info: </span>
                                                                {item.bulk_product?.service_info}
                                                            </p>
                                                            <p className="card-text mb-2">
                                                                <span
                                                                    className="fw-bold text-dark">Product Type: </span>
                                                                <Badge color="danger">Bulk Product</Badge>
                                                            </p>
                                                        </Col>
                                                    </Row>

                                                    <div className="mt-3">
                                                        <span
                                                            className="fw-bold text-dark">Purchased Serials: </span>

                                                        <Table responsive bordered size="sm"
                                                               className="mt-2">
                                                            <thead className="table-light">
                                                            <tr>
                                                                <th className="text-center">Purchased
                                                                    At
                                                                </th>
                                                                <th>Serial</th>
                                                                <th>Action</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                        {item.user_purchase_serials.map((serialItem, j) => (
                                                            <tr key={j}>
                                                                <td className="text-center">
                                                                    {formDataDateTimeConverter(serialItem.updated_at)}
                                                                </td>
                                                                <td>
                                                                    {serialItem.serial}
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        color='primary' outline
                                                                        style={{padding: 5, alignItems: 'center'}}
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(serialItem.serial)
                                                                                .then(() => {
                                                                                    customToastMsg('Copied to clipboard!', 1)
                                                                                })
                                                                                .catch((err) => {
                                                                                    customToastMsg('Failed to copy!', 0)
                                                                                })
                                                                        }}
                                                                    >
                                                                        <Copy size={15}/>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </Row>
                                            </Col>
                                        )}
                                    </Col>
                                )) : (
                                    <Col lg={12} className="text-center mt-4">
                                        <p className="text-muted">No product details available.</p>
                                    </Col>
                                )}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default ProductDetails;
