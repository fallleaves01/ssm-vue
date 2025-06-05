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

import Myquestions from '@/views/Myquestions/Myquestions.vue'

import CoursePage from '@/views/course/CoursePage/CoursePage.vue'
import CourseInfo from '@/views/course/CoursePage/CourseInfo.vue'
import StudentList from '@/views/course/StudentList/StudentList.vue'
import CreateProblem from '@/views/course/CreateProblem/CreateProblem.vue'
import Forum from '@/views/course/Forum/ForumPage.vue'
import PostPage from '@/views/course/Forum/PostPage.vue'
import CreatePage from '@/views/course/Forum/CreatePage.vue'
import AnnouncePage from '@/views/course/AnnouncePage/AnnouncePage.vue'


import ProblemList from '@/views/course/ProblemList/ProblemList.vue'
import InCourse from '@/views/course/InCourse/InCourse.vue'
import DocumentList from '@/views/course/DocumentList/DocumentList.vue'


import ProblemInfo from '@/views/course/ProblemInfo/ProblemInfo.vue'


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
      { path: '/myproduct/detail/:id', component: () => import('@/views/Product/MyProductPage.vue') },
      { path: '/allproduct', component: AllProduct },
      { path: '/mymessage', component: MyMessage },
      { path: '/perinfo', component: PerInfo },
      { path: '/buyproduct', component: BuyProduct },
      { path: '/createproduct', component: CreateProduct },
      { path: '/myproduct/coursepage/:id', component: CoursePage },
      { path: '/Myquestions', name: 'MyQuestions', component: Myquestions },
      { path: '/myproduct/coursepage/studentlist/:id', component: StudentList },
      { path: '/myproduct/coursepage/createproblem/:id', component: CreateProblem },

      { path: '/myproduct/coursepage/forum/:id/:forumId', component: Forum },
      { path: '/myproduct/coursepage/forum/post/:id/:forumId/:postId/:postName', component: PostPage },
      { path: '/myproduct/coursepage/forum/createpage/:id/:forumId', component: CreatePage },


      { path: '/myproduct/coursepage/problemlist/:id', component: ProblemList },
      { path: '/myproduct/coursepage/:courseId/problemlist/problem/:problemId', name: 'ProblemInfo', component: ProblemInfo },
      { path: '/myproduct/coursepage/incourse/:id', component: InCourse },
      { path: '/myproduct/coursepage/documentlist/:id', component: DocumentList },
      { path: '/myproduct/coursepage/anncouncement/:id', component: AnnouncePage },
      { path: '/myproduct/coursepage/courseinfo/:id', component: CourseInfo },

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


