<template>

    <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct'}">我的课程</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct/coursepage/'+courseId}">{{courseName}}</el-breadcrumb-item>
    <el-breadcrumb-item>上课</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 教师显示： -->
    <div v-if="level==2">

          <el-button @click="OffClass">下课</el-button>
          <el-button @click="toggleShowProblem">{{ showProblem ? '隐藏题目' : '添加题目' }}</el-button>
          <el-button @click="toggleShowStuSignin" >{{ showStuSignin ? '隐藏签到学生列表' : '查看签到学生列表' }}</el-button>
          <!-- 签到学生列表 -->
          <div v-if="showStuSignin">
            <div>
              <h3 style="margin-bottom: 20px;">签到学生</h3>
              <el-table :data="inList" style="width: 100%">
              <el-table-column prop="userName" label="学生名" width="360" />
              <el-table-column prop="number" label="学号" width="360" />
              </el-table>

            </div>
            <div>
              <h3 style="margin-bottom: 20px;">未签到学生</h3>
              <el-table :data="outList" style="width: 100%">
              <el-table-column prop="userName" label="学生名" width="360" />
              <el-table-column prop="number" label="学号" width="360" />
              </el-table>

            </div>
        
          </div>
          <!-- 题目列表 -->
          <div class="problem-list" v-if="showProblem">
              <el-collapse v-model="expandedChapter">
                <el-collapse-item v-for="(problems, chapter) in classifiedProblemList" :title="'第' + chapter + '章'" :name="chapter" :key="chapter">
                  <ul>
                    <li v-for="problem in problems" :key="problem.id" >
                      <el-row :gutter="20" class="problem-item">
                        <el-card class="easy-card">


                      <div class="flex-container">
                      <div class="text">
                        <p>题目：{{JSON.parse(problem.problemDescription).description}}</p>
                        <p>题型：{{ problem.problemType==0?'选择':'判断' }}</p>
                      </div>
                      <el-button type="primary" size="mini" @click="huanchong(problem.problemId)">添加至发送区</el-button>
                    </div>


                        </el-card>
                      </el-row>
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
          </div>
          <!-- 发送缓冲区 -->
          <div v-if="showHuanchong">
            <el-row :gutter="20" style="margin-top:10px;">

            <el-col :span="12" :offset="6">
              <div >
            <el-card >

              <el-form label-width="80px"  size="small" label-position="right">
                <el-form-item label="题目id" prop="to_problem_id">
                  <el-input  auto-complete="off"  v-model="to_problem_id" :disabled="!isEditing"></el-input>
                </el-form-item>
                <el-form-item label="时间(s)" >
                  <el-input  auto-complete="off"  v-model="time" :disabled="isEditing"></el-input>
                </el-form-item>
                <el-button :disabled="time == null" @click="fabu">发布题目</el-button>
              </el-form>

            </el-card>
              </div>
          </el-col>

            </el-row>
          </div>
          <!-- 倒计时加题目详情 -->
          <div  v-if="showTeachCount">
            <div class="content-container" >
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="16">
              <div class="grid-content bg-purple">
                <el-card class="box-card">
                  <el-row>
                    <el-col :span="12"> 
                      <el-countdown title="剩余答题时间" :value="timeValue" @finish="teachTimeFinish"/>
                    </el-col>
                    <el-col :span="12"> 
                      <el-statistic title="连续发布同一道题次数"  :value="problemTimes" />
                    </el-col>
                  </el-row>
                  
                  
                  <div v-if="showStatic">

                    <!-- <el-row>
                    <el-col :span="6">
                      <label for="input1">{{tableData.problemType==0?'A选项人数':'选择对选项人数'}}</label>
                      <el-input v-model="tableData.numA" :readonly="true" id="input1" :disabled="true"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <label for="input2">{{tableData.problemType==0?'B选项人数':'选择错选项人数'}}</label>
                      <el-input v-model="tableData.numB" :readonly="true" id="input2" :disabled="true"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <label for="input3" v-if="tableData.problemType==0">C选项人数</label>
                      <el-input v-model="tableData.numC" :readonly="true" id="input3" :disabled="true" v-if="tableData.problemType==0"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <label for="input4" v-if="tableData.problemType==0">D选项人数</label>
                      <el-input v-model="tableData.numD" :readonly="true" id="input4" :disabled="true" v-if="tableData.problemType==0"></el-input>
                    </el-col>
                  </el-row> -->

                  <el-form label-width="80px">
                      <el-form-item label="正确答案" >
                        <el-input  v-model="tableData.rightAns"  :disabled="true"></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="正确率" >
                        <el-input  v-model="tableData.rightRatio"  :disabled="true"></el-input>
                      </el-form-item> -->
                      <el-button @click="rePost">再次发送</el-button>
                      <el-button @click="publishAns">公布答案</el-button>
                  </el-form>

                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
            </div>
            <div v-show="showStatic">

              <div class="chart-container" v-show="showStatic">
                <div ref="chart" class="chart"></div>
                <p>正确率: {{ accuracy }}%</p>
            </div>
            </div>

          </div>

    </div>

    <!-- 学生显示 -->
    <div v-if="level==1">
      <h1>学生界面</h1>
        <div class="content-container" >
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="16">
              <div class="grid-content bg-purple">
                <el-card class="box-card">

                  <!-- 卡片内容 -->

                  <!-- 答题内容 -->
                  <div v-if="showstu">
                    <el-form label-width="80px">
                      <el-form-item label="题干" >
                        <el-input type="textarea" v-model="problem.description" placeholder="请输入题干" :disabled="true"></el-input>
                      </el-form-item>

                      <el-form-item label="类型" >
                          <el-input v-model="problem.problemType" :disabled="true"></el-input>
                      </el-form-item>



                      <el-form-item label="章节">
                          <el-input v-model="problem.chapter" :disabled="true"></el-input>
                      </el-form-item>
                      <el-radio-group v-model="ans" >
                        <div v-if="problem.problemType == '选择'">
                          <el-radio label="A">A:{{ problem.optionA }}</el-radio>
                          <el-radio label="B">B:{{ problem.optionB }}</el-radio>
                          <el-radio label="C">C:{{ problem.optionC }}</el-radio>
                          <el-radio label="D">D:{{ problem.optionD }}</el-radio>
                        </div>
                        <div v-if="problem.problemType == '判断'">
                          <el-radio label="A">正确</el-radio>
                          <el-radio label="B">错误</el-radio>
                        </div>

                      </el-radio-group>
                      <!-- <el-form-item label="答案">
                      <el-input v-model="ans" v-if="showAnswer" :disabled="true"></el-input>
                      <el-button @click="toggleShowAnswer">{{ showAnswer ? '隐藏答案' : '显示答案' }}</el-button>
                      </el-form-item> -->
                      <el-form-item label="题目理解" >
                        <el-input type="textarea" v-model="problem.comment" placeholder="请输入你对题目的理解（必填）" ></el-input>
                      </el-form-item>

                      <el-button type="primary" :disabled="problem.comment==''||ans==''" @click="AnswerProblem" >提交答案</el-button>
                      <!-- 倒计时 -->

                      <el-row>
                    <el-col :span="12"> 
                      <el-countdown title="剩余答题时间" :value="timeValue" @finish="timeFinish"/>
                    </el-col>
                    <el-col :span="12"> 
                      <el-statistic title="连续收到同一道题次数"  :value="problemTimes" />
                    </el-col>
                  </el-row>
                      


                      
                    </el-form>
                  </div>
                  <!-- 查看其他同学答题情况内容 -->
                  <div v-if="showcomment">
                    <h1>这里是答题情况</h1>
                    <el-form-item label="获取到的题目理解" >
                        <el-input type="textarea" v-model="problem.otherComment"  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="获取到的作答" >
                        <el-input  v-model="problem.otherAns"  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="正确答案" >
                        <el-input  v-model="publishedAnswer"  :disabled="true" placeholder="教师尚未公布答案"></el-input>
                    </el-form-item>
                  </div>

                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
    </div>
    

  
