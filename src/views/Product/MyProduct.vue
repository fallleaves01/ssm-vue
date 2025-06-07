<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>我的商品</el-breadcrumb-item>
  </el-breadcrumb>  <div class="product-home">
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
    </div>    <!-- 我的商品列表 -->
    <div class="product-list">
      <el-row :gutter="20">
        <!-- 添加商品卡片 -->
        <el-col :span="8">
          <el-card class="product-card add-product-card" shadow="hover" @click="createProduct">
            <div class="add-product-content">
              <el-icon class="add-icon"><Plus /></el-icon>
              <div class="add-text">添加新商品</div>
            </div>
          </el-card>
        </el-col>
          <!-- 商品列表 -->
        <el-col :span="8" v-for="product in productList" :key="product.product_id" class="product-col">
          <el-card class="product-card" shadow="hover">
            <div class="product-image-container">
              <img :src="product.image" alt="商品图片" class="product-cover" />
            </div>
            <div class="product-info">
              <h2>{{ product.product_name }}</h2>
              <p>{{ product.description }}</p>
              <p>起拍价: ¥{{ product.start_price }}</p>
            </div>
            <div class="product-footer">
              <el-button type="primary" @click="viewProduct(product.product_id)">查看商品</el-button>
              <el-button type="danger" @click="deleteProduct(product.product_id)">删除商品</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { GetReleasedProductList, SearchReleasedProductList, DeleteProduct } from '@/utils/api/ProductApi';
import { Search, Plus } from '@element-plus/icons-vue';

export default {
  data() {
    return {
      productList: [],
      keyWord: ''
    };
  },
  created() {
    this.loadProducts();
  },  methods: {
    createProduct() {
      this.$router.push('/myproduct/create');
    },
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
    },    viewProduct(productId) {
      this.$router.push({
        path: '/myproduct/detail/' + productId
      });
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
    },    search() {
      let vm = this;
      if (!vm.keyWord.trim()) {
        vm.loadProducts();
        return;
      }
      
      SearchReleasedProductList(vm.keyWord).then(function(resp) {
        console.log("搜索结果:", resp);
        if (resp.data.product_list !== null) {
          vm.productList = resp.data.product_list;
        } else {
          vm.productList = [];
          vm.$message.info("未找到匹配的商品");
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
  height: 200px;
  object-fit: contain;
  background-color: #f8f8f8;
  display: block;
  margin: 0 auto;
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

.product-col {
  margin-bottom: 20px;
}

.product-image-container {
  height: 220px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ebeef5;
}

/* 添加商品卡片样式 */
.add-product-card {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px dashed #dcdfe6;
  transition: all 0.3s;
  background-color: #f8f9fa;
}

.add-product-card:hover {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.add-product-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 40px 0;
}

.add-icon {
  font-size: 48px;
  color: #909399;
  margin-bottom: 16px;
}

.add-product-card:hover .add-icon {
  color: #409EFF;
}

.add-text {
  font-size: 16px;
  color: #606266;
}

.add-product-card:hover .add-text {
  color: #409EFF;
}
</style>
