<template>
  <div class="my-cover">
    <!-- 图片按钮 -->
    <div class="btn_img" @click="openDialog">
      <!-- 如果是动态的设置的, 脚手架, 就不能帮我们进行处理了 -->
      <!-- 正常工作中, 一般都是设置完整的路径 -->
      <img :src="value || imgSrc" />
    </div>
    <!-- 对话框 -->
    <el-dialog
      title="选择封面"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="720px">

      <!-- tab组件 -->
      <!-- v-model="activeName" 激活的tab栏, 根据name激活的 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <div class="top-box">
            <el-radio-group @change="changeCollect" size="medium" v-model="collect">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
          </div>

          <el-row :gutter="10" class="img_list">
            <el-col
              @click.native="changeSelect(item)"
              v-for="item in images"
              :key="item.id"
              class="img_item"
              :class="{ selected: selectedImageUrl === item.url }"
              :xs="12" :sm="8" :md="6" :lg="4" :xl="4">
              <el-image style="height: 100px; width: 100%;" :src="item.url" fit="cover"></el-image>
            </el-col>
          </el-row>

          <el-pagination
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            background
            :page-size="per_page"
            :current-page="currentPage"
            :total="total_count">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            :action="$http.defaults.baseURL  + '/mp/v1_0/user/images'"
            :show-file-list="false"
            :headers="headers"
            name="image"
            :on-success="handleSuccess">
            <el-image v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <!-- 对话框的底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqGetImages } from '@/api/pictures.js'
import { getUser } from '@/utils/storage.js'
import DefaultImg from '@/assets/default.png'

export default {
  name: 'MyCover',
  props: ['value'], // 父组件传过来的默认值
  data () {
    return {
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 当前tabs组件激活的选项卡的name属性的值
      activeName: 'image',
      images: [], // 素材列表
      collect: false, // 全部
      per_page: 2, // 每页条数
      currentPage: 1, // 当前页
      total_count: 0, // 总条数
      selectedImageUrl: '', // 选中的图片的地址 (素材库的选中地址)
      imageUrl: '', // 上传的图片的地址 (文件上传的选中地址)
      imgSrc: DefaultImg,
      headers: {
        Authorization: `Bearer ${getUser().token}`
      }
    }
  },
  created () {

  },
  methods: {
    openDialog () {
      // 显示对话框
      this.dialogVisible = true
      // 显示对话框后, 发送请求获取素材数据
      this.loadImages()
    },
    async loadImages () {
      // 发送请求获取素材库图片
      const res = await reqGetImages({
        collects: this.collect,
        page: this.currentPage,
        per_page: this.per_page
      })
      this.images = res.data.data.results
      this.total_count = res.data.data.total_count
      console.log(this.images, this.total_count)
    },
    handleCurrentChange (val) {
      // val 当前页
      // 更新当前页
      this.currentPage = val
      this.loadImages()
    },
    changeCollect () {
      this.currentPage = 1
      this.loadImages()
    },
    changeSelect (item) {
      this.selectedImageUrl = item.url
    },
    handleSuccess (res, file) {
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
    },
    // 处理确认图片, 将图片进行预览展示
    handleConfirm () {
      // 子传父, 将选择的图片, 进行预览
      if (this.activeName === 'image') {
        // 选择素材库
        if (!this.selectedImageUrl) {
          this.$message.error('请选择封面')
          return
        }
        this.imgSrc = this.selectedImageUrl
      } else if (this.activeName === 'upload') {
        // 自行上传封面
        if (!this.imageUrl) {
          this.$message.error('请上传封面')
          return
        }
        this.imgSrc = this.imageUrl
      }
      // 将最终确定的图片地址, 提交给父组件
      this.$emit('input', this.imgSrc)
      // 隐藏对话框
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang='less'>
// 图片按钮
.btn_img {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

// 素材列表
.img_list {
  margin-top: 15px;
  .img_item{
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 15px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}

// <div class="selected"></div>
.selected::after{
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3) url(../assets/selected.png) no-repeat center / 50px 50px;
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
</style>
