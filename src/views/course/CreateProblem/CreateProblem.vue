<template>
    <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myclass'}">我的课程</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myclass/coursepage/'+courseId}">{{courseName}}</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myclass/coursepage/problemlist/'+courseId}">题库</el-breadcrumb-item>
    <el-breadcrumb-item>创建题目</el-breadcrumb-item>
    </el-breadcrumb>


    <div class="content-container">
    <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="16">
        <div >
          <el-card class="box-card">
            <div>
              <el-form label-width="80px">
                <el-form-item label="题干">
                  <el-input type="textarea" v-model="problemDescription.description" placeholder="请输入题干"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                  <el-select v-model="type" @change="handleChangeType">
                    <!-- 0表示选择，1表示判断 -->
                    <el-option label="选择题" value=0></el-option>
                    <el-option label="判断题" value=1></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="type == 0" label="选项">
                  <el-input v-model="problemDescription.A" placeholder="选项A"></el-input>
                  <el-input v-model="problemDescription.B" placeholder="选项B"></el-input>
                  <el-input v-model="problemDescription.C" placeholder="选项C"></el-input>
                  <el-input v-model="problemDescription.D" placeholder="选项D"></el-input>
                </el-form-item>

                <el-form-item label="答案">
                  <el-select v-model="answer">
                    <el-option v-if="type ==0" label="A" value="A"></el-option>
                    <el-option v-if="type ==0" label="B" value="B"></el-option>
                    <el-option v-if="type ==0" label="C" value="C"></el-option>
                    <el-option v-if="type ==0" label="D" value="D"></el-option>
                    <el-option v-if="type ==1" label="对" value="A"></el-option>
                    <el-option v-if="type ==1" label="错" value="B"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="章节">
                    <el-select v-model="chapter">
                      <el-option v-for="(chapter,index) in chapterList" :key="chapter.chapterNo" :label="getLabel(chapter)" :value="chapter.chapterNo"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="">
                  <el-button type="primary" @click="handleSubmit">提交</el-button>
                </el-form-item>
                
              </el-form>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {GetCoursePage} from '@/utils/api/CoursePageApi'
import {CreateProblem} from '@/utils/api/CreateProblemApi'
export default{
    data(){
        return{
            courseId:null,
            courseName:'',
            problemDescription:{
            description: '',
            A: '',
            B: '',
            C: '',
            D: '',
            },            
            type: null,
            answer: '',
            chapter:null,
            chapterList:[],
        };
    },
    created()
    {
        let vm=this
        vm.courseId=this.$route.params.id
        let data={
            "courseId":vm.courseId
        }
        GetCoursePage(data).then(function(resp){
            vm.courseName=resp.data.courseName
            vm.chapterList=resp.data.chapter
        });


    },
    methods: {
    handleChangeType() {
      if (this.type == 1) {
        this.problemDescription.A = '';
        this.problemDescription.B = '';
        this.problemDescription.C = '';
        this.problemDescription.D = '';
        this.answer='';
      }
    },
    handleSubmit() {
      // console.log('提交题目：', {
      //   question: this.problemDescription.description,
      //   type: this.type,
      //   optionA: this.problemDescription.A,
      //   optionB: this.problemDescription.B,
      //   optionC: this.problemDescription.C,
      //   optionD: this.problemDescription.D,
      //   answer: this.answer
        
      // });

      let vm=this
      let str_descri=JSON.stringify(vm.problemDescription)
      if(vm.type==1)
      {
        vm.problemDescription.A='对'
        vm.problemDescription.B='错'
      }
      let data={
        "problemDescription":str_descri,
        "courseId":vm.courseId,
        "problemType": vm.type,
        "ans":vm.answer,
        "chapter":vm.chapter
      }
      // console.log(data)
      CreateProblem(data).then(function(resp){
         if(resp.data.status==200)
         {
          vm.$message.success("创建题目成功，您创建的题目id为："+resp.data.problemId)
        }
        else
        {
          vm.$message.error(resp.data.message)
        }
      })
    },
    getLabel(chapter) {
      return `${chapter.chapterNo} - ${chapter.chapterName}`
    }
  }
}

</script>