<template>
    <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>个人题目列表</el-breadcrumb-item>
  </el-breadcrumb>

  <div>
 <ul>
   <li v-for="problem in problemList" :key="problem.problemId" class="no-bullet" @click="ProblemInfo(problem.problemId,problem.courseId)">
    <!-- 根据题目id跳转到对应的题目详情页 -->
     <!-- <router-link :to="'/myclass/coursepage/'+problem.problemId"> -->
      <el-row :gutter="20" style="margin-top:10px;">
        <el-card class="box-card">
          <div class="problem-info">
       <div class="text">
         <p>题目：{{JSON.parse(problem.problemDescription).description}}</p>
         <p>题型：{{ problem.problemType==0?'选择':'判断' }}</p>
         <p>课程及章节：{{ problem.courseName }}-第{{ problem.chapter }}章 </p>

       </div>
     </div>
        </el-card>
        
      </el-row>
      
     <!-- </router-link> -->
    

   </li>
 </ul>
</div>

</template>


<script>
import { GetMyquestionList } from '@/utils/api/MyQuestionsAPI';

export default {
  data() {
    return {
      problemList: [],
      // courseId:-1,
    };
  },
  created() {
    let vm = this;
    let data = {};
    try {
      GetMyquestionList(data).then(function (resp) {
        console.log(resp);
        if (resp.data.problemList !== null) {
          vm.problemList = resp.data.problemList;

        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  methods:{
    ProblemInfo(problemId,courseId)
    {
        this.$router.push('/myclass/coursepage/'+courseId+'/problemlist/problem/'+problemId)
    }
  }
};
</script>

<style>
  .box-card {
    width: 100%;
  }
  .no-bullet {
    list-style-type: none;
  }
</style>