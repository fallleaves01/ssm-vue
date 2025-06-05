<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>创建商品</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 返回按钮 -->


  <div>
    <el-row :gutter="20" style="margin-top:10px;">

      <el-col :span="16">
        <div>
          <el-card>

            <div>

              <el-form label-width="100px" v-model="productForm" size="small" label-position="right">
                <el-form-item label="商品名" prop="">
                  <el-input auto-complete="off" v-model="productForm.productName"></el-input>
                </el-form-item>
                <el-form-item label="商品简介" prop="">
                  <el-input auto-complete="off" v-model="productForm.productInfo"></el-input>
                </el-form-item>
                <el-form-item label="开始拍卖时间" prop="startAuctionTime">
                  <el-date-picker v-model="productForm.startAuctionTime" type="datetime" placeholder="选择开始拍卖时间"
                    style="width: 100%;"></el-date-picker>
                </el-form-item>
                <!-- 添加起拍价 -->
                <el-form-item label="起拍价(元)" prop="startPrice">
                  <el-input-number v-model="productForm.startPrice" :min="0" style="width: 100%;" />
                </el-form-item>
                <!-- 添加拍卖持续时间 -->
                <el-form-item label="拍卖持续时间(小时)" prop="durationHours">
                  <el-input-number v-model="productForm.durationHours" :min="1" style="width: 100%;" />
                </el-form-item>                <el-form-item label="商品图片" prop="image">

                  <el-upload 
                    action="#" 
                    ref="upload" 
                    list-type="picture-card" 
                    :auto-upload="false" 
                    :file-list="fileList"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :on-change="handleFileChange"
                    :before-upload="beforeUpload"
                    :on-remove="handleRemove"
                  >
                    <template #trigger v-if="fileList.length === 0">
                      <el-icon style="font-size:32px;cursor:pointer;">
                        <Plus />
                      </el-icon>
                    </template>
                    <template #file="{ file }">
                      <div>
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                            <el-icon><zoom-in /></el-icon>
                          </span>
                          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                            <el-icon>
                              <Delete />
                            </el-icon>
                          </span>
                        </span>
                      </div>
                    </template>
                    <template #tip>
                      <div class="el-upload__tip">
                        只能上传 JPG/PNG 文件，且不超过 5MB
                      </div>
                    </template>
                  </el-upload>

                  <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                  </el-dialog>

                </el-form-item>
              </el-form>              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createproduct">创建商品</el-button>
                <el-button @click="backallproduct">返回</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

    </el-row>
  </div>
</template>
<script>

import { CreateCourse } from '@/utils/api/CreateProductApi'
import { CreateProduct } from '@/utils/api/ProductApi';
import { Delete, Download, Plus, ZoomIn, Check } from '@element-plus/icons-vue'
export default {
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      productForm: {
        productName: '',
        productInfo: '',
        startAuctionTime: null,
        // 添加起拍价字段
        startPrice: null,
        // 添加拍卖持续时间字段
        durationHours: null,
      },
      chapters: [],
      product_id: null,
    };
  },  methods: {
    createproduct() {
      var that = this;
      // 表单验证
      if (!that.productForm.productName) {
        that.$message.error("请输入商品名称");
        return;
      }
      if (!that.productForm.startAuctionTime) {
        that.$message.error("请选择开始拍卖时间");
        return;
      }
      if (!that.productForm.startPrice) {
        that.$message.error("请设置起拍价");
        return;
      }
      if (!that.productForm.durationHours) {
        that.$message.error("请设置拍卖持续时间");
        return;
      }
      if (that.fileList.length === 0) {
        that.$message.error("请上传商品图片");
        return;
      }

      let image = (that.fileList[0] && that.fileList[0].raw) ? that.fileList[0].raw : null;
      
      // 显示加载中提示
      const loading = that.$loading({
        lock: true,
        text: '正在创建商品...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
        CreateProduct(
        that.productForm.productName,
        that.productForm.productInfo,
        image,
        that.productForm.startPrice,
        that.productForm.durationHours,
        that.productForm.startAuctionTime
      ).then(function (resp) {
        console.log('API响应：', resp);
        loading.close(); // 关闭加载提示
        
        // 检查响应是否成功
        if (resp.status === 200) {
          let responseData = resp.data;
  
          // 处理响应数据
          that.product_id = responseData.product_id || '未知';
          that.$message.success("商品创建成功" + (responseData.product_id ? "，id为:" + responseData.product_id : ""));
          
          // 重置表单
          that.fileList = [];
          that.productForm = {
            productName: '',
            productInfo: '',
            startAuctionTime: null,
            startPrice: null,
            durationHours: null,
          };
        } else {
          let errorMsg = "创建失败，请重试";
          if (resp.data) {
            if (typeof resp.data === 'string') {
              try {
                const errorData = JSON.parse(resp.data);
                errorMsg = errorData.msg || errorMsg;
              } catch(e) {
                errorMsg = resp.data || errorMsg;
              }
            } else {
              errorMsg = resp.data.msg || errorMsg;
            }
          }
          that.$message.error(errorMsg);
        }
      }).catch(function(error) {
        loading.close(); // 关闭加载提示
        console.error("创建产品时出错:", error);
        that.$message.error("网络错误，请重试");
      });
    },
    backallproduct() {
      this.$router.push('/allproduct')
    },
    addChapter() {
      this.chapters.push({ chapterNo: null, chapterName: '' });
    },
    removeChapter(index) {
      this.chapters.splice(index, 1);
    },
    // 图片相关处理方法
    handleExceed() {
      this.$message.warning('最多只能上传1张图片');
    },
    beforeUpload(file) {
      // 验证文件类型
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return false;
      }
      
      // 验证文件大小 (5MB = 5 * 1024 * 1024 bytes)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB!');
        return false;
      }
      
      return true;
    },
    handleFileChange(file) {
      // 保存文件对象到fileList
      this.fileList = [file];
    },
    handleRemove() {
      this.fileList = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
  }
}

</script>
<style>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.bg-purple {
  background: #d3dce6;
}

.box-card {
  width: 100%;
}

.dialog-footer {
  padding-top: 10px;
  padding-left: 10%;
}
</style>