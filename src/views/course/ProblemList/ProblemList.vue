<template>
    <div>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/myproduct' }">我的课程</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/myproduct/coursepage/' + courseId }">{{ courseName }}</el-breadcrumb-item>
        <el-breadcrumb-item>题库</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" @click="CreateProblem" v-if="level==2">创建题目</el-button>
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
      </div>
      <div class="problem-list">
        <el-collapse v-model="expandedChapter">
          <el-collapse-item v-for="(problems, chapter) in classifiedProblemList" :title="'第' + chapter + '章'" :name="chapter" :key="chapter">
            <ul>
              <li v-for="problem in problems" :key="problem.id" >
                <el-row :gutter="20" class="problem-item">
                  <el-card class="easy-card">
                    <div class="card-content">
                    <div class="text">
                        <p>题目：{{JSON.parse(problem.problemDescription).description}}</p>
                        <p>题型：{{ problem.problemType==0?'选择':'判断' }}</p>
                       
                        
                    </div>
                    <div class="button">
                        <el-button type="success" @click="ProblemInfo(problem.problemId)"    >查看详情</el-button>
                        <el-button type="danger" @click="deleteProblem(problem.problemId) " v-if="level==2"   >删除</el-button>

                    </div>
                  </div>
                  </el-card>
                </el-row>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
    
    </div>
  </template>
  
  <script>
  import { GetCoursePage } from '@/utils/api/CoursePageApi';
  import { ProblemList,DeleteProblem,SearchProblem } from '@/utils/api/ProblemListApi';
  import {getLevel,setLevel,removeLevel} from '@/store/level'
  import { Search} from '@element-plus/icons-vue'
  export default {
    data() {
      return {
        level:null,
        courseId: null,
        courseName: '',
        problemList: [],
        keyWord:''

      };
    },
    created() {
      let vm = this;
      vm.level= getLevel()
      vm.courseId = this.$route.params.id;
      let data = { "courseId": vm.courseId };
      
      GetCoursePage(data).then(function (resp) {
        vm.courseName = resp.data.courseName;
      });
      
      ProblemList(data).then(function (resp) {
        vm.problemList = resp.data.problemList;
      });
    },
    computed: {
      classifiedProblemList() {
        const classified = {};
        this.problemList.forEach(problem => {
          if (!classified[problem.chapter]) {
            classified[problem.chapter] = [];
          }
          classified[problem.chapter].push(problem);
        });
        return classified;
      }
    },
    methods: {
        CreateProblem()
        {
            this.$router.push("/myproduct/coursepage/createproblem/"+this.courseId)
        },
        ProblemInfo(problemId)
        {
            this.$router.push('/myproduct/coursepage/'+this.courseId+'/problemlist/problem/'+problemId)
        },
        deleteProblem(problemId)
        {
          let vm=this
          let data={
            "problemId":problemId
          }
          DeleteProblem(data).then(function(resp){
            if(resp.data.status==200)
            {
                vm.$message.success('删除成功')
            }
            else
            {
                vm.$message.error(resp.data.msg);
            }
          })
        },
        search()
        {
          let vm=this
          let data={
            "keyWord":vm.keyWord,
            "courseId":vm.courseId
          }
          SearchProblem(data).then(function(resp){
            vm.problemList = resp.data.problemList;
          })
        }
        }
  }
  </script>
  
  <style scoped>
  .problem-list {
    max-width: 1500px;
    margin: 50px auto 0;
    border: 1px solid #bfd8d2;
    padding: 10px;
    background-color: #fff;
  }
  
  .problem-item {
    margin-top: 10px;
  }
  
  .easy-card {
    background-color: #eaffd0; /* 浅绿色 */
    width:80%;
    border-radius: 30px;
  }

  
  .box-card {
    width: 100%;
    padding: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .course-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
  </style>
  