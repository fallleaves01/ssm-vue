<template>

    <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct'}" >我的课程</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct/coursepage/'+courseId}" v-if="$route.params.courseId>0">{{courseName}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/myproduct/coursepage/problemlist/'+courseId}" >题库</el-breadcrumb-item>
    <el-breadcrumb-item>问题详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>题目详情</h1>
    
    <div class="content-container">
    <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="16">
        <div >
          <el-card class="box-card">
            <div>
              <el-form label-width="80px">
                <el-form-item label="题干" >
                  <el-input type="textarea" v-model="problemDescription.description" placeholder="请输入题干" :disabled="!showEdit"></el-input>
                </el-form-item>


                <el-form-item label="类型">
                  <el-select v-model="problemType" @change="handleChangeType" :disabled="!showEdit">
                    <!-- 0表示选择，1表示判断 -->
                    <el-option label="选择" value='选择'></el-option>
                    <el-option label="判断" value='判断'></el-option>
                    <!-- 注意发出去的时候要将字符串转回01 -->
                  </el-select>
                </el-form-item>

                <el-form-item v-if="problemType == '选择'" label="A">
                  <el-input v-model="problemDescription.A" placeholder="选项A" :disabled="!showEdit"></el-input>
                </el-form-item>

                <el-form-item v-if="problemType == '选择'" label="B">
                <el-input v-model="problemDescription.B" placeholder="选项B" :disabled="!showEdit"></el-input>
                </el-form-item>

                <el-form-item v-if="problemType == '选择'" label="C">
                <el-input v-model="problemDescription.C" placeholder="选项C" :disabled="!showEdit"></el-input>
                </el-form-item>

                <el-form-item v-if="problemType == '选择'" label="D">
                <el-input v-model="problemDescription.D" placeholder="选项D" :disabled="!showEdit"></el-input>
                </el-form-item>



                <el-form-item label="课程">
                    <el-input v-model="courseName" :disabled="true"></el-input>
                </el-form-item>

                <!-- <el-form-item label="章节">
                    <el-input v-model="chapter" :disabled="true"></el-input>
                </el-form-item> -->

                <el-form-item label="章节">
                    <el-select v-model="chapter" :disabled="!showEdit">
                      <el-option v-for="(chapter,index) in chapterList" :key="chapter.chapterNo" :label="getLabel(chapter)" :value="chapter.chapterNo"></el-option>
                    </el-select>
                </el-form-item>

                <div v-if="showAnswer">
                <el-form-item label="答案">
                <el-input v-model="ans"  :disabled="!showEdit"></el-input>
                </el-form-item>
                <!-- <div class="chart-container">
                  <div ref="chart" class="chart"></div>
                  <p>正确率: {{ accuracy }}%</p>
                </div> -->
                
                </div>
                
                <el-button @click="toggleShowAnswer">{{ showAnswer ? '隐藏答案' : '显示答案' }}</el-button>
                <el-button @click="toggleShowStatic">{{ showStatic ? '隐藏统计信息' : '查看统计信息' }}</el-button>
                <el-button @click="toggleShowEdit" v-if="level==2">{{ showEdit ? '提交' : '编辑' }}</el-button>


                
              </el-form>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
    <div class="chart-container" v-show="showStatic">
        <div ref="chart" class="chart"></div>
        <p>正确率: {{ accuracy }}%</p>
    </div>

</template>


