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
        grid: [
          {
            left: '5%',
            bottom: '0%',
            right: '5%',
            height: 150,
            containLabel: true
          },
          {
            left: '5%',
            bottom: 50,
            right: '5%',
            containLabel: true
          }
        ],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        axisTick: {
          show: false
        },
        xAxis:
          {
            type: 'category',
            name: '月',
            position: 'bottom',
            data: [1, 2, 3, 4, 5, 6]
          },
        yAxis: [
          {
            position: 'left',
            offset: 0,
            type: 'category',
            nameLocation: 'left',
            nameRotate: 90,
            name: '身高',
            max: 20,
            splitNumber: 5
          },
          {
            position: 'left',
            offset: 40,
            gridIndex: 2,
            type: 'category',
            name: '体重',
            nameGap: 15,
            max: 20,
            data: [0, 5, 12, 13, 15, 20],
            inside: true
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
