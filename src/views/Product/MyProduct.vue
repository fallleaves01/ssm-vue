<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>我的商品</el-breadcrumb-item>
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
    </div>
    <!-- 我的商品列表 -->
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
            </div>
            <div class="product-footer">
              <el-button type="primary" @click="viewProduct(product.product_id)">查看商品</el-button>
              <el-button type="primary" @click="deleteProduct(product.product_id)">删除商品</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { GetReleasedProductList, SearchReleasedProductList, DeleteProduct } from '@/utils/api/ProductApi';
import { Search } from '@element-plus/icons-vue';

export default {
  data() {
    return {
      productList: [],
      keyWord: ''
    };
  },
  created() {
    this.loadProducts();
  },
  methods: {
    loadProducts() {
      let vm = this;
      try {
        GetReleasedProductList().then(function(resp) {
          console.log(resp);
          if (resp.data.product_list !== null) {
            vm.productList = resp.data.product_list;
          }
        }).catch(function(error) {
          console.error("获取发布的商品列表失败:", error);
          vm.$message.error("获取商品列表失败，请稍后再试");
        });
      } catch (error) {
        console.log(error);
      }
    },
    viewProduct(productId) {
      this.$router.push('/product/detail/' + productId);
    },
    deleteProduct(productId) {
      let vm = this;
      DeleteProduct(productId).then(function(resp) {
        if (resp.data.status == 0) {
          vm.$message.success("商品删除成功");
          vm.loadProducts(); // 重新加载商品列表
        } else {
          vm.$message.error("商品不存在或已被删除");
        }
      }).catch(function(error) {
        console.error("删除商品失败:", error);
        vm.$message.error("删除商品失败，请稍后再试");
      });
    },
    search() {
      let vm = this;
      if (!vm.keyWord.trim()) {
        vm.loadProducts();
        return;
      }
      
      SearchReleasedProductList(vm.keyWord).then(function(resp) {
        if (resp.data.product_list !== null) {
          vm.productList = resp.data.product_list;
        } else {
          vm.productList = [];
        }
      }).catch(function(error) {
        console.error("搜索商品失败:", error);
        vm.$message.error("搜索失败，请稍后再试");
      });
    }
  }
};
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
  -webkit-line-clamp: 2; /* 最多显示2行 */
  line-clamp: 2; /* 标准属性 */
  -webkit-box-orient: vertical;
  box-orient: vertical;
  white-space: normal;
}

.product-footer {
  margin-top: auto;
  margin-bottom: 10px; /* 调整底部距离 */
  display: flex;
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
</style>
