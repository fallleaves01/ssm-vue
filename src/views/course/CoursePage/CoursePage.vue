<template>

    <!-- 面包屑导航 -->
    <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myclass'}">我的课程</el-breadcrumb-item>
    <el-breadcrumb-item>{{courseName}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="course-home">
        <div class="course-cover">
        <img :src="url" alt="课程封面" />
        </div>

        <div class="course-info">
        <h2 class="course-name">{{ courseName }}</h2>
        <p class="teacher">教师：{{ teacher }}</p>
        <p class="teacher">课程id：{{ courseId }}</p>
        </div>

        <!-- <img :src="url" alt="课程封面" class="course-cover" /> -->
        <!-- <h1>论坛id:{{ forumId }}</h1> -->
        <div class="buttons">
            <el-button type="primary" @click="InCourse">上课</el-button>
            <el-button type="primary" @click="ProblemList">题库</el-button>
            <el-button type="primary" @click="StudentList">选课学生</el-button>

            <el-button type="primary" @click="Announcement">公告</el-button>
            <el-button type="primary" @click="Forum">论坛</el-button>

            <el-button type="primary" @click="DocumentList">文件</el-button>
            <el-button type="primary" @click="ChangeCourseInfo" v-if="level==2">修改课程信息</el-button>
        </div>
    </div>
    
    
    <!-- <el-button type="primary" @click="CreateProblem">创建题目</el-button> -->

</template>

<script>

import {GetCoursePage,BeginCourse,SignIn} from '@/utils/api/CoursePageApi'
import {getLevel,setLevel,removeLevel} from '@/store/level'
export default{
    data(){
        return{
            courseId:null,
            courseName:'',
            teacher:'',
            forumId:null,
            url:'',
            level:null,
        }

    },
    created(){
        let vm=this
        vm.courseId=this.$route.params.id
        vm.level=getLevel()
        console.log(this.$route.params.id)
        let data={
            "courseId":vm.courseId
        }
        GetCoursePage(data).then(function(resp){
            vm.courseName=resp.data.courseName

            
            vm.forumId=resp.data.forumId

            vm.teacher=resp.data.userName
            vm.url=resp.data.url


        });

    },
    methods:{
        StudentList()
        {
            this.$router.push("/myclass/coursepage/studentlist/"+this.courseId)
        },
        CreateProblem()
        {
            this.$router.push("/myclass/coursepage/createproblem/"+this.courseId)
        },

        Forum()
        {
            this.$router.push("/myclass/coursepage/forum/"+this.courseId+"/"+this.forumId)
        },
        ProblemList()
        {
            this.$router.push("/myclass/coursepage/problemlist/"+this.courseId)
        },
        InCourse()
        {
            if(getLevel()==2)
            {
                let vm=this
                let data={
                    "courseId":vm.courseId
                }
                BeginCourse(data).then(function(resp){
                    if(resp.data.status==200)
                    {
                        vm.$message.success("开始上课")
                        vm.$router.push("/myclass/coursepage/incourse/"+vm.courseId)
                    }
                    else{
                        vm.$message.error(resp.data.msg)
                    }
                })
            }
            else
            {
                let vm=this
                let data={
                    "courseId":vm.courseId
                }
                SignIn(data).then(function(resp){
                    if(resp.data.status==200)
                    {
                        vm.$message.success("签到成功")
                        vm.$router.push("/myclass/coursepage/incourse/"+vm.courseId)
                    }
                    else{
                        vm.$message.error(resp.data.msg)
                    }
                })

            }
            
            // this.$router.push("/myclass/coursepage/incourse/"+this.courseId)

        },
        DocumentList()
        {
            this.$router.push("/myclass/coursepage/documentlist/"+this.courseId)
        },
        Announcement()
        {
            this.$router.push("/myclass/coursepage/anncouncement/"+this.courseId)
        },
        ChangeCourseInfo()
        {
            this.$router.push("/myclass/coursepage/courseinfo/"+this.courseId)
        }
    }
}
</script>

<style scoped>
.course-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.course-cover {
  margin-bottom: 20px;
}

.course-cover img {
  width: 300px;
  height: auto;
}

.course-info {
  text-align: center;
  margin-bottom: 20px;
}

.course-name {
  font-size: 24px;
}

.teacher {
  margin-top: 10px;
  font-size: 16px;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.buttons el-button {
  margin: 10px;
}
</style>