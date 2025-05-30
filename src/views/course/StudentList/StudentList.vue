<template>
    <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct'}">我的课程</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct/coursepage/'+courseId}">{{courseName}}</el-breadcrumb-item>
    <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 学生列表 -->
    <div>

        <div v-if="level==2">
            <el-row>
                <el-col :span="8">
                    <el-input v-model="stuNumber" placeholder="请输入学生学号"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button @click="addStu">添加</el-button>
                </el-col>
            </el-row>
        </div>

    <el-table :data="studentTableData" style="width: 100%">
    <el-table-column prop="userName" label="学生名" width="360" />
    <el-table-column prop="number" label="学号" width="360" />
    <el-table-column fixed="right" label="Operations" width="120" v-if="level==2">
      <template v-slot="scope">
        <el-button link type="primary" size="small" @click="deleteStu((scope.row.number))">删除学生</el-button>
      </template>
    </el-table-column>
    </el-table>

    </div>
    


</template>

<script>
import {GetCoursePage} from '@/utils/api/CoursePageApi'
import {GetStudentList,DeleteStudent,AddStudent} from '@/utils/api/GetStudentList'
import {getLevel,setLevel,removeLevel} from '@/store/level'
export default{
    data(){
        return{
            courseId:null,
            courseName:'',
            studentTableData:[
                // {userName:'范勐',number:1120201324}
            ],
            stuNumber:null,
            level:null,
        };
    },
    created()
    {
        let vm=this
        vm.courseId=this.$route.params.id
        vm.level=getLevel()
        let data={
            "courseId":vm.courseId
        }
        GetCoursePage(data).then(function(resp){
            vm.courseName=resp.data.courseName
        });
        GetStudentList(data).then(function(resp){
            vm.studentTableData=resp.data.stuList
        })

    },
    methods:
    {
        deleteStu(number)
        {
            let vm=this
            let data={
                "courseId":vm.courseId,
                "number":number
            }
            DeleteStudent(data).then(function(resp){
                if(resp.data.status==200)
                {
                    vm.$message.success("移除学生成功")

                }
                else{
                    vm.$message.error(resp.data.msg)
                }
            })
        },
        addStu()
        {
            let vm=this
            let data={
                "number":vm.stuNumber,
                "courseId":vm.courseId
            }
            AddStudent(data).then(function(resp){
                if(resp.data.status==200)
                {
                    vm.$message.success("添加成功")
                }
                else{
                    vm.$message.error(resp.data.msg)
                }
            })
        }
    }
}
</script>