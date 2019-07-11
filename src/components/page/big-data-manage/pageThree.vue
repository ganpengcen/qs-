<template>
  <div class="wrap">
    <div class="data">
      <div class="data-title">
        <div class="title-center">锡山区智慧法务系统大数据分析</div>
        <div class="nav-btn">
          <div class="skew boxstyle unactive fl">
            <div class="skew-main" @click="gotoHome">首 页</div>
          </div>
          <div class="skew boxstyle unactive fl">
            <div class="skew-main" @click="gotoSecond">法律咨询</div>
          </div>
          <div class="skew boxstyle btnactive fl">
            <div class="skew-main" @click="gotoThree">社区矫正</div>
          </div>
          <div class="fl iconstyle" @click="changeIcon">
            <i class="el-icon-video-pause dashicon" v-show="!iconplay"></i>            
            <i class="el-icon-video-play dashicon"  v-show="iconplay"></i>            
          </div>
        </div>
      </div>
      <div class="data-content">
        <div class="con-left fl">
          <div class="left-top">
            <div class="info boxstyle">
              <div class="titleBigData">矫正类型分析</div>
              <div id="echarts_xyType" class="charts"></div>
            </div>
            <div class="top-bottom top-bottom3 boxstyle">
              <div class="titleBigData">区局社区矫正人员统计</div>
              <div id="echarts_correct" class="charts"></div>
            </div>
          </div>
          <!-- <div ref="qWarp" class="left-bottom boxstyle">
            <div class="titleBigData">实时咨询问题</div>
          </div> -->
        </div>
        <div class="con-center fl">
          <div class="cen-tit boxstyle">
            <div class="case-count">
              <div>
                <p class="t-orange">{{XyStatisticsSummary.totalStudyHour}}</p>
                <p>教育学习总时间(小时)</p>
              </div>
              <div>
                <p class="t-redorange">{{XyStatisticsSummary.totalServiceHour}}</p>
                <p>社区服务总时间(小时)</p>
              </div>
              <div>
                <p class="t-green">{{XyStatisticsSummary.personCount}}</p>
                <p>在期监管人员</p>
              </div>
            </div>
          </div>

          <div class="cen-bottom3 boxstyle">
            <div class="titleBigData">当月完成数统计</div>
            <ul class="rank">
              <li>
                <span>区域名称</span>
                <span>在矫正期人员数</span>
                <span>教育学习本月完成数</span>
                <span>社区服务本月完成数</span>
              </li>
              <li v-for="(item,i) in XyFinishedReporting" :key="i">
                <span>{{item.areaName}}</span>
                <span>{{item.monitedPersonCount}}</span>
                <span class="progressOut">{{item.studyRecordThisMonth}}
                  <el-progress :percentage="item.studyFinishRate"></el-progress>
                </span>
                <span class="progressOut">{{item.serviceRecordThisMonth}}
                  <el-progress :percentage="item.serviceFinishRate" color="#8e71c7"></el-progress>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="con-right con-right1 fr">
          <div class="right-top1 boxstyle">
            <div class="titleBigData">监管周期统计</div>
            <div id="echarts_xyDate" class="charts"></div>
          </div>
          <div class="right-center boxstyle">
            <div class="titleBigData">监管人员年龄段分析</div>
            <div id="echarts_xyages" class="charts"></div>
          </div>
          <div class="right-center boxstyle">
            <div class="titleBigData">监管人员性别统计</div>
            <div id="echarts_xysex" class="charts"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg"></div>

  </div>

</template>

