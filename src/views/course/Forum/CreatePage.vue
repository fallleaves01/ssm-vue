<template>
  <div class="post-detail-container">
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/myproduct' }">我的课程</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/myproduct/coursepage/' + courseId }">{{ courseName }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/myproduct/coursepage/forum/' + courseId + '/' + forumId }">论坛</el-breadcrumb-item>
      <el-breadcrumb-item>发表帖子</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="breadcrumb-separator"></div>

    <!-- Content to create a new post -->
    <el-form label-width="80px" v-model="postForm" size="small" label-position="right" class="create-post-form">
      <el-form-item label="帖子内容" prop="postName">
        <el-input v-model="postForm.postName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="publishPost">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { CreatePost } from '@/utils/api/CreatePostApi'
import { GetCoursePage } from '@/utils/api/CoursePageApi'
export default {
  data() {
    return {
      courseId: null,
      courseName: '',
      forumId: null,
      postForm: {
        postName: '',
        forumId: null,
      },
    }
  },
  created() {
    let vm = this
    this.courseId = this.$route.params.id
    this.courseName = this.$route.params.courseName
    this.forumId = this.$route.params.forumId
    this.postForm.forumId = this.forumId

    let data = {
      courseId: vm.courseId,
    }
    GetCoursePage(data).then(function (resp) {
      vm.courseName = resp.data.courseName
    })
  },
  methods: {
    publishPost() {
      // Validate postName before submitting
      if (!this.postForm.postName.trim()) {
        this.$message.error('帖子内容不能为空')
        return
      }

      // Call the API to create a new post
      CreatePost(this.postForm).then((resp) => {
        if (resp.data.status === 200) {
          this.$message.success('帖子发布成功')
          // Redirect back to the forum page
          this.$router.push("/myproduct/coursepage/forum/"+this.courseId+"/"+this.forumId)
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },
  },
}
</script>


<style scoped>
.breadcrumb {
  text-decoration: none;
  margin-bottom: 10px;
}

.breadcrumb-separator {
  height: 20px;
}

.create-post-form {
  max-width: 400px;
  margin: 20px auto;
}

.post-input {
  height: 40px; /* Increase the height of the input field */
}
</style>