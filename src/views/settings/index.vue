<template>
  <div class='settings-container'>
    <el-card>
      <!-- 导航 -->
      <div slot="header">
        <my-breadcrumb>个人设置</my-breadcrumb>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">100</el-form-item>
            <el-form-item label="手机：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体简介：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="save" type="primary">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传组件 action必须属性-->
          <!-- el-upload 默认的上传方式, post, 而接口需要的 patch, 所以不能用他默认的上传了
               需要配置一个参数 http-request 去覆盖默认的 post上传请求, 通过自己的方式上传 (formData)
          -->
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleUpload">
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="edit-photo">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb.vue'
import { reqGetUserInfo, reqModUserInfo, reqModUserImg } from '@/api/user.js'
export default {
  name: 'Settings',
  components: {
    MyBreadcrumb
  },
  data () {
    return {
      // 用户信息
      userInfo: {
        name: 'test',
        intro: 'info',
        email: 'info@qq.com',
        mobile: '17788889999',
        photo: ''
      },
      // 支持上传组件的数据
      imageUrl: null
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo () {
      const res = await reqGetUserInfo()
      this.userInfo = res.data.data
    },
    async save () {
      try {
        // 发送请求, 进行修改
        const { name, intro, email } = this.userInfo
        const res = await reqModUserInfo({
          name,
          intro,
          email
        })
        this.$message.success('操作成功')
        // 将修改后的name, 传递给layout
        // 触发事件, 传值
        this.$eventBus.$emit('user_update_name', name)
      } catch (e) {
        console.log(e)
        this.$message.error('操作失败')
      }
    },
    async handleUpload (obj) {
      try {
        // console.log('要进行上传了', obj)
        // 利用formData进行异步文件上传 (xhr2.0)
        // 1. 创建 formData 对象
        const formData = new FormData()
        // 2. 收集参数 formData.append(key, value) value支持文件对象
        formData.append('photo', obj.file)
        // 3. 基于formData发送请求
        const res = await reqModUserImg(formData)
        // 通过修改数据, 更新视图
        this.userInfo.photo = res.data.data.photo
        this.$message.success('操作成功')

        // 触发bus的事件, 传值
        this.$eventBus.$emit('user_update_photo', this.userInfo.photo)
      } catch (e) {
        console.log(e)
        this.$message.error('操作失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.avatar{
  width: 178px;
  height: 178px;
  line-height: 178px;
}
.avatar-uploader {
    text-align: center;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.edit-photo{
  font-size: 12px;
  text-align: center;
}
</style>
