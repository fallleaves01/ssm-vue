


<template>
        <!-- 面包屑导航区 -->
<el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>创建课程</el-breadcrumb-item>
</el-breadcrumb>
<!-- 返回按钮 -->


<div>
      <el-row :gutter="20" style="margin-top:10px;">

    <el-col :span="16">
        <div >
       <el-card >

        <div>

        <el-form label-width="80px" v-model="courseForm" size="small" label-position="right">
          <el-form-item label="课程名" prop="">
            <el-input  auto-complete="off" v-model="courseForm.courseName" ></el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="">
            <el-input  auto-complete="off" v-model="courseForm.courseInfo" ></el-input>
          </el-form-item>
          <el-form-item label="课程封面" prop="">
            
            <el-upload action="#" ref="upload" list-type="picture-card" :auto-upload="false" :file-list="fileList" :limit="1" :http-request="picUpload">
            <el-icon><Plus /></el-icon>

              <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <!-- <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <el-icon><Download /></el-icon>
                  </span> -->
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <el-icon><Delete /></el-icon>
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

        <!-- 章节信息 -->
        <h3>课程章节</h3>
        <div class="create-course">
    <div v-for="(chapter, index) in chapters" :key="index">
      <div style="display: flex;">
        <div style="flex: 0.3;">
          <el-input v-model="chapter.chapterNo" placeholder="章节号" />
        </div>
        <div style="flex: 0.7;">
          <el-input v-model="chapter.chapterName" placeholder="章节名" />
        </div>
        <div style="flex: 0.6;">
          <el-button @click="removeChapter(index)" type="danger"  circle>
            <el-icon style="vertical-align: middle;">
              <Delete />
            </el-icon>
          </el-button>
        </div>
      </div>
    </div>
    <el-button @click="addChapter" type="success"  circle >
      <el-icon style="vertical-align: middle;">
      <Plus />
    </el-icon>
    </el-button>
    <!-- <button @click="printcha">输出</button> -->
        </div>
        <!-- <template #file="{ file }"> -->
        <div slot="footer" class="dialog-footer">
             <el-button type="primary" @click="createClass">创建课程</el-button> 
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

import {CreateClass,UploadPic} from '@/utils/api/CreateClassApi'

import { Delete, Download, Plus, ZoomIn ,Check} from '@element-plus/icons-vue'
export default{
    data(){
        return{
          fileList: [],
          dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
            courseForm:{
                courseName:'',
                courseInfo:'',
            },
            chapters: [],
            courseId:null,
        };
    },
    methods:{
        createClass()
        {
            var that = this;

            let data = {

                "courseName": that.courseForm.courseName,
                "courseInfo": that.courseForm.courseInfo,
                "chapter":that.chapters
            }
            CreateClass(data).then(function(resp){
                    console.log(resp)
                    if(resp.data.status === 200)
                    {
                        that.courseId=resp.data.courseId
                        that.$message.success("课程创建成功，课程id为:"+resp.data.courseId)
                        that.$refs.upload.submit();
                        that.fileList = [];
                    }
                    else {
                        that.$message.error(resp.data.msg);
                    }
            });
        },
        backallclass()
        {
            this.$router.push('/allclass')
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
    picUpload(f)
    {
      let vm=this
      let params = new FormData()
      params.append("file", f.file);
      params.append("courseId",vm.courseId)
      UploadPic(params).then(function(resp){
        if(resp.data.status==200)
        {
          vm.$message.success("封面上传成功,课程id为："+vm.courseId)
        }
      })
    }
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
  .dialog-footer{
  padding-top:10px ;
  padding-left: 10%;
}
</style>