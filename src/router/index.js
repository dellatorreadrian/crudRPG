import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import PlayerCrud from '../components/PlayerCrud'
import DiceCrud from '../components/DiceCrud'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    name: 'Jogadores',
    path: '/players',
    component: PlayerCrud
    
  },
  {
    name: 'Dados de RPG',
    path: '/dice',
    component: DiceCrud
    
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
