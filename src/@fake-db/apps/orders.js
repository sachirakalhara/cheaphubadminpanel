// eslint-disable-next-line no-unused-vars
export const dataOrder = {
    orders: [
        {
            id: 1,
            styleNumber: 1234,
            articleDescription: 'FLS 236 132/140 Melange "S"',
            yarn_supplier: 'Fulgar Lanka',
            size: 'XL',
            qty: '120',
            ratio: '0.21',
            sizeWiseWeight: '140.6',
            articleWiseYarn: '33.2',
            dueDate: 'asa'
        },
        {
            id: 2,
            styleNumber: 5678,
            articleDescription: 'FLS 236 132/140 Melange "S"',
            yarn_supplier: 'Fulgar Lanka',
            size: 'S',
            qty: '120',
            ratio: '0.21',
            sizeWiseWeight: '140.6',
            articleWiseYarn: '33.2',
            dueDate: 'asa'
        },
        {
            id: 3,
            styleNumber: 8910,
            articleDescription: 'FLS 236 132/140 Melange "S"',
            yarn_supplier: 'Fulgar Lanka',
            size: 'XL',
            qty: '120',
            ratio: '0.21',
            sizeWiseWeight: '140.6',
            articleWiseYarn: '33.2',
            dueDate: 'asa'
        }
    ],
    orderDetails: [
        {
            id: 1,
            style: 'GMLG4062',
            size: 'XL',
            color: 'BLACK',
            quantity: '12',
            fob: 10.8
        },
        {
            id: 2,
            style: 'GMLG5582',
            size: 'SM',
            color: 'RED',
            quantity: '500',
            fob: 71.9
        }
    ],
    styles: [
        {
            id: 1,
            styleNumber: 'GMLC0001',
            description: 'T-shirt',
            fallOut: 12,
            typesOfCompo: [
                {
                    id: 0,
                    name: 'Neck'
                },
                {
                    id: 1,
                    name: 'Body'
                },
                {
                    id: 2,
                    name: 'Sleeve'
                }
            ]
        },
        {
            id: 2,
            styleNumber: 'GMLC0002',
            description: 'T-shirt',
            fallOut: 22,
            typesOfCompo: [
                {
                    id: 0,
                    name: 'Neck'
                },
                {
                    id: 1,
                    name: 'Body'
                },
                {
                    id: 2,
                    name: 'Sleeve'
                }
            ]
        },
        {
            id: 3,
            styleNumber: 'GMLC0003',
            description: 'T-shirt',
            fallOut: 12,
            typesOfCompo: [
                {
                    id: 0,
                    name: 'Neck'
                },
                {
                    id: 1,
                    name: 'Body'
                },
                {
                    id: 2,
                    name: 'Sleeve'
                }
            ]
        }
    ],
    diameter: [
        {
            id: 0,
            size: 'XS',
            knittingDia: '12"',
            components: "Body",
            smv: 3,
            weight: 60
        },
        {
            id: 1,
            size: 'XS',
            knittingDia: '12"',
            components: "Body",
            smv: 3,
            weight: 60
        },
        {
            id: 2,
            size: 'XS',
            knittingDia: '12"',
            components: "Body",
            smv: 3,
            weight: 60
        }
    ],
    consumptionConfirmation: [
        {
            id: 1,
            yarnSupplier: 'Fulgar',
            yarnArticle: 'FLS',
            yarnTwist: '5',
            colorDependency: 'Almatex',
            consumption: '39.56',
            withFailOut: '59.65'
        },
        {
            id: 2,
            yarnSupplier: 'Fulgar',
            yarnArticle: 'FLS',
            yarnTwist: '5',
            colorDependency: 'Almatex',
            consumption: '39.56',
            withFailOut: '379.65'
        },
        {
            id: 3,
            yarnSupplier: 'Fulgar',
            yarnArticle: 'FLS',
            yarnTwist: '5',
            colorDependency: 'Almatex',
            consumption: '39.56',
            withFailOut: '79.65'
        }
    ],
    consumption2: [
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            garmentSize: "XXS",
            consumption: 0,
            consumptionWithFallout: 0,
            colorDependent: true,
            deleted: true,
            styleComponent: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                ratio: "1:1",
                calculatedRatio: 0,
                deleted: true,
                style: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    styleNumber: "GCD002",
                    styleDescription: "GBH0200",
                    falloutPercentage: 0,
                    deleted: true
                },
                component: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "Body",
                    deleted: true
                }
            },
            supplierArticle: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                deleted: true,
                supplier: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "YARN",
                    name: "Fluger",
                    deleted: true,
                    address: {
                        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        textRepresentation: "string",
                        line1: "string",
                        line2: "string",
                        line3: "string",
                        cityCounty: "string",
                        district: "string",
                        postalCode: "string",
                        countryCode: "string",
                        deleted: true
                    }
                },
                article: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name: "FLS",
                    twist: "S",
                    deleted: true,
                    articleType: {
                        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        type: "string",
                        deleted: true
                    }
                }
            },
            color: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                name: "Almatex",
                code: "string",
                deleted: true
            }
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            garmentSize: "XL",
            consumption: 0,
            consumptionWithFallout: 0,
            colorDependent: true,
            deleted: true,
            styleComponent: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                ratio: "1:1",
                calculatedRatio: 0,
                deleted: true,
                style: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    styleNumber: "GCD002",
                    styleDescription: "GBH0200",
                    falloutPercentage: 0,
                    deleted: true
                },
                component: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "Neck",
                    deleted: true
                }
            },
            supplierArticle: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                deleted: true,
                supplier: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "YARN",
                    name: "Fluger",
                    deleted: true,
                    address: {
                        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        textRepresentation: "string",
                        line1: "string",
                        line2: "string",
                        line3: "string",
                        cityCounty: "string",
                        district: "string",
                        postalCode: "string",
                        countryCode: "string",
                        deleted: true
                    }
                },
                article: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name: "FLS",
                    twist: "S",
                    deleted: true,
                    articleType: {
                        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        type: "string",
                        deleted: true
                    }
                }
            },
            color: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                name: "Almatex",
                code: "string",
                deleted: true
            }
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            garmentSize: "S",
            consumption: 0,
            consumptionWithFallout: 0,
            colorDependent: true,
            deleted: true,
            styleComponent: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                ratio: "1:1",
                calculatedRatio: 0,
                deleted: true,
                style: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    styleNumber: "GCD002",
                    styleDescription: "GBH0200",
                    falloutPercentage: 0,
                    deleted: true
                },
                component: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "Sleeve",
                    deleted: true
                }
            },
            supplierArticle: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                deleted: true,
                supplier: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "YARN",
                    name: "Fluger",
                    deleted: true,
                    address: {
                        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        textRepresentation: "string",
                        line1: "string",
                        line2: "string",
                        line3: "string",
                        cityCounty: "string",
                        district: "string",
                        postalCode: "string",
                        countryCode: "string",
                        deleted: true
                    }
                },
                article: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name: "FLS",
                    twist: "S",
                    deleted: true,
                    articleType: {
                        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        type: "string",
                        deleted: true
                    }
                }
            },
            color: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                name: "Almatex",
                code: "string",
                deleted: true
            }
        }
    ],
    diameter2:[
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            garmentSize: "XXS",
            smv: 0,
            weight: 0,
            deleted: true,
            styleComponent: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                ratio: "string",
                calculatedRatio: 0,
                deleted: true,
                style: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    styleNumber: "string",
                    styleDescription: "string",
                    falloutPercentage: 0,
                    deleted: true
                },
                component: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "Body",
                    deleted: true
                }
            },
            knittingDiameter: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                knittingDiameter: 0,
                deleted: true
            }
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            garmentSize: "XXS",
            smv: 0,
            weight: 0,
            deleted: true,
            styleComponent: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                ratio: "string",
                calculatedRatio: 0,
                deleted: true,
                style: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    styleNumber: "string",
                    styleDescription: "string",
                    falloutPercentage: 0,
                    deleted: true
                },
                component: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "Body",
                    deleted: true
                }
            },
            knittingDiameter: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                knittingDiameter: 0,
                deleted: true
            }
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            garmentSize: "XXS",
            smv: 0,
            weight: 0,
            deleted: true,
            styleComponent: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                ratio: "string",
                calculatedRatio: 0,
                deleted: true,
                style: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    styleNumber: "string",
                    styleDescription: "string",
                    falloutPercentage: 0,
                    deleted: true
                },
                component: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "Body",
                    deleted: true
                }
            },
            knittingDiameter: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                knittingDiameter: 0,
                deleted: true
            }
        }
    ],
    production:[
        {
            date:"15.12.2051",
            shift:'Day',
            order:'PO12121212',
            style:'GML45412',
            component:'Neck',
            machine:'1201',
            production:1000,
            rejection:200

        }
    ]
}
