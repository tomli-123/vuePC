<template>
  <div class="add-article">
    <!-- <div v-for="(item, index) in 10" :key="index">我是盒子 - {{ item }} - {{ index }}</div> -->

    <el-card>
      <template v-slot:header>
        <my-breadcrumb>发布文章</my-breadcrumb>
      </template>

      <!-- ref 和 $refs 配合, 便于获取dom元素或者组件 -->
      <!-- this.$refs.myform -->
      <!-- :hide-required-asterisk="true" -->
      <el-form ref="myform" :rules="rules" :model="form" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor @blur="quillFn" @change="quillFn" v-model="form.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <!-- 这边单选框的部分, 比较复杂, 先不绑定, 假的 -->
          <el-radio-group @change="changeCoverType" v-model="form.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 这里需要根据不同的 type, 需要展示不同数量的 my-cover 组件 -->
          <!-- 处理单图和三图片 -->
          <!-- key 用于标记盒子, 便于进行新旧dom的对比
               如果盒子没有设置 key, 默认是按照下标对比的
               但是一旦设置了 key, 就是按照 key 来对比

               这里每次切换, 都切换了一个新的key, vue就知道之前的不复用, 需要新创建
          -->
          <div class="cover-box" v-if="form.cover.type > 0" :key="form.cover.type">
            <my-cover
              v-for="(item, index) in form.cover.type"
              :key="index"
              v-model="form.cover.images[index]">
            </my-cover>
          </div>
          <!-- 处理自动, 数据驱动, 只要数据是正确, 视图就会自动按照数据进行展示 -->
          <div class="cover-box" v-if="form.cover.type === -1" :key="form.cover.type">
            <my-cover
              v-for="(item, index) in (form.cover.images.length + 1)"
              :key="index"
              v-model="form.cover.images[index]"
            ></my-cover>
          </div>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
           <my-channels v-model="form.channel_id"></my-channels>
        </el-form-item>
        <el-form-item>
          <el-button @click="addArticle(false)" type="primary">发表</el-button>
          <el-button @click="addArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import MyChannels from '@/components/my-channels.vue'
import MyCover from '@/components/my-cover.vue'
import MyBreadcrumb from '@/components/my-breadcrumb.vue'
import { reqAddArticle } from '@/api/articles.js'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'add-article',
  components: {
    MyChannels,
    MyBreadcrumb,
    MyCover,
    quillEditor
  },
  data () {
    return {
      form: {
        title: '', // 文章标题
        content: '', // 文章内容
        channel_id: '', // 频道id
        cover: {
          type: 0, // 封面类型, 无图 0
          images: [] // 空数组, 无图
        }
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: ['blur', 'change'] },
          { min: 5, max: 30, message: '文章标题必须是5-30个字符', trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: ['blur', 'change'] }
        ],
        channel_id: [
          { required: true, message: '请选择频道', trigger: ['blur', 'change'] }
        ]
      },
      // 这里就是editor的配置
      // 富文本配置对象
      editorOption: {
        // 占位配置
        placeholder: '请输入文章内容',
        modules: {
          // 配置工具栏
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  created () {

  },
  methods: {
    addArticle (draft) {
      // 在发送ajax前, 先校验表单, 通过了, 才请求
      this.$refs.myform.validate(async flag => {
        if (flag) {
          try {
            await reqAddArticle(draft, this.form)
            this.$message.success('操作成功')
            this.$router.push('/articles')
          } catch (e) {
            console.log(e)
            this.$message.error('操作失败')
          }
        }
      })
    },
    quillFn () {
      // console.log('失去焦点了, 或者值改变了')
      // 在失去焦点, 或者值改变时, 校验当前这个字段
      this.$refs.myform.validateField('content')
    },
    changeCoverType () {
      // 一旦修改了类型, 就重置数组
      this.form.cover.images = []
    }
  }
}
</script>

<style lang="less" scoped>
.add-article /deep/ .ql-editor {
  min-height: 300px;
}
.add-article /deep/ .ql-toolbar {
  padding: 0 8px;
}
.cover-box {
  display: flex;
  .my-cover {
    margin-right: 20px;
  }
}
</style>
