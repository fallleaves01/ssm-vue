<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>创建课程</el-breadcrumb-item>
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
                  <el-date-picker
                    v-model="productForm.startAuctionTime"
                    type="datetime"
                    placeholder="选择开始拍卖时间"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
                <!-- 添加起拍价 -->
                <el-form-item label="起拍价(元)" prop="startPrice">
                  <el-input-number
                    v-model="productForm.startPrice"
                    :min="0"
                    style="width: 100%;"
                  />
                </el-form-item>
                <!-- 添加拍卖持续时间 -->
                <el-form-item label="拍卖持续时间(小时)" prop="durationHours">
                  <el-input-number
                    v-model="productForm.durationHours"
                    :min="1"
                    style="width: 100%;"
                  />
                </el-form-item>
                <el-form-item label="商品图片" prop="">

                  <el-upload action="#" ref="upload" list-type="picture-card" :auto-upload="false" :file-list="fileList" :limit="1">
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
                  </el-upload>

                  <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                  </el-dialog>



                </el-form-item>
              </el-form>

              <!-- <template #file="{ file }"> -->
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createproduct">创建课程</el-button>
              </div>
              <!-- </template> -->
            </div>
          </el-card>
        </div>
      </el-col>

    </el-row>
  </div>
</template>
<script>

import { CreateProduct } from '@/utils/api/CreateProductApi'

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
      courseId: null,
    };
  },
  methods: {
    createproduct() {
      var that = this;
      let formData = new FormData();
      formData.append("product_name", that.productForm.productName);
      formData.append("descreption", that.productForm.productInfo);
      formData.append("start_price", that.productForm.startPrice);
      formData.append("due_time", that.productForm.durationHours);
      formData.append("plan_start_time", that.productForm.startAuctionTime);
      if (that.fileList[0] && that.fileList[0].raw) {
        formData.append("image", that.fileList[0].raw);
      }
      CreateProduct(formData).then(function (resp) {
        console.log(resp)
        if (resp.data.status === 200) {
          that.courseId = resp.data.courseId
          that.$message.success("商品创建成功，id为:" + resp.data.courseId)
          that.fileList = [];
        }
        else {
          that.$message.error(resp.data.msg);
        }
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
    // printcha() {
    //   this.chapters.forEach(function (item) {
    //     console.log(item.number);
    //     console.log(item.name);
    //   });
    // }
    handleRemove(file) {
      console.log(file)
      this.fileList = [];

    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
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