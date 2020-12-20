<template>
  <div class="pictures">
    <el-card class="box-card">
      <template v-slot:header>
        <my-breadcrumb>素材管理 </my-breadcrumb>
      </template>

      <div class="top-box">
        <!-- 左侧的按钮组 -->
        <!-- label是收集给后台的数据, 内容才是显示给用户看的 -->
        <el-radio-group @change="changeCollect" size="medium" v-model="collect">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 右侧的上传按钮 -->
        <el-button @click="showUpload" style="float: right;" size="medium" type="success">上传图片素材</el-button>
      </div>

      <!--
        el-row 行 :gutter="10", 列的间距
        el-col 列
          xs 超小屏 sm 小屏 md 中屏 lg 大屏 xl 超大屏
          一行 24份
       -->
      <el-row :gutter="10">
        <el-col
          v-for="item in images"
          :key="item.id"
          class="img_item"
          :xs="12" :sm="8" :md="6" :lg="4" :xl="4"
        >
          <el-image style="height: 180px; width: 100%;" :src="item.url" fit="cover"></el-image>
          <div class="option">
            <span @click="collectImage(item.id, item.is_collected)" :class="{ yellow: item.is_collected }" class="el-icon-star-off"></span>
            <span @click="deleleImage(item.id)" class="el-icon-delete"></span>
          </div>
        </el-col>
      </el-row>

      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="per_page"
        :current-page="currentPage"
        :total="total_count">
      </el-pagination>
    </el-card>

    <!--
      visible 控制显示隐藏
      append-to-body 控制是否将dialog元素, 直接作为子节点添加到body中
     -->
    <el-dialog
      title="请选择图片"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="30%">

      <!--
        elementUI 帮你封装好了文件上传的操作, 你只需要提供好地址, 参数即可
        1. action: 上传文件的地址, 需要完整的路径
           原因: 我们之前不用写完整的路径, 是因为axios,设置了baseURL, 当你使用axios,
           发送请求, 会自动拼接, 但是, 这里不是我们发送的, 需要传完整的地址
        2. on-success: 成功的函数
        3. before-upload: 上传前的函数 (做一些校验, 不通过要求, 不让上传, 文件大小, 文件格式)
        4. headers 配置请求头
           原因: element帮你封装好了上传操作, 不走axios, axios请求拦截器拦不到他的请求, 不能帮你带token
           就需要手动携带
        5. name 配置请求时, 图片的name, 将来后台才能正确保存接收
       -->
      <el-upload
        class="avatar-uploader"
        :action="$http.defaults.baseURL  + '/mp/v1_0/user/images'"
        :show-file-list="false"
        :headers="headers"
        name="image"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <el-image @load="handleLoad" v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

    </el-dialog>

  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb.vue'
import { reqGetImages, reqCollectImage, reqDeleteImage } from '@/api/pictures.js'
import { getUser } from '@/utils/storage.js'
export default {
  name: 'pictures',
  components: {
    MyBreadcrumb
  },
  created () {
    this.loadImages()
  },
  data () {
    return {
      images: [], // 素材列表
      collect: false, // 全部
      per_page: 6, // 每页条数
      currentPage: 1, // 当前页
      total_count: 0, // 总条数
      dialogVisible: false, // 默认隐藏
      imageUrl: '', // 预览的图片路径
      headers: {
        Authorization: `Bearer ${getUser().token}`
      }
    }
  },
  methods: {
    // 加载图片
    async loadImages () {
      try {
        const res = await reqGetImages({
          page: this.currentPage,
          per_page: this.per_page,
          collect: this.collect
        })
        this.images = res.data.data.results
        this.total_count = res.data.data.total_count
        console.log(res.data.data)
      } catch (err) {
        console.log(err)
      }
    },
    // 当前页变化, 切换分页
    handleCurrentChange (index) {
      // console.log(index)
      // 更新当前页
      this.currentPage = index
      // 重新渲染
      this.loadImages()
    },
    changeCollect () {
      // 重置成第一页
      this.currentPage = 1
      // 重新渲染
      this.loadImages()
    },
    showUpload () {
      this.dialogVisible = true
    },
    handleSuccess (res, file) {
      // console.log('文件上传完成了', res)
      this.imageUrl = res.data.url
      this.loadImages()
      this.$message.success('上传成功')
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传素材图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传素材图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleLoad () {
      // 图片预览加载完毕, 隔两秒后, 关闭对话框
      setTimeout(() => {
        this.dialogVisible = false
        this.imageUrl = null
      }, 2000)
    },
    async collectImage (id, collect) {
      try {
        // 发送收藏/取消收藏请求
        await reqCollectImage(id, !collect)
        this.$message.success('操作成功')
        this.loadImages()
      } catch (err) {
        this.$message.success('操作失败')
        console.log(err)
      }
    },
    async deleleImage (id) {
      try {
        await reqDeleteImage(id)
        this.$message.success('操作成功')
        // 如果删除, 删除到了当前页的最后一张, 应该渲染的是上一页
        if (this.images.length === 1 && this.currentPage > 1) {
          this.currentPage--
        }
        this.loadImages()
      } catch (err) {
        console.log(err)
        this.$message.success('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-radio-group {
  margin-bottom: 15px;
}
.img_item {
  position: relative;
  box-sizing: border-box;
}
.option {
  position: absolute;
  left: 5px;
  right:5px;
  bottom: 5px;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: #fff;
  span {
    margin: 0 30px;
    cursor: pointer;
  }
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
.el-pagination {
  margin-top: 20px;
}
.yellow {
  color: yellow;
}
// .pictures类, 在模板中能找到, 后面的类, 可以不受scoped的限制, 后面的类, 是可以不在模板中的, 也能生效
// .pictures /deep/ .el-pager li.active {
//   background-color: red;
//   border-radius: 2px;
//   color: #fff;
// }
.pictures {
  /deep/ .el-pager li.active {
    background-color: red;
    border-radius: 2px;
    color: #fff;
  }
}
</style>

<style lang="less">
// 不加scoped, 就可以不受scoped的影响, 特征: 只要满足类, 就能生效
// .pictures .el-pager li.active {
//   background-color: red;
//   border-radius: 2px;
//   color: #fff;
// }
</style>
