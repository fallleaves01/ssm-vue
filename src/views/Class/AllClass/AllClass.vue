<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>全部课程</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 创建课程按钮 -->
  <!-- <div v-if="showCreate" class="create-course-button">
    <el-button type="primary" @click="createCourse">创建课程</el-button>
  </div> -->
  <div class="course-home">
 <div>
    <div >
            <el-row>
                <el-col :span="16">
                    <el-input v-model="keyWord" placeholder="请输入关键词"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button @click="search" circle>
                    <el-icon style="vertical-align: middle;">
                      <Search />
                    </el-icon>
                    </el-button>
                </el-col>
            </el-row>
        </div>
  </div>
  <!-- 全部课程列表 -->
  <div class="course-list">
    <el-row :gutter="20">
      <el-col :span="8" v-for="course in courseList" :key="course.id">
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
            <el-button type="success" @click="JoinClass(course.courseId) " v-if="course.in==0&&level==1">加入课程</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  </div>
  <!-- 搜索框 -->
 
</template>

<script>
import { GetAllCourseList,SearchCourse } from '@/utils/api/AllClassApi'
import { getLevel } from '@/store/level'
import {JoinClass} from '@/utils/api/JoinClassApi'

import { Search} from '@element-plus/icons-vue'
export default {
  data() {
    return {
      level:null,
      // showCreate: null,
      courseList: [],
      keyWord:''
    }
  },
  created() {
    let vm = this
    vm.level = getLevel()
    vm.showCreate = vm.level == 1 ? false : true
    let data = {}
    try {
      GetAllCourseList(data).then(function (resp) {
        console.log(resp)
        if (resp.data.courseList !== null) {
          resp.data.courseList.forEach((course) => {
            vm.courseList.push(course)
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    // createCourse() {
    //   this.$router.push("/allclass/createclass")
    // }
    JoinClass(courseId)
    {
      let that = this;
            let data = {
                "courseId": courseId
            }
            JoinClass(data).then(function(resp){
                    console.log(resp)
                    if(resp.data.status === 200)
                    {
                        that.$message.success(resp.data.msg)
                    }
                    else {
                        that.$message.error(resp.data.msg);
                    }
            });
    },
    search()
    {
      let vm=this
      let data={
        "keyWord":vm.keyWord
      }
      SearchCourse(data).then(function(resp){
        vm.courseList=resp.data.courseList
      })
    }
  }
}
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

.course-cover {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.course-info {
  padding: 20px;
  text-align: center;
}

.create-course-button {
  margin: 20px 0;
  text-align: center;
}
.card-footer {
  margin-top: auto;
  margin-bottom: 10px; /* 调整底部距离 */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
/* 根据需要添加其他样式 */
.course-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
