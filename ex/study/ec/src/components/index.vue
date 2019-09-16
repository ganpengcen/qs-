<template>
  <div class="wrapper" ref="ec">
  </div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
export default {
  data () {
    return {}
  },
  created () {
    this.$nextTick(() => {
      let ech = echarts.init(this.$refs.ec)
      let option = {
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '12']
        },
        grid: [
          {
            left: '10%',
            bottom: '10%',
            right: '10%',
            containLabel: true
          }
        ],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis:
         [{
           type: 'category',
           name: '月龄',
           position: 'top',
           data: ['2', '4', '8', '10', '12', '20']
         }, {
           type: 'category',
           data: ['2', '4', '8', '10', '12', '20', '21', '22']}],
        yAxis: [
          {
            name: '邮件营销',
            type: 'value',
            data: ['1', '3', '5', '7', '9', '11', '13']
          },
          {
            name: '12',
            type: 'value',
            data: ['20', '40', '80', '100', '120', '140']
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: ',总量',
            data: [1, 2, 5, 7, 9, 10, 11]
          },
          {
            yAxisIndex: 1,
            xAxisIndex: 1,
            name: '12',
            type: 'line',
            stack: '总量',
            data: [10, 20, 30, 40, 50, 60, 70, 40, 20]
          }
        ]
      }
      ech.setOption(option)
    })
  }
}
</script>

<style>
.wrapper {
  width: 800px;
  height: 500px;
  margin:  0 auto;
  border: 1px solid grey;
}
</style>
