<template>
  <div>
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/myproduct' }">我的课程</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/myproduct/coursepage/' + courseId }">{{ courseName }}</el-breadcrumb-item>
      <el-breadcrumb-item>论坛</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Add margin between breadcrumb and forum posts -->
    <div class="breadcrumb-separator"></div>

    <!-- Add Post button -->
    <div class="post-button-container">
      <el-button type="primary" @click="goToCreatePage">发表帖子</el-button>
    </div>

    <!-- 论坛主页 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card v-for="post in PostTableData" :key="post.postId" class="forum-card">
          
    <div class="post-container">
      <router-link :to="'/myproduct/coursepage/forum/post/' + courseId + '/' + forumId + '/' + post.postId + '/' + post.postName">
      <div class="post-info">
        <h2 class="post-title">{{ post.postName }}</h2>
        <p class="post-author">发帖人：{{ post.userName }}</p>
      </div>
      </router-link>
      <div class="post-actions">
        <el-button v-if="isUserPost(post.number)" type="danger" @click="deleteUserPost(post.postId)">删除</el-button>
      </div>
    </div>
  
            
          
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetCoursePage } from '@/utils/api/CoursePageApi'
import { GetPosts } from '@/utils/api/GetPostsApi'
import { deletePost } from '@/utils/api/deletePost'
import {getNumber,setNumber,removeNumber} from '@/store/number'

export default {
  data() {
    return {
      forumId: null,
      courseId: null,
      courseName: '',
      PostTableData: [
        {
          postId: null,
          number: null,
          userName: null,
          postName: null,
          level: null,
        },
      ],
    }
  },
  created() {
    let vm = this
    vm.forumId = this.$route.params.forumId
    vm.courseId = this.$route.params.id

    let data = {
      'courseId': vm.courseId,
    }

    GetCoursePage(data).then(function (resp) {
      vm.courseName = resp.data.courseName
    })

    data = {
      'forumId': vm.forumId,
    }

    GetPosts(data).then(function (resp) {
      vm.PostTableData = resp.data.postList
    })
  },
  methods: {
    goToCreatePage() {
      // Redirect to the create post page
      this.$router.push("/myproduct/coursepage/forum/createpage/" + this.courseId + '/' + this.forumId );
    },
    isUserPost(number) {

      return number == getNumber();

    },
    deleteUserPost(postId) {
      // 调用 deletePost 方法删除帖子

      deletePost({ postId: postId }).then((resp) => {
        if (resp.data.status === 200) {
          // 删除成功后，刷新帖子列表
          this.refreshPosts();
          this.$message.success('删除成功');
        } else {
          // 删除失败，显示错误信息
          this.$message.error('Error');
        }
      });
    },

    // 刷新帖子列表
    refreshPosts() {
      let data = {
        'forumId': this.forumId,
      };

      GetPosts(data).then((resp) => {
        this.PostTableData = resp.data.postList;
      });
    },
  

  },
}
</script>


<style scoped>
.breadcrumb {
  text-decoration: none; /* Remove underline from breadcrumb */
  margin-bottom: 10px; /* Add margin at the bottom of breadcrumb */
}

.breadcrumb-separator {
  height: 20px; /* Adjust the height as needed for spacing */
}

.forum-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-container {
  display: flex;
  justify-content: space-between; /* 或其他对齐方式，根据需要调整 */
}

.post-info {
  flex: 1; /* 让 post-info 部分占据剩余空间 */
  padding: 20px;
  text-decoration: none; /* 移除下划线 */
}

.post-actions {
  margin-top: 30px;
  margin-left: 10px; /* 或其他间距，根据需要调整 */
}


.post-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  text-decoration: none; /* 移除下划线 */
}

.post-author {
  color: #666;
  text-decoration: none; /* 移除下划线 */
}
.post-button-container {
  text-align: center;
  margin-bottom: 20px;
}


/* Add more styling as needed */
</style>
