<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/myproduct' }">我的商品</el-breadcrumb-item>
    <el-breadcrumb-item>{{ productName }}</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="product-home">
    <!-- 商品已删除提示 -->
    <div v-if="productName === '商品不存在'" class="product-deleted-notice">
      <el-icon class="deleted-icon">
        <Close />
      </el-icon>
      <h2>商品不存在或已被删除</h2>
      <p>该商品可能已被删除、下架或者从未存在过</p>
    </div>

    <!-- 正常商品显示 -->
    <template v-else>
      <div class="product-cover">
        <img :src="imageUrl" alt="商品图片" />
      </div>

      <div class="product-info">
        <h2 class="product-name">{{ productName }}</h2>
        <p class="description">描述：{{ description }}</p>
        <p class="price">起拍价：¥{{ startPrice }}</p>
        <p class="due-time">拍卖持续时间：{{ dueTime }}小时</p>
        <p class="plan-start-time">开始拍卖时间：{{ formatDateTime(planStartTime) }}</p>
        <p class="product-id">商品ID：{{ productId }}</p>
        <p class="status" :class="{ 'status-active': isActive, 'status-ended': !isActive }">
          状态：{{ statusText }}
        </p>
      </div>
    </template>
    <div class="buttons">
      <!-- 根据商品状态显示不同的按钮 -->
      <template v-if="productName !== '商品不存在'">
        <el-button type="primary" @click="editProductInfo" v-if="canEdit">修改商品信息</el-button>
        <el-button type="danger" @click="confirmDelete">删除商品</el-button>
      </template>
      <el-button @click="backToList">返回列表</el-button>
    </div>

    <!-- 修改商品信息的弹窗 -->
    <el-dialog v-model="editDialogVisible" title="修改商品信息" width="50%">
      <el-form :model="editForm" label-width="120px" label-position="right">
        <el-form-item label="商品名称">
          <el-input v-model="editForm.productName" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="editForm.description" type="textarea" :rows="4" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item label="起拍价(元)">
          <el-input-number v-model="editForm.startPrice" :min="0" :precision="2" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item label="拍卖持续时间(小时)">
          <el-input-number v-model="editForm.dueTime" :min="1" :precision="0" :step="1"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确认修改</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { UpdateProductInfo, DeleteProduct, GetReleasedProductList } from '@/utils/api/ProductApi';
import { Close } from '@element-plus/icons-vue';

