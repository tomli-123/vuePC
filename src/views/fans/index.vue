<template>
  <div class="fans">
    <el-card>
      <template v-slot:header>
        <my-breadcrumb>粉丝管理</my-breadcrumb>
      </template>

      <!-- tabs组件 -->
      <el-tabs @tab-click="tabChange" v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <!-- 列表 -->
          <div class="fans_list">
            <div v-for="item in list" :key="item.id.toString()" class="fans_item">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{ item.name }}</p>
              <el-button type="primary" plain size="small">+关注</el-button>
            </div>
          </div>

          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="per_page"
            :current-page="page"
            @current-change="changePage"
            :total="total">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="粉丝画像" name="img">
          <!-- this.$refs.main -->
          <div ref="main" style="width: 600px; height:400px;"></div>
        </el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb.vue'
import { reqGetFans, reqGetFansStatistics } from '@/api/fans.js'
// import moment from 'moment'
import echarts from 'echarts'

export default {
  name: 'Fans',
  data () {
    return {
      activeName: 'list',
      page: 1,
      per_page: 30,
      total: 0,
      list: [],
      // 测试默认头像
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  created () {
    this.getFans()
  },
  methods: {
    // 发送请求获取粉丝列表
    async getFans () {
      const res = await reqGetFans(this.page, this.per_page)
      this.list = res.data.data.results
      this.total = res.data.data.total_count
    },
    changePage (index) {
      // console.log(index)
      this.page = index
      this.getFans()
    },
    async tabChange (tab) {
      // console.log('tab被点击了', tab.name)
      if (tab.name === 'img') {
        // 发送请求, 获取初始化的数据
        const res = await reqGetFansStatistics()
        const ages = res.data.data.age
        // 需要基于返回的数据, 得到两个数组 ageX控制x轴刻度, ageY控制y轴显示的数据
        const ageX = []
        const ageY = []
        for (const key in ages) {
          ageX.push(key.replace('gt', '大于').replace('le', '小于') + '岁')
          ageY.push(ages[key])
        }

        // 开始初始化渲染echarts
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(this.$refs.main)

        // 指定图表的配置项和数据
        const option = {
          title: {
            text: '粉丝列表柱状图'
          },
          tooltip: {},
          legend: {
            data: ['人数']
          },
          // x轴的刻度
          xAxis: {
            data: ageX
          },
          // y轴一般不用指定, 因为可以根据数据自动生成 y 轴的刻度
          yAxis: {},
          series: [{
            name: '人数',
            type: 'bar',
            data: ageY
          }]
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      }
    }
  },
  components: {
    MyBreadcrumb
  }
}
</script>

<style lang="less" scoped>
.fans_list {
  .fans_item {
    width: 120px;
    height: 170px;
    border: 1px dashed #ddd;
    text-align: center;
    padding-top: 10px;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 30px;
    p {
      margin: 10px 0;
    }
  }
}
</style>
