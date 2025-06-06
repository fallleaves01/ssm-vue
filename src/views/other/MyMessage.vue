<template>
      <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item >我的消息</el-breadcrumb-item>
</el-breadcrumb>
    <div>
        <div class="announcement-list">
        <el-collapse v-model="expandedChapter">
          <el-collapse-item v-for="(announcements, courseName) in classifiedAnnouncement" :title="courseName" :name="courseName" :key="courseName">
            <ul>
              <li v-for="announcement in announcements" :key="announcement.annId" >
                <el-row :gutter="20" class="problem-item">
                  <el-card class="easy-card">
                    <div class="card-content">
                    <div class="text">
                        <p>公告内容：{{ announcement.msg }}</p>
                        <p>时间{{ announcement.date }}</p>
                       
                        
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
import {GetAllAnnouncement} from '@/utils/api/MyMessageApi'
export default{
    data(){
        return{
            announcementList:[],
        };
    },
    created()
    {
        let vm=this
        let data={}
        GetAllAnnouncement(data).then(function(resp){
            vm.announcementList=resp.data.announcementList
        })
    },
    computed: {
      classifiedAnnouncement() {
        const classified = {};
        this.announcementList.forEach(announcement => {
          if (!classified[announcement.courseName]) {
            classified[announcement.courseName] = [];
          }
          classified[announcement.courseName].push(announcement);
        });
        return classified;
      }
    },
    
}
</script>
  
<style scoped>
.announcement-list {
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
