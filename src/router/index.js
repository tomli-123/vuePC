import Vue from 'vue'
import VueRouter from 'vue-router'
// 默认就会去 login 目录, 找index.vue(可以省略) (如果是页面大写, 需要写全)
// 如果要 ../ 不好用, 将来可能出现, ../../../ 的情况 => 一般用 @ => @ 就直接代表 src
import { getUser } from '@/utils/storage.js'

// 只有将来路由被访问到了, 才会执行这个函数, 才会加载组件 (异步组件)
const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')
const Articles = () => import('@/views/articles')
const EditArticle = () => import('@/views/articles/edit.vue')
const AddArticle = () => import('@/views/articles/add.vue')
const Comment = () => import('@/views/comment')
const Fans = () => import('@/views/fans')
const Settings = () => import('@/views/settings')
const Pictures = () => import('@/views/pictures')
const Home = () => import('@/views/home')
const Page404 = () => import('@/views/page404')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', component: Home },
        { path: '/articles', component: Articles }, // 文章列表
        { path: '/add-article', component: AddArticle },
        { path: '/edit-article/:id', component: EditArticle },
        { path: '/pictures', component: Pictures },
        { path: '/comment', component: Comment },
        { path: '/fans', component: Fans },
        { path: '/settings', component: Settings }
      ]
    },
    { path: '/login', component: Login },
    // 404也是一级路由, 整个页面, 都换成404
    // 一般在路由的配置最后, path: '*' 可以处理没被处理其他路由情况, 一般用于实现404
    { path: '*', component: Page404 }
  ]
})

// 全局前置守卫: 这个导航守卫需要配置一个函数
// 所有的路由在被访问时, 都会先经过全局前置守卫, 只有守卫放行了, 你才能访问到路由真正匹配的内容
// 需求:
//    1. 如果是去登录, 放行
//    2. 如果是去其他除了登录页的页面, 看有没有token, 有token才放行
// 什么时候放行?
//    1. 去登陆, 直接放行
//    2. 有token, 有令牌, 直接放行
//    3. 既不是去登录, 也没有token, 拦截
// from 从哪来
// to 到哪去
// next 是一个函数, 决定是否放行
// (1) next() 放行
// (2) next(路由地址) 拦截到对应的路由地址, 比如拦截到登录 next('/login')
router.beforeEach((to, from, next) => {
  // console.log(to, next)
  // console.log('被守卫拦着了')
  const userInfo = getUser()
  if (to.path === '/login' || userInfo.token) {
    next()
  } else {
    // 不是去登录, 且没票(没有token), 拦截去登录
    next('/login')
  }
})

export default router
