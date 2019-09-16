<template>
  <div class="wrapper">
    <div class="top">
      <div class="left-top" id="leftTop"></div>
      <div class="right-top" id="rightTop"></div>
    </div>
    <div class="bottom">
      <div class="left-bottom" id="leftBottom"></div>
      <div class="right-bottom" id="rightBottom"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: {
      }
    }
  },
  created () {
    let option1 = {
      title: {
        text: '7岁以下男孩身高年龄'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['-3SD', '-2SD', '中位', '+2SD', '+3SD']
      },
      grid: [
        {
          left: '10%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        },
        {
          left: '10%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        }
      ],
      xAxis: [{
        type: 'category',
        name: '月龄',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36]
      }, {
        type: 'category',
        name: '月龄',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36]
      }
      ],
      yAxis: [
        {
          name: '身高(cm)',
          type: 'value',
          min: '30',
          splitNumber: 20,
          boundaryGap: [0, 0.1]
        }
      ],
      series: [
        {
          'name': '-3SD',
          type: 'line',
          smooth: true,
          data: [45.2, 48.7, 52.2, 55.3, 57.9, 59.9, 61.4, 62.7, 63.9, 65.2, 66.4, 67.5, 68.6, 71.2, 73.6, 76.0, 78.3, 80.5, 82.4, 84.4, 86.3]
        },
        {
          'name': '-2SD',
          type: 'line',
          smooth: true,
          data: [46.9, 50.7, 54.3, 57.5, 60.1, 62.1, 63.7, 65.0, 66.3, 67.6, 68.9, 70.1, 71.2, 74.0, 76.6, 79.1, 81.6, 83.9, 85.9, 88.0, 90.0]
        },
        {
          'name': '中位',
          type: 'line',
          smooth: true,
          data: [50.4, 54.8, 58.7, 62.0, 64.6, 66.7, 68.4, 69.8, 71.2, 72.6, 74.0, 75.3, 76.5, 79.8, 82.7, 85.6, 88.5, 91.1, 93.3, 95.4, 97.5]
        },
        {
          'name': '+2SD',
          type: 'line',
          smooth: true,
          data: [54.0, 59.0, 63.3, 66.6, 69.3, 71.5, 73.3, 74.8, 76.3, 77.8, 79.3, 80.8, 82.1, 85.8, 89.1, 92.4, 95.8, 98.6, 101.0, 103.2, 105.3]
        },
        {
          'name': '+3SD',
          type: 'line',
          smooth: true,
          data: [55.8, 61.2, 65.7, 69.1, 71.7, 73.9, 75.8, 77.4, 78.9, 80.5, 82.1, 83.6, 85.0, 88.9, 92.4, 95.9, 99.5, 102.5, 105, 107.2, 109.4]
        }
      ]
    }
    let option2 = {
      title: {
        text: '7岁以下女孩身高年龄'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['-3SD', '-2SD', '中位', '+2SD', '+3SD']
      },
      grid: [
        {
          left: '10%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        },
        {
          left: '10%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        }
      ],
      xAxis: [{
        type: 'category',
        name: '月龄',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36]
      }, {
        type: 'category',
        name: '月龄',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36]
      }
      ],
      yAxis: [
        {
          name: '身高(cm)',
          type: 'value',
          min: '30',
          splitNumber: 20,
          boundaryGap: [0, 0.1]
        }
      ],
      series: [
        {
          'name': '-3SD',
          type: 'line',
          smooth: true,
          data: [44.7, 47.9, 51.1, 54.2, 56.7, 58.6, 60.1, 61.3, 62.5, 63.7, 64.9, 66.1, 67.2, 70.2, 72.8, 75.1, 77.3, 79.3, 81.4, 83.4, 85.4]
        },
        {
          'name': '-2SD',
          type: 'line',
          smooth: true,
          data: [46.4, 49.8, 53.2, 56.3, 58.8, 60.8, 62.3, 63.6, 64.8, 66.1, 67.3, 68.6, 69.7, 72.9, 75.6, 78.1, 80.5, 82.7, 84.8, 86.9, 88.9]
        },
        {
          'name': '中位',
          type: 'line',
          smooth: true,
          data: [49.7, 53.7, 57.4, 60.6, 63.1, 65.2, 66.8, 68.2, 69.6, 71.0, 72.4, 73.7, 75.0, 78.5, 81.5, 84.4, 87.2, 89.8, 92.1, 94.3, 96.3]
        },
        {
          'name': '+2SD',
          type: 'line',
          smooth: true,
          data: [] // 51.4, 55.7, 59.6, 62.8, 65.4, 67.4, 69.1, 70.2, 72.1, 73.6, 75.0, 76.4, 77.7, 81.4, 84.6, 87.7, 90.7, 93.5, 95.9, 98.1, 100.1
        },
        {
          'name': '+3SD',
          type: 'line',
          smooth: true,
          data: [53.2, 57.8, 61.8, 65.1, 67.7, 69.8, 71.5, 73.6, 74.2, 76.2, 77.5, 78.3, 80.2, 84.2, 87.6, 91.2, 94.2, 97.6, 98.3]
        }
      ]
    }
    let option3 = {
      title: {
        text: '7岁以下男孩体重年龄'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['-3SD', '-2SD', '中位', '+2SD', '+3SD']
      },
      grid: [
        {
          left: '10%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        },
        {
          left: '10%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        }
      ],
      xAxis: [{
        type: 'category',
        name: '月龄',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36]
      }, {
        type: 'category',
        name: '月龄',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36]
      }
      ],
      yAxis: [
        {
          name: '体重(kg)',
          type: 'value',
          min: '1',
          max: '25',
          splitNumber: 10,
          boundaryGap: [0, 0.1]
        }
      ],
      series: [
        {
          'name': '-3SD',
          type: 'line',
          smooth: true,
          data: [2.26, 3.09, 3.94, 4.69, 5.25, 5.66, 5.97, 6.24, 6.46, 6.67, 6.86, 7.04, 7.21, 7.68, 8.13, 8.61, 9.06, 9.47, 9.76, 10.24, 10.54]
        },
        {
          'name': '-2SD',
          type: 'line',
          smooth: true,
          data: [2.58, 3.52, 4.47, 5.29, 5.91, 6.36, 6.70, 6.99, 7.23, 7.46, 7.67, 7.87, 8.06, 8.57, 9.07, 9.59, 10.09, 10.54, 10.97, 11.39, 11.79]
        },
        {
          'name': '中位',
          type: 'line',
          smooth: true,
          data: [3.32, 4.51, 5.68, 6.70, 7.45, 8.00, 8.41, 8.76, 9.05, 9.33, 9.58, 9.83, 10.05, 10.68, 11.29, 11.93, 12.54, 13.11, 13.64, 14.15, 14.65]
        },
        {
          'name': '+2SD',
          type: 'line',
          smooth: true,
          data: [4.18, 5.67, 7.14, 8.40, 9.32, 9.99, 10.50, 10.93, 11.29, 11.64, 11.95, 12.26, 12.54, 13.32, 14.09, 14.90, 15.67, 16.38, 17.06, 17.72, 18.37]
        },
        {
          'name': '+3SD',
          type: 'line',
          smooth: true,
          data: [4.66, 6.33, 7.97, 9.37, 10.39, 11.15, 11.72, 12.20, 12.60, 12.99, 13.34, 13.68, 14.00, 14.88, 15.75, 16.66, 17.54, 18.36, 19.13, 19.89, 20.64]
        }
      ]
    }
    let option4 = {
      title: {
        text: '7岁以下女孩体重年龄'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['-3SD', '-2SD', '中位', '+2SD', '+3SD']
      },
      grid: [
        {
          left: '10%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        },
        {
          left: '10%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        }
      ],
      xAxis: [{
        type: 'category',
        name: '月龄',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36]
      }, {
        type: 'category',
        name: '月龄',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36]
      }
      ],
      yAxis: [
        {
          name: '体重(kg)',
          type: 'value',
          min: '1',
          nameRotate: 90,
          nameLocation: 'middle',
          max: '25',
          splitNumber: 20,
          boundaryGap: [0, 0.1]
        }
      ],
      series: [
        {
          'name': '-3SD',
          type: 'line',
          smooth: true,
          data: [2.26, 2.98, 3.72, 4.40, 4.93, 5.33, 5.64, 5.90, 6.13, 6.34, 6.53, 6.71, 6.87, 7.34, 7.79, 8.26, 8.70, 9.10, 9.48, 9.86, 10.23]
        },
        {
          'name': '-2SD',
          type: 'line',
          smooth: true,
          data: [2.54, 3.33, 4.15, 4.90, 5.48, 5.92, 6.26, 6.55, 6.79, 7.03, 7.23, 7.43, 7.61, 8.12, 8.63, 9.15, 9.64, 10.09, 10.52, 10.94, 11.36]
        },
        {
          'name': '中位',
          type: 'line',
          smooth: true,
          data: [3.21, 4.20, 5.21, 6.13, 6.83, 7.36, 7.77, 8.11, 8.41, 8.69, 8.94, 9.18, 9.40, 10.02, 10.65, 11.30, 11.92, 12.50, 13.05, 13.59, 14.13]
        },
        {
          'name': '+2SD',
          type: 'line',
          smooth: true,
          data: [4.10, 5.35, 6.60, 7.73, 8.59, 9.23, 9.73, 10.15, 10.51, 10.86, 11.16, 11.46, 11.73, 12.50, 13.29, 14.12, 14.92, 15.67, 16.32, 17.00, 17.81]
        },
        {
          'name': '+3SD',
          type: 'line',
          smooth: true,
          data: []
        }
      ]
    }
    let echarts = require('echarts')
    this.$nextTick(() => {
      let mechart1 = echarts.init(document.getElementById('leftTop'))
      mechart1.setOption(option1, true)
      let mechart2 = echarts.init(document.getElementById('rightTop'))
      mechart2.setOption(option2, true)
      let mechart3 = echarts.init(document.getElementById('leftBottom'))
      mechart3.setOption(option3, true)
      let mechart4 = echarts.init(document.getElementById('rightBottom'))
      mechart4.setOption(option4, true)
    })
  }
}
</script>

<style scoped>
  .top{
    display: flex;
  }
  .bottom {
    display: flex;
  }
  .left-top{
    flex: 1;
    border: 1px solid red;
    display: inline-block;
    height: 400px;
  }
  .right-top{
    flex: 1;
    height: 400px;
    border: 1px solid red;
  }
  .left-bottom {
    flex: 1;
    height: 400px;
    border: 1px solid red;
  }
  .right-bottom{
    flex: 1;
    height:400px;
    border: 1px solid red;
  }
</style>
