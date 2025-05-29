<template>
  <div class="common-layout" >
    <el-container class="home-container" >
      <el-header class="custom-header">
        <div class="title">
          <span>同伴教学平台</span>
        </div>

        <div class="user-info">
          <span>{{userName}}({{number}})</span>
          <el-button class="logout-button" @click="logout">退出登录</el-button>
        </div>

        
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <!-- 侧边栏菜单区 -->


        <el-menu active-text-color="#409eef" background-color="#bfd8d2" text-color="#fff" :router="true">
            
        <el-menu-item index="/myclass">
          <el-icon><UserFilled /></el-icon>
          <span>我的课程</span>       
        </el-menu-item>
        <el-menu-item index="/joinclass" v-show="showJoin">
          <el-icon><UserFilled /></el-icon>
          <span>加入课程</span>       
        </el-menu-item>
        <el-menu-item index="/allclass">
          <el-icon><Files /></el-icon>
          <span>全部课程</span>
        </el-menu-item>
        <el-menu-item index="/createclass" v-show="showCreate">
          <el-icon><Files /></el-icon>
          <span>创建课程</span>
        </el-menu-item>
        <el-menu-item index="/mymessage" >
          <el-icon><Position /></el-icon>
          <span>我的消息</span>
        </el-menu-item>
        
        
        
        <el-menu-item index="/perinfo" >
          <el-icon><document /></el-icon>
          <span>个人信息</span>
        </el-menu-item>

        <el-menu-item index="/Myquestions" >
          <el-icon :size="20" color="hotpink">
            <Edit />
          </el-icon>
          <span>个人题目列表</span>
        </el-menu-item>

        
        

        </el-menu>


        </el-aside>
        <!-- 内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Edit } from '@element-plus/icons'
import {removeToken} from '@/store/token';
import {getLevel,setLevel,removeLevel} from '@/store/level'
import {getNumber,setNumber,removeNumber} from '@/store/number'
import {GetInfo} from '@/utils/api/InfoApi'
export default{
  data(){
    return{
      showJoin:null,
      showCreate:null,
      userName:'',
      number:null,
    };

  },
  created(){

    let vm=this
    let level=getLevel()
    let number=getNumber()

      let data={}
      GetInfo(data).then(function(resp){
        level=resp.data.level;
        number=resp.data.number;
        setLevel(level);
        setNumber(number);
        vm.showJoin= ((resp.data.level==1)?true:false)
      vm.showCreate= resp.data.level==1 ?false:true
        vm.userName=resp.data.user_name
        vm.number=resp.data.number
      })
      
    
    vm.showJoin= ((level==1)?true:false)
    vm.showCreate= level==1 ?false:true

    
    
    
    
  },

  methods:{
    logout()
    {
      removeToken();
      removeLevel();
      removeNumber();
      this.$router.push("/loginPage");
    }

  }
}
</script>
<style>
.home-container {
  height: 100vh;
}

.el-header {
  background-color: #5c73c4; /* 修改背景颜色为深蓝色 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 30px;
  border-radius: 0 0 15px 15px; /* 添加底部圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  /* > div {
    display: flex;
    align-items: center;
  } */
  span {
    margin-left: 20px; /* 减小左边距 */
  }
}



.el-aside {
  background-color: #bfd8d2; /* 修改侧边栏背景颜色为蓝色 */
  border-radius: 10px 0 0 10px; /* 添加左侧圆角 */
}

.el-main {
  background-color: #f5f5f5; /* 修改内容主体背景颜色为浅灰色 */
  border-radius: 0 10px 10px 0; /* 添加右侧圆角 */
  padding: 20px; /* 增加内边距 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 添加轻微阴影效果 */
}

.userinfo{
  float:right;

}
.custom-header {
  background-color: #5c73c4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 22px; /* 根据需要调整字体大小 */
  padding: 0 20px; /* 调整内边距 */
  border-radius: 0 0 15px 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.title {
  margin-left: 15px;
  font-size: 30px;
}

.user-info {
  margin-right: 20px;
  font-size: 20px;
}

.logout-button {
  font-size: 14px; /* 根据需要调整字体大小 */
}
</style>