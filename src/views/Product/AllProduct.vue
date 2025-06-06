<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>全部商品</el-breadcrumb-item>
  </el-breadcrumb>

  <div class="product-home">
    <div>
      <div>
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
    </div>    <!-- 全部商品列表 -->
    <div class="product-list">
      <el-row :gutter="20">
        <el-col :span="8" v-for="product in productList" :key="product.product_id">
          <el-card class="product-card" shadow="hover">
            <div slot="header">
              <img :src="product.image" alt="商品图片" class="product-cover" />
            </div>
            <div class="product-info">
              <h2>{{ product.product_name }}</h2>
              <p>{{ product.description }}</p>
              <p>起拍价: ¥{{ product.start_price }}</p>
              <p v-if="product.current_price" class="current-price">当前价: ¥{{ product.current_price }}</p>
              <p class="state-label" :class="'state-' + product.state">{{ productStateText(product.state) }}</p>
            </div>
            <div class="product-footer">
              <el-button type="primary" @click="viewProductDetail(product)">查看详情</el-button>
              <el-button type="success" @click="buyproduct(product.product_id)"
                v-if="!buyer_auction_pro_id.has(product.product_id)">加入竞拍</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
  <!-- 搜索框 -->

</template>

<script>
import { GetTotalProductList, SearchTotalProductList } from '@/utils/api/ProductApi'
import { GetBuyerAuctionList, EnterAuction } from '@/utils/api/AuctionApi'
import { GetUserInfo } from '@/utils/api/UserApi'

import { Search } from '@element-plus/icons-vue'
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
      keyWord: ''
    }
  },
  created() {
    let vm = this
    let data = {}
    try {
      // 先获取用户信息，在获取到用户名后再调用其他依赖用户名的API
      GetUserInfo().then(function (resp) {
        vm.username = resp.data.user_name  // 确保正确获取user_name字段
        console.log("获取到用户名:", vm.username)
        // 在获取到用户名后调用需要用户名的API
        return GetBuyerAuctionList(vm.username)
      }).then(function (resp) {
        console.log("获取拍卖列表成功:", resp)
        vm.buyer_auction.product_list = resp.data.product_list;
        vm.buyer_auction.auction_list = resp.data.auction_list;
        // 使用for...of循环正确迭代数组元素
        for (let item of vm.buyer_auction.product_list) {
          vm.buyer_auction_pro_id.add(item.product_id);
        }
      }).catch(function (error) {
        console.error("获取用户信息或拍卖列表失败:", error)
      })

      // 商品列表获取不依赖用户名，可以并行请求
      GetTotalProductList().then(function (resp) {
        console.log(resp)
        if (resp.data.product_list !== null) {
          vm.productList = resp.data.product_list; // 直接赋值数组，避免forEach每次push
        }
      }).catch(function (error) {
        console.error("获取商品列表失败:", error)
      })
    } catch (error) {
      console.log(error)
    }
  }, methods: {
    viewProductDetail(product) {
      // 跳转到详情页，带上商品信息
      const isInAuction = this.buyer_auction_pro_id.has(product.product_id);
      this.$router.push({
        path: '/allproduct/detail/' + product.product_id,
        query: {
          productInfo: JSON.stringify(product),
          isInAuction: isInAuction.toString()
        }
      });
    },
    // createCourse() {
    //   this.$router.push("/allproduct/createproduct")
    // }
    buyproduct(productId) {
      let that = this;
      EnterAuction(productId).then(function (resp) {
        console.log(resp)
        switch (resp.data.status) {
          case 0:
            that.$message.success("您已成功加入竞拍")
            break;
          case 1:
            that.$message.error("商品拍卖未开始");
            break;
          case 2:
            that.$message.error("商品拍卖已结束");
            break;
          case 3:
            that.$message.error("商品不存在");
            break;
          default:
            that.$message.error(resp.data.msg || "未知错误，请稍后再试");
            break;
        }
      });
    },    search() {
      let vm = this
      SearchTotalProductList(vm.keyWord).then(function (resp) {
        if (resp.data.product_list !== null) {
          vm.productList = resp.data.product_list;
        }
      }).catch(function (error) {
        console.error("搜索产品失败:", error);
      })
    },
    productStateText(state) {
      switch(state) {
        case 0: return '未开始';
        case 1: return '进行中';
        case 2: return '已结束';
        default: return '-';
      }
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
  display: box;
  -webkit-line-clamp: 2;
  /* 最多显示2行 */
  line-clamp: 2;
  /* 标准属性 */
  -webkit-box-orient: vertical;
  box-orient: vertical;
  white-space: normal;
}

.create-product-button {
  margin: 20px 0;
  text-align: center;
}

.product-footer {
  margin-top: auto;
  margin-bottom: 10px;
  /* 调整底部距离 */  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.el-breadcrumb {
  margin: 20px 0;
}

/* 根据需要添加其他样式 */
.product-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

/* 价格样式 */
.product-info p:nth-child(3) {
  color: #e57373;
  font-weight: bold;
  margin-top: 10px;
}

/* 当前价格样式 */
.current-price {
  color: #409EFF;
  font-weight: bold;
}

/* 状态标签样式 */
.state-label {
  font-weight: bold;
  margin-top: 5px;
}
.state-0 {
  color: #909399;
}
.state-1 {
  color: #409EFF;
}
.state-2 {
  color: #f56c6c;
}
</style>