export default {
  components: { Close },
  data() {
    return {
      productId: null,
      productName: '',
      description: '',
      imageUrl: '',
      startPrice: 0,
      dueTime: 0,
      planStartTime: null,
      statusId: 0,  // 0-待拍卖，1-拍卖中，2-已成交，3-已过期
      statusText: '未知',
      isActive: true,
      canEdit: true,

      // 编辑表单数据
      editDialogVisible: false,
      editForm: {
        productName: '',
        description: '',
        startPrice: 0,
        dueTime: 0
      }
    };
  }, created() {
    this.productId = this.$route.params.id;

    // 尝试从路由查询参数中获取商品信息
    const productInfoParam = this.$route.query.productInfo;
    if (productInfoParam) {
      try {
        const product = JSON.parse(productInfoParam);
        this.loadProductFromParams(product);
      } catch (e) {
        console.error('解析商品信息失败:', e);
        this.loadProductDetail(); // 如果解析失败，则回退到API请求
      }
    } else {
      this.loadProductDetail(); // 如果没有查询参数，则使用API请求
    }
  },
  methods: {
    // 从传递的参数中加载商品信息
    loadProductFromParams(product) {
      this.productName = product.product_name;
      this.description = product.description;
      this.imageUrl = product.image;
      this.startPrice = product.start_price;
      this.dueTime = product.due_time;
      this.planStartTime = product.plan_start_time;
      this.statusId = product.status || 0;

      // 设置状态文本和其他属性
      this.setProductStatus();

      // 初始化编辑表单
      this.initEditForm();
    },

    // 设置商品状态和相关属性
    setProductStatus() {
      switch (this.statusId) {
        case 0:
          this.statusText = '待拍卖';
          this.isActive = true;
          this.canEdit = true;
          break;
        case 1:
          this.statusText = '拍卖中';
          this.isActive = true;
          this.canEdit = true;
          break;
        case 2:
          this.statusText = '已成交';
          this.isActive = false;
          this.canEdit = false;
          break;
        case 3:
          this.statusText = '已过期';
          this.isActive = false;
          this.canEdit = true;
          break;
        default:
          this.statusText = '未知';
      }
    },

    // 初始化编辑表单
    initEditForm() {
      this.editForm.productName = this.productName;
      this.editForm.description = this.description;
      this.editForm.startPrice = this.startPrice;
      this.editForm.dueTime = this.dueTime;
    },
    // 通过API加载商品详情（作为备选方案）
    loadProductDetail() {
      const vm = this;

      // 使用GetReleasedProductList API获取所有已发布商品
      GetReleasedProductList().then(function (resp) {
        if (resp.data && resp.data.product_list) {
          // 在返回的商品列表中查找指定ID的商品
          const foundProduct = resp.data.product_list.find(
            product => product.product_id === parseInt(vm.productId, 10) || product.product_id === vm.productId
          );

          if (foundProduct) {
            // 找到商品，加载数据
            vm.loadProductFromParams(foundProduct);
          } else {
            // 没找到商品，显示"商品已删除"的提示
            vm.$message.error('商品不存在或已被删除');
            vm.productName = '商品不存在';
            vm.description = '该商品可能已被删除或下架';
            vm.statusText = '已删除';
            vm.isActive = false;
            vm.canEdit = false;
          }
        } else {
          // API返回异常
          vm.$message.error('获取商品信息失败');
          console.error("API返回异常:", resp);
        }
      }).catch(function (error) {
        // 网络错误处理
        vm.$message.error('网络错误，请稍后再试');
        console.error("API请求失败:", error);
      });
    },
    editProductInfo() {
      this.editDialogVisible = true;
    }, submitEdit() {
      const vm = this;

      UpdateProductInfo(
        vm.productId,
        vm.editForm.productName,
        vm.editForm.description,
        vm.editForm.startPrice,
        vm.editForm.dueTime
      ).then(function (resp) {
        if (resp.data) {
          if (resp.data.status === 0) {
            vm.$message.success('商品信息修改成功');
            vm.editDialogVisible = false;
            vm.productName = vm.editForm.productName;
            vm.description = vm.editForm.description;
            vm.startPrice = vm.editForm.startPrice;
            vm.dueTime = vm.editForm.dueTime;
          } else if (resp.data.status == 1) {
            vm.$message.error('商品不存在');
          } else if (resp.data.status == 2) {
            vm.$message.error('商品正在拍卖中');
          } else {
            vm.$message.error(resp.data?.msg || '修改商品信息失败');
          }
        } else {
          vm.$message.error(resp.data?.msg || '修改商品信息失败');
        }
      }).catch(function (error) {
        console.error('修改商品信息出错:', error);
        vm.$message.error('网络错误，请稍后再试');
      });
    },
    confirmDelete() {
      const vm = this;
      this.$confirm('确定要删除此商品吗？此操作不可逆!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteProduct(vm.productId).then(function (resp) {
          if (resp.data && resp.data.status === 0) {
            vm.$message.success('商品已成功删除');
            vm.backToList(); // 删除成功后返回列表
          } else if (resp.data && resp.data.status === 1) {
            vm.$message.error('商品不存在');
          } else {
            vm.$message.error(resp.data?.msg || '删除商品失败');
          }
        }).catch(function (error) {
          console.error('删除商品出错:', error);
          vm.$message.error('网络错误，请稍后再试');
        });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    backToList() {
      this.$router.push('/myproduct');
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
    }
  }
};
</script>

<style scoped>
.product-home {
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
  text-align: center;
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
}

.product-info p {
  margin: 10px 0;
  line-height: 1.6;
  font-size: 16px;
  color: #606266;
}

.price {
  color: #e57373 !important;
  font-weight: bold;
  font-size: 18px !important;
}

.status {
  font-weight: bold;
}

.status-active {
  color: #67c23a !important;
}

.status-ended {
  color: #f56c6c !important;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.buttons .el-button {
  min-width: 120px;
}

.el-breadcrumb {
  margin: 20px 0;
}

.dialog-footer {
  text-align: right;
  margin-top: 15px;
}

/* 商品已删除提示样式 */
.product-deleted-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 8px;
  background-color: #fef0f0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 600px;
  text-align: center;
  margin: 40px 0;
}

.deleted-icon {
  font-size: 64px;
  color: #f56c6c;
  margin-bottom: 20px;
  border: 4px solid #f56c6c;
  border-radius: 50%;
  padding: 10px;
}

.product-deleted-notice h2 {
  color: #f56c6c;
  margin-bottom: 15px;
}

.product-deleted-notice p {
  color: #909399;
}

@media (max-width: 768px) {
  .product-info {
    width: 95%;
  }

  .buttons {
    flex-direction: column;
    width: 100%;
  }

  .buttons .el-button {
    width: 100%;
  }

  .product-deleted-notice {
    width: 95%;
    padding: 20px;
  }
}
</style>