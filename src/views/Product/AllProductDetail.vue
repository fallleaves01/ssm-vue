<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/allproduct' }">全部商品</el-breadcrumb-item>
    <el-breadcrumb-item>{{ product.product_name || '商品详情' }}</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="product-detail-home">
    <div class="product-cover">
      <img :src="product.image" alt="商品图片" />
    </div>
    <div class="product-info">
      <h2 class="product-name">{{ product.product_name }}</h2>
      <div class="info-row"><span class="label">描述：</span><span class="value">{{ product.description }}</span></div>
      <div class="info-row"><span class="label">起拍价：</span><span class="value price">¥{{ product.start_price }}</span></div>
      <div class="info-row"><span class="label">当前最高出价：</span><span class="value current-price">{{ product.current_price ? '¥' + product.current_price : '无' }}</span></div>
      <div class="info-row"><span class="label">当前最高出价者：</span><span class="value current-bidder">{{ product.current_bidder_name || '-' }}</span></div>
      <div class="info-row"><span class="label">商品竞价状态：</span><span class="value state-label" :class="'state-' + product.state">{{ productStateText(product.state) }}</span></div>
      <div class="info-row"><span class="label">商品ID：</span><span class="value">{{ product.product_id }}</span></div>
      <div class="info-row"><span class="label">开始拍卖时间：</span><span class="value">{{ formatDateTime(product.plan_start_time) }}</span></div>
      <div class="info-row"><span class="label">拍卖持续时间：</span><span class="value">{{ product.due_time }}小时</span></div>
    </div>
    <div class="buttons">
      <el-button type="success" @click="enterAuction" v-if="!isInAuction">加入竞拍</el-button>
      <el-button type="primary" @click="goToMyAuction" v-if="isInAuction">查看我的竞拍</el-button>
      <el-button @click="backToList">返回列表</el-button>
    </div>
  </div>
</template>

<script>
import { EnterAuction } from '@/utils/api/AuctionApi';
import { GetUserInfo } from '@/utils/api/UserApi';
import { GetProductInfo } from '@/utils/api/ProductApi';

export default {
  data() {
    return {
      product: {},
      userName: '',
      isInAuction: false
    };
  },  created() {
    const vm = this;
    const productId = this.$route.params.id;
    const isInAuction = this.$route.query.isInAuction === 'true';
    this.isInAuction = isInAuction;
    
    // 使用GetProductInfo接口获取商品信息
    GetProductInfo(productId).then(function(resp) {
      if (resp.data && resp.data) {
        vm.product = resp.data;
      } else {
        vm.$message.error('获取商品信息失败');
      }
    }).catch(function(error) {
      vm.$message.error('获取商品信息失败');
    });
    
    // 使用GetUserInfo接口获取用户名
    GetUserInfo().then(function(resp) {
      if (resp.data && resp.data.user_name) {
        vm.userName = resp.data.user_name;
      } else {
        vm.$message.error('获取用户信息失败');
      }
    }).catch(function(error) {
      vm.$message.error('获取用户信息失败');
    });
  },
  methods: {    enterAuction() {
      const vm = this;
      EnterAuction(this.product.product_id).then(function(resp) {
        console.log(resp);
        switch (resp.data.status) {
          case 0:
            vm.$message.success("您已成功加入竞拍");
            vm.isInAuction = true;
            // 重新获取商品信息，确保状态是最新的
            GetProductInfo(vm.product.product_id).then(function(productResp) {
              if (productResp.data && productResp.data.product) {
                vm.product = productResp.data.product;
              }
            });
            break;
          case 1:
            vm.$message.error("商品拍卖未开始");
            break;
          case 2:
            vm.$message.error("商品拍卖已结束");
            break;
          case 3:
            vm.$message.error("商品不存在");
            break;
          default:
            vm.$message.error(resp.data.msg || "未知错误，请稍后再试");
            break;
        }
      });
    },
    goToMyAuction() {
      this.$router.push('/myauction');
    },
    backToList() {
      this.$router.push('/allproduct');
    },
    formatDateTime(ts) {
      if (!ts) return '未设置';
      const date = new Date(ts);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
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
};
</script>

<style scoped>
.product-detail-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.product-cover {
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.product-cover img {
  width: 300px;
  max-height: 300px;
  object-fit: cover;
}
.product-info {
  width: 80%;
  max-width: 600px;
  text-align: left;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 4px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.product-name {
  font-size: 24px;
  margin-bottom: 20px;
  color: #303133;
  text-align: center;
}
.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 16px;
}
.label {
  min-width: 120px;
  color: #888;
  text-align: right;
  margin-right: 8px;
  flex-shrink: 0;
}
.value {
  color: #333;
  word-break: break-all;
}
.price {
  color: #e57373;
  font-weight: bold;
  font-size: 18px;
}
.current-price {
  color: #409EFF;
  font-weight: bold;
}
.current-bidder {
  color: #67c23a;
}
.state-label {
  font-weight: bold;
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
.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.buttons .el-button {
  min-width: 120px;
}
</style>
