<!--
<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="top">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="loginForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input type="password" v-model="loginForm.pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
-->

<template>
  <div class="mainbox">

<!-- 最外层的大盒子 -->
  <div class="box">
    <!-- 滑动盒子 -->
    <div class="pre-box" ref="prebox">
      <h1>WELCOME</h1>
      <p>JOIN US!</p>
      <div class="img-box">
        <img src="@/assets/logo.png" alt="">
      </div>
    </div>
    <!-- 注册盒子 -->
    <div class="register-form">
      <el-form ref="regForm" :model="regForm" :rules="regRules" label-position="left" label-width="100px">
      <!-- 标题盒子 -->
      <div class="title-box">
        <h1>注册</h1>
      </div>
      <!-- 输入框盒子 -->
      <div class="input-box">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="regForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="regForm.pwd" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="重复密码" prop="rpwd">
          <el-input type="password" v-model="regForm.rpwd" placeholder="请再次输入密码"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="regForm.phone" placeholder="可选"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="regForm.email" placeholder="可选"></el-input>
        </el-form-item>

        <el-form-item label="支付信息" prop="payment_info">
          <el-input v-model="regForm.payment_info" placeholder="可选"></el-input>
        </el-form-item>
        
        <p v-show="this.regForm.pwd !== this.regForm.rpwd" class="password_info" style="margin: 0;">密码不一致！</p>
      </div>
      <!-- 按钮盒子 -->
      <div class="btn-box">
          <el-button type="primary" @click="register">注册</el-button>
          <p @click="mySwitch">已有账号?去登录</p>
      </div>
        </el-form>
    </div>
    <!-- 登录盒子 -->
    <div class="login-form">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="top">
      <!-- 标题盒子 -->
      <div class="title-box">
        <h1>登录</h1>
      </div>
      <!-- 输入框盒子 -->
      <div class="input-box-login">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="loginForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="loginForm.pwd"></el-input>
        </el-form-item>
      </div>
      <!-- 按钮盒子 -->
      <div class="btn-box">
          <el-button type="primary" @click="login">登录</el-button>
        <!-- 绑定点击事件 -->
        <p @click="mySwitch">没有账号?去注册</p>
      </div>
      </el-form>
    </div>
  </div>
  </div>
</template>

<script>

import {ref} from 'vue';


import qs from "qs";
// import {login,register} from '@/utils/api/LoginAPI'
import {Login, Register} from '@/utils/api/UserApi'
import {setToken} from '@/store/token'
import {reactive} from "vue";
import {translate} from "element-plus";

// 这玩意只能在setup或生命周期钩子函数用
//import { getCurrentInstance } from 'vue';
//const { proxy } = getCurrentInstance();

export default {
  name: 'Login',
  data() {
    return {
      flag : 0,
      loginForm: {
        userName: null,
        pwd: ''
      },
      loginRules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在1到9个字符', trigger: 'blur'}
        ],
        pwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 1, max: 9, message: '长度在1到9个字符', trigger: 'blur'}
        ]
      },
      regForm:{
        userName: '',
        pwd: '',
        rpwd: '',
        phone: '',
        email: '',
        payment_info: ''
      },
      regRules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 9, message: '长度在1到9个字符', trigger: 'blur'}
        ],
        pwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 1, max: 9, message: '长度在1到9个字符', trigger: 'blur'}
        ],
        rpwd: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {min: 1, max: 9, message: '长度在1到9个字符', trigger: 'blur'}
        ]
        // phone、email、payment_info 不做必填和格式校验
      },
    };
  },



  methods: {
    mySwitch(){
      var that = this;
      var tflag = that.flag;
      console.log(tflag);
      if(tflag){
        that.$refs.prebox.style.transform = 'translateX(0%)';
      }
      else{
        that.$refs.prebox.style.transform = 'translateX(100%)';
      }
      that.flag=!tflag;
    },
    login() {
      this.$refs.loginForm.validate(valid => {
        var that = this;
        if (valid) {
          console.log(this.loginForm);
          // 登录逻辑，可以发送请求到后端进行验证

          /*this.$axios({
            method:'post',
            url:'user/login',
            data: {
              "userName":this.loginForm.userName,
              "pwd":this.loginForm.pwd
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
          }).then(function (resp) {
            console.log(resp)
            if(resp.data=="success"){
              console.log('真棒');
              that.$router.push("/Home")
            }else{
              that.$message.error('用户名或密码错误');
              return false;
            }
          })*/
          Login(
            this.loginForm.userName,
            this.loginForm.pwd
          ).then(function (resp) {
            console.log(resp)


            if (resp.data.status === 200) {
              console.log('真棒');
              setToken(resp.data.msg);
              that.$router.push("/homePage")
            } else {
              that.$message.error(resp.data.msg);
              return false;
            }
          });
        } else {
          console.log('表单验证失败');
        }
      });
    },
    register(){
        if(this.regForm.pwd!==this.regForm.rpwd)
        {

        }
        else
        {
          this.$refs.regForm.validate(valid => {
        var that = this;
        if (valid) {
          console.log(this.regForm);
          let data = {
            "user_name":this.regForm.userName,
            "password":this.regForm.pwd,
            "phone":this.regForm.phone,
            "email":this.regForm.email,
            "payment_info":this.regForm.payment_info
          }
          Register(
            this.regForm.userName,
            this.regForm.pwd,
            this.regForm.phone,
            this.regForm.email,
            this.regForm.payment_info
          ).then(function (resp) {
            console.log(resp)
            if (resp.data.status === 200) {
              console.log('注册成功');
              //提示注册成功
              that.$message.success('恭喜您注册成功！')
              that.mySwitch()
              that.$router.push("/loginPage")
            } else {
              that.$message.error(resp.data.msg);
              return false;
            }
          });
        } else {
          console.log('表单验证失败');
        }
      });
        }
        
      
      
    }
  }
};
</script>

<style  lang='scss' scoped>
@import "@/assets/css/login.css";
</style>
