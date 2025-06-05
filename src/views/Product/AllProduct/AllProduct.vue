<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>全部商品</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 创建课程按钮 -->
  <!-- <div v-if="showCreate" class="create-course-button">
    <el-button type="primary" @click="createCourse">创建课程</el-button>
  </div> -->
  <div class="product-home">
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
  <div class="product-list">
    <el-row :gutter="20">
      <el-col :span="8" v-for="course in courseList" :key="course.id">
        <el-card class="product-card" shadow="hover">
          <div slot="header">
            <img :src="course.url" alt="商品图片" class="product-cover" />
          </div>
          <div class="product-info">
            <h2>{{ course.courseName }}</h2>
            <p>卖家：{{ course.userName }}</p>
            <p>{{ course.courseInfo }}</p>
          </div>
          <div class="product-footer">
            <el-button type="success" @click="buyproduct(course.courseId) " v-if="course.in==0">加入竞拍</el-button>
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
import {buyProduct} from '@/utils/api/JoinClassApi'

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
    //   this.$router.push("/allproduct/createproduct")
    // }
    buyproduct(courseId)
    {
      let that = this;
            let data = {
                "courseId": courseId
            }
            buyProduct(data).then(function(resp){
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
.product-list {
  padding: 20px;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-cover {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 20px;
  text-align: center;
}

.product-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多显示2行 */
  -webkit-box-orient: vertical;
  white-space: normal;
}

.create-product-button {
  margin: 20px 0;
  text-align: center;
}
.product-footer {
  margin-top: auto;
  margin-bottom: 10px; /* 调整底部距离 */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
/* 根据需要添加其他样式 */
.product-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
