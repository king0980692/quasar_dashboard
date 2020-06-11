
const routes = [
  { path: '/login', component: () => import('pages/Login.vue') },
  { path: '/register', component: () => import('pages/Register.vue') },
  { path: '/email_validation',  component: () => import('pages/email_validation.vue') },

  { 
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    // redirect: '/dashboard',
    children: [
      { path: '/dashboard', component: () => import('pages/dashboard.vue') },
      { path: '/dashboard2', component: () => import('pages/dashboard2.vue') },
      { path: '/dashboard_temp', component: () => import('pages/dashboard_temp.vue') },
      { path: '/cagedash',  component: () => import('pages/cagedash.vue') },
      { path: '/racks', component: () => import('pages/racks.vue') },
      { path: '/devices', component: () => import('pages/devices.vue') },
      { path: '/mqttall', component: () => import('pages/mqttall.vue') },
      { path: '/events', component: () => import('pages/events.vue') },
      { path: '/account',  component: () => import('pages/account.vue') },
    ]
  },
  
  { path: '*',  redirect: '/login' },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
