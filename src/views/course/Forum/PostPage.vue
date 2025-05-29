<template>
  <div class="post-detail-container">
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/myclass' }">我的课程</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/myclass/coursepage/' + courseId }">{{ courseName }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/myclass/coursepage/forum/' + courseId + '/' + forumId }">论坛</el-breadcrumb-item>
      <el-breadcrumb-item>帖子详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="breadcrumb-separator"></div>

    <h1 class="post-name">{{ postName }}</h1>

    <el-button type="primary" @click="replyToPost">回复帖子</el-button>

    <!-- Reply to Post dialog -->
    
    <div v-if="replyToPostDialogVisible" title="回复帖子" style="text-align: center;" width="30%">
      <el-form :model="replyToPostForm" ref="replyToPostForm" label-width="80px">
        <el-form-item label="回复内容" prop="msg">
          <el-input v-model="replyToPostForm.msg" placeholder="请输入回复内容" style="width: 100%;"></el-input>
        </el-form-item>
      </el-form>
          <el-button @click="cancelReplyToPost">取消</el-button>
          <el-button type="primary" @click="sendReplyToPost">提交</el-button>
    </div>

    <el-col :span="50" v-for="layer in layerList" :key="layer.layerId" class="layer">
      <div class="layer-container">
      <div class="post-info">
        <h2>{{ layer.userName }}:</h2>
        <p>{{ layer.msg }}</p>

        <el-button type="text" @click="reply(layer.layerId)">回复</el-button>
        <el-button type="text" @click="loadComments(layer.layerId)">更多评论</el-button>
        <div class="layer-actions">
        <el-button v-if="isUserLayer(layer.number)" type="danger" @click="deleteUserLayer(layer.layerId)">删除</el-button>
      </div>
      </div>
      <!-- <div class="layer-actions">
        <el-button v-if="isUserLayer(layer.number)" type="danger" @click="deleteUserLayer(layer.layerId)">删除</el-button>
      </div> -->
        <div v-if="layer.replyDialogVisible" title="回复评论" width="30%">
          <el-form :model="layer.commentForm" ref="layer.commentForm" label-width="80px">
            <el-form-item label="回复内容" prop="msg">
              <el-input v-model="layer.commentForm.msg" placeholder="请输入回复内容" style="width: 100%;"></el-input>
            </el-form-item>
          </el-form>
          
          <el-button @click="cancelReply(layer)">取消</el-button>
          <el-button type="primary" @click="sendReply(layer.layerId)">发送</el-button>
        </div>

        <div v-if="layer.showComments">
          <el-row :gutter="20">
            <el-col :span="24" v-for="comment in layer.commentList" :key="comment.commentId" class="comment">
              <div class="comment-info">
                <h3>{{ comment.userName }}:</h3>
                <p>{{ comment.msg }}</p>
                <div class="post-actions">
                <el-button v-if="isUserComment(comment.number)" type="my-button" @click="deleteUserComment(comment.commentId)">删除回复</el-button>
              </div>
              </div>
              
            </el-col>
          </el-row>
        
      </div>
      
      </div>
    </el-col>

    

  </div>
</template>

<script>
import { GetCoursePage } from '@/utils/api/CoursePageApi'
import { GetLayers } from '@/utils/api/GetLayersApi'
import { GetComments } from '@/utils/api/GetCommentsApi'
import { CreateComment } from '@/utils/api/CreateCommentApi'
import { CreateLayer } from '@/utils/api/CreateLayerApi'

import { deleteLayer } from '@/utils/api/deleteLayer'
import { deleteComment } from '@/utils/api/deleteComment'
import {getNumber,setNumber,removeNumber} from '@/store/number'

