import Vue from 'vue'
import Router from 'vue-router'
import ec from '@/components/echart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: ec
    }
  ]
})
