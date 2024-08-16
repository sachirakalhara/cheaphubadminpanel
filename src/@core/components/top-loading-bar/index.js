import React, {useEffect, useRef} from 'react'
import LoadingBar from 'react-top-loading-bar'
import {useSelector} from "react-redux"

// class TopLoadingBar extends Component {
//
//     ref = React.createRef()
//
//     componentWillReceiveProps() {
//         if (layoutStore.loading) {
//             this.ref.current.continuousStart()
//         }
//
//         if (!layoutStore.loading) {
//             this.ref.current.complete()
//         }
//     }
//
//     render() {
//         return (<LoadingBar  color={'#CC6C5C'} ref={this.ref} shadow={true} style={{zIndex:9999999999}}/>)
//     }
// }
//
// export default TopLoadingBar


const TopLoadingBar = () => {

    const ref = useRef(null)
    const isLoading = useSelector(state => state.loading)

    useEffect(() => {
        if (isLoading) {
            ref.current.continuousStart()
        }

        if (!isLoading) {
            ref.current.complete()
        }
    })

    return (
        <LoadingBar color={'#1B9AF8'} ref={ref} shadow={true} style={{zIndex: 9999999999}}/>
    )
}

export default TopLoadingBar
