<template>
  <div class="common_content">
    <nav-header v-if="true"></nav-header>
    <div class="content_wrapper">
      <div class="content_center">
        <div class="center_item center_item_1">
          <div class="leftBorder">
            <div class="lb_center_su">
              <el-row class="one">
                <el-col :span="16">
                  <p class="px18">总人数</p>
                  <br />
                  <p class="px42 white" style="width: 78%;text-align: center;line-height: 20px">
                    144
                    <span class="px16 deepBlue">人</span>
                  </p>
                </el-col>
                <el-col :span="4">
                  <div class="rIMG backIMG5" ref="widthHeight" style="margin-left:6rem">
                    <i class="iconfont icon-yonghu"></i>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="leftBorder2 backIMG deepBlue">
            <div class="lb_center_su">
              <el-row class="box_box">
                <el-col :span="16">
                  <p class="px18">异常人数</p>
                  <br />
                  <p class="px42 white" style="text-align: center ;line-height: 20px">
                    144
                    <span class="px16 deepBlue">人</span>
                  </p>
                </el-col>
                <el-col :span="4">
                  <div class="rIMG backIMG5" style="margin-left:2rem">
                    <i class="iconfont icon-jingbao"></i>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="leftBorder2 backIMG2 deepBlue">
            <div class="lb_center_su">
              <el-row style="padding: 10px 30px">
                <el-col :span="16">
                  <p class="px18">在线人数</p>
                  <br />
                  <p class="px42 white" style="text-align: center;line-height: 20px">
                    134
                    <span class="px16 deepBlue">人</span>
                  </p>
                </el-col>
                <el-col :span="4">
                  <div class="rIMG backIMG5" style="margin-left:2rem">
                    <i class="iconfont icon-yonghu"></i>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="leftBorder backIMG3 deepBlue">
            <div class="lb_center_su">
              <el-row style="padding: 10px 30px">
                <el-col :span="16">
                  <p class="px18">报警次数</p>
                  <br />
                  <p class="px42 white" style="text-align: center;line-height: 20px">
                    24
                    <span class="px16 deepBlue">人</span>
                  </p>
                </el-col>
                <el-col :span="4">
                  <div class="rIMG backIMG5" style="margin-left:6rem">
                    <i class="iconfont icon-jingbao"></i>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="center_item center_item_2">
          <map-vue style="width: 400px; height: 500px;" class="map_show"  ref="map"></map-vue>
        </div>
        <div class="center_item center_item_3">
          <div style="display:flex;justify-content: space-between;">
            <div class="rightBorder backIMG4">
              <p class="nums">33</p>
              <p class="lan">本月新增人数</p>
            </div>
            <div class="rightBorder backIMG4-1">
              <p class="nums">33</p>
              <p class="lan">本月刑满人数</p>
            </div>
          </div>
          <div class="rightBorder2">
            <el-col :span="24" style="padding:5px 30px;">
              <TablesMain></TablesMain>
            </el-col>
          </div>
        </div>
      </div>
      <div class="content_footer">
        <div class="footer_box">
          <div class="footer">
            <div class="echarts_box">
              <span class="tb_title">类型分析</span>
              <div class="echarts_list_boxs">
                <div id="chart1" class="chart"></div>
                <div class="bg_box"></div>
              </div>
            </div>
            <div class="echarts_box">
              <span class="tb_title">年龄分析</span>
              <div class="echarts_list_boxs">
                <div id="chart2" class="chart"></div>
                <div class="bg_box"></div>
              </div>
            </div>
            <div class="echarts_box">
              <span class="tb_title">性别分析</span>
              <div class="echarts_list_boxs">
                <div id="chart3" class="chart"></div>
                <div class="bg_box"></div>
              </div>
            </div>
            <div class="echarts_box">
              <span class="tb_title">周期分析</span>
              <div class="echarts_list_boxs">
                <div id="chart4" class="chart hover"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import local from "../../../static/js/js";
import MapVue from "../Map.vue";
import TablesMain from "../TablesMain.vue";

