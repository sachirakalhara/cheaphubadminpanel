// ** Third Party Components
import {Line} from 'react-chartjs-2'
import Flatpickr from 'react-flatpickr'
import {Calendar} from 'react-feather'

// ** Reactstrap Imports
import {Card, CardHeader, CardTitle, CardBody, Alert} from 'reactstrap'
import React from "react"
import {emptyUI} from "../../../utility/Utils"

// eslint-disable-next-line no-unused-vars
const MachineAvgChart = ({primaryBar, secondaryBar, gridLineColor, labelColor, dataList, fetched}) => {

    const xAxis = Array.from(dataList.map(item => item.knittingDiameter))
    const yAxis = Array.from(dataList.map(item => item.average))
    const y1Axis = Array.from(dataList.map(item => item.weight))

    // ** Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {duration: 1000},
        scales: {
            x: {
                grid: {display: false},
                ticks: {color: labelColor},
                offset: true,
                title: {
                    display: true,
                    text: 'Knitting Diameter'
                }
            },
            y: {
                min: 0,
                grid: {
                    color: gridLineColor,
                    borderColor: primaryBar
                },
                ticks: {
                    precision: 0,
                    count: Math.max(yAxis) > 0 ? 10 : null,
                    color: labelColor
                },
                title: {
                    display: true,
                    text: 'Total Machine Average'
                },
                beginAtZero: true,
                grace: '5%',
                alignToPixels: true,
                type: 'linear'
            },
            y1: {
                min: 0,
                grid: {
                    color: gridLineColor,
                    borderColor: secondaryBar
                },
                ticks: {
                    precision: 0,
                    count: Math.max(y1Axis) > 0 ? 10 : null,
                    color: labelColor
                },
                title: {
                    display: true,
                    text: 'Total Production Weight (kg)'
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
                display: true,
                align: 'center',
                labels: {
                    // boxWidth: 10,
                    // paddingLeft: 1000,
                    color: labelColor,
                    usePointStyle: true
                }
            },
            legendDistance: {
                padding: 50
            }
        }
    }

    const labels = xAxis

    // ** Chart data
    const data = {
        labels,
        datasets: [
            {
                borderColor: primaryBar,
                data: yAxis,
                fill: false,
                tension: 0.5,
                label: 'Total Machine Average',
                pointRadius: 3,
                pointHoverRadius: 5,
                pointStyle: 'circle',
                pointHoverBorderWidth: 5,
                pointBorderColor: 'transparent',
                backgroundColor: primaryBar,
                yAxisID: 'y',
                pointHoverBackgroundColor: primaryBar
            },
            {
                borderColor: secondaryBar,
                data: y1Axis,
                fill: false,
                tension: 0.5,
                label: 'Total Production Weight',
                pointRadius: 3,
                pointHoverRadius: 5,
                pointStyle: 'circle',
                pointHoverBorderWidth: 5,
                pointBorderColor: 'transparent',
                backgroundColor: secondaryBar,
                yAxisID: 'y1',
                pointHoverBackgroundColor: secondaryBar
            }
        ]
    }

    return (
        <Card className='invoice-preview-card w-100'>
            <CardHeader className='d-flex justify-content-start'>
                <CardTitle tag='h4'>Machine Average</CardTitle>
            </CardHeader>
            <CardBody>
                {dataList.length !== 0 ? (
                    <Line data={data} options={options} height={400}/>
                ) : emptyUI(fetched)}

            </CardBody>
        </Card>
    )
}

export default MachineAvgChart
