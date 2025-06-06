import { createRouter, createWebHistory } from 'vue-router'
import login from "@/views/other/Login.vue";
import home from "@/views/other/Home.vue"
import { getToken } from '@/store/token'

import MyMessage from '@/views/other/MyMessage.vue'
import PerInfo from '@/views/other/PerInfo.vue'
import Welcome from '@/views/other/Welcome.vue'

// 商品列表相关
import MyProduct from '@/views/Product/MyProduct.vue'
import AllProduct from '@/views/Product/AllProduct.vue'
import BuyProduct from '@/views/Product/BuyProduct.vue'
import CreateProduct from '@/views/Product/CreateProduct.vue'
import AllProductDetail from '@/views/Product/AllProductDetail.vue'




const routes = [
  {
    path: "/",
    redirect: "/loginPage"
  },
  {
    path: "/loginPage",
    name: "login",
    component: login
  },
  {
    path: '/homePage',
    name: 'home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome }, { path: '/myproduct', component: MyProduct },
      { path: '/myproduct/create', component: CreateProduct },
      { path: '/myproduct/detail/:id', component: () => import('@/views/Product/MyProductPage.vue') },      { path: '/allproduct', component: AllProduct },
      { path: '/allproduct/detail/:id', component: AllProductDetail },
      { path: '/mymessage', component: MyMessage },
      { path: '/perinfo', component: PerInfo },
      { path: '/buyproduct', component: BuyProduct },
      { path: '/createproduct', component: CreateProduct },

      {
        path: '/myauction',
        component: () => import('@/views/Auction/MyAuction.vue')
      },
      {
        path: '/myauction/detail/:id',
        component: () => import('@/views/Auction/MyAuctionDetail.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});


// 设置路由跳转判断，主要是设置token

router.beforeEach((to, from, next) => {
  let token = getToken();
  const isAuthenticated = !(token === null || token === '');

  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' });
  } else {
    next();
  }
});

router.o

export default router;


