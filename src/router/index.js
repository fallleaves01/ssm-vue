import { createRouter, createWebHistory } from 'vue-router'
import login from "@/views/other/loginPage/Login.vue";
import home from "@/views/other/homePage/Home.vue"
import {getToken} from '@/store/token'

import MyMessage from '@/views/other/MyMessage/MyMessage.vue'
import PerInfo from '@/views/other/PerInfo/PerInfo.vue'
import Welcome from '@/views/other/welcome/Welcome.vue'

// 课程列表相关
import MyClass from '@/views/Class/MyClass/MyClass.vue'
import AllClass from '@/views/Class/AllClass/AllClass.vue'
import JoinClass from '@/views/Class/JoinClass/JoinClass.vue'
import CreateClass from '@/views/Class/CreateClass/CreateClass.vue'

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
    redirect:'/welcome',
    children:[
      {path:'/welcome',component: Welcome},
      {path:'/myclass',component:MyClass},
      {path:'/allclass',component:AllClass},
      {path:'/mymessage',component:MyMessage},
      {path:'/perinfo',component:PerInfo},
      {path:'/joinclass',component:JoinClass},
      {path:'/createclass',component:CreateClass},
      {path:'/myclass/coursepage/:id',component:CoursePage},
      {path:'/Myquestions',name:'MyQuestions',component:Myquestions},
      {path:'/myclass/coursepage/studentlist/:id',component:StudentList},
      {path:'/myclass/coursepage/createproblem/:id',component:CreateProblem},

      {path:'/myclass/coursepage/forum/:id/:forumId',component:Forum},
      {path:'/myclass/coursepage/forum/post/:id/:forumId/:postId/:postName',component:PostPage},
      {path:'/myclass/coursepage/forum/createpage/:id/:forumId',component:CreatePage},


      {path:'/myclass/coursepage/problemlist/:id',component:ProblemList},
      {path:'/myclass/coursepage/:courseId/problemlist/problem/:problemId',name:'ProblemInfo',component:ProblemInfo},
      {path:'/myclass/coursepage/incourse/:id',component:InCourse},
      {path:'/myclass/coursepage/documentlist/:id',component:DocumentList},
      {path:'/myclass/coursepage/anncouncement/:id',component:AnnouncePage},
      {path:'/myclass/coursepage/courseinfo/:id',component:CourseInfo},
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