<script>
import {GetCoursePage} from '@/utils/api/CoursePageApi';
import {ProblemInfo,ChangeProblem} from '@/utils/api/ProblemInfoApi';
import {getLevel,setLevel,removeLevel} from '@/store/level'
import * as echarts from 'echarts';
export default{

    data(){
        return{
            courseId:null,
            problemId:null,
            courseName:'',
            level:null,
            
            problemDescription:{
            description:'',
            A:'',
            B:'',
            C:'',
            D:'',
            },
            
            numA:1,
            numB:1,
            numC:1,
            numD:1,
            numT:null,
            numF:null,
            problemType:'',
            chapter:null,
            ans:'',

            showAnswer:false,
            showStatic:false,
            showEdit:false,
            chapterList:[],
        };
    },
    computed: {
    accuracy() {
      if(this.problemType=='选择')
      {
        const total = this.numA + this.numB + this.numC + this.numD;
     const correct = this.ans=='A'?this.numA:(this.ans=='B'?this.numB:(this.ans=='C'?this.numC:this.numD))
      
      return ((correct / total) * 100).toFixed(2);
      }
      else
      {
        const total = this.numT + this.numF ;
        const correct = this.ans=='对'?this.numT:this.numF;
        return ((correct / total) * 100).toFixed(2);
      }
    }
    },
    mounted() {
    this.renderChart();
  },
 
    created()
    {

        console.log(this.$route.params)
      
        let vm=this

        vm.level=getLevel()
        vm.problemId=this.$route.params.problemId
        vm.courseId=this.$route.params.courseId
        let data={
            "courseId":vm.courseId
        }
        GetCoursePage(data).then(function(resp){
            vm.courseName=resp.data.courseName
            vm.chapterList=resp.data.chapter
        });
        let data1={
            'problemId':vm.problemId
        }
        ProblemInfo(data1).then(function(resp){
            
            // {vm.description,vm.optionA,vm.optionB,optionC,optionD} = JSON.parse(resp.data.problemDescription)
            vm.problemDescription.description=JSON.parse(resp.data.problemDescription).description
            vm.problemDescription.A=JSON.parse(resp.data.problemDescription).A
            vm.problemDescription.B=JSON.parse(resp.data.problemDescription).B
            vm.problemDescription.C=JSON.parse(resp.data.problemDescription).C
            vm.problemDescription.D=JSON.parse(resp.data.problemDescription).D
            vm.numA=resp.data.A
            vm.numB=resp.data.B
            vm.numC=resp.data.C
            vm.numD=resp.data.D
            vm.numT=resp.data.A
            vm.numF=resp.data.B

            vm.problemType=resp.data.problemType==0?'选择':'判断'
            vm.chapter=resp.data.chapter
            if(resp.data.problemType==0)
            {
              vm.ans=resp.data.ans
            }
            else{
              vm.ans=resp.data.ans=='A'?'对':(resp.data.ans=='B'?'错':'')
            }
            
            
        })
        
        


    },
    methods:{
    toggleShowAnswer() {
      this.showAnswer = !this.showAnswer;

    },
    toggleShowStatic() {
      this.showStatic = !this.showStatic;
      this.renderChart();
    },
    toggleShowEdit(){
      
      let vm=this
      if(vm.showEdit)
      {
        
      let type=vm.problemType=='选择'?0:1
      let str_descri=JSON.stringify(vm.problemDescription)


      let data={
        'problemId':vm.problemId,
        'problemDescription':str_descri,
        'chapter':vm.chapter,
        'problemType':type,
        'ans':vm.ans
      }
      ChangeProblem(data).then(function(resp){
        if(resp.data.status==200)
        {
          vm.$message.success("题目修改成功")
        }
        else{
          vm.$message.error(resp.data.msg)
        }
      })
        
      }
      this.showEdit=!this.showEdit
    },
    renderChart() {
  const chartDom = this.$refs.chart;
  if (chartDom) {
    const myChart = echarts.init(chartDom);

    let data = [{ name: 'A', value: this.numA },
     { name: 'B', value: this.numB },
     { name: 'C', value: this.numC },
     { name: 'D', value: this.numD }];
    console.log(this.problemType)
 if (this.problemType==='选择') {
   data = [{ name: 'A', value: this.numA },
     { name: 'B', value: this.numB },
     { name: 'C', value: this.numC },
     { name: 'D', value: this.numD }];
  console.log("我在这里：选择")
}
 else if(this.problemType==='判断'){
  console.log("我在这里：判断")
  data = [
    { name: '对', value: this.numT },
    { name: '错', value: this.numF }
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
getLabel(chapter) {
      return `${chapter.chapterNo} - ${chapter.chapterName}`
    }

    }
}

</script>
<style>
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