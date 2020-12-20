<template>
  <div class="login-container">
    <!-- 白色的整个内部容器 -->
    <div class="login-form-wrap">
      <div class="login-head">
        <div ref="logoref" class="logo"></div>
      </div>
      <!--
        el-form 整个的大的form组件
          (1) :model="form" 绑定了一个对象, 用于收集表单数据 (将来还可以用于表单校验)
          (2) label-width 控制label的宽度
        el-form-item 一个表单项, 一行, 用于包裹表单元素
          label="活动名称"  label的名字
        el-input 输入框组件
          v-model="form.name" 和form中的某个属性双向绑定
      -->
      <el-form ref="form" class="login-form" :model="form" :rules="rules">
        <el-form-item prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" v-model="form.code"></el-input>
        </el-form-item>

        <el-form-item prop="agree">
          <el-checkbox v-model="form.agree">我已阅读并同意许可协议!</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button @click="login" class="login-btn" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reqUserLogin } from '@/api/user.js'
import { setUser } from '@/utils/storage.js'

export default {
  // 默认调试工具, 会以文件名, 作为组件名在调试工具中展示
  // 如果不设置, index.vue这个组件, 将来调试工具中看到的也是 Index.vue
  // 所以一般为了方便调试, 配置 name, 看到的就是 Login.vue
  /*
    消息提示:
      1. 基本提示 this.$message(提示信息)
      2. 传入一个对象
         this.$message({
           type: 主题颜色,  'success/warning/info/error'
           message: 内容文本,
           showClose: true // 显示关闭的按钮
         })
      3. 简写
         this.$message.success(提示消息)
         this.$message.error(提交消息)

    ref 和 $refs 配合使用, 可以用方便的获取dom元素或者vue组件
      1. 给需要获取的元素, 加上 ref 属性
      2. 通过 this.$refs 就可以拿到元素的引用, 获取对应元素
  */
  name: 'Login',
  data () {
    return {
      form: {
        mobile: '13911111111',
        code: '246810',
        agree: true
      },
      rules: {
        // 1. required 必填项, 非空
        // 2. message: 错误提示
        // 3. trigger触发, 'blur'失去焦点时触发校验 / 'change'表单元素的值变化时触发
        // 4. min 最小长度, max最大长度
        mobile: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: ['blur', 'change'] },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: ['blur', 'change'] }
        ],
        agree: [
          {
            // rule 当前规则的相关信息, 比如字段名: agree
            // value 当前校验的值  true false
            // callback 它内部提供给你的一个函数, 成功callback() 失败了callback(new Error('错误提示'))
            validator: function (rule, value, callback) {
              if (value === false) {
                callback(new Error('请同意许可'))
              } else {
                callback()
              }
            },
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    login () {
      // console.log(this.$refs.logoref)
      // console.log(this.$refs.form)
      // 要先拿到el-form组件, 调用内部的校验方法, 进行校验
      // 校验通过, 才发送ajax请求
      this.$refs.form.validate((flag) => {
        if (flag) {
          // 通过校验了, 才发送ajax请求了, 登录请求
          reqUserLogin(this.form.mobile, this.form.code).then(res => {
            console.log('登录成功了', res)
            this.$message.success('登录成功')
            // 将个人信息(包含了token)存到本地, 对象存到本地需要转JSON
            setUser(res.data.data)
            // 再跳转
            this.$router.push('/')
          }).catch(err => {
            console.log('登录失败了, 手机号或者验证码错误', err)
            this.$message.error('手机号或者验证码错误')
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 铺满整屏
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  background: url("../../assets/login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        background: url("../../assets/logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
