<template>
    <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myclass'}">我的课程</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myclass/coursepage/'+courseId}">{{courseName}}</el-breadcrumb-item>
    <el-breadcrumb-item>课程信息</el-breadcrumb-item>
    </el-breadcrumb>


    <div>
      <el-row :gutter="20" style="margin-top:10px;">

    <el-col :span="10">
        <div >
       <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>课程信息</span>
        </div>
        <div>
            <el-form label-width="80px" size="small" label-position="right">
                <el-form-item label="课程名" prop="">
                    <el-input  auto-complete="off" v-model="courseName" :disabled="!isEditing"></el-input>
                </el-form-item>
                <el-form-item label="课程简介" prop="">
                    <el-input type="textarea" auto-complete="off" v-model="courseInfo" :disabled="!isEditing"></el-input>
                </el-form-item>

                <!-- 课程封面 -->
                <el-form-item label="新课程封面" prop="">
            
            <el-upload action="#" ref="upload" list-type="picture-card" :auto-upload="false" :file-list="fileList" :limit="1" :http-request="picUpload" :disabled="!isEditing">
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

<!-- 章节 -->
            <h3>课程章节</h3>
        <div class="create-course">
    <div v-for="(chapter, index) in chapters" :key="index">
      <div style="display: flex;">
        <div style="flex: 0.3;">
          <el-input v-model="chapter.chapterNo" placeholder="章节号" :disabled="!chapter.edit||!isEditing"/>
        </div>
        <div style="flex: 0.7;">
          <el-input v-model="chapter.chapterName" placeholder="章节名" :disabled="!isEditing"/>
        </div>
        <div style="flex: 0.6;" v-if="chapter.edit&&isEditing">
          <el-button @click="removeChapter(index)" type="danger"  circle>
            <el-icon style="vertical-align: middle;">
              <Delete />
            </el-icon>
          </el-button>
        </div>
        <div style="flex: 0.6;" v-if="chapter.edit&&!isEditing"> 
        </div>
        <div style="flex: 0.6;" v-if="!chapter.edit">
            
        </div>
      </div>
    </div>
    <el-button @click="addChapter" type="success"  circle v-if="isEditing">
      <el-icon style="vertical-align: middle;">
      <Plus />
    </el-icon>
    </el-button>
    <!-- <button @click="printcha">输出</button> -->
        </div>


        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toggleEditing">{{ isEditing ? '保存' : '编辑' }}</el-button>
        </div>
        </el-card>
        </div>
    </el-col>

</el-row>
</div>

</template>

<script>
import {GetCoursePage} from '@/utils/api/CoursePageApi'
import {ChangeCourseInfo} from '@/utils/api/CourseInfoApi'
import {getLevel,setLevel,removeLevel} from '@/store/level'
import { Delete, Download, Plus, ZoomIn ,Check} from '@element-plus/icons-vue'
import {CreateClass,UploadPic} from '@/utils/api/CreateClassApi'
export default{
    data(){
        return{

            dialogImageUrl: '',
      dialogVisible: false,
            isEditing:false,
            courseId:null,
            courseName:'',
            courseInfo:'',
            level:null,
            chapters:[],
            fileList: [],
        };
    },
    created()
    {
        let vm=this
        vm.courseId=this.$route.params.id
        vm.level=getLevel()
        let data={
            "courseId":vm.courseId
        }
        GetCoursePage(data).then(function(resp){
            vm.courseName=resp.data.courseName
            vm.courseInfo=resp.data.courseInfo
            resp.data.chapter.forEach((item,index)=>{
                vm.chapters.push({ chapterNo: item.chapterNo, chapterName: item.chapterName,edit:false });
            })
            
        });


    },
    methods:
    {
        addChapter() {
          this.chapters.push({ chapterNo: null, chapterName: '',edit:true });
        },
        toggleEditing()
            {
            let vm=this
            if(this.isEditing)
            {
                vm.chapters.forEach((item,index)=>{
                    delete item.edit
                })
                let data={
                    "courseId":vm.courseId,
                    "courseName":vm.courseName,
                    "chapter":vm.chapters,
                    "courseInfo":vm.courseInfo
                }
                ChangeCourseInfo(data).then(function(resp){
                    if(resp.data.status==200){
                        vm.$message.success("修改成功")
                        if(vm.fileList!==[])
                        {
                            vm.$refs.upload.submit();
                            vm.fileList = [];
                        }
                    }
                    else{
                        vm.$message.error(resp.data.message)
                    }
                })
                
                
            }
            this.isEditing = !this.isEditing;
            }
            ,
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
                },
                handleRemove(file) {
                console.log(file)
                this.fileList = [];

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
                    vm.$message.success("封面更新成功,课程id为："+vm.courseId)
                    }
                })
                }
    }
}
</script>

<style>
  .box-card {
    width: 100%;
  }
</style>