export default {
  data() {
    return {
      forumId: null,
      courseId: null,
      postId: null,
      courseName: '',
      postName: '',

      replyToPostDialogVisible: false,
      replyToPostForm: {
        postId: null,
        msg: '',
        
      },
      
      layerList: [
        {
          layerId: 2,
          number: 1120201234,
          userName: 'ming',
          msg: '',
          level: 1,
          
          commentList: [
            {
              commentId: null,
              msg: '',
              number:1120200001,
              userName:'',
              level:1,

            }
            

          ],
          showComments: false,
          replyDialogVisible: false,
          commentForm: {
            msg: '',
            layerId: null,
          },
        },
      ],
      
    }
  },
  created() {
    let vm = this
    vm.forumId = this.$route.params.forumId
    vm.courseId = this.$route.params.id
    vm.postId = this.$route.params.postId
    vm.replyToPostForm.postId = this.$route.params.postId
    vm.postName = this.$route.params.postName
    let data = {
      'courseId': vm.courseId,
    }
    GetCoursePage(data).then(function (resp) {
      vm.courseName = resp.data.courseName
    })
    data = {
      'postId': vm.postId,
    }
    GetLayers(data).then(function (resp) {
      vm.layerList = resp.data.layerList
      
    })
  },
  methods: {

    sendReplyToPost() {
  // Validate msg before submitting
  if (!this.replyToPostForm.msg.trim()) {
    this.$message.error('回复内容不能为空');
    return;
  }

  // Call the API to create a new layer for the post
  CreateLayer(this.replyToPostForm).then((resp) => {

    
    if (resp.data.status === 200) {
      this.$message.success('回复成功');

      this.replyToPostDialogVisible = false;

    } else {
      this.$message.error(resp.data.msg);
    }
  });
},


    sendReply(layerId) {
      const layer = this.layerList.find((layer) => layer.layerId === layerId);
      console.log('Found Layer:', layer);

      if (!layer.commentForm) {
      console.log('555');
      }
      if (!layer.commentForm.msg.trim()) {
        this.$message.error('回复内容不能为空');
        return;
      }
  
      CreateComment(layer.commentForm).then((resp) => {
        if (resp.data.status === 200) {
          this.$message.success('回复成功');

          layer.replyDialogVisible = false;
          layer.commentForm.msg = '';

        } else {
          this.$message.error("Error");
    }
    
  });
},

reply(layerId) {
  console.log('Reply method called');
  console.log('LayerList:', this.layerList);
  const layer = this.layerList.find((layer) => layer.layerId === layerId);
  console.log('Found Layer:', layer);
  if (layer) {
    console.log('Updated Layer:', layer);
    // 设置属性前检查 commentForm 是否为 undefined
    if (!layer.commentForm) {
      console.log('555');
      layer.commentForm = {
        msg: '',
        layerId: null,
      };
      layer.replyDialogVisible = true;
    }
    if (layer.commentForm) {
      // 查看 layerId 被正确设置
      console.log('Setting layerId:', layerId);
      layer.commentForm.layerId = layerId;

      // 查看设置后的值
      console.log('Updated Layer:', layer);

      // 打开对话框
      layer.replyDialogVisible = true;
      
    } else {
      console.error('commentForm is undefined in the layer.');
    }
  } 
  
  
},


  cancelReply(layer) {
  console.log('Cancel reply method called');
  // 使用 layer.replyDialogVisible 控制当前 layer 的回复对话框显示与隐藏
  layer.replyDialogVisible = false;
  layer.commentForm.msg = ''; // 清空输入内容
},
  

  updateReplyDialog(value, layer) {
  console.log('Update reply dialog method called');
  // 使用 layer.replyDialogVisible 控制当前 layer 的回复对话框显示与隐藏
  if (!value) {
    layer.replyDialogVisible = false;
    this.layer.commentForm.msg = ''; // 关闭对话框时清空输入内容
  }
},

  replyToPost() {
  console.log('Reply to Post method called');
  this.replyToPostDialogVisible = true;
},

    cancelReplyToPost() {
      console.log('Cancel reply to Post method called');
      this.replyToPostDialogVisible = false;
      this.$refs.replyToPostForm.resetFields(); // Clear the form if the user cancels the reply
    },


    moreComments(layerId) {
      // Handle more comments action
      console.log('Viewing more comments for layer:', layerId)
    },
    loadComments(layerId) {
      const vm = this;
      // Use API to get comments based on the layerId
      GetComments({ layerId: layerId }).then((resp) => {
        // Update the commentList for the current layer
        const layer = vm.layerList.find((layer) => layer.layerId === layerId);
        layer.commentList = resp.data.commentList;
        layer.showComments = true;
      });
    },

    isUserLayer(number) {
      
      return number == getNumber();
    },
    deleteUserLayer(layerId) {
      // 调用 deleteLayer 方法删除帖子
      deleteLayer({ layerId: layerId }).then((resp) => {
        if (resp.data.status == 200) {
          // 删除成功后，刷新帖子列表
          //this.refreshLayer();
          this.$message.success('删除成功');
        } else {
          // 删除失败，显示错误信息
          this.$message.error('Error');
        }
      });
    },

    // 刷新帖子列表
    refreshLayer() {
     
    GetLayers(this.postId).then(function (resp) {
      
      this.layerList = resp.data.layerList
    });
    },

    isUserComment(number) {
      
      return number == getNumber();
    },
    deleteUserComment(commentId) {
      
      deleteComment({ commentId: commentId }).then((resp) => {
        if (resp.data.status === 200) {
          // 删除成功后，刷新帖子列表
          // this.refreshComment();
          this.$message.success('删除成功');
        } else {
          // 删除失败，显示错误信息
          this.$message.error('Error');
        }
      });
    },

    // 刷新帖子列表
    // refreshComments() {
    //   data = {
    //   lId: vm.postId,
    // }
    // GetComments({ layerId: layerId }).then((resp) => {
    //     // Update the commentList for the current layer
    //     const layer = vm.layerList.find((layer) => layer.layerId === layerId);
    //     layer.commentList = resp.data.commentList;
    //     layer.showComments = true;
    //   });
    // },





  },
}
</script>

<style scoped>
.post-name {
  text-align: center;
  margin-bottom: 20px;
}


.layer {
  margin-bottom: 20px;
}

.post-container { 
  display: flex;
  justify-content: space-between; /* 或其他对齐方式，根据需要调整 */ 
}

.post-info { 
  flex: 1; /* 让 post-info 部分占据剩余空间 */ 
  padding: 20px; 
  }

.post-actions { 
  float: right; 
  margin-top: 10px; 
  margin-left: 10px; /* 或其他间距，根据需要调整 */ 
  }
.layer-actions { 
  float: right; 
  margin-top: 30px; 
  margin-left: 10px; /* 或其他间距，根据需要调整 */ 
  }

.breadcrumb-separator {
  height: 20px; /* Adjust the height as needed for spacing */
}

.comment-info { 
  padding: 10px; 
  border: 1px solid #eee; 
  border-radius: 5px; 
  margin-bottom: 10px; 
  }

.layer-container { 
  border: 1px solid #ccc; 
  margin: 10px; 
  padding: 10px; 
  }




/* Add more styling as needed */
</style>
