<template>
    <!-- 面包屑导航区 -->
<el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>加入竞拍</el-breadcrumb-item>
</el-breadcrumb>


<div>
      <el-row :gutter="20" style="margin-top:10px;">

    <el-col :span="16">
        <div >
       <el-card class="box-card">

        <div>
        <el-form label-width="80px" v-model="courseForm" size="small" label-position="right">
          <el-form-item label="商品id" prop="">
            <el-input  auto-complete="off" v-model="courseForm.courseId" ></el-input>
          </el-form-item>

          
        </el-form>
          <div slot="footer" class="dialog-footer">
             <el-button type="primary" @click="buyproduct">加入竞拍</el-button> 
        </div>
        </div>
      </el-card>
        </div>
    </el-col>

      </el-row>
    </div>
</template>

<script>

import {buyProduct} from '@/utils/api/JoinClassApi'
export default{
    data(){
        return{
            courseForm:{
                courseId:null,
            }
        };
    },
    methods:{
        buyproduct()
        {
            var that = this;
            let data = {
                "courseId": that.courseForm.courseId
            }
            buyProduct(data).then(function(resp){
                    console.log(resp)
                    if(resp.data.status === 200)
                    {
                        that.$message.success(resp.data.msg)
                    }
                    else {
                        that.$message.error(resp.data.msg);
                    }
            });
        },
        backmyproduct()
        {
            this.$router.push('/myproduct')
        }
    }
}

</script>
<style>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.bg-purple {
    background: #d3dce6;
  }
  
  .box-card {
    width: 100%;
  }
  .dialog-footer{
  padding-top:10px ;
  padding-left: 10%;
}
</style>