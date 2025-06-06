<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/myauction' }">我的竞拍</el-breadcrumb-item>
    <el-breadcrumb-item>{{ product.product_name || '商品详情' }}</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="auction-detail-home">
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
      <div class="info-row"><span class="label">我的最高出价：</span><span class="value my-bid" :class="{'no-bid': !auction.max_bid_price}">{{ auction.max_bid_price ? '¥' + auction.max_bid_price : '无出价记录' }}</span></div>
      <div class="info-row"><span class="label">我的竞拍状态：</span><span class="value my-auction-state">{{ auctionStateText(auction.state) }}</span></div>
      <div class="info-row"><span class="label">出价次数：</span><span class="value">{{ auction.bid_count ?? '-' }}</span></div>
      <div class="info-row"><span class="label">首次出价时间：</span><span class="value">{{ auction.first_bid_time ?? '-' }}</span></div>
      <div class="info-row"><span class="label">最近出价时间：</span><span class="value">{{ auction.last_bid_time ?? '-' }}</span></div>
    </div>    <div class="buttons">
      <!-- 正常的竞价按钮，只有非卖家才能出价 -->
      <template v-if="!isProductSeller && product.state === 1">
        <el-input-number v-model="bidPrice" :min="minBidPrice" :precision="2" placeholder="输入竞价" style="margin-right:10px;" />
        <el-button type="primary" @click="submitBid">竞价</el-button>
      </template>
      <el-button @click="backToList">返回列表</el-button>
    </div>
  </div>
</template>

<script>
import { Bid, GetAuctionInfo, EndAuction } from '@/utils/api/AuctionApi';
import { GetUserInfo } from '@/utils/api/UserApi';
import { GetProductInfo } from '@/utils/api/ProductApi';

export default {  data() {
    return {
      product: {},
      auction: {},
      bidPrice: null,
      minBidPrice: 0,
      userName: '',
      isProductSeller: false, // 是否是商品的卖家
    };
  },  created() {
    const vm = this;
    // 获取路由参数
    const productId = this.$route.params.id; // 修正这里，使用id而不是product_id
    
    console.log("Auction Detail created, productId:", productId);    // 使用GetProductInfo接口获取商品信息
    GetProductInfo(productId).then(function(resp) {
      if (resp.data && resp.data) {
        vm.product = resp.data;
        // 设置最低出价为商品current_price+1（若有），否则为起拍价
        const basePrice = vm.product.current_price ? Number(vm.product.current_price) : Number(vm.product.start_price);
        vm.minBidPrice = basePrice + 1;
        vm.bidPrice = vm.minBidPrice;
        
        // 如果用户名已获取，检查当前用户是否是卖家
        if (vm.userName && vm.product.seller_name) {
          vm.isProductSeller = (vm.userName === vm.product.seller_name);
        }
        
        // 获取商品成功后获取竞拍信息
        if (vm.product) {
          vm.loadAuctionInfo();
        }
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
        
        // 如果产品信息已加载，检查当前用户是否是卖家
        if (vm.product && vm.product.seller_name) {
          vm.isProductSeller = (vm.userName === vm.product.seller_name);
        }
      } else {
        vm.$message.error('获取用户信息失败');
      }
    }).catch(function(error) {
      vm.$message.error('获取用户信息失败');
    });
  },  methods: {
    // 加载竞拍信息
    loadAuctionInfo() {
      const vm = this;
      GetAuctionInfo(vm.product.product_id).then(function(resp) {
        if (resp.data) {
          vm.auction = resp.data;
        } else {
          vm.$message.error('获取竞拍信息失败');
        }
      }).catch(function(error) {
        vm.$message.error('获取竞拍信息失败');
        console.error("获取竞拍信息失败:", error);
      });
    },
    
    submitBid() {
      if (!this.bidPrice || this.bidPrice < this.minBidPrice) {
        this.$message.error('请输入有效的竞价（必须高于当前最高价）');
        return;
      }
      const vm = this;
      Bid(this.bidPrice, this.userName, this.product.product_id).then(function(resp) {
        if (resp.data.status === 0) {
          vm.$message.success('出价成功');
          
          // 重新获取商品信息和竞拍信息，确保数据最新
          GetProductInfo(vm.product.product_id).then(function(resp) {
            if (resp.data && resp.data) {
              vm.product = resp.data;
              // 重新计算最低出价
              const basePrice = vm.product.current_price ? Number(vm.product.current_price) : Number(vm.product.start_price);
              vm.minBidPrice = basePrice + 1;
              vm.bidPrice = vm.minBidPrice;
                // 重新获取竞拍信息
              vm.loadAuctionInfo();
            }
          });
        } else {
          vm.$message.error(resp.data.msg || '出价失败');
        }
      }).catch(function(error) {
        vm.$message.error('网络错误，请稍后再试');
      });
    },    backToList() {
      this.$router.push('/myauction');
    },
    // 结束竞拍
    endAuction() {
      const vm = this;
      
      // 确认对话框
      this.$confirm('确定要结束当前竞拍吗？此操作不可逆！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        EndAuction(vm.product.product_id).then(function(resp) {
          if (resp.data && resp.data.status === 0) {
            vm.$message.success('竞拍已成功结束');
              // 重新获取商品信息
            GetProductInfo(vm.product.product_id).then(function(resp) {
              if (resp.data && resp.data) {
                vm.product = resp.data;
                // 同时刷新竞拍信息
                vm.loadAuctionInfo();
              }
            });
            
          } else if (resp.data && resp.data.status === 1) {
            vm.$message.error('商品不在竞拍时段，无法结束');
          } else if (resp.data && resp.data.status === 2) {
            vm.$message.error('无效的商品ID或您不是此商品的卖家');
          } else {
            vm.$message.error('结束竞拍失败');
          }
        }).catch(function(error) {
          vm.$message.error('网络错误，请稍后再试');
          console.error('结束竞拍失败:', error);
        });
      }).catch(() => {
        vm.$message.info('已取消操作');
      });
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
    },
    auctionStateText(state) {
      switch(state) {
        case 0: return '未出价';
        case 1: return '已出价';
        case 2: return '已胜出';
        case 3: return '未胜出';
        default: return '-';
      }
    }
  }
};
</script>

<style scoped>
.auction-detail-home {
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
.my-bid {
  color: #409EFF;
  font-weight: bold;
}
.my-bid.no-bid {
  color: #909399;
  font-weight: normal;
}
.my-auction-state {
  color: #e6a23c;
  font-weight: bold;
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
