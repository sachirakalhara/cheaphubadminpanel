// ** React Imports
import {Link, NavLink} from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import {PROJ_NAME} from "../../../const/constant"

const Error = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'error-dark.svg' : 'error.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <svg viewBox='0 0 139 95' version='1.1' height='28'>
          <defs>
            <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
              <stop stopColor='#000000' offset='0%'></stop>
              <stop stopColor='#FFFFFF' offset='100%'></stop>
            </linearGradient>
            <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
              <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
              <stop stopColor='#FFFFFF' offset='100%'></stop>
            </linearGradient>
          </defs>
        </svg>
        <NavLink to='/' className='d-flex align-items-center'>
          <img src={require(`@src/assets/images/logo/new-logo.png`).default} alt='logo' width={30} height={30} />
          <span className='mb-0 text-break ms-1 fw-bold' style={{fontSize:19}}>{PROJ_NAME}</span>
        </NavLink>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-2'>
            Back to home
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error
