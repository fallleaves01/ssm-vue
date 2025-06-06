<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/myorder' }">我的订单</el-breadcrumb-item>
    <el-breadcrumb-item>订单详情</el-breadcrumb-item>
  </el-breadcrumb>
  
  <div class="order-detail-container">
    <el-row :gutter="20">
      <!-- 订单信息 -->
      <el-col :span="12">
        <el-card class="order-info-card">
          <template #header>
            <div class="card-header">
              <h2>订单信息</h2>
              <div class="order-status" :class="'status-' + order.state">{{ orderStateText(order.state) }}</div>
            </div>
          </template>
          <div class="order-info">
            <div class="info-row"><span class="label">订单号:</span><span class="value">{{ order.product_id }}</span></div>
            <div class="info-row"><span class="label">最终价格:</span><span class="value price">¥{{ order.final_price }}</span></div>
            <div v-if="orderType === 'seller'" class="info-row"><span class="label">买家用户名:</span><span class="value">{{ order.user_name }}</span></div>
            <div class="info-row"><span class="label">创建时间:</span><span class="value">{{ formatDateTime(order.create_time) }}</span></div>
            <div v-if="order.pay_time" class="info-row"><span class="label">支付时间:</span><span class="value">{{ formatDateTime(order.pay_time) }}</span></div>
            <div v-if="order.receive_time" class="info-row"><span class="label">确认收款时间:</span><span class="value">{{ formatDateTime(order.receive_time) }}</span></div>
            <div v-if="order.cancel_time" class="info-row"><span class="label">取消时间:</span><span class="value">{{ formatDateTime(order.cancel_time) }}</span></div>
          </div>
          <div class="order-actions" v-if="orderType === 'buyer' && order.state === 0">
            <el-button type="success" @click="payOrder">支付订单</el-button>
            <el-button type="danger" @click="cancelOrder">取消订单</el-button>
          </div>
          <div class="order-actions" v-if="orderType === 'seller' && order.state === 1">
            <el-button type="success" @click="receiveOrder">确认收款</el-button>
          </div>
        </el-card>
      </el-col>
      
      <!-- 商品信息 -->
      <el-col :span="12">
        <el-card class="product-info-card">
          <template #header>
            <div class="card-header">
              <h2>商品信息</h2>
            </div>
          </template>
          <div v-if="product">
            <div class="product-image">
              <img :src="product.image" alt="商品图片" />
            </div>
            <div class="product-details">
              <h3 class="product-name">{{ product.product_name }}</h3>
              <div class="info-row"><span class="label">描述:</span><span class="value">{{ product.description }}</span></div>
              <div class="info-row"><span class="label">起拍价:</span><span class="value">¥{{ product.start_price }}</span></div>
              <div class="info-row"><span class="label">成交价:</span><span class="value price">¥{{ order.final_price }}</span></div>
              <div class="info-row"><span class="label">拍卖时长:</span><span class="value">{{ product.due_time }}小时</span></div>
              <div class="info-row"><span class="label">开始时间:</span><span class="value">{{ formatDateTime(product.start_time) }}</span></div>
              <div class="info-row"><span class="label">结束时间:</span><span class="value">{{ formatDateTime(product.end_time) }}</span></div>
            </div>
          </div>
          <div v-else class="product-loading">
            <el-skeleton :rows="6" animated />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="back-button">
      <el-button @click="goBack">返回列表</el-button>
    </div>
  </div>
</template>

<script>
import { GetOrderInfo, PayOrder, CancelOrder, ReceiveOrder } from '@/utils/api/OrderApi';
import { GetProductInfo } from '@/utils/api/ProductApi';