</template>

<script>
import {GetCoursePage} from '@/utils/api/CoursePageApi';
import { ProblemList } from '@/utils/api/ProblemListApi';
import {postProblem,GetProblem,answerProblem,GetCommunication,GetAllAnswer,offClass,PublishAnswer,GetStuSignin} from '@/utils/api/InCourseApi';
import {getLevel,setLevel,removeLevel} from '@/store/level'
import * as echarts from 'echarts';
export default{
    data(){
        return{

            problemTimes:1,
            pid:'',
            level:null,  
            showstu:false,
            showcomment:false,

            showProblem:false,
            showHuanchong:false,
            showStuSignin:false,

          // 教师倒计时和题目作答详情显示控制
            showTeachCount:false,
            showStatic:false,

            time:null,
            timeValue:null,

            tableData:
            {
              numA:null,
              numB:null,
              numC:null,
              numD:null,
              problemType:null,
              rightAns:'',
              rightRatio:0,
            },
            


            courseId:null,
            courseName:'',
            problemList: [],

            to_problem_id:null,
            problem:{
              problemId:null,
              description:'',
              optionA:'',
              optionB:'',
              optionC:'',
              optionD:'',
              problemType:'',
              chapter:'',
              courseName:'',
              comment:'',
              otherComment:'',
              otherAns:'',
            },
            ans:'',
            publishedAnswer:'',
            // 学生签到
            inList:[],
            outList:[]
        };
    },
    created()
    { 
        
        let vm=this
        vm.level=getLevel()
        vm.courseId=this.$route.params.id
        let data={
            "courseId":vm.courseId
        }
        GetCoursePage(data).then(function(resp){
            vm.courseName=resp.data.courseName
        });

        if(vm.level==2)
        {
          ProblemList(data).then(function (resp) {
        vm.problemList = resp.data.problemList;
            });
        }
        else
        {
          this.requestProblem()
        }
        

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
      },
      accuracy() {
        console.log(this.tableData.problemType)
      if(this.tableData.problemType==0)
      {
        const total = this.tableData.numA + this.tableData.numB + this.tableData.numC + this.tableData.numD;
        console.log("选择总数："+total)
     const correct = this.tableData.rightAns=='A'?this.tableData.numA:(this.tableData.rightAns=='B'?this.tableData.numB:(this.tableData.rightAns=='C'?this.tableData.numC:this.tableData.numD))
      
      return ((correct / total) * 100).toFixed(2);
      }
      else
      {
        const total = this.tableData.numA + this.tableData.numB ;
        const correct = this.tableData.rightAns=='对'?this.tableData.numA:this.tableData.numB;
        return ((correct / total) * 100).toFixed(2);
      }
    }
    },
    methods: {
                OffClass(){
                  let vm=this
                  let data={
                    "courseId":vm.courseId
                  }
                  offClass(data).then(function(resp){
                    if(resp.data.status==200)
                    {
                      vm.$message.success('已下课')
                      vm.$router.push('/myproduct/coursepage/'+vm.courseId)
                    }
                    else{
                      vm.$message.error(resp.data.message)
                    }
                  })
                },
          toggleShowProblem() {
              this.showProblem = !this.showProblem;
              this.showTeachCount=false
            this.showStatic=false
            },
            toggleShowStuSignin(){
              this.showStuSignin=!this.showStuSignin
              let vm=this
              let data={
                "courseId":vm.courseId
              }
              GetStuSignin(data).then(function(resp){
                vm.inList=resp.data.inList
                vm.outList=resp.data.outList
              })
            },
            huanchong(problemId){
                this.showProblem = false
                this.showHuanchong=true
                if(this.to_problem_id!==problemId)
                {
                  this.problemTimes=1
                }
                this.to_problem_id=problemId
                
                
            },
            fabu(){
                let vm=this
                
                let data={
                    'courseId':vm.courseId,
                    'problemId':vm.to_problem_id,
                    'tim':vm.time
                }
                postProblem(data).then(function(resp){
                    if(resp.data.status == 200)
                    {
                        vm.$message.success('发布题目成功')
                        vm.showHuanchong=false
                        vm.showTeachCount=true
                        vm.timeValue=Date.now() +vm.time*1000
                    }
                    else
                    {
                        vm.$message.error(resp.data.msg)
                    }
                })
            },

            requestProblem(){
              let vm=this
              let data={
                "courseId":vm.courseId
              }
              GetProblem(data).then(function(resp){
                if(resp.data.status==200){
                  if(resp.data.ans==''){
                    vm.publishedAnswer='';
                  }
                  if(resp.data.pid==vm.pid)
                  {
                    if(resp.data.ans!==''){
                      if(resp.data.problemType==0)
                      {
                        vm.publishedAnswer=resp.data.ans
                      }
                      else {
                        vm.publishedAnswer=resp.data.ans=='A'?'对':'错'
                      }
                    }

                    //console.log(vm.publishedAnswer)
                    setTimeout(vm.requestProblem, 1000);
                  }
                  else{
                  vm.ans=''
                  vm.problem.comment=''
                  vm.showcomment=false
                  vm.pid=resp.data.pid
                  vm.showstu=true
                  vm.$message.success('老师已发布题目，请在规定时间内完成')
                  vm.problem.description=JSON.parse(resp.data.problemDescription).description
                  vm.problem.optionA=JSON.parse(resp.data.problemDescription).A
                  vm.problem.optionB=JSON.parse(resp.data.problemDescription).B
                  vm.problem.optionC=JSON.parse(resp.data.problemDescription).C
                  vm.problem.optionD=JSON.parse(resp.data.problemDescription).D
                  vm.problem.problemType=resp.data.problemType==0?'选择':'判断'
                  vm.problem.chapter=resp.data.chapter
                    if(resp.data.problemType==0)
                    {
                      vm.publishedAnswer=resp.data.ans
                    }
                  else {
                      vm.publishedAnswer=resp.data.ans=='A'?'对':'错'
                    }
                  if(vm.problem.problemId==resp.data.problemId)
                  {
                    vm.problemTimes=vm.problemTimes+1
                  }
                  else{
                    vm.problemTimes=1
                  }
                  vm.problem.problemId=resp.data.problemId
                  vm.time=resp.data.tim
                  vm.timeValue=Date.now() +vm.time*1000
                  }
                  
                }
                else{
                  setTimeout(vm.requestProblem, 1000);
                }
              })
            },
            AnswerProblem()
            {
              let vm=this
              let data={
                "problemId":vm.problem.problemId,
                "courseId":vm.courseId,
                "situation":vm.ans,
                "comment":vm.problem.comment
              }
              answerProblem(data).then(function(resp){
                if(resp.data.status==200)
                {
                  vm.$message.success('答题成功')
                }
                else{
                  vm.$message.error(resp.data.message);
                }
              })
            },
            timeFinish()
            {
              let vm=this
              this.$message.success('答题结束！')
              this.showcomment=true
              let data={
                "problemId":vm.problem.problemId
              }
              GetCommunication(data).then(function(resp){

                vm.problem.otherComment=resp.data.comment

                if(vm.problem.problemType=='选择')
                {
                  vm.problem.otherAns=resp.data.situation
                }
                else{
                  vm.problem.otherAns=resp.data.situation=='A'?'对':(resp.data.situation=='B'?'错':'')
                }
              })
              this.requestProblem()
            },
          teachTimeFinish()
          {
            let vm=this
            let data={
              "courseId":vm.courseId
            }
            GetAllAnswer(data).then(function(resp){
              vm.tableData.numA=resp.data.A
              vm.tableData.numB=resp.data.B
              vm.tableData.numC=resp.data.C
              vm.tableData.numD=resp.data.D
              vm.tableData.problemType=resp.data.problemType
              vm.tableData.rightAns=resp.data.ans

              if(resp.data.problemType==0)
                {
                  vm.tableData.rightAns=resp.data.ans
                }
                else{
                  vm.tableData.rightAns=resp.data.ans=='A'?'对':(resp.data.ans=='B'?'错':'')
                }
                if(vm.tableData.problemType==0)
                {
                  if(vm.tableData.rightAns=='A')
                    {
                      vm.tableData.rightRatio=vm.tableData.numA/(vm.tableData.numA+vm.tableData.numB+vm.tableData.numC+vm.tableData.numD)
                    }
                    if(vm.tableData.rightAns=='B')
                    {
                      vm.tableData.rightRatio=vm.tableData.numB/(vm.tableData.numA+vm.tableData.numB+vm.tableData.numC+vm.tableData.numD)
                    }
                    if(vm.tableData.rightAns=='C')
                    {
                      vm.tableData.rightRatio=vm.tableData.numC/(vm.tableData.numA+vm.tableData.numB+vm.tableData.numC+vm.tableData.numD)
                    }
                    if(vm.tableData.rightAns=='D')
                    {
                      vm.tableData.rightRatio=vm.tableData.numD/(vm.tableData.numA+vm.tableData.numB+vm.tableData.numC+vm.tableData.numD)
                    }
                }
                else
                {
                  if(vm.tableData.rightAns=='对')
                    {
                      vm.tableData.rightRatio=vm.tableData.numA/(vm.tableData.numA+vm.tableData.numB)
                    }
                    if(vm.tableData.rightAns=='错')
                    {
                      vm.tableData.rightRatio=vm.tableData.numB/(vm.tableData.numA+vm.tableData.numB)
                    }
                }
              vm.showStatic=true
              vm.renderChart();
            })
          },
          rePost()
          {
            this.fabu()
            this.problemTimes=this.problemTimes+1
          } ,
          renderChart() {
                    const chartDom = this.$refs.chart;
                    if (chartDom) {
                      const myChart = echarts.init(chartDom);

                      let data = [{ name: 'A', value: this.tableData.numA },
                      { name: 'B', value: this.tableData.numB },
                      { name: 'C', value: this.tableData.numC },
                      { name: 'D', value: this.tableData.numD }];
                      console.log(this.problemType)
                  if (this.tableData.problemType===0) {
                    data = [{ name: 'A', value: this.tableData.numA },
                      { name: 'B', value: this.tableData.numB },
                      { name: 'C', value: this.tableData.numC },
                      { name: 'D', value: this.tableData.numD }];
                    console.log("我在这里：选择")
                  }
                  else if(this.tableData.problemType===1){
                    console.log("我在这里：判断")
                    data = [
                      { name: '对', value: this.tableData.numA },
                      { name: '错', value: this.tableData.numB }
                    ];
                  }

                      const option = {
                        title: {
                          text: '答题统计'
                        },
                        series: [{
                          type: 'pie',
                          radius: '50%',
                          data: data,

                          emphasis: {
                            label: {
                              show: true,
                              formatter: '{b}: {c} ({d}%)',
                              textStyle: {
                                fontSize: '14',
                                fontWeight: 'bold'
                              }
                            }
                          }
                        }]
                      };

                      myChart.setOption(option);

                      // 添加饼状图的事件监听器
                      myChart.on('mouseover', function(params) {
                        let dataIndex = params.dataIndex;
                        let tooltipText = option.series[0].data[dataIndex].name + ': ' + option.series[0].data[dataIndex].value;
                        myChart.dispatchAction({
                          type: 'showTip',
                          seriesIndex: 0,
                          dataIndex: dataIndex,
                          position: ['50%', '50%'],
                          tooltip: {
                            formatter: tooltipText
                          }
                        });
                      });

                      myChart.on('mouseout', function(params) {
                        myChart.dispatchAction({
                          type: 'hideTip'
                        });
                      });
                    } else {
                      console.error('无法找到图表的 DOM 元素');
                    }
                  },
                  publishAns()
                  {
                    let vm=this
                    let data={
                      "courseId":vm.courseId
                    }
                    PublishAnswer(data).then(function(resp){
                      if(resp.data.status==200)
                      {
                        vm.$message.success("答案公布成功")
                      }
                      else
                      {
                        vm.$message.error(resp.data.msg)
                      }
                    })
                    
                  }
        }
        
}
</script>

<style scoped>
.problem-list {
  max-width: 50%;
  margin: 50px auto 0;
  border: 1px solid #bfd8d2;
  padding: 10px;
  background-color: #fff;
  /* float:left */
}

.problem-item {
  margin-top: 10px;
}

.easy-card {
    background-color: #eaffd0; /* 浅绿色 */
    width:80%;
  }


.box-card {
  width: 100%;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.flex-container {
  display: flex;
  justify-content: space-between;
}
.chart-container {
  width: 300px;
  height: 300px;

}

.chart {
  position: relative;
  left:50px;
  width: 500px;
  height: 500px;


}

</style>