<template>
  <div class="articles">
    <!-- 上半部卡片 -->
    <el-card class="box-card">
      <!-- 具名插槽, 将来就会分发给 <slot name="header"></slot> -->
      <template v-slot:header>
        <!-- 面包屑 -->
        <my-breadcrumb>内容管理</my-breadcrumb>
      </template>

      <!-- 内容部分, 默认插槽, 分发给 <slot></slot> -->
      <el-form ref="form" :model="form" label-width="40px">
        <el-form-item label="状态">
          <!-- el-radio, label值就是将来要收集的信息,
               如果标签内, 没有写内容, 就默认展示label的值
          -->
          <el-radio-group v-model="form.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <my-channels v-model="form.channel_id"></my-channels>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下半部卡片 -->
    <el-card class="box-card">
      <template v-slot:header>
        <div>根据筛选条件共查询到 {{ total_count }} 条结果, 当前是第 {{ currentPage }} 页: </div>
      </template>

      <!--
        el-table 整个的表格组件
          (1) :data 配置表格渲染的数据
          (2) style="width: 100%" 设置表格宽
        el-table-column 表格的一列
          (1) label 配置列的名字
          (2) prop 配置列的数据, 需要指定成遍历得到的对象的属性
          (3) width 列宽
      -->
      <el-table :data="articles" v-loading="loading">
        <el-table-column label="封面">
          <template v-slot:default="obj">
            <!-- {{ obj.row.cover.images[0] }}, fit="cover", 保持宽高比铺满, 可能会有一部分出去 -->
            <el-image
              style="width: 150px; height: 100px"
              :src="obj.row.cover.images[0]"
              fit="cover">
              <div slot="error" class="image-slot">
                <img style="width: 150px; height: 100px" src="@/assets/error.gif" alt="">
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="标题" prop="title"></el-table-column>

        <el-table-column label="状态">
          <template v-slot:default="obj">
            <!-- {{ obj.row.status }} -->
            <el-tag type="info" v-if="obj.row.status === 0">草稿</el-tag>
            <el-tag v-if="obj.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-if="obj.row.status === 2">审核通过</el-tag>
            <el-tag type="danger" v-if="obj.row.status === 3">审核失败</el-tag>
            <el-tag type="warning" v-if="obj.row.status === 4">已删除</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="发布时间" prop="pubdate"></el-table-column>

        <el-table-column label="操作">
          <!-- 默认插槽, elementUI在定义插槽时, 给你提供了 $index(下标) row(当前行的数据) 数据 -->
          <template v-slot:default="obj">
            <!-- {{ obj.row }} -->
            <el-button @click="edit(obj.row.id)" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="del(obj.row.id)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件
           layout: 控制展示的布局控件
           :page-size="10" 控制每页条数
           :total 总条数
           background 蓝色背景
           @current-change="handleCurrentChange" 当前页变化时, 触发
       -->
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        background
        :page-size="10"
        :current-page="currentPage"
        :total="total_count">
      </el-pagination>

      <!--
        <el-button>登录</el-button>
        <hm-button>登录</hm-button>
        <hm-button>注册</hm-button>
      -->
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb.vue'
import MyChannels from '@/components/my-channels.vue'
import { reqGetArticles, reqDeleteArticle } from '@/api/articles.js'
export default {
  name: 'Articles',
  data () {
    return {
      form: {
        date: [], // 这边选择的日期是一个范围, 一定要给个空数组
        status: null, // 状态, 默认选中全部
        channel_id: null // 频道
      },
      articles: [], // 文章列表
      currentPage: 1, // 当前页
      total_count: 0, // 总条数
      loading: false,
      // 准备一个对象, 存储着所有的筛选条件
      query: {
        begin_pubdate: null, // 开始日期
        end_pubdate: null, // 结束日期
        status: null, // 状态
        channel_id: null // 频道的 id
      }
    }
  },
  created () {
    this.loadArticles()
  },
  components: {
    MyBreadcrumb,
    MyChannels
  },
  methods: {
    // 根据条件, 获取对应的文章列表
    loadArticles () {
      this.loading = true
      reqGetArticles({
        page: this.currentPage, // 页码
        ...this.query
      }).then(res => {
        console.log(res.data.data)
        this.articles = res.data.data.results
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },

    del (id) {
      // 给后台传递的应该是 articleId
      const articleId = id.toString()
      // 询问一下用户, 是否要删除, 确认才删除
      this.$confirm('亲, 你确认要进行删除么?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        // 确认发送 ajax 请求了
        reqDeleteArticle(articleId).then(res => {
          this.$message.success('删除成功')
          this.loadArticles()
        }).catch(err => {
          this.$message.error('目前是测试阶段, 假数据暂时无法删除')
          return err
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    handleCurrentChange (index) {
      // index变化后的当前页
      this.currentPage = index
      // 重新调用渲染方法
      this.loadArticles()
      console.log(this.currentPage)
    },
    search () {
      // 重置页码
      this.currentPage = 1
      // 数组的解构, undefined这边不用处理, axios如果遇到了传值是 undefined或者null, 会忽略这个参数
      const [beginPubdate, endPubdate] = this.form.date || []
      // 一点查询, 更新查询筛选条件
      this.query = {
        begin_pubdate: beginPubdate, // 开始日期
        end_pubdate: endPubdate, // 结束日期
        status: this.form.status, // 状态
        channel_id: this.form.channel_id || null // 频道的 id
      }
      // 调用方法, 按照最新条件, 重新请求渲染
      this.loadArticles()
    },
    edit (id) {
      const articleId = id.toString()
      console.log(articleId)
      this.$router.push(`/edit-article/${articleId}`)
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
