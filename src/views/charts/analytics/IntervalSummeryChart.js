// ** Third Party Components
import {Line} from 'react-chartjs-2'
import Flatpickr from 'react-flatpickr'
import {X} from 'react-feather'

// ** Reactstrap Imports
import {Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Label} from 'reactstrap'
import React from "react"
import classnames from "classnames"
import {emptyUI, stringToColour} from "../../../utility/Utils"

// eslint-disable-next-line no-unused-vars
const IntervalSummeryChart = ({primaryBar, secondaryBar, gridLineColor, labelColor, activeView, onDailyClick, onMonthlyClick, onYearlyClick, dataList, picker, onCloseClick, onClosePicker, onChangeDateRange, fetched}) => {

    const dateFormat = (type) => {
        switch (type) {
            case 'DAILY':
                return {
                    title: 'day',
                    format: {
                        month: 'short',
                        year: 'numeric',
                        day: 'numeric'
                    }
                }
            case 'MONTHLY':
                return {
                    title: 'month',
                    format: {
                        month: 'short',
                        year: 'numeric'
                    }
                }
            case 'YEARLY':
                return {
                    title: 'year',
                    format: {
                        year: 'numeric'
                    }
                }
            default:
                return {}
        }
    }

    // ** Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {duration: 1000},
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: dateFormat(activeView).title
                },
                title: {
                    display: true,
                    text: 'Date'
                },
                grid: {display: false},
                ticks: {color: labelColor},
                offset: true
            },
            y: {
                min: 0,
                grid: {
                    color: gridLineColor,
                    borderColor: '#DBDBDB'
                },
                ticks: {
                    precision: 0,
                    count: 10,
                    color: labelColor
                },
                title: {
                    display: true,
                    text: 'Production (PCS)'
                }
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
            },
            tooltip: {
                callbacks: {
                    title: context => {
                        const d = new Date(context[0].parsed.x)
                        return d.toLocaleString([], dateFormat(activeView).format)
                    }
                }

            }
        }
    }

    // const labels = ["Jan 2, 20", "Feb 3, 20", "Mar 4, 20", "Apr 5, 20", "May 6, 20", "Jun 9, 20", "Nov 10, 20", "Dec 11, 20"]

    // ** Chart data
    const data = {
        datasets: dataList.map(item => (
            {
                borderColor: stringToColour(item.componentType),
                data: item.subList,
                fill: false,
                tension: 0.5,
                pointRadius: item.subList.length === 1 ? 3 : 0,
                pointHoverRadius: 5,
                pointStyle: 'circle',
                label: item.componentType,
                pointHoverBorderWidth: 5,
                pointBorderColor: 'transparent',
                backgroundColor: stringToColour(item.componentType),
                pointHoverBackgroundColor: stringToColour(item.componentType),
                parsing: {
                    xAxisKey: 'date',
                    yAxisKey: 'productionCount'
                }
            }
        ))
    }

    return (
        <Card className='invoice-preview-card w-100'>
            <CardHeader className='d-flex justify-content-between w-100'>
                <CardTitle tag='h4'>Interval Summery</CardTitle>
                <ButtonGroup>
                    <Button
                        tag='label'
                        className={classnames('btn-icon view-btn grid-view-btn', {
                            active: activeView === 'DAILY'
                        })}
                        color='primary'
                        outline={activeView !== 'DAILY'}
                        onClick={onDailyClick}
                    >
                        Daily
                    </Button>
                    <Button
                        tag='label'
                        className={classnames('btn-icon view-btn list-view-btn', {
                            active: activeView === 'MONTHLY'
                        })}
                        color='primary'
                        outline={activeView !== 'MONTHLY'}
                        onClick={onMonthlyClick}
                    >
                        Monthly
                    </Button>
                    <Button
                        tag='label'
                        className={classnames('btn-icon view-btn list-view-btn', {
                            active: activeView === 'YEARLY'
                        })}
                        color='primary'
                        outline={activeView !== 'YEARLY'}
                        onClick={onYearlyClick}
                    >
                        Yearly
                    </Button>
                </ButtonGroup>
            </CardHeader>

            <div className='d-flex align-items-center mt-1 ms-2 w-75'>
                <Label className='form-label' for='default-picker'>
                    Date Range
                </Label>
                <Flatpickr
                    value={picker}
                    id='range-picker'
                    className='form-control ms-1'
                    onChange={onChangeDateRange}
                    placeholder={"Select Date Range"}
                    onClose={onClosePicker}
                    options={{
                        mode: 'range',
                        showMonths: 2
                        // defaultDate:[new Date(picker[0]), new Date(picker[1])]
                    }}
                />
                {picker.length !== 0 && (
                    <div
                        className='ms-2'>
                        <X size={18}
                           className='cursor-pointer'
                           onClick={onCloseClick}
                        />
                    </div>
                )}

            </div>

            <CardBody>
                {dataList.length !== 0 ? (
                    <div style={{height: '400px'}}>
                        <Line data={data} options={options} height={400}/>
                    </div>
                ) : emptyUI(fetched)}

            </CardBody>
        </Card>
    )
}

export default IntervalSummeryChart
