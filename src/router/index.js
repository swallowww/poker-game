import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from '../pages/home.vue'
import Game from '../pages/game.vue'

const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/game', component: Game }
    ]
})

export default router;