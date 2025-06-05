<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>全部商品</el-breadcrumb-item>
  </el-breadcrumb>

  <div class="product-home">
 <div>
    <div >
            <el-row>
                <el-col :span="16">
                    <el-input v-model="keyWord" placeholder="请输入关键词"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button @click="search" circle>
                    <el-icon style="vertical-align: middle;">
                      <Search />
                    </el-icon>
                    </el-button>
                </el-col>
            </el-row>
        </div>
  </div>
  <!-- 全部课程列表 -->
  <div class="product-list">
    <el-row :gutter="20">
      <el-col :span="8" v-for="product in productList" :key="product.id">
        <el-card class="product-card" shadow="hover">
          <div slot="header">
            <img :src="product.image" alt="商品图片" class="product-cover" />
          </div>
          <div class="product-info">
            <h2>{{ product.product_name }}</h2>
            <p>{{ product.description }}</p>
          </div>
          <div class="product-footer">
            <el-button type="success" @click="buyproduct(course.product_id) " v-if="true">加入竞拍</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  </div>
  <!-- 搜索框 -->
 
</template>

<script>
import { GetAllCourseList,SearchCourse } from '@/utils/api/AllClassApi'
import {buyProduct} from '@/utils/api/JoinClassApi'
import { GetTotalProductList, SearchTotalProductList } from '@/utils/api/ProductApi'
import { GetBuyerAuctionList, EnterAuction } from '@/utils/api/AuctionApi'
import { GetUserInfo } from '@/utils/api/UserApi'

import { Search} from '@element-plus/icons-vue'
export default {
  data() {
    return {
      username: '',
      courseList: [],
      productList: [],
      buyer_auction: {
        product_list: [],
        auction_list: []
      },
      buyer_auction_pro_id: new Set(),
      keyWord:''
    }
  },
  created() {
    let vm = this
    let data = {}
    try {
      GetUserInfo()
      GetTotalProductList().then(function (resp) {
        console.log(resp)
        if (resp.data.product_list !== null) {
          resp.data.product_list.forEach((data) => {
            vm.productList.push(data)
          })
        }
      })
      
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    // createCourse() {
    //   this.$router.push("/allproduct/createproduct")
    // }
    buyproduct(courseId)
    {
      let that = this;
            let data = {
                "courseId": courseId
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
    search()
    {
      let vm=this
      let data={
        "keyWord":vm.keyWord
      }
      SearchCourse(data).then(function(resp){
        vm.courseList=resp.data.courseList
      })
    }
  }
}
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-cover {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 20px;
  text-align: center;
}

.product-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多显示2行 */
  -webkit-box-orient: vertical;
  white-space: normal;
}

.create-product-button {
  margin: 20px 0;
  text-align: center;
}
.product-footer {
  margin-top: auto;
  margin-bottom: 10px; /* 调整底部距离 */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
/* 根据需要添加其他样式 */
.product-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
