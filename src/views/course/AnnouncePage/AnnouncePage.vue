<template>
    <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct'}">我的竞拍</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct/coursepage/'+courseId}">{{courseName}}</el-breadcrumb-item>
    <el-breadcrumb-item>公告</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 发布公告 -->
    <el-button @click="ShowAnnouncement" v-if="level==2">{{ showAnnouncement ? '隐藏' : '发布公告' }}</el-button>
    <div v-if="level==2&&showAnnouncement" >
        <el-row :gutter="20" style="margin-top:10px;">

        <el-col :span="16">
        <el-card class="box-card">
            <template #header>
            <div class="card-header">
                <span>发布公告</span>
            </div>
            </template>
            <el-form label-width="80px">
                <el-form-item >
                  <el-input type="textarea" v-model="msg" placeholder="请输入公告内容"></el-input>
                </el-form-item>
                <el-form-item >
                  <el-button @click="sendAnnouncement">发布</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-col>

</el-row>

    </div>

    <!-- 公告列表 -->
    <ul>
   <li v-for="announcement in announcementList" :key="announcement.annId" class="no-bullet" >

      <el-row :gutter="20" style="margin-top:10px;">
        <el-card class="box-card">
          <div class="problem-info">
       <div class="text">
            <p>公告内容：{{ announcement.msg }}</p>
            <p>时间：{{ announcement.date }}</p>

       </div>
     </div>
        </el-card>
        
      </el-row>
      
     <!-- </router-link> -->
    

   </li>
 </ul>

</template>

<script>
import {GetCoursePage} from '@/utils/api/CoursePageApi'
import {getLevel,setLevel,removeLevel} from '@/store/level'
import {AnnouncementList,SendAnnouncement} from '@/utils/api/AnnounceApi'

export default{
    data(){
        return{
            showAnnouncement:false,
            courseId:null,
            courseName:'',
            level:null,
            msg:'',
            announcementList:[],
        };
    },
    created()
    {
        let vm=this
        vm.courseId=this.$route.params.id
        vm.level= getLevel()
        let data={
            "courseId":vm.courseId
        }
        GetCoursePage(data).then(function(resp){
            vm.courseName=resp.data.courseName
            
        });
        AnnouncementList(data).then(function(resp){
            if(resp.data.announcementList!==null)
            {
                vm.announcementList=resp.data.announcementList
            }
            
        })
    },
    methods:
    {
        ShowAnnouncement()
        {
            this.showAnnouncement=!this.showAnnouncement
        },
        sendAnnouncement()
        {
          let vm=this
          let data={
            "courseId":vm.courseId,
            "msg":vm.msg
          }
          SendAnnouncement(data).then(function(resp){
            if(resp.data.status==200)
            {
              vm.$message.success("发布公告成功")
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

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
.bg-purple {
    background: #d3dce6;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>