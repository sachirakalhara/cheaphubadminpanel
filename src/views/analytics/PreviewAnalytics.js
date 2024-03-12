// ** Reactstrap Imports
import {Card, CardBody} from 'reactstrap'
import React, {useEffect, useState} from "react"
import AnalyticsTab from './AnalyticsTabs'

const PreviewStyles = () => {
    const [active, setActive] = useState("1")
    const toggleTab = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    useEffect(async () => {
        const lastParam = window.location.href.split("/").pop()
        switch (lastParam) {
            case 'production-analysis':
                setActive('1')
                break
            case 'yarn-analysis':
                setActive('2')
                break
            case 'order-analysis':
                setActive('3')
                break
            default:
                setActive('1')
                break
        }

    }, [])

    return (
        // <Card className='invoice-preview-card'>
        //     <CardBody className='invoice-padding pb-0'>
                <div>
                    <h3 className='text-primary ms-2'>Analytics</h3>

                    <AnalyticsTab active={active} toggleTab={toggleTab}/>
                </div>


        //     </CardBody>
        // </Card>
    )
}

export default PreviewStyles
