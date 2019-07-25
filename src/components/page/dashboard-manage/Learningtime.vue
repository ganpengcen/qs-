<template>
  <div class="common_content body">
    <nav-header></nav-header>
    <el-main>
      <el-row>
        <el-col :span="24" style="padding: 0px 20px;">
          <div class="study_box">
            <ul class="title_box">
              <li @click="$router.push({path:'/Onlinelearning'})" style="color:#50b9e6;">教育学习时长</li>
              <li @click="$router.push({path:'/Learningtime'})">社区服务时长</li>
            </ul>
            <div id="myChart"></div>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>


<script>
  import echarts from "echarts";

  export default {
    data() {
      return {
        activeName: "first"
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.usecharts();
      });
    },
    methods: {
      usecharts() {
        let myChart = echarts.init(document.getElementById("myChart"));
        const option = {
          // x轴
          xAxis: {
            type: "category",
            data: [
              "竹山村",
              "竹山村",
              "竹山村",
              "竹山村",
              "竹山村",
              "竹山村",
              "竹山村",
              "竹山村",
              "竹山村",
              "竹山村",
              "竹山村"
            ],
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#fff", //左边线的颜色
                width: "2" //坐标线的宽度
              }
            },
            axisLabel: {
              textStyle: {
                color: "#fff",
                fontSize: '18'
              }
            }
          },
          lineStyle: {
            type: "dashed"
          },
          //y轴
          yAxis: {
            type: "value",
            min: 0,
            max: 50,
            minInterval: 1,
            interval: 12.5,
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#fff", //左边线的颜色
                width: "2" //坐标线的宽度
              }
            },
            axisLabel: {
              textStyle: {
                color: "#fff"
              }
            }
          },
          boundaryGap: false,
          series: [{
            data: [20, 50, 33, 22, 11, 44, 33, 33, 22, 11, 44],
            type: "line",
            color: "#2cb4ea",
            symbol: "circle", //拐点形状
            symbolSize: 8, //拐点大小
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    //拐点上标字体大小颜色
                    color: "white",
                    fontSize: "18",
                    backgroundColor: "#2cb4ea",
                    padding: 7
                  }
                },
                //拐点颜色
                color: "white",
                borderColor: "#50b9e6",
                borderWidth: 4,
                lineStyle: {
                  width: 2
                }
              }
            }
          }]
        };
        myChart.setOption(option);
      }
    }
  };

</script>

<style scoped>
  @import "../../../../static/css/table.css";

  html {
    height: 100% !important;
  }

  .body {
    background: radial-gradient(rgb(46, 105, 175), rgb(12, 33, 66) 70%) no-repeat center !important;
    overflow: hidden;
  }

  .title_box {
    width: 35%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 10px;
    line-height: 1.8;
    font-size: 26px;
    font-weight: 700;
    color: white;
  }

  .title_box>li {
    text-align: center;
    width: 50%;
    cursor: pointer;
    font-size: 2rem;
  }

  .study_box {
    width: 100%;
    height: 62.5rem;
    background: url(/static/img/dashboard/study6.png) no-repeat;
    background-size: 100% 100%;
    margin: 2.55vw 0;
  }

  .lBorder {
    position: relative;
    width: 70%;
    height: 41.66rem;
    border: 1px solid #57c2eb;
    text-align: center;
    line-height: 41.66rem;
    color: white;
    font-size: 2rem;
    cursor: pointer;
  }

  .border {
    position: absolute;
    padding: 5px;
    border-style: solid;
    border-color: #57c2eb;
  }

  .row1 {
    border-width: 5px 0 0 5px;
    top: -5px;
    left: -5px;
  }

  .row2 {
    border-width: 5px 5px 0 0;
    top: -5px;
    right: -5px;
  }

  .col1 {
    border-width: 0 0 5px 5px;
    bottom: -5px;
    left: -5px;
  }

  .col2 {
    border-width: 0 5px 5px 0;
    bottom: -5px;
    right: -5px;
  }

  .mborder {
    text-align: center;
    background: url(/static/img/dashboard/Path.png) center;
    background-size: 100% 100%;
    width: 100%;
    height: 70px;
    line-height: 70px;
  }

  .mborder>p {
    font-size: 32px;
    margin: 0 0;
    color: white;
  }

  /* .studytime{
    background-color: rgba(0, 0, 0, 0) !important;
} */
  .learnbox p {
    color: #58c2eb;
    font-size: 20px;
    font-weight: 500;
    padding-left: 13%;
    box-sizing: border-box;
  }

  .learnbox td {
    width: 30%;
    line-height: 40px;
    text-align: center;
  }

  .table1 {
    width: 95%;
    color: white;
    /* padding-left: 5%; */
    margin-top: 15px;
  }

  .table2 {
    width: 95%;
    color: white;
    /* padding-left: 10%; */
    margin-top: 15px;
    box-sizing: border-box;
  }

  .tablebox,
  tbody {
    height: 501px;
   
  }

  #myChart {
    width: 100%;
    height: 50rem;
    margin: 0 auto;
    position: relative;
  }

  #mychart canvas {
      /* margin: 0 auto !important; */
  }

</style>
