<template>
  <div class="comment">
    <el-card>
      <template v-slot:header>
        <my-breadcrumb>评论管理</my-breadcrumb>
      </template>

      <!-- el-table-column 的内容定制
           1. 写 prop, prop需要指定成遍历出的对象的属性
           2. 插槽
              comment_status: true  表示关闭了评论状态
              comment_status: false 表示开启了评论状态

              通过作用域插槽, 可以拿到行的数据 row
       -->
      <el-table :data="comments" v-loading="loading">
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="评论状态">
          <template v-slot:default="obj">
            {{ obj.row.comment_status ? '关闭' : '正常'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="obj">
            <el-button @click="changeStatus(obj.row)" v-if="obj.row.comment_status" type="success">打开评论</el-button>
            <el-button @click="changeStatus(obj.row)" v-else type="danger">关闭评论</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        background
        :page-size="per_page"
        :current-page="page"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb.vue'
import { reqGetComments, reqModCommentStatus } from '@/api/comment.js'

export default {
  name: 'Comment',
  components: {
    MyBreadcrumb
  },
  data () {
    return {
      page: 1, // 当前页
      per_page: 10, // 每页条数
      comments: [], // 评论列表的数据
      total: 0, // 总条数
      loading: false
    }
  },
  created () {
    this.getComments()
  },
  methods: {
    async getComments () {
      this.loading = true

      try {
        const res = await reqGetComments(this.page, this.per_page)
        this.comments = res.data.data.results
        this.total = res.data.data.total_count
      } catch (e) {
        console.log(e)
      }

      this.loading = false
    },
    handleCurrentChange (index) {
      // console.log(index)
      this.page = index
      this.getComments()
    },
    async changeStatus (row) {
      try {
        // console.log(row, '当前行的数据')
        // 注意: 这边的 id 是大数, 需要转字符串 .toString
        await reqModCommentStatus(row.id.toString(), !row.comment_status)
        this.$message.success('操作成功')
        this.getComments()
      } catch (e) {
        console.log(e)
        this.$message.error('操作失败')
      }
    }
  }
}
</script>

<style>

</style>
