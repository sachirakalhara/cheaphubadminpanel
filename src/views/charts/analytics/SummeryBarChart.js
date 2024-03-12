// ** Third Party Components
import {Bar} from 'react-chartjs-2'
import Flatpickr from 'react-flatpickr'
import {Calendar} from 'react-feather'

// ** Reactstrap Imports
import {Card, CardHeader, CardTitle, CardBody, Alert, Label} from 'reactstrap'
import React from "react"
import {emptyUI} from "../../../utility/Utils"

// eslint-disable-next-line no-unused-vars
const SummeryBarChart = ({primaryBar, secondaryBar, gridLineColor, dataList, labelColor, picker, onClose, onChangeDate, fetched}) => {

    const yAxis = Array.from(dataList.map(item => item.productionCount))
    const y1Axis = Array.from(dataList.map(item => item.rejectionCount))
    const xAxis = Array.from(dataList.map(item => item.componentType))

    // ** Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        // animation: {duration: 1000},
        scales: {
            x: {
                grid: {display: false},
                ticks: {color: labelColor},
                title: {
                    display: true,
                    text: 'Components'
                }
            },
            y: {
                min: 0,
                // max:Math.max(...dataList.map(e => e.productionCount)),
                grid: {
                    color: gridLineColor,
                    borderColor: primaryBar
                },
                ticks: {
                    // stepSize: 20,
                    color: labelColor,
                    precision: 0,
                    count: Math.max(yAxis) > 0 ? 10 : null
                },
                title: {
                    display: true,
                    text: 'Production (PCS)'
                },
                beginAtZero: true,
                grace: '5%',
                alignToPixels: true,
                type: 'linear'
            },
            y1: {
                min: 0,
                // max:Math.max(...dataList.map(e => e.rejectionCount)),
                grid: {
                    color: gridLineColor,
                    borderColor: secondaryBar
                },
                ticks: {
                    // stepSize: 20,
                    color: labelColor,
                    precision: 0,
                    count: Math.max(y1Axis) > 0 ? 10 : null
                },
                title: {
                    display: true,
                    text: 'Rejection (Kg)'
                },
                position: 'right',
                beginAtZero: true,
                grace: '5%',
                alignToPixels: true,
                type: 'linear'
            }
        },
        plugins: {
            legend: {
                align: 'center',
                position: 'top',
                labels: {
                    // boxWidth: 10,
                    // marginBottom: 25,
                    padding: 20,
                    color: labelColor,
                    usePointStyle: true,
                    textAlign: 'right'
                },
                fullSize: true,
                padding: 100
            }
        }
    }

    const labels = xAxis

    // ** Chart data
    const data = {
        labels,
        datasets: [
            {
                maxBarThickness: 40,
                borderColor: 'transparent',
                data: yAxis,
                backgroundColor: primaryBar,
                borderRadius: 5,
                categoryPercentage: 0.5,
                yAxisID: 'y',
                label: 'Production PCS'
            },
            {
                borderColor: 'transparent',
                data: y1Axis,
                maxBarThickness: 40,
                backgroundColor: secondaryBar,
                borderRadius: 5,
                categoryPercentage: 0.5,
                yAxisID: 'y1',
                label: 'Rejection Weight'
            }
        ]
    }

    return (
        <Card className='invoice-preview-card w-100'>
            <CardHeader className='d-flex justify-content-start'>
                <CardTitle tag='h4'>Summery</CardTitle>
            </CardHeader>
            <CardBody>
                <div className='d-flex align-items-center mb-2 mt-1'>
                    <Label className='form-label' for='default-picker'>
                        Date Range
                    </Label>
                    <Flatpickr
                        value={picker}
                        id='range-picker'
                        className='form-control ms-1'
                        style={{width: 210}}
                        onChange={onChangeDate}
                        onClose={onClose}
                        options={{
                            mode: 'range',
                            showMonths: 2
                            // defaultDate:[new Date(picker[0]), new Date(picker[1])]
                        }}
                        placeholder={"Select Date Range"}
                    />
                </div>
                {dataList.length !== 0 ? (
                    <div style={{height: '400px'}}>
                        <Bar data={data} options={options} height={400}/>
                    </div>
                ) : emptyUI(fetched)}

            </CardBody>
        </Card>
    )
}

export default SummeryBarChart
