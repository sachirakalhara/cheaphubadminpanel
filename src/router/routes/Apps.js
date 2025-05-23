// ** React Imports
import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const AppRoutes = [
  {
    path: '/apps/email',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email'))
  },
  {
    path: '/apps/email/:folder',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/email/label/:label',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/email/:filter',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/chat',
    appLayout: true,
    className: 'chat-application',
    component: lazy(() => import('../../views/apps/chat'))
  },
  {
    path: '/apps/todo',
    exact: true,
    appLayout: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo'))
  },
  {
    path: '/apps/todo/:filter',
    appLayout: true,
    exact: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo')),
    meta: {
      navLink: '/apps/todo'
    }
  },
  {
    path: '/apps/todo/tag/:tag',
    appLayout: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo')),
    meta: {
      navLink: '/apps/todo'
    }
  },
  {
    path: '/apps/calendar',
    component: lazy(() => import('../../views/apps/calendar'))
  },
  {
    path: '/apps/invoice/list',
    component: lazy(() => import('../../views/apps/invoice/list'))
  },
  {
    path: '/apps/invoice/preview/:id',
    component: lazy(() => import('../../views/apps/invoice/preview')),
    meta: {
      navLink: '/apps/invoice/preview'
    }
  },
  {
    path: '/apps/invoice/preview',
    exact: true,
    component: () => <Redirect to='/apps/invoice/preview/4987' />
  },
  {
    path: '/apps/invoice/edit/:id',
    component: lazy(() => import('../../views/apps/invoice/edit')),
    meta: {
      navLink: '/apps/invoice/edit'
    }
  },
  {
    path: '/apps/invoice/edit',
    exact: true,
    component: () => <Redirect to='/apps/invoice/edit/4987' />
  },
  {
    path: '/apps/invoice/add',
    component: lazy(() => import('../../views/apps/invoice/add'))
  },
  {
    path: '/apps/invoice/print',
    layout: 'BlankLayout',
    component: lazy(() => import('../../views/apps/invoice/print'))
  },
  {
    path: '/apps/ecommerce/shop',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/shop'))
  },
  {
    path: '/apps/ecommerce/wishlist',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/wishlist'))
  },
  {
    path: '/apps/ecommerce/product-detail',
    exact: true,
    className: 'ecommerce-application',
    component: () => <Redirect to='/apps/ecommerce/product-detail/apple-i-phone-11-64-gb-black-26' />
  },
  {
    path: '/apps/ecommerce/product-detail/:product',
    exact: true,
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/detail')),
    meta: {
      navLink: '/apps/ecommerce/product-detail'
    }
  },
  {
    path: '/apps/ecommerce/checkout',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/checkout'))
  },
  {
    path: '/apps/user/list',
    component: lazy(() => import('../../views/apps/user/list'))
  },
  {
    path: '/apps/user/view',
    exact: true,
    component: () => <Redirect to='/apps/user/view/1' />
  },
  {
    path: '/apps/user/view/:id',
    component: lazy(() => import('../../views/apps/user/view')),
    meta: {
      navLink: '/apps/user/view'
    }
  },
  {
    path: '/apps/roles',
    component: lazy(() => import('../../views/apps/roles-permissions/roles'))
  },
  {
    path: '/apps/permissions',
    component: lazy(() => import('../../views/apps/roles-permissions/permissions'))
  },

    //my custom tabs links

  {
    path: '/products/bulk/list',
    component: lazy(() => import('../../views/product/bulk'))
  },
  {
    path: '/products/subscription/list',
    component: lazy(() => import('../../views/product/subscription'))
  },
  {
    path: '/order/order-details/:id',
    component: lazy(() => import('../../views/product/order-details')),
    meta: {
      navLink: '/order/order-details'
    }
  },
  {
    path: '/order/order-details/:id/:subject',
    component: lazy(() => import('../../views/product/order-details')),
    meta: {
      navLink: '/order/order-details'
    }
  },
  {
    path: '/categories/list',
    component: lazy(() => import('../../views/categories'))
  },
  {
    path: '/styles/styles-details/:id',
    component: lazy(() => import('../../views/categories/styles-details'))
  },
  {
    path: '/styles/styles-details/:id/:subject',
    component: lazy(() => import('../../views/categories/styles-details')),
    meta: {
      navLink: '/styles/styles-details'
    }
  },

    //others
  {
    path: '/analytics',
    component: lazy(() => import('../../views/analytics'))
  },
  {
    path: '/analytics/:subject',
    component: lazy(() => import('../../views/analytics')),
    meta: {
      navLink: '/analytics'
    }
  },
  {
    path: '/materials_requirements/list',
    component: lazy(() => import('../../views/materials'))
  },



  {
    path: '/tags/list',
    component: lazy(() => import('../../views/tags'))
  },
  {
    path: '/coupon/list',
    component: lazy(() => import('../../views/coupon'))
  },
  {
    path: '/customer/list',
    component: lazy(() => import('../../views/customers'))
  },
  {
    path: '/customer/:name',
    component: lazy(() => import('../../views/customers/profile'))
  },
  {
    path: '/order/list',
    component: lazy(() => import('../../views/orders'))
  },
  {
    path: '/order/:orderNumber',
    component: lazy(() => import('../../views/orders/details/index')),
  },
  {
    path: '/product-details/:orderNumber',
    component: lazy(() => import('../../views/orders/product/index')),
    exact: true,
    meta: {
      navLink: '/order/:orderNumber'
    }
  },
  {
    path: '/ticket/list',
    component: lazy(() => import('../../views/tickets'))
  },
  {
    path: '/ticket/:name',
    appLayout: true,
    className: 'chat-application',
    component: lazy(() => import('../../views/tickets/chat'))
  },
]

export default AppRoutes
