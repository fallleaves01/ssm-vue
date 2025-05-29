<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>我的课程</el-breadcrumb-item>
  </el-breadcrumb>

  <div class="course-list">
    <el-row :gutter="20">
      

<el-col :span="8" v-for="course in courseList" :key="course.courseId" >
  <!-- 路由传参 -->

        <el-card class="course-card" shadow="hover">
          <div slot="header">
            <img :src="course.url" alt="课程封面" class="course-cover" />
          </div>
          <div class="course-info">
            <h2>{{ course.courseName }}</h2>
            <p>教师：{{ course.userName }}</p>
            <p>{{ course.courseInfo }}</p>
          </div>
          <div class="card-footer">
            <el-button type="success" @click="toCoursePage(course.courseId)">进入课程</el-button>
          <el-button type="danger" @click="deleteCourse(course.courseId)" v-if="level==2">删除课程</el-button>
          </div>
          
        </el-card>


      </el-col>

     
      

    </el-row>
  </div>
</template>

<script>
import { GetCourseList ,DeleteCourse} from '@/utils/api/MyClassApi';
import {getLevel,setLevel,removeLevel} from '@/store/level'
export default {
  data() {
    return {
      courseList: [],
      level:null,
    };
  },
  created() {
    let vm = this;
    let data = {};
    vm.level= getLevel()
    try {
      GetCourseList(data).then(function (resp) {
        console.log(resp);
        if (resp.data.courseList !== null) {
          vm.courseList = resp.data.courseList;
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  methods:{
    // To_course_page()
    // {
    //   this.$router.push("'/blog/'+")
    // }
    toCoursePage(courseId)
    {
      this.$router.push('/myclass/coursepage/'+courseId)
    },
    deleteCourse(courseId)
    {
      let vm = this
      let data ={
        "courseId":courseId
      }
      DeleteCourse(data).then(function(resp){
        if(resp.data.status==200)
            {
                vm.$message.success('删除成功')
            }
            else
            {
                vm.$message.error(resp.data.msg);
            }
      })
    }
  }
};
</script>

<style scoped>
.course-list {
  padding: 20px;
}

.course-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-footer {
  margin-top: auto;
  margin-bottom: 10px; /* 调整底部距离 */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.course-cover {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.course-info {
  padding: 20px;
  text-align: center;
}

.el-breadcrumb {
  margin: 20px 0;
}

/* 根据需要添加其他样式 */

</style>
