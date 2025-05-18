import BreadCrumbs from "../../../@core/components/breadcrumbs";
import React, {Fragment, useEffect} from "react";
import {Badge, Card, CardBody, CardHeader, CardTitle, Col, Row, Table} from "reactstrap";
import {useLocation} from "react-router-dom";
import {formDataDateTimeConverter} from "../../../utility/commonFun";

const ProductDetails = () => {
    const location = useLocation();
    const navigationParam = location.state;

    useEffect(() => {
        console.log(navigationParam);
    }, []);

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
                                {navigationParam ? navigationParam?.order_items?.map((item, i) => (
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
                                                            </p>
                                                        </Col>
                                                    </Row>
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
                                                                            {serialItem.removed_product_replacement_serials.map((historyItem, k) => (
                                                                                <tr key={k}>
                                                                                    <td className="text-center">
                                                                                        {formDataDateTimeConverter(historyItem.updated_at)}
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        {historyItem.product_replacement_serial.serial}
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
                                                </Col>
                                            </Row>
                                        ) : (
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
                                                        <span className="fw-bold text-dark">Service Info: </span>
                                                        {item.bulk_product?.service_info}
                                                    </p>
                                                    <p className="card-text mb-2">
                                                        <span className="fw-bold text-dark">Product Type: </span>
                                                        <Badge color="danger">Bulk Product</Badge>
                                                    </p>
                                                </Col>
                                            </Row>
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
