<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>我的订单</el-breadcrumb-item>
  </el-breadcrumb>

  <div class="order-home">
    <!-- 标签页切换：我购买的 / 我售出的 -->
    <el-tabs v-model="activeTab" class="order-tabs">
      <el-tab-pane label="我购买的" name="buying">
        <div class="search-bar">
          <el-input v-model="buyerKeyword" placeholder="搜索我购买的订单" class="search-input"></el-input>
          <el-button @click="searchBuyerOrders" circle>
            <el-icon style="vertical-align: middle;"><Search /></el-icon>
          </el-button>
        </div>
        
        <!-- 我购买的订单列表 -->
        <div class="order-list" v-if="buyerOrderList.length > 0">
          <el-card v-for="order in buyerOrderList" :key="order.product_id" class="order-card">
            <div class="order-header">
              <h3>订单号: {{ order.product_id }}</h3>
              <div class="order-status" :class="'status-' + order.state">{{ orderStateText(order.state) }}</div>
            </div>
            <div class="order-content">
              <div class="order-info">
                <div class="info-row"><span class="label">最终价格:</span><span class="value price">¥{{ order.final_price }}</span></div>
                <div class="info-row"><span class="label">创建时间:</span><span class="value">{{ formatDateTime(order.create_time) }}</span></div>
                <div v-if="order.pay_time" class="info-row"><span class="label">支付时间:</span><span class="value">{{ formatDateTime(order.pay_time) }}</span></div>
                <div v-if="order.receive_time" class="info-row"><span class="label">确认收款时间:</span><span class="value">{{ formatDateTime(order.receive_time) }}</span></div>
                <div v-if="order.cancel_time" class="info-row"><span class="label">取消时间:</span><span class="value">{{ formatDateTime(order.cancel_time) }}</span></div>
              </div>
            </div>
            <div class="order-footer">
              <el-button type="primary" @click="viewOrderDetail(order, 'buyer')">查看详情</el-button>
              <el-button type="success" @click="payOrder(order.product_id)" v-if="order.state === 0">支付订单</el-button>
              <el-button type="danger" @click="cancelOrder(order.product_id)" v-if="order.state === 0">取消订单</el-button>
            </div>
          </el-card>
        </div>
        <el-empty v-else description="暂无购买订单" :image-size="200"></el-empty>
      </el-tab-pane>
      
      <el-tab-pane label="我售出的" name="selling">
        <div class="search-bar">
          <el-input v-model="sellerKeyword" placeholder="搜索我售出的订单" class="search-input"></el-input>
          <el-button @click="searchSellerOrders" circle>
            <el-icon style="vertical-align: middle;"><Search /></el-icon>
          </el-button>
        </div>
        
        <!-- 我售出的订单列表 -->
        <div class="order-list" v-if="sellerOrderList.length > 0">
          <el-card v-for="order in sellerOrderList" :key="order.product_id" class="order-card">
            <div class="order-header">
              <h3>订单号: {{ order.product_id }}</h3>
              <div class="order-status" :class="'status-' + order.state">{{ orderStateText(order.state) }}</div>
            </div>
            <div class="order-content">
              <div class="order-info">
                <div class="info-row"><span class="label">买家用户名:</span><span class="value">{{ order.user_name }}</span></div>
                <div class="info-row"><span class="label">最终价格:</span><span class="value price">¥{{ order.final_price }}</span></div>
                <div class="info-row"><span class="label">创建时间:</span><span class="value">{{ formatDateTime(order.create_time) }}</span></div>
                <div v-if="order.pay_time" class="info-row"><span class="label">支付时间:</span><span class="value">{{ formatDateTime(order.pay_time) }}</span></div>
                <div v-if="order.receive_time" class="info-row"><span class="label">确认收款时间:</span><span class="value">{{ formatDateTime(order.receive_time) }}</span></div>
                <div v-if="order.cancel_time" class="info-row"><span class="label">取消时间:</span><span class="value">{{ formatDateTime(order.cancel_time) }}</span></div>
              </div>
            </div>
            <div class="order-footer">
              <el-button type="primary" @click="viewOrderDetail(order, 'seller')">查看详情</el-button>
              <el-button type="success" @click="receiveOrder(order.product_id)" v-if="order.state === 1">确认收款</el-button>
            </div>
          </el-card>
        </div>
        <el-empty v-else description="暂无售出订单" :image-size="200"></el-empty>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { GetBuyerOrderList, GetSellerOrderList, payOrder, cancelOrder, receiveOrder } from '@/utils/api/OrderApi';
