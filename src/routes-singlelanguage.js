// only pages should be imported and used here
// http://bradfrost.com/blog/post/atomic-web-design/
import HomePage from './pages/HomePage'
import ServicePage from './pages/ServicePage'

let routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/service',
    name: 'Service',
    component: ServicePage
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default routes
