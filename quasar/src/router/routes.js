
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
      { path: '/cagedash',  component: () => import('pages/cagedash.vue') },
      { path: '/cagedash_old',  component: () => import('pages/cagedash_old.vue') },
      { path: '/account',  component: () => import('pages/account.vue') },
      { path: '/devices', component: () => import('pages/devices.vue') },
      { path: '/devreg', component: () => import('pages/devReg.vue') },
      { path: '/mqttall', component: () => import('pages/mqttall.vue') },
      { path: '/events', component: () => import('pages/events.vue') },
      { path: '/mqtttable',  component: () => import('pages/mqtttable.vue') },
      { path: '/mqttchart', component: () => import('pages/mqttchart.vue') },
      { path: '/eventshistory', component: () => import('pages/eventshistory.vue') },
      { path: '/storage',  component: () => import('pages/storage.vue') },
      { path: '/systemcheck',  component: () => import('pages/systemcheck.vue') },
      { path: '/temperature',  component: () => import('pages/temperature.vue') },
      { path: '/test',  component: () => import('pages/test.vue') },
      { path: '/racks', component: () => import('pages/racks.vue') }
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