<script>
import Api from "@/kites/api";
import { Post } from "@/api/api";
import { constants } from "zlib";
import { clearInterval, setInterval } from "timers";
require("echarts-wordcloud");
export default {
  name: "pageThree",
  data() {
    return {
      animate: false,
      serviceAgencies: [], //机构
      text: ["", "", ""],
      XyStatisticsSummary: [], //统计概况
      XyFinishedReporting: [], //学习情况
      timer: null,
      iconplay:false
    };
  },
  beforeCreate() {
    // document.getElementById("appLoading").style.display = "block";
  },
  computed: {},
  created() {
    this.GetXyStatisticsSummary(); //社区矫正统计概况
    this.GetXyFinishedReporting(); //学习情况
    // document.getElementById("appLoading").style.display = "none";
  },
  mounted() {
    this.echarts_xyDate(); //周期统计
    this.echarts_xyType(); //类型占比
    this.echarts_xyages(); //年龄分布
    this.echarts_xysex(); //性别
    this.echarts_correct(); //矫正人员统计
    this.openTimer();
  },

  methods: {
    changeIcon() {
      this.iconplay = !this.iconplay
      if (!this.iconplay) {
        this.openTimer()
      }else{
         clearTimeout(this.timer)
      }
    },
     openTimer () {
      this.timer = setTimeout(() => {
        this.gotoHome()
      }, 30000)
      this.$once('hook:beforeDestroy', () => {
        clearTimeout(this.timer)
      })
    },
    // 监管周期统计
    async echarts_xyDate() {
      try {
        const res = await Post(Api.GetXyDateRangeSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_xyDate")
          );
          const result = res.result;
          var data = [];
          var category = [];
          for (var i = 0; i < result.length; i++) {
            data.push({ name: result[i].name, value: result[i].count });
            category.push(result[i].name);
          }

          var option = {
            color: "#DAB4E4",
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            grid: {
              borderWidth: 0,
              top: 20,
              bottom: 35,
              left: 40,
              right: 10,
              textStyle: {
                color: "#fff"
              }
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                axisTick: { show: false },
                data: category,
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "rgba(255,255,255,0.6)"
                  }
                },
                axisLabel: {
                  inside: false,
                  textStyle: {
                    color: "#bac0c0",
                    fontWeight: "normal",
                    fontSize: "12"
                  },
                  interval: 0 //强制显示所有标签
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "rgba(255,255,255,0.6)"
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "rgba(255,255,255,0)"
                  }
                }
              }
            ],

            series: [
              {
                type: "bar",
                barWidth: "35%",
                barGap: 0,
                data: data
              }
            ]
          };

          myChart.setOption(option);
          window.addEventListener("resize", function() {
            myChart.resize();
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    //社区矫正人数统计
    async echarts_correct() {
      try {
        const res = await Post(Api.GetAreaMonitedPersonSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_correct")
          );
          const result = res.result;
          var xData = [];
          var data = [];
          for (var i = 0; i < result.length; i++) {
            xData.push(result[i].name);
            data.push(result[i].personCount);
          }
          var option = {
            // backgroundColor: "#141f56",
            tooltip: {
              show: "true",
              trigger: "item",
              backgroundColor: "rgba(0,0,0,0.4)", // 背景
              padding: [8, 10], //内边距
              // extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
              formatter: function(params) {
                if (params.seriesName != "") {
                  return params.name + " ：  " + params.value + " 人";
                }
              }
            },
            grid: {
              borderWidth: 0,
              top: 20,
              bottom: 35,
              left: 40,
              right: 10,
              textStyle: {
                color: "#fff"
              }
            },
            xAxis: [
              {
                type: "category",

                axisTick: {
                  show: false
                },

                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "rgba(255,255,255,0.2)"
                  }
                },
                axisLabel: {
                  inside: false,
                  textStyle: {
                    color: "#bac0c0",
                    fontWeight: "normal",
                    fontSize: "12"
                  },
                  interval: 0, //强制显示所有标签
                  rotate: 25,
                  formatter: function(params) {
                    var newParamsName = ""; // 最终拼接成的字符串
                    var paramsNameNumber = params.length; // 实际标签的个数
                    var provideNumber = 4; // 每行能显示的字的个数
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                      /** 循环每一行,p表示行 */
                      var tempStr = "";
                      tempStr = params.substring(0, 4);
                      newParamsName = tempStr + "..."; // 最终拼成的字符串
                    } else {
                      // 将旧标签的值赋给新标签
                      newParamsName = params;
                    }
                    //将最终的字符串返回
                    return newParamsName;
                  }
                },
                data: xData
              },
              {
                type: "category",
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: false
                },
                splitArea: {
                  show: false
                },
                splitLine: {
                  show: false
                },
                data: xData
              }
            ],
            yAxis: {
              min: 0,
              type: "value",
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.2)"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.1)"
                }
              },
              axisLabel: {
                textStyle: {
                  color: "#bac0c0",
                  fontWeight: "normal",
                  fontSize: "12"
                },
                formatter: "{value}"
              }
            },
            series: [
              {
                type: "bar",
                itemStyle: {
                  normal: {
                    show: true,
                    color: new this.$echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "#00c0e9"
                        },
                        {
                          offset: 1,
                          color: "#3b73cf"
                        }
                      ]
                    ),
                    barBorderRadius: 50,
                    borderWidth: 0
                  },
                  emphasis: {
                    shadowBlur: 15,
                    shadowColor: "rgba(105,123, 214, 0.7)"
                  }
                },
                zlevel: 2,
                barWidth: "20%",
                data: data
              },
              {
                name: "",
                type: "bar",
                xAxisIndex: 1,
                zlevel: 1,
                itemStyle: {
                  normal: {
                    color: "transparent",
                    borderWidth: 0,
                    shadowBlur: {
                      shadowColor: "rgba(255,255,255,0.31)",
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowOffsetY: 2
                    }
                  }
                },
                barWidth: "20%",
                data: [30, 30, 30, 30, 30]
              }
            ]
          };
          myChart.setOption(option);
          window.addEventListener("resize", function() {
            myChart.resize();
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 社区统计
    async GetXyStatisticsSummary() {
      try {
        const res = await Post(Api.GetXyStatisticsSummary, {});
        if (res.success) {
          this.XyStatisticsSummary = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //学习完成情况
    async GetXyFinishedReporting() {
      try {
        const res = await Post(Api.GetXyFinishedReporting, {});
        if (res.success) {
          this.XyFinishedReporting = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 类型占比
    async echarts_xyType() {
      try {
        const res = await Post(Api.GetXyTypeSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_xyType")
          );
          const result = res.result;
          var typeArr = [];
          var data = [];
          for (var i = 0; i < result.length; i++) {
            typeArr.push(result[i].name);
            data.push({ value: result[i].count, name: result[i].name });
          }
          var option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
              backgroundColor: "rgba(0,0,0,0.4)" // 背景
            },
            legend: {
              data: typeArr,
              textStyle: {
                color: "rgb(200,200,200)"
              }
            },
            series: [
              {
                name: "监管人员类型占比",
                type: "pie",
                color: ["#ED9257", "#72AB89", "#9A75E1"],
                radius: "55%",
                center: ["50%", "60%"],
                data: data,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                },
                label: {
                  //标签的位置
                  normal: {
                    show: true,
                    textStyle: {
                      color: "rgb(200,200,200)"
                    }
                  }
                }
              }
            ]
          };

          myChart.setOption(option);
          window.addEventListener("resize", function() {
            myChart.resize();
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 年龄段
    async echarts_xyages() {
      try {
        const res = await Post(Api.OnlineQuestionAgeSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_xyages")
          );
          const result = res.result;
          var data = [];
          var tit = [];
          for (var i = 0; i < result.length; i++) {
            tit.push(result[i].name);
            data.push({ value: result[i].count, name: result[i].name });
          }
          var option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
              {
                name: "监管人员年龄段",
                type: "pie",

                radius: ["50%", "70%"],

                avoidLabelOverlap: false,
                // label: {
                //   normal: {
                //     show: false
                //     // position: "center"
                //   },
                //   emphasis: {
                //     show: true,
                //     textStyle: {
                //       fontSize: "30",
                //       fontWeight: "bold"
                //     }
                //   }
                // },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                data: data
              }
            ]
          };

          myChart.setOption(option);
          window.addEventListener("resize", function() {
            myChart.resize();
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 性别
    async echarts_xysex() {
      try {
        const res = await Post(Api.GetXyGenderSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_xysex")
          );
          const result = res.result;
          var data = [];
          for (var i = 0; i < result.length; i++) {
            data.push({ value: result[i].count, name: result[i].name });
          }
          var option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
              backgroundColor: "rgba(0,0,0,0.4)" // 背景
            },
            series: [
              {
                name: "监管人员性别占比",
                type: "pie",
                color: ["#CD5555", "#4F94CD"],
                radius: "65%",
                center: ["50%", "50%"],
                data: data,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                },
                label: {
                  //标签的位置
                  normal: {
                    show: true,
                    // position: "inside",
                    textStyle: {
                      color: "rgb(250,250,250)"
                    }
                  }
                }
              }
            ]
          };

          myChart.setOption(option);
          window.addEventListener("resize", function() {
            myChart.resize();
          });
        }
      } catch (e) {
        console.log(e);
      }
    },

    gotoHome() {
      this.$router.push("/bigData");
    },
    gotoSecond() {
      this.$router.push("/pageTwo");
    },
    gotoThree() {
      this.$router.push("/pageThree");
    }
  }
};
</script>

<style>
.progressOut .el-progress__text{
  color: rgb(221, 221, 221);
  font-size: 12px !important;
}
</style>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.diaWrap {
  height: 500px;
  overflow: scroll;
}
.nondata {
  text-align: center;
}

.cen-bottom {
  overflow: hidden;
}
.con-left > .left-top > .top-bottom3 {
  height: 60%;
}

/*公共服务机构 */
.entity-services {
  overflow: hidden;
  width: 90%;
  height: 32px;
  line-height: 32px;
  margin: 0 auto;
  background: linear-gradient(
    135deg,
    transparent 10px,
    rgba(30, 30, 214, 0.8) 0
  );
  color: rgb(255, 255, 255);
  padding: 5px 0;
  text-align: center;
  margin-top: 10px;
}
.entity-services i {
  float: left;
  margin-left: 8%;
}
.services-count {
  float: left;
  margin-left: 8%;
  font-weight: bolder;
}
.services-text {
  font-size: 14px;
  font-weight: bolder;
}
.left-bottom {
  overflow: hidden;
}
.l-wrap {
  position: relative;
  overflow: hidden;
  height: 85%;
}
.question-list {
  position: absolute;
  width: 100%;

  top: 40px;
  color: rgb(226, 226, 226);
  font-size: 14px;
}
.question-list li {
  padding: 0 15px;
  margin: 0 auto;
  margin-bottom: 8px;
}
.question-list li .question {
  color: rgb(30, 154, 255);
}
.question-list li .date {
  text-align: right;
}

.outside {
  float: left;
  margin-left: 2.2%;
  margin-bottom: 8px;
}

.avatar {
  width: 75px;
  border-radius: 50%;
}
.activeLvs {
  padding: 10px 8px 10px 15px;
  color: rgb(123, 176, 255);
}
.avatarInfo {
  width: 60%;
  margin-left: 10px;
}
.avatarInfo > h1 {
  font-size: 20px;
  font-weight: bolder;
  border-bottom: 1px solid rgb(199, 213, 233);
  padding-bottom: 6px;
}
.miaos {
  padding-top: 3px;
  font-size: 13px;
}
.Agency {
  text-align: center;
  font-size: 15px;
  font-weight: bolder;
  color: rgb(222, 227, 235);
  padding: 8px 0;
}
.rank {
  margin-top: 10px;
}
.rank > li {
  display: flex;
  justify-content: space-around;
  color: rgb(238, 238, 238);
  line-height: 35px;
  font-size: 14px;
  font-weight: bolder;
  text-align: center;
}
.rank .top-three {
  line-height: 45px;
}
.rank li:nth-child(odd) {
  background-color: rgba(17, 132, 240, 0.4);
}
.rank > li > span {
  width: 33%;
  text-align: center;
}
.rank-first {
  color: red;
}
.rank-second {
  color: orange;
}
.rank-third {
  color: green;
}
.rankNumber {
  position: relative;
}
.rankNumber > span {
  position: absolute;
  left: 46.6%;
  top: 6%;
  font-size: 12px;
}
.rankNumber > i {
  position: absolute;
  font-size: 25px;
  left: 37%;
}
.cen-center-left {
  width: 49%;
  height: 100%;
  margin-top: 0;
}
.cen-center-right {
  width: 49%;
  height: 100%;
  margin-left: 2%;
  margin-top: 0;
}
.cen-tit {
  display: flex;
}
.case-count {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.case-count > div {
  width: 33%;
}
.case-count div p:first-child {
  font-size: 25px;
  margin-bottom: 10px;
  font-weight: bolder;
}
.case-count div p:last-child {
  color: #fff;
  font-weight: bolder;
}
.t-orange {
  color: rgb(226, 171, 88);
}
.t-redorange {
  color: rgb(230, 94, 70);
}
.t-green {
  color: rgb(49, 218, 63);
}

</style>