export default {
  data() {
    return {
      order: {},
      product: null,
      orderType: 'buyer', // 'buyer' 或 'seller'
      loading: true
    };
  },
  created() {
    const orderInfo = this.$route.query.orderInfo;
    const orderType = this.$route.query.orderType;
    
    if (orderInfo) {
      this.order = JSON.parse(orderInfo);
      this.orderType = orderType || 'buyer';
      this.fetchProductInfo();
    } else {
      // 从URL获取订单ID
      const productId = this.$route.params.id;
      if (productId) {
        this.fetchOrderInfo(productId);
      } else {
        this.$message.error('订单信息不存在');
        this.goBack();
      }
    }
  },
  methods: {
    fetchOrderInfo(productId) {
      const vm = this;
      GetOrderInfo(productId).then(function(resp) {
        if (resp.data) {
          vm.order = resp.data;
          vm.fetchProductInfo();
        } else {
          vm.$message.error('获取订单信息失败');
        }
      }).catch(function(error) {
        console.error("获取订单信息失败:", error);
        vm.$message.error('获取订单信息失败，请稍后再试');
      });
    },
    fetchProductInfo() {
      const vm = this;
      GetProductInfo(this.order.product_id).then(function(resp) {
        if (resp.data) {
          vm.product = resp.data;
        } else {
          vm.$message.warning('获取商品详情失败');
        }
        vm.loading = false;
      }).catch(function(error) {
        console.error("获取商品信息失败:", error);
        vm.$message.warning('获取商品详情失败，请稍后再试');
        vm.loading = false;
      });
    },
    payOrder() {
      const vm = this;
      PayOrder(this.order.product_id).then(function(resp) {
        if (resp.data && resp.data.status === 1) {
          vm.$message.success("支付成功");
          vm.order.state = 1; // 更新状态
          vm.order.pay_time = new Date().toISOString(); // 更新支付时间
        } else {
          vm.$message.error(resp.data.msg || "支付失败");
        }
      }).catch(function(error) {
        console.error("支付订单失败:", error);
        vm.$message.error("支付订单失败，请稍后再试");
      });
    },
    cancelOrder() {
      const vm = this;
      vm.$confirm('确定要取消此订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CancelOrder(vm.order.product_id).then(function(resp) {
          if (resp.data && resp.data.status === 3) {
            vm.$message.success("订单已取消");
            vm.order.state = 3; // 更新状态
            vm.order.cancel_time = new Date().toISOString(); // 更新取消时间
          } else {
            vm.$message.error(resp.data.msg || "取消订单失败");
          }
        }).catch(function(error) {
          console.error("取消订单失败:", error);
          vm.$message.error("取消订单失败，请稍后再试");
        });
      }).catch(() => {
        vm.$message.info('已取消操作');
      });
    },
    receiveOrder() {
      const vm = this;
      vm.$confirm('确认已收到此订单的付款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ReceiveOrder(vm.order.product_id).then(function(resp) {
          if (resp.data && resp.data.status === 2) {
            vm.$message.success("已确认收款");
            vm.order.state = 2; // 更新状态
            vm.order.receive_time = new Date().toISOString(); // 更新收款时间
          } else {
            vm.$message.error(resp.data.msg || "确认收款失败");
          }
        }).catch(function(error) {
          console.error("确认收款失败:", error);
          vm.$message.error("确认收款失败，请稍后再试");
        });
      }).catch(() => {
        vm.$message.info('已取消操作');
      });
    },
    orderStateText(state) {
      switch(parseInt(state)) {
        case 0: return '待支付';
        case 1: return '已支付';
        case 2: return '已完成';
        case 3: return '已取消';
        default: return '未知状态';
      }
    },
    formatDateTime(timestamp) {
      if (!timestamp) return '未设置';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    goBack() {
      this.$router.push('/myorder');
    }
  }
};
</script>

<style scoped>
.order-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-status {
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
}

.status-0 {
  color: #e6a23c;
  background-color: #fdf6ec;
}

.status-1 {
  color: #409EFF;
  background-color: #ecf5ff;
}

.status-2 {
  color: #67c23a;
  background-color: #f0f9eb;
}

.status-3 {
  color: #f56c6c;
  background-color: #fef0f0;
}

.order-info-card, .product-info-card {
  margin-bottom: 20px;
  height: 100%;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.label {
  min-width: 120px;
  color: #909399;
  margin-right: 10px;
}

.value {
  color: #303133;
  flex: 1;
}

.price {
  color: #e57373;
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.product-image {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.product-image img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.product-name {
  margin-bottom: 15px;
  color: #303133;
}

.product-details {
  padding: 0 10px;
}

.back-button {
  margin-top: 20px;
  text-align: center;
}

.product-loading {
  padding: 20px;
}

.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
