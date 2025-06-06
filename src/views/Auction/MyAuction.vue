<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>我的竞拍</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="auction-home">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(product, idx) in productList" :key="product.product_id">
        <el-card class="auction-card" shadow="hover">
          <div slot="header">
            <img :src="product.image" alt="商品图片" class="auction-cover" />
          </div>
          <div class="auction-info">
            <div class="auction-info-row"><span class="label">商品名：</span><span class="value">{{ product.product_name }}</span></div>
            <div class="auction-info-row"><span class="label">商品描述：</span><span class="value">{{ product.description }}</span></div>
            <div class="auction-info-row"><span class="label">起拍价：</span><span class="value price">¥{{ product.start_price }}</span></div>
            <div class="auction-info-row"><span class="label">当前最高出价：</span><span class="value current-price">{{ product.current_price ? '¥' + product.current_price : '无' }}</span></div>
            <div class="auction-info-row"><span class="label">当前最高出价者：</span><span class="value current-bidder">{{ product.current_bidder_name || '-' }}</span></div>
            <div class="auction-info-row"><span class="label">商品竞价状态：</span><span class="value state-label" :class="'state-' + product.state">{{ productStateText(product.state) }}</span></div>
            <div class="auction-info-row"><span class="label">我的最高出价：</span><span class="value my-bid" :class="{'no-bid': !auctionList[idx]?.max_bid_price}">{{ auctionList[idx]?.max_bid_price ? '¥' + auctionList[idx].max_bid_price : '无出价记录' }}</span></div>
            <div class="auction-info-row"><span class="label">我的竞拍状态：</span><span class="value my-auction-state">{{ auctionStateText(auctionList[idx]?.state) }}</span></div>
            <div class="auction-info-row"><span class="label">出价次数：</span><span class="value">{{ auctionList[idx]?.bid_count ?? '-' }}</span></div>
            <div class="auction-info-row"><span class="label">首次出价时间：</span><span class="value">{{ auctionList[idx]?.first_bid_time ?? '-' }}</span></div>
            <div class="auction-info-row"><span class="label">最近出价时间：</span><span class="value">{{ auctionList[idx]?.last_bid_time ?? '-' }}</span></div>
          </div>
          <div class="auction-footer">
            <el-button type="primary" @click="viewAuctionDetail(product, auctionList[idx])">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetBuyerAuctionList } from '@/utils/api/AuctionApi';
import { GetUserInfo } from '@/utils/api/UserApi';

export default {
  data() {
    return {
      productList: [],
      auctionList: [],
      userName: '',
    };
  },
  created() {
    // 使用GetUserInfo接口获取用户名
    let vm = this;
    GetUserInfo().then(function(resp) {
      if (resp.data && resp.data.user_name) {
        vm.userName = resp.data.user_name;
        vm.loadMyAuctions();
      } else {
        vm.$message.error('获取用户信息失败');
      }
    }).catch(function(error) {
      vm.$message.error('获取用户信息失败');
    });
  },
  methods: {
    loadMyAuctions() {
      const vm = this;
      GetBuyerAuctionList(vm.userName).then(function(resp) {
        if (resp.data && resp.data.product_list && resp.data.auction_list) {
          vm.productList = resp.data.product_list;
          vm.auctionList = resp.data.auction_list;
        } else {
          vm.productList = [];
          vm.auctionList = [];
        }
      }).catch(function(error) {
        vm.$message.error('获取竞拍信息失败');
        vm.productList = [];
        vm.auctionList = [];
      });
    },    viewAuctionDetail(product, auction) {
      // 跳转到详情页，只传递竞拍信息，商品信息通过API获取
      this.$router.push({
        path: '/myauction/detail/' + product.product_id,
        query: {
          auctionInfo: JSON.stringify(auction)
        }
      });
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
    },
  }
};
</script>

<style scoped>
.auction-home {
  padding: 20px;
}
.auction-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.auction-cover {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}
.auction-info {
  padding: 20px;
  text-align: left;
}
.auction-info-row {
  display: flex;
  margin-bottom: 6px;
  font-size: 15px;
}
.label {
  min-width: 110px;
  color: #888;
  text-align: right;
  margin-right: 8px;
  flex-shrink: 0;
}
.value {
  color: #333;
  word-break: break-all;
}
.auction-footer {
  margin-top: auto;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.price {
  color: #e57373;
  font-weight: bold;
  font-size: 16px;
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
</style>
