<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>个人信息</el-breadcrumb-item>
  </el-breadcrumb>
  <div>
    <el-row :gutter="20" style="margin-top:10px;">

      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>个人信息</span>
            </div>
            <div>
              <el-form label-width="80px" v-model="dataFrom" size="small" label-position="right">
                <el-form-item label="用户名" prop="">
                  <el-input auto-complete="off" v-model="PerInfoForm.userName" :disabled="!isEditing"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="">
                  <el-input auto-complete="off" v-model="PerInfoForm.email" :disabled="!isEditing"></el-input>
                </el-form-item>

                <el-form-item label="电话号码" prop="">
                  <el-input maxlength="18" v-model="PerInfoForm.phone" :disabled="!isEditing"></el-input>
                </el-form-item>

                <el-form-item label="支付信息" prop="">
                  <el-input maxlength="18" v-model="PerInfoForm.payment_info" :disabled="!isEditing"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="toggleEditing">{{ isEditing ? '保存' : '编辑' }}</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>


import { GetUserInfo, UpdateUserInfo } from '@/utils/api/InfoApi'

export default {
  data() {
    return {
      isEditing: false,//1为保存，0为编辑
      PerInfoForm: {
        userName: '',
        email: '',
        phone: '',
        payment_info: ''
      }
    };
  },
  created() {
    let vm = this
    let data = {}
    try {
      GetUserInfo(data).then(function (resp) {
        console.log(resp)
        //console.log(vm.PerInfoForm.userName)
        vm.PerInfoForm.userName = resp.data.user_name;
        vm.email = resp.data.email;
        vm.PerInfoForm.info.phone = resp.data.phone;
        vm.PerInfoForm.info.payment_info = resp.data.payment_info;

      })
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    // levelText()
    // {
    //   return this.PerInfoForm.level ===1?'学生':(this.PerInfoForm.level ===2?'教师':'');
    // }
  },
  methods: {

    toggleEditing() {
      let vm = this
      if (this.isEditing) {
        let str_info = JSON.stringify(vm.PerInfoForm.info)
        let data = {
          "userName": vm.PerInfoForm.userName,
          "info": str_info,
        }
        UpdateUserInfo(data).then(function (resp) {
          console.log(data)
          console.log(vm.PerInfoForm.userName)
          console.log(str_info)
          console.log(resp)
          if (resp.data.status == 200) {
            console.log("修改成功")
            //添加提示修改成功信息
            vm.$message.success(resp.data.msg)
          }
          else {
            console.log("修改失败")
            vm.$message.error(resp.data.msg)
          }
        })

      }
      this.isEditing = !this.isEditing;
    }
  }
}
</script>

<style lang="scss" scoped>
//卡片样式

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}

//文本样式区
.name-role {
  font-size: 16px;
  padding: 5px;
  text-align: center;
}

.sender {
  text-align: center;
}

.registe-info {
  text-align: center;
  padding-top: 10px;
}

.personal-relation {
  font-size: 16px;
  padding: 0px 5px 15px;
  margin-right: 1px;
  width: 100%
}

.relation-item {
  padding: 12px;

}

.dialog-footer {
  padding-top: 10px;
  padding-left: 10%;
}

//布局样式区
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
