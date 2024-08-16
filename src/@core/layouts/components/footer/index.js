// ** Icons Import
import { Heart } from 'react-feather'
import {COMPANY_NAME} from "../../../../const/constant";

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        Powered by {' '}
        <a href='https://ceyentra.com' target='_blank' rel='noopener noreferrer'>
            {COMPANY_NAME}
        </a>
        {/*<span className='d-none d-sm-inline-block'>, All rights Reserved</span>*/}
      </span>
      {/*<span className='float-md-end d-none d-md-block'>*/}
      {/*  Hand-crafted & Made with*/}
      {/*  <Heart size={14} />*/}
      {/*</span>*/}
    </p>
  )
}

export default Footer