import echarts from "echarts";
export default {
  name: "dashboard",
  data() {
    return {
      // 显示的数据
      X: "",
      Y: "",
      local: "",
      dian: "",
      i: 0,
      a: ["lq", "ds", "sc"],
      a2: {},
      X2: "",
      Y2: "",
      s: false,
      eWidth: ""
    };
  },
  components: {
    MapVue,
    TablesMain
  },
  mounted() {
    // this.star();

    this.$nextTick(() => {
      let footerHeight = document.querySelector(".content_footer").clientHeight;
      console.log(footerHeight);
      let echartsArray = document.querySelectorAll(".chart");
      echartsArray.forEach(item => {
        item.style.height = footerHeight + "px";
      });

      this.tables();
      this.tables2();
      this.tables3();
      this.tables4();
    });
  },
  created() {
    
  },
  // beforeDestroy() {
  //   this.$refs.map.clearTimer() 
  // },
  computed: {},
  watch: {
    i(val) {
      if (val == 2) {
        setTimeout(() => {
          this.star();
        }, 3000);
      }
    }
  },
  methods: {
    // 饼状图
    tables() {
      this.chart = echarts.init(document.getElementById("chart1"));
      this.chart.clear();
      const option = {
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                length: 15, // 改变标示线的长度
                smooth: 0.2,
                lineStyle: {
                  color: "#000" // 改变标示线的颜色
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  //自定义颜色
                  var colorList = ["#d54a61", "#50b8e6", "#f5c450"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split(" ").join("\n");
                  }
                }
              }
            },
            data: [
              {
                value: 335,
                name: "本区活动 39%"
              },
              {
                value: 310,
                name: "国内活动 41%"
              },
              {
                value: 150,
                name: "本市活动 20%"
              }
            ]
          }
        ]
      };
      this.chart.setOption(option);
    },
    tables2() {
      this.chart = echarts.init(document.getElementById("chart2"));
      this.chart.clear();
      const option = {
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                length: 15, // 改变标示线的长度
                smooth: 0.2,
                lineStyle: {
                  color: "#000" // 改变标示线的颜色
                },
                formatter: function(val) {
                  //让series 中的文字进行换行
                  return val.name.split(" ").join("\n");
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  //自定义颜色
                  var colorList = ["#d54a61", "#50b8e6", "#f5c450"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split(" ").join("\n");
                  }
                }
              }
            },
            data: [
              {
                value: 335,
                name: "35以下 39%"
              },
              {
                value: 310,
                name: "35-54 41%"
              },
              {
                value: 150,
                name: "55以上 20%"
              }
            ]
          }
        ]
      };
      this.chart.setOption(option);
    },
    tables3() {
      this.chart = echarts.init(document.getElementById("chart3"));
      this.chart.clear();
      const option = {
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                length: 15, // 改变标示线的长度
                smooth: 0.2,
                lineStyle: {
                  color: "#000" // 改变标示线的颜色
                },
                formatter: function(val) {
                  //让series 中的文字进行换行
                  return val.name.split(" ").join("\n");
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  //自定义颜色
                  var colorList = ["#d54a61", "#50b8e6"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split(" ").join("\n");
                  }
                }
              }
            },
            data: [
              {
                value: 335,
                name: "女性 31%"
              },
              {
                value: 310,
                name: "男性 69%"
              }
            ]
          }
        ]
      };
      this.chart.setOption(option);
    },
    tables4() {
      this.chart = echarts.init(document.getElementById("chart4"));
      this.chart.clear();
      const option = {
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                },
                formatter: function(val) {
                  //让series 中的文字进行换行
                  return val.name.split(" ").join("\n");
                }
              }
            },
            labelLine: {
              normal: {
                length: 15, // 改变标示线的长度
                smooth: 0.2,
                lineStyle: {
                  color: "#000" // 改变标示线的颜色
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  //自定义颜色
                  var colorList = ["#d54a61", "#50b8e6", "#f5c450"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split(" ").join("\n");
                  }
                }
              }
            },
            data: [
              {
                value: 335,
                name: "三个月 39%"
              },
              {
                value: 310,
                name: "六个月 41%"
              },
              {
                value: 150,
                name: "一年以上 20%"
              }
            ]
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
};
</script>

<style scoped>
p {
  transform: scale(0.8);
}
/* 饼状图 */
.chart {
  width: 100%;
  height: 100%;
  cursor: pointer;
  padding: 5px;
  box-sizing: border-box;
  margin: 5px;
}

.chart.hover {
  box-shadow: 0 0 5px #58c2eb;
}

.iconfont {
  font-size: 2.4rem;
}

.tb_title {
  color: #58c2eb;
  font-size: 1.333rem;
}

.echarts_box {
  width: 25%;
}

.bg_box {
  background: url(/static/img/dashboard/Path129.png) no-repeat;
  background-size: 100% 100%;
  width: 20%;
}

