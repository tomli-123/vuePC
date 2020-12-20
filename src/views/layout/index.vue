<template>
  <div class="layout-container">
    <!-- 规范: 组件封装时, 一般会给组件的根元素, 添加上一个和组件名同名的类名 -->
    <!-- <Jack></Jack>  .jack类 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 头部Logo -->
        <div class="logo" :class="{ minLogo: isCollapse }"></div>
        <!-- 菜单 -->
        <!--
          el-menu 整个的菜单组件
            default-active="2" 配置默认高亮的是哪个菜单
            collapse 配置菜单是否折叠显示, true折叠, false不折叠
            collapse-transition 配置菜单动画效果, 关闭false
            router 开启路由模式

          el-submenu 子菜单(不需要折叠效果, 这边不用)

          el-menu-item 具体的菜单项
            <i class="el-icon-menu"></i> 小图标
            <span slot="title">导航二</span> 文字内容
         -->
        <el-menu
          :default-active="$route.path"
          background-color="#002033"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/articles">
            <i class="el-icon-document"></i>
            <span slot="title">内容管理</span>
          </el-menu-item>
          <el-menu-item index="/pictures">
            <i class="el-icon-picture"></i>
            <span slot="title">素材管理</span>
          </el-menu-item>
          <el-menu-item index="/add-article">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">发布文章</span>
          </el-menu-item>
          <el-menu-item index="/comment">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="/fans">
            <i class="el-icon-setting"></i>
            <span slot="title">粉丝管理</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <i class="el-icon-setting"></i>
            <span slot="title">个人设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <!-- 左侧部分 -->
          <div class="left" @click="toggleMenu">
            <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
            <span>江苏传智播客科技教育有限公司</span>
          </div>
          <!-- 右侧下拉菜单 -->
          <el-dropdown>
            <!-- 配置默认显示的内容的 -->
            <div class="avatar-wrap">
              <img class="avatar" :src="user.photo" alt="">
              <span>{{ user.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <!-- 下拉折叠的部分 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/*
  退出功能:
    1. 给按钮注册点击事件
       <el-button></el-button> @click="fn" 有效, 因为element-ui内部做好了处理
       <el-dropdown-item>      @click="fn" 无效, 但不是所有的组件, 他都做好了处理
       但是我们就想要注册点击事件, @click.native 给组件注册原生的 click 事件
       如果组件支持这个事件, 内部处理过了, 就不加,
       如果组件不支持这个事件, 没有处理, 就加上 .native

    2. 点击时退出, 我们是基于token进行的登录认证, 所以退出, 只需要将本地的token清除即可

    3. 退出后, 跳转到登录
*/
import { reqGetUserInfo } from '@/api/user.js'
import { delUser } from '@/utils/storage.js'

export default {
  name: 'Layout',
  data () {
    return {
      isCollapse: false,
      user: {}
    }
  },
  methods: {
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      // 添加退出提示
      this.$confirm('亲, 你确认要进行退出操作么?', '警告!', {
        type: 'warning'
      }).then(() => {
        // 点击了确认
        // 删除本地用户token信息
        delUser()
        // 跳转到登录页
        this.$router.push('/login')
        // 提示退出成功
        this.$message.success('恭喜, 退出成功')
      }).catch(() => {
        console.log('点击了取消')
      })
    }
  },
  created () {
    // 添加监听
    this.$eventBus.$on('user_update_name', name => {
      this.user.name = name
    })
    this.$eventBus.$on('user_update_photo', photo => {
      this.user.photo = photo
    })

    // 发请求渲染页面
    reqGetUserInfo().then(res => {
      this.user = res.data.data
    })
  }
}
</script>

<style lang="less" scoped>
// 1. 不加scoped, 全局样式, 将来会作用到所有的组件  (单页应用程序, 不跳转页面, 还是同一个页面)
// 2. 加上scoped, 局部样式, 只作用于当前组件
// 所以如果你的样式, 也只是当前组件的样式, 也推荐加上scoped

// scoped的原理:
// 1. 给样式, 添加上一个属性选择器 (独一无二的)
//    div  =>  div[data-v-038e7047]
// 2. vue会自动给当前组件的所有元素, 添加上对应的标签属性 data-v-038e7047
//    <div data-v-038e7047 ></div>
// 效果: 可以让样式只作用于当前组件
// div {
//   background-color: pink;
// }

.layout-container {
  position: fixed;
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
  }
  .el-aside {
    background-color:#002033;
    .el-menu {
      border-right: none;
    }
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/logo_admin.png) no-repeat center;
      background-size: 140px auto;
    }
    // 小logo 覆盖background 的图片和大小，类书写在logo的下方。
    .minLogo{
      background-image: url(../../assets/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .avatar-wrap {
      display: flex;
      align-items: center;
      cursor: pointer;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .el-main {
    background-color: #e9eef3;
  }
}
</style>
