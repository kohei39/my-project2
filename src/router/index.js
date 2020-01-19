import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Restaurant from '@/components/restaurant/restaurant'

Vue.use(Router)
Vue.use(BootstrapVue)

/* eslint-disable import/first */
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/restaurant',
      name: 'Restaurant',
      component: Restaurant
    }
  ]
})