import { Search } from '@element-plus/icons-vue';

export default {
  components: { Search },
  data() {
    return {
      activeTab: 'buying',
      buyerOrderList: [],
      sellerOrderList: [],
      fullBuyerOrderList: [], // 用于搜索功能
      fullSellerOrderList: [], // 用于搜索功能
      buyerKeyword: '',
      sellerKeyword: ''
    };
  },
  created() {
    this.loadBuyerOrders();
    this.loadSellerOrders();
  },
  methods: {
    loadBuyerOrders() {
      const vm = this;
      GetBuyerOrderList().then(function(resp) {
        if (resp.data && resp.data.buyer_order_list) {
          vm.buyerOrderList = resp.data.buyer_order_list;
          vm.fullBuyerOrderList = [...resp.data.buyer_order_list]; // 保存完整列表用于搜索
        } else {
          vm.buyerOrderList = [];
          vm.fullBuyerOrderList = [];
        }
      }).catch(function(error) {
        console.error("获取买家订单列表失败:", error);
        vm.$message.error("获取订单列表失败，请稍后再试");
      });
    },
    loadSellerOrders() {
      const vm = this;
      GetSellerOrderList().then(function(resp) {
        if (resp.data && resp.data.seller_order_list) {
          vm.sellerOrderList = resp.data.seller_order_list;
          vm.fullSellerOrderList = [...resp.data.seller_order_list]; // 保存完整列表用于搜索
        } else {
          vm.sellerOrderList = [];
          vm.fullSellerOrderList = [];
        }
      }).catch(function(error) {
        console.error("获取卖家订单列表失败:", error);
        vm.$message.error("获取订单列表失败，请稍后再试");
      });
    },
    viewOrderDetail(order, type) {
      // 跳转到订单详情页
      this.$router.push({
        path: `/myorder/detail/${order.product_id}`,
        query: {
          orderInfo: JSON.stringify(order),
          orderType: type
        }
      });
    },
    payOrder(productId) {
      const vm = this;
      payOrder(productId).then(function(resp) {
        if (resp.data && resp.data.status === 0) {
          vm.$message.success("支付成功");
          vm.loadBuyerOrders(); // 重新加载订单列表
        } else {
          vm.$message.error(resp.data.msg || "支付失败");
        }
      }).catch(function(error) {
        console.error("支付订单失败:", error);
        vm.$message.error("支付订单失败，请稍后再试");
      });
    },
    cancelOrder(productId) {
      const vm = this;
      vm.$confirm('确定要取消此订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelOrder(productId).then(function(resp) {
          if (resp.data && resp.data.status === 0) {
            vm.$message.success("订单已取消");
            vm.loadBuyerOrders(); // 重新加载订单列表
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
    receiveOrder(productId) {
      const vm = this;
      vm.$confirm('确认已收到此订单的付款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        receiveOrder(productId).then(function(resp) {
          if (resp.data && resp.data.status === 0) {
            vm.$message.success("已确认收款");
            vm.loadSellerOrders(); // 重新加载订单列表
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
    searchBuyerOrders() {
      if (!this.buyerKeyword.trim()) {
        this.buyerOrderList = [...this.fullBuyerOrderList];
        return;
      }
      
      const keyword = this.buyerKeyword.toLowerCase();
      this.buyerOrderList = this.fullBuyerOrderList.filter(order => {
        return order.product_id.toString().includes(keyword) || 
               (order.final_price && order.final_price.toString().includes(keyword));
      });
    },
    searchSellerOrders() {
      if (!this.sellerKeyword.trim()) {
        this.sellerOrderList = [...this.fullSellerOrderList];
        return;
      }
      
      const keyword = this.sellerKeyword.toLowerCase();
      this.sellerOrderList = this.fullSellerOrderList.filter(order => {
        return order.product_id.toString().includes(keyword) || 
               (order.user_name && order.user_name.toLowerCase().includes(keyword)) || 
               (order.final_price && order.final_price.toString().includes(keyword));
      });
    }
  }
};
</script>

<style scoped>
.order-home {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.order-tabs {
  margin-bottom: 20px;
  width: 100%;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-input {
  margin-right: 10px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border-radius: 8px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.order-status {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f0f0f0;
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

.order-content {
  display: flex;
  margin-bottom: 15px;
}

.order-info {
  flex-grow: 1;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
}

.label {
  min-width: 120px;
  color: #909399;
  margin-right: 10px;
}

.value {
  color: #303133;
}

.price {
  color: #e57373;
  font-weight: bold;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
}

.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
