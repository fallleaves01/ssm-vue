<template>

    <el-breadcrumb >
    <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct'}">我的课程</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/myproduct/coursepage/'+courseId}">{{courseName}}</el-breadcrumb-item>
    <el-breadcrumb-item>文件</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 上传文件 -->
    <el-button @click="ShowCreateDocument" v-if="level==2">{{ showCreateDocu ? '隐藏' : '上传文件' }}</el-button>
    <div v-if="showCreateDocu">
        <div>
            <el-row :gutter="20" style="margin-top:10px;">
    <el-col :span="16">
    <div class="grid-content bg-purple">
       <el-card class="box-card">
            <div class="parent">

                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :http-request="picUpload"
                    :on-success="handleSuccess"
                    multiple
                    :file-list="fileList"
                    :limit="1"
                    :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                
            </el-upload>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" >
                    上传文件
            </el-button>
            </div>
            
            <el-form label-width="80px">

                <el-form-item label="文件名" prop="">
                    <el-input  auto-complete="off" v-model="document.documentName" ></el-input>
                </el-form-item>
                <el-form-item label="章节" >
                    <el-select v-model="document.chapter">
                    <el-option v-for="(chapter,index) in chapterList" :key="chapter.chapterNo" :label="getLabel(chapter)" :value="chapter.chapterNo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="">
                    <el-input  auto-complete="off" v-model="document.documentInfo" ></el-input>
                </el-form-item>
            </el-form>
            
    </el-card>
    </div>
    </el-col>
</el-row>
        </div>
  
    </div>

    <!-- 文件列表 -->

    <div class="document-list">
        <el-collapse v-model="expandedChapter">
          <el-collapse-item v-for="(documents, chapter) in classifiedDocumentList" :title="'第' + chapter + '章'" :name="chapter" :key="chapter">
            <ul>
              <li v-for="document in documents" :key="document.documentId" >
                <el-row :gutter="20" class="problem-item">
                  <el-card class="easy-card">
                    <div class="card-content">

                        <div class="text">
                        <p>文件名：{{document.documentName}}</p>
                        <p>备注：{{ document.documentInfo}}</p>
                       
                        
                        </div>
                    <div class="button">
                        <el-button type="success" @click="DocumentDonload(document.documentId)"    >下载</el-button>
                        <el-button type="danger" @click="deleteDocument(document.documentId)"   v-if="level==2" >删除</el-button>

                    </div>

                    </div>
                    

                  </el-card>
                </el-row>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>

  </template>
  
  <script>
  import {GetCoursePage} from '@/utils/api/CoursePageApi'
import {UploadDocument,DocumentList,DownloadDocument,DeleteDocument} from '@/utils/api/DocumentListApi'
import {getLevel,setLevel,removeLevel} from '@/store/level'

  export default {
      data() {
          return {

            level:null,
            showCreateDocu:false,
                courseId:null,
                courseName:'',
                chapterList:[],
                document:{
                    documentName:'',
                    chapter:null,
                    documentInfo:'',
                },
              fileList: [],
                documentList:[],
              note: '' // 备注信息
          }
      },
      computed: {
      classifiedDocumentList() {
        const classified = {};
        this.documentList.forEach(document => {
          if (!classified[document.chapter]) {
            classified[document.chapter] = [];
          }
          classified[document.chapter].push(document);
        });
        return classified;
      }
    },
      created()
    {
        let vm=this
        vm.courseId=this.$route.params.id
        vm.level= getLevel()
        let data={
            "courseId":vm.courseId
        }
        GetCoursePage(data).then(function(resp){
            vm.courseName=resp.data.courseName
            vm.chapterList=resp.data.chapter
        });
        DocumentList(data).then(function(resp){
            vm.documentList=resp.data.documentList
        })

    },
      methods: {
            handleSuccess(response, file, fileList) {
            // 文件上传成功后禁用文件输入框的点击事件
            this.$refs.upload.$refs['input'].click = function() {}; // 禁用文件输入框的点击事件
            },

          submitUpload() {
              this.$refs.upload.submit();
              //this.fileList = [];
              //this.document.documentName=''
              //this.document.chapter=null
              //this.document.documentInfo=''
          },
          picUpload(f) {
              let vm=this
              let params = new FormData()
              params.append("file", f.file);
              params.append("documentInfo", vm.document.documentInfo); // 添加备注信息到请求参数中
              params.append("courseId", vm.courseId);
              params.append("documentName", vm.document.documentName);
              params.append("chapter", vm.document.chapter);
            console.log(params.get("documentInfo"))
            console.log(vm.document.documentInfo)
            console.log("try upload!!!")
              UploadDocument(params).then(function(resp){
                if(resp.data.status==200)
                {
                    vm.$message.success('文件上传成功，文件ID为：'+resp.data.documentId)
                    vm.fileList = [];
                    vm.document.documentName=''
                    vm.document.chapter=null
                    vm.document.documentInfo=''
                }
                else{
                    vm.$message.error("文件上传失败");
                }
              });
              
          },
          getLabel(chapter) {
      return `${chapter.chapterNo} - ${chapter.chapterName}`
    },
    ShowCreateDocument()
    {
        this.showCreateDocu=!this.showCreateDocu
    },
    DocumentDonload(documentid)
    {
        // this.$message.success("文件下载成功，文件id为："+documentid)
        let data={
            "documentId":documentid
        }
        DownloadDocument(data).then(function(res){
         console.log("下载的文件流",res)
        const link=document.createElement('a');
        try{
	          // let blob = new Blob([res.data],{type: 'application/vnd.ms-excel'});    //如果后台返回的不是blob对象类型，先定义成blob对象格式
	          let blob =  res.data    //如果后台返回的直接是blob对象类型，直接获取数据
	          let _fileName = res.headers['content-disposition'].split(';')[1].split('=')[1]; //拆解获取文件名，
	          link.style.display='none';
	        
	          // 兼容不同浏览器的URL对象
	          const url = window.URL || window.webkitURL || window.moxURL;
	          link.href=url.createObjectURL(blob);
	          link.download = _fileName;   //下载的文件名称
	          link.click();
	          window.URL.revokeObjectURL(url);  //  #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建的对象URL. 当你要已经用过了这个对象URL,然后要让浏览器知道这个URL已经不再需要指向对应的文件的时候,就需要调用这个方法.

      }
       catch (e) {
          console.log('下载的文件出错',e)
        }
			
        }
      )

    },
    deleteDocument(documentid)
    {
        let vm=this
        let data={
            "documentId":documentid
        }
        DeleteDocument(data).then(function(resp){
            if(resp.data.status==200)
            {
                vm.$message.success('删除成功')
            }
            else
            {
                vm.$message.error(resp.data.msg);
            }
        })
    }
      }
  }
  </script>

<style scoped>
.document-list {
  max-width: 1500px;
  margin: 50px auto 0;
  border: 1px solid #bfd8d2;
  padding: 10px;
  background-color: #fff;
}

.problem-item {
  margin-top: 10px;
}

.easy-card {
  background-color: #eaffd0; /* 浅绿色 */
  width:80%;
}


.box-card {
  width: 100%;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .parent {
  display: flex;
  justify-content: space-evenly;
}
</style>