.echarts_list_boxs {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

/* 饼状图 */

.dashboard {
  width: calc(100vw - 25.6rem);
  height: calc(100vh - 6rem);
  background: radial-gradient(rgb(46, 105, 175), rgb(12, 33, 66) 70%) no-repeat
    center;
}

.header {
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.header .item {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.header .item1 {
  width: 400px;
  padding: 0 20px;
  box-sizing: border-box;
}

.header .item3 {
  padding: 0 30px;
  color: #fff;
}

.content_wrapper {
  height: calc(100vh - 130px);
  padding: 10px 20px;
  box-sizing: border-box;
  /* background-color: red; */
}

.content_center {
  height: 80%;
  /* background-color: blue; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;

  background: url(/static/img/dashboard/wave.png) no-repeat;
  background-size: 60% auto;
  background-position: center bottom;
}

.content_center .center_item {
  height: 100%;
}

.content_center .center_item_1 {
  width: 45rem;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.content_center .center_item_2 {
  position: relative;
}

.content_center .center_item_3 {
  height: 100%;
  width: 25%;
}

.content_footer {
  height: 20%;
}

html {
  overflow-y: hidden !important;
}

.box_box {
  padding: 10px 30px;
}

.content_box {
  margin: 1.53vw 0;
}

.one {
  /* padding: 2vw 2vw; */
  padding: 10px 20px;
}

.beijing {
  position: absolute;
  z-index: 20;
  top: -7rem;
  width: 72%;
  /* height: 100%; */
  left: -6rem;
}

.yuan {
  background: url(/static/img/dashboard/Path118.png) no-repeat;
  background-size: 100% 100%;
  position: absolute;
  width: 90%;
  height: 80rem;
  left: -60rem;
  bottom: -20rem;
  z-index: 10;
}

.point_box {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.point {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
}

.dtMenu {
  background: url(/static/img/dashboard/Path191.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: -20rem;
  z-index: 999;
  width: 14vw;
  height: 10vw;
  animation: myfirst2 3s infinite;
  color: #fff;
}

.dtMenu_list {
  padding: 20rem 20rem;
}

@keyframes myfirst2 {
  0% {
    opacity: 0;
  }

  16% {
    opacity: 0;
  }

  32% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

@keyframes myfirst {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.canvas {
  position: relative;
  width: 60px;
  height: 60px;
  z-index: 999;
}

.p1 {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  width: 70%;
  height: 100%;
  z-index: 99;
  animation: myfirst 1s infinite;
}

.p1 > img {
  width: 100%;
  height: 100%;
}

.rIMG {
  position: relative;
  width: 8rem;
  height: 8rem;
  text-align: center;
  border-radius: 50%;
  line-height: 6rem;
}

.rIMG > i {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 50%;
  border: 1px rgb(53, 135, 173) solid;
  width: 60px;
  height: 60px;
  font-size: 42px;
  z-index: 99;
}

.footer_box {
  background: url(/static/img/dashboard/Path6.png) no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 35px;
}

.content {
  position: relative;
  width: 100%;
  height: 100%;
}

.content > img {
  width: 100%;
  height: 100%;
  z-index: 99;
  position: relative;
}

.nums {
  margin-top: 10px;
  font-size: 42px;
}

.lan {
  color: #377ca8;
  margin-bottom: 10px;
  font-size: 1.6rem;
}

.leftBorder {
  width: 100%;
  height: 20%;
  background: url(/static/img/dashboard/Path54.png) no-repeat center;
  background-size: 100% 100%;
  color: rgb(53, 135, 173);
  position: relative;
}

.leftBorder2 {
  width: 80%;
  height: 20%;
  margin-top: 20px;
  position: relative;
}

.lb_center_su {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 2rem;
}

.rightBorder {
  width: 100%;
  height: 20%;
  text-align: center;
  color: #fff;
}

.rightBorder2 {
  width: 100%;
  height: 85%;
  background: url(/static/img/dashboard/Path68.png) no-repeat center;
  background-size: 100% 100%;
  overflow-y: auto;
}

.backIMG {
  background: url(/static/img/dashboard/Path58.png) no-repeat center;
  background-size: 100% 100%;
}

.backIMG2 {
  background: url(/static/img/dashboard/Path67.png) no-repeat center;
  background-size: 100% 100%;
}

.backIMG3 {
  background: url(/static/img/dashboard/Path62.png) no-repeat center;
  background-size: 100% 100%;
}

.backIMG4 {
  background: url(/static/img/dashboard/Path153.png) no-repeat center;
  background-size: 100% 100%;
}

.backIMG4-1 {
  background: url(/static/img/dashboard/Path154.png) no-repeat center;
  background-size: 100% 100%;
}

.backIMG5 {
  background: url(/static/img/dashboard/Path156.png) no-repeat center;
  background-size: 100% 100%;
}

.backIMG6 {
  background: rgb(53, 135, 173);
  background-size: 100% 100%;
}

.lBorder {
  position: relative;
  width: 40%;
  height: 50px;
  border: 1px solid #57c2eb;
  text-align: center;
  line-height: 50px;
  color: white;
  font-size: 15rem;
  margin-right: 10px;
  padding: 3px 5px;
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

.map_show {
  transform-origin: 50% 50%;
  transform: scale(1.6);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(1.6);
}

@media screen and (min-width: 900px) and (max-width: 1600px) {
  .map_show {
    transform: translate(-50%, -50%) scale(1);
  }
}

@media screen and (min-width: 1601px) and (max-width: 2000px) {
  .map_show {
    transform: translate(-50%, -50%) scale(1.6);
  }
}

@media screen and (min-width: 20001px) and (max-width: 2600px) {
  .map_show {
    transform: translate(-50%, -50%) scale(2.3);
  }
}

@media screen and (min-width: 2601px) {
  .map_show {
    transform: translate(-50%, -50%) scale(2.6);
  }
}

</style>
