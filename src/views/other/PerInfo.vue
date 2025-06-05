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
              <el-form ref="perInfoForm" label-width="80px" :model="PerInfoForm" size="small" label-position="right"
                :rules="perInfoRules">
                <el-form-item label="用户名" prop="userName">
                  <el-input auto-complete="off" v-model="PerInfoForm.userName" :disabled=true></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                  <el-input auto-complete="off" v-model="PerInfoForm.email" :disabled="!isEditing"></el-input>
                </el-form-item>

                <el-form-item label="电话号码" prop="phone">
                  <el-input maxlength="18" v-model="PerInfoForm.phone" :disabled="!isEditing"></el-input>
                </el-form-item>

                <el-form-item label="支付信息" prop="payment_info">
                  <el-input v-model="PerInfoForm.payment_info" :disabled="!isEditing"></el-input>
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


import { GetUserInfo, UpdateUserInfo } from '@/utils/api/UserApi'

export default {
  data() {
    return {
      isEditing: false,//1为保存，0为编辑
      PerInfoForm: {
        userName: '',
        email: '',
        phone: '',
        payment_info: ''
      },
      perInfoRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入合法的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: ['blur', 'change'] },
          { pattern: /^[\d+\-\s()]*$/, message: '请输入合法的电话号码', trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  created() {
    let vm = this
    let data = {}
    try {
      GetUserInfo().then(function (resp) {
        console.log(resp)
        //console.log(vm.PerInfoForm.userName)
        vm.PerInfoForm.userName = resp.data.user_name;
        vm.PerInfoForm.email = resp.data.email;
        vm.PerInfoForm.phone = resp.data.phone;
        vm.PerInfoForm.payment_info = resp.data.payment_info;

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
        this.$refs.perInfoForm.validate(valid => {
          if (!valid) {
            this.$message.error('请检查输入项是否正确');
            return;
          }
          UpdateUserInfo(
            vm.PerInfoForm.userName,
            null,
            vm.PerInfoForm.phone,
            vm.PerInfoForm.email,
            vm.PerInfoForm.payment_info
          ).then(function (resp) {
            let equal_tag = resp.data["user_name"] === vm.PerInfoForm.userName &&
              resp.data["email"] === vm.PerInfoForm.email &&
              resp.data["phone"] === vm.PerInfoForm.phone &&
              resp.data["payment_info"] === vm.PerInfoForm.payment_info;
            if (equal_tag) {
              vm.$message.success("修改成功")
            } else {
              vm.$message.error("修改失败")
              vm.PerInfoForm = {
                userName: resp.data.user_name,
                email: resp.data.email,
                phone: resp.data.phone,
                payment_info: resp.data.payment_info
              }
            }
          })
        });
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
