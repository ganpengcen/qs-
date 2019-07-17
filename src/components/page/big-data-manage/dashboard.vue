<template>
  <div class="wrap">
    <div class="data">
      <div class="data-title">
        <div class="title-center">锡山区智慧法务系统大数据分析</div>
        <div class="nav-btn">
          <div class="skew boxstyle btnactive fl">
            <div class="skew-main">首 页</div>
          </div>
          <div class="skew boxstyle unactive fl">
            <div class="skew-main" @click="gotoSecond">法律咨询</div>
          </div>
          <div class="skew boxstyle unactive fl">
            <div class="skew-main" @click="gotoThree">社区矫正</div>
          </div>
          <div class="fl iconstyle" @click="changeIcon">
            <i class="el-icon-video-pause dashicon" v-show="!iconplay"></i>
            <i class="el-icon-video-play dashicon" v-show="iconplay"></i>
          </div>
        </div>
      </div>

      <div class="data-content">
        <div class="con-left fl">
          <div class="left-top">
            <div class="info boxstyle">
              <div class="titleBigData">实时统计</div>
              <div class="info-main">
                <ul>
                  <li>
                    <img src="@/assets/images/weixin.png" alt />
                    <span>社群总数(个)</span>
                    <p>{{dashboardSummary.totalWeiChatGroupCount}}</p>
                  </li>
                  <li>
                    <img src="@/assets/images/kw.png" alt />
                    <span>知识库总数(条)</span>
                    <p>{{dashboardSummary.totalRobKnowledgeCount}}</p>
                  </li>
                  <li>
                    <img src="@/assets/images/yuanzhu.png" alt />
                    <span>法律援助数(件)</span>
                    <p>{{dashboardSummary.totalLegalAidCount}}</p>
                  </li>
                  <li>
                    <img src="@/assets/images/tiaojie.png" alt />
                    <span>人民调解数(件)</span>
                    <p>{{dashboardSummary.totalPeopleMediationCount}}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="top-bottom boxstyle">
              <div class="titleBigData">法律援助分类统计TOP5</div>
              <div id="echarts_1" class="charts"></div>
            </div>
          </div>
          <div class="left-bottom boxstyle">
            <div class="titleBigData">区局社区矫正人员统计</div>
            <div id="echarts_2" class="charts"></div>
          </div>
        </div>
        <div class="con-center fl">
          <div class="cen-tit boxstyle">
            <div class="case-count falv">
              <div class="cmonth">
                <p>{{allCount.totalLegalAidMonthCount}}</p>
                <p>法律援助当月数量</p>
              </div>
              <div class="cyear">
                <p>{{allCount.totalLegalAidYearCount}}</p>
                <p>法律援助全年数量</p>
              </div>
            </div>
            <div class="case-count people">
              <div class="cmonth">
                <p>{{allCount.totalPeopleMediationMonthCount}}</p>
                <p>人民调解当月数量</p>
              </div>
              <div class="cyear">
                <p>{{allCount.totalPeopleMediationYearCount}}</p>
                <p>人民调解全年数量</p>
              </div>
            </div>
          </div>
          <div class="cen-top boxstyle">
            <div class="titleBigData">各街道申请案件汇总</div>
            <div class="clearfix mapwrap">
              <div class="fl map">
                <div class="backgorundmap">
                  <img src="/static/img/map1.png" alt />
                </div>
                <div class="backgorundmap" v-for="(item,index) in imgs" :key="index">
                  <img
                    class="animated flash"
                    v-show="i == index"
                    :src="`/static/img/${item}.png`"
                    alt
                  />
                </div>
              </div>
              <div class="fl mapcharts">
                <div id="echarts_7" class="charts"></div>
              </div>
              <!-- <div class="streetbox">
                <p class="streetname">{{DistrictSummary[i].district}}</p>
                <p class="streetcount">法律援助数量：{{DistrictSummary[i].legalAidCount}}</p>
                <p class="streetcount">人民调解数量：{{DistrictSummary[i].peopleMediationCount}}</p>
              </div>-->

              <!-- animated flipInX -->

              <div
                class="dbox"
                v-for="(item,index) in coordinates"
                :key="index"
                :style="{top:`${item.top}px`,left:`${item.left}px`}"
                v-show="i == index"
              >
                <div class="dot"></div>
                <div class="brokenline">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="40px"
                    height="130px"
                    viewBox="0 0 40 130"
                    enable-background="new 0 0 40 130"
                    xml:space="preserve"
                  >
                    <path
                      stroke="#fff"
                      stroke-width="2"
                      class="line-drawing-demo"
                      d="m0.98295,129.61905l12.389,-85.17829l26.402,0"
                      fill="none"
                    />
                  </svg>
                </div>

                <div class="streetbox1">
                  <div>
                    <p class="streetname">{{DistrictSummary[i].district}}</p>
                    <p class="streetcount">法律援助数量：<strong>{{DistrictSummary[i].legalAidCount}}</strong></p>
                    <p class="streetcount">人民调解数量：<strong>{{DistrictSummary[i].peopleMediationCount}}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="cen-bottom clearfix">
            <div class="cen-bottom-left boxstyle fl">
              <div class="titleBigData">社区热词分析</div>
              <div id="echarts_11" class="charts"></div>
            </div>
            <div class="cen-bottom-right boxstyle fl">
              <div class="titleBigData">当天群发言排行TOP9</div>
              <div class="awardWrap">
                <div class="award-table fl">
                  <div class="t-low">
                    <p>{{mostChatGroups[1].nickName}}</p>
                    <div>第2名</div>
                  </div>
                  <div class="t-high">
                    <p>{{mostChatGroups[0].nickName}}</p>
                    <div>第1名</div>
                  </div>
                  <div class="t-low">
                    <p>{{mostChatGroups[2].nickName}}</p>
                    <div>第3名</div>
                  </div>
                </div>
                <div class="award-list fl">
                  <div v-for="(item,index) in mostChatGroups" :key="index">
                    <div class="list-item fl" v-if="index!==0&&index!==1&&index!==2">
                      <p class="list-num fl">{{index+1}}</p>
                      <p class="list-text fl">{{item.nickName}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="con-right con-right1 fr">
          <div class="right-top boxstyle">
            <div class="titleBigData">人民调解分类统计TOP5</div>
            <div id="echarts_4" class="charts"></div>
          </div>
          <!-- <div class="right-center boxstyle">
            <div class="titleBigData">当天群发言排行TOP5</div>
            <div id="echarts_5" class="charts"></div>
          </div>-->
          <div class="right-bottom boxstyle">
            <div class="titleBigData">当天用户发言排行TOP5</div>
            <div id="echarts_6" class="charts"></div>
          </div>
          <div class="right-center boxstyle">
            <div class="titleBigData">各街道信息上报汇总</div>
            <div id="echarts_12" class="charts"></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="案件统计详情" :visible.sync="dialogVisible" width="50%">
      <div class="diaWrap">
        <div class="row">
          <div class="col-lg-6">
            <p v-if="nonData2" class="nondata">法律援助暂时没有数据</p>
            <div
              class="charts"
              ref="chart7_2"
              style="text-align: center;width: 90%; height: 400px; margin: 0 auto;"
            ></div>
          </div>
          <div class="col-lg-6">
            <p v-if="nonData1" class="nondata">人民调解暂时没有数据</p>
            <div
              class="charts"
              ref="chart7_1"
              style="text-align: center;width: 90%; height: 400px; margin: 0 auto;"
            ></div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="bg"></div>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { Post } from "@/api/api";
import anime from "animejs";
require("echarts-wordcloud");
export default {
  name: "bigData",
  data() {
    return {
      dialogVisible: false,
      dashboardSummary: {}, //工作台信息
      mostChatGroups: [{ nickName: "" }, { nickName: "" }, { nickName: "" }], //群发言排行
      nonData1: false, //人民调解
      nonData2: false, //法律援助
      allCount: {},
      timer: null,
      imgTimer: null,
      iconplay: false,
      DistrictSummary: [
        { areaId: 0, district: "", legalAidCount: 0, peopleMediationCount: 0 }
      ],
      imgs: [
        "yangjian",
        "donggang",
        "dongbeitang",
        "dongting",
        "anzheng",
        "xibei",
        "ehu",
        "yunlin",
        "houqiao"
      ],
      // xy:[200,100,200,260,230,130,330,220,260],
      coordinates: [
        { top: 200, left: 310 },
        { top: 100, left: 280 },
        { top: 200, left: 40 },
        { top: 260, left: 70 },
        { top: 230, left: 180 },
        { top: 130, left: 130 },
        { top: 330, left: 330 },
        { top: 220, left: 100 },
        { top: 260, left: 250 }
      ],
      // left:[310,280,40,70,180,130,330,100,250],
      i: 0
    };
  },
  beforeCreate() {},
  created() {
    // this.GetDashboardStatisticCount();
  },
  mounted() {
    // this.GetDashboardSummary(); //工作台信息
    // this.echarts_1(); //法律援助类型统计
    // this.echarts_2(); //社区矫正人数统计
    // this.echarts_4(); //人民调解分类统计
    // //this.echarts_5(); //群发言总排行数
    // this.GetTopMostChatGroups(); //群发言总排行数
    // this.echarts_6(); //用户发言排行
    // this.echarts_7(); //街道案件统计
    // //this.echarts_8(); //根据区域统计上报信息
    // this.echarts_11(); //热词
    // this.echarts_12(); //根据区域统计上报信息
    // this.show = false;
    // this.openTimer();
    // this.openImgTimer();
  },
  methods: {
    setDash() {
      anime({
        targets: ".line-drawing-demo",
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInOutSine",
        duration: 400,
        delay: 0,
        direction: "alternate",
        loop: false
      });
    },
    unfoldBox() {
      anime({
        targets: ".streetbox1",
        opacity: [0,1],
        delay: 400,
        duration: 350,
        height: "85px",
        easing: 'easeInSine',
        loop: false
      });
    },
    changeIcon() {
      this.iconplay = !this.iconplay;
      if (!this.iconplay) {
        this.openTimer();
      } else {
        clearTimeout(this.timer);
      }
    },
    gotoSecond() {
      this.$router.push("/pageTwo");
    },
    gotoThree() {
      this.$router.push("/pageThree");
    },
    openTimer() {
      this.timer = setTimeout(() => {
        this.gotoSecond();
      }, 30000);
      this.$once("hook:beforeDestroy", () => {
        clearTimeout(this.timer);
      });
    },
    openImgTimer() {
      this.imgTimer = setInterval(() => {
        this.i++;
        if (this.i >= this.imgs.length) {
          this.i = 0;
        }
        this.setDash();
      var box = document.getElementsByClassName("streetbox1");
      box[this.i].style.height = 0;
        this.unfoldBox();
      }, 3000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(this.imgTimer);
      });
    },
    //工作台信息
    async GetDashboardSummary() {
      try {
        const res = await Post(Api.GetDashboardSummary, {});
        if (res.success) {
          this.dashboardSummary = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //法律援助类型统计
    async echarts_1() {
      try {
        const res = await Post(Api.LegalAidSummary, { top: 5 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_1")
          );
          const result = res.result;
          var data = [];
          var category = [];
          for (var i = 0; i < result.length; i++) {
            data.push({ name: result[i].name, value: result[i].count });
            category.push(result[i].name);
          }
          var option = {
            tooltip: {
              trigger: "item",
              formatter: "{b}: <br/>{c} ({d}%)"
            },
            color: ["#20b9cf", "#2089cf", "#205bcf"],
            legend: {
              //图例组件，颜色和名字
              x: "60%",
              y: "center",
              orient: "vertical",
              itemGap: 12, //图例每项之间的间隔
              itemWidth: 10,
              itemHeight: 10,
              icon: "rect",
              data: category,
              textStyle: {
                color: [],
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: 12
              }
            },
            series: [
              {
                name: "分类占比",
                type: "pie",
                clockwise: false, //饼图的扇区是否是顺时针排布
                minAngle: 20, //最小的扇区角度（0 ~ 360）
                center: ["35%", "50%"], //饼图的中心（圆心）坐标
                radius: [40, 60], //饼图的半径
                //  avoidLabelOverlap: true, ////是否启用防止标签重叠
                itemStyle: {
                  //图形样式
                  normal: {
                    borderColor: "transparent",
                    borderWidth: 2
                  }
                },
                label: {
                  //标签的位置
                  normal: {
                    show: true,
                    position: "inside", //标签的位置
                    formatter: "{d}%",
                    textStyle: {
                      color: "#fff"
                    }
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    textStyle: {
                      fontWeight: "bold"
                    }
                  }
                },
                data: data
              },
              {
                name: "",
                type: "pie",
                clockwise: false,
                silent: true,
                minAngle: 20, //最小的扇区角度（0 ~ 360）
                center: ["35%", "50%"], //饼图的中心（圆心）坐标
                radius: [0, 40], //饼图的半径
                itemStyle: {
                  //图形样式
                  normal: {
                    borderColor: "#1e2239",
                    borderWidth: 1.5,
                    opacity: 0.51
                  }
                },
                label: {
                  //标签的位置
                  normal: {
                    show: false
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

    //社区矫正人数统计
    async echarts_2() {
      try {
        const res = await Post(Api.GetAreaMonitedPersonSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_2")
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

    //人民调解分类统计
    async echarts_4() {
      try {
        const res = await Post(Api.PeopleMediationSummary, { top: 5 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_4")
          );
          const result = res.result;
          var data = [];
          var category = [];
          for (var i = 0; i < result.length; i++) {
            data.push({ name: result[i].name, value: result[i].count });
            category.push(result[i].name);
          }
          var option = {
            tooltip: {
              trigger: "item",
              formatter: "{b}: <br/>  {c} ({d}%)"
            },
            toolbox: {
              show: false,
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                  show: true,
                  type: ["pie", "funnel"]
                },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            calculable: true,
            series: [
              {
                name: "排名",
                type: "pie",
                color: ["#33b565", "#20cc98", "#20b9cf", "#2089cf", "#205bcf"],
                radius: [20, 70],
                center: ["50%", "50%"],
                roseType: "area",
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

    //群发言总排行数
    async GetTopMostChatGroups() {
      try {
        const res = await Post(Api.GetTopMostChatGroups, { top: 9 });
        if (res.success) {
          this.mostChatGroups = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async echarts_5() {
      try {
        const res = await Post(Api.GetTopMostChatGroups, { top: 5 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_5")
          );
          const result = res.result;
          var xData = [];
          var data = [];
          for (var i = 0; i < result.length; i++) {
            xData.push(result[i].nickName);
            data.push(result[i].totalChatCount);
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
                  return params.name + " ：  " + params.value + " 条";
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

    //用户发言排行
    async echarts_6() {
      try {
        const res = await Post(Api.GetTopMostChatGroupMembers, { top: 5 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_6")
          );
          const result = res.result;
          var data = {
            chart: []
          };
          for (var i = 0; i < result.length; i++) {
            data.chart.push({
              month: result[i].nickName,
              value: result[i].totalChatCount
            });
          }
          var xAxisMonth = [],
            barData = [],
            lineData = [];
          for (var i = 0; i < data.chart.length; i++) {
            xAxisMonth.push(data.chart[i].month);
            barData.push({
              name: xAxisMonth[i],
              value: data.chart[i].value
            });
            lineData.push({
              name: xAxisMonth[i],
              value: data.chart[i].ratio
            });
          }

          var option = {
            // backgroundColor: "#020d22",
            title: "",
            grid: {
              top: "10%",
              left: "30",
              bottom: "0",
              right: "10",
              containLabel: true
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "none"
              },
              formatter: function(params) {
                return (
                  params[0]["data"].name +
                  "<br/>" +
                  "发言次数: " +
                  params[1]["data"].value +
                  "次"
                );
              }
            },
            xAxis: [
              {
                type: "category",
                show: false,
                data: ["NO.1", "NO.2", "NO.3", "NO.4", "NO.5"],
                axisLabel: {
                  textStyle: {
                    color: "#b6b5ab"
                  }
                }
              },
              {
                type: "category",
                position: "bottom",
                nameRotate: -30,
                data: xAxisMonth,
                boundaryGap: true,
                // offset: 40,
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: "rgba(255,255,255,0.2)"
                  }
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  color: "rgba(255,255,255,0.2)"
                },
                axisLabel: {
                  textStyle: {
                    color: "#b6b5ab"
                  }
                  // interval:0,//强制显示所有标签
                }
              }
            ],
            yAxis: [
              {
                show: true,
                offset: 15,
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: "rgba(255,255,255,0.1)"
                  }
                },

                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  color: "rgba(255,255,255,0.1"
                },
                axisLabel: {
                  show: true,
                  color: "#b6b5ab"
                }
              },
              {
                show: false,
                type: "value",
                // name: "合格率(%)",
                nameTextStyle: {
                  color: "#ccc"
                },
                axisLabel: {
                  color: "#ccc"
                },
                splitLine: {
                  show: false
                },
                axisLine: {
                  show: true
                },
                axisTick: {
                  show: true
                }
              }
            ],
            color: ["#e54035"],
            series: [
              {
                name: "发言次数",
                type: "pictorialBar",
                xAxisIndex: 1,
                barCategoryGap: "-40%",
                // barCategoryGap: '-5%',
                symbol: 'path://d="M150 50 L130 130 L170 130  Z"',
                itemStyle: {
                  normal: {
                    color: function(params) {
                      var colorList = [
                        "rgba(13,177,205,0.8)",
                        "rgba(29,103,182,0.6)",
                        "rgba(13,177,205,0.8)",
                        "rgba(29,103,182,0.6)",
                        "rgba(13,177,205,0.8)",
                        "rgba(29,103,182,0.6)"
                      ];
                      return colorList[params.dataIndex];
                    }
                  },
                  emphasis: {
                    opacity: 1
                  }
                },
                data: barData
              },
              {
                symbol:
                  "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAGDUlEQVRogbWaPWxcRRDHf/fO92Ffgk2MrXygBEJACCiQkCgQcoPSIAVXoYCKFBRIKegpQJHSBokehIgoiBBFrEiAQuEKgoQiPiIQEIRANnFI7ODYvvP5fBQ74zdvb/e9y9keafV27+3Hf2ZnZmf2XYlulx2kClAFVqS9V57LO7mIUmmb4H2wO90/l7YLfru0LWYGAd8A1oF2dM4wFS1UB8oFc3sLbV/yMbD9kF1cd6EDNPtbuBh8BUiAVmacP09+21+kqN0XDSL5UuQZ+w2y4LqRp18fwalPVIWGckBWvIE+yJJXz2PKAg3VtV0y9TbOBgYCnwSA+4ATD7zPSAj8pgFui+1XokDqrlOx2oQkbIEnpsQYUICb5rkZ+C2kUnWp9xixL/kKbqu0Ywh44pWy97SMPQ78A9w2ADsGfEf6bRqwm/KbqlHTMJAhX/INUleVB7xsypCpPwncBO6QlbyCfQyYkz6dQMnbhULw2Xdx4EOmPCiLLRtGtK8u3hVwG15pm7plwNqFZaAsfYC4wYY8iwVeMeUO7nBpSFsZ0HEKXMG3cafoOnAMuAEsBDBYVQqS9SiNAAMxqU8CR3G6OIzzyS8DM8B9wMPAi8DzwCjwEHAROCnrjMi4FeB+w7Rv+BYLGKn74Ne9jpYBX+qTOCkq8HEB+ouA7QA/AX8BYzJmBjgF7DEMNHH6XyVVw5DnslSX+YI6H5K4gq4CNbISfwd4Hxe7q4dQr6WeZEOE0wLWgNPA18Cn0j6M80i/Sz+1Aav/yFM1ZCXvkFJGfJVRJurA2x7IESMZH3wLJ+khATkNXJL3i2S9loJWDFbC69KHEt2uH1P7qlI2gI+JhEZw278fp7Mdaasuqxoo+LYAX5N17uK807LU7wKr8r5Ferpa9+mHEwzJQr6+W10Lucgq8BZwXvo0BHxjCg6/Ac895YyWFqx/AVffhW9uOAkjoNoilBeAT2TeI8BvZFXXlzy43W0mIomiAEwZmDcMPC3jEplseAqOnIOTChygBtUT8Ox5eIV0Z4bdKxrAa6QqM0q+sWYoyXvpTXKY7A58Rurra0DtLJyouV3poQMwftoxXMP1qeJs4XtS9bxJ2FVaPCDhS0Ka4cc6an0f2Z24gjlpp+DgWHwuAI7DE2ZMWcCfM4CXcoD3UEzyscGx8Lc0FgmeLHXDYfQlD/CeAgxK5YTwnUroSP6B1OI/Bm6Zdnepj7yzFI7nIeBJIhgypMYWIj/LOYQzqC7wAc7oEiSwmoW5ecdQlL6Ea/QGYl8FGOorN02QozaHAS0jwIQsOIPb1iGcx2kBrTPweSt1uxm6DnPvwVXpq4FZGzhLNqL8L4cB+1snoTfV8iWuWz0vE6vkTgHP4NSlCazNwp9vwoUf4Q+dYAmWL8KVl5yq6UG0Jq+Pk4bFe4ED5BxKhurgJGd1VWMTO1CP6n9xJ+EIqdSmgcuYUGAWrs/C3+SfsGsyZp+Zaz9O7fpRoQrQ1MCsTjb102KzJQ3KxmWBhpRDpL69n9hmlTREWJGiO9I0zKhd6M6rcLeoKDCzybKfCWnGdAv4ELiAixSbEfDrMt/rAvYMaSyjgP10sAewJfXzvpvzt82CXyQb3t4GvsPlp9pnSfotSn0Jl3FtAI8C35JKegJ4hGwYHFIZrW8lTbEcNi+L0gjzKE5aa0h4gDO6j6RcJk1SpoFXSb1My5QJYXKBXumHdmDrMsyCt7e/NrrUE9Hqv2ZTkzjjrJLGOf3msJM4r+TreCgJj0g4BR+L64tuDypeu5/bg3Gc3i9wb7cHUfC973qZiN3bPAAcBH41fWxsMopTj2uGiXu9t6mRvakOgq+TJguD3piN4/z2z4QNfzNQt8At6B5dzwOvurtqgPsMWFvY7bvKKPV7P18KPEPhbSwDsmBit8Qh16ifeoLfrIoOKT15bdhgSS9KLWD/6YP36yEp+7cFQSqSfOh6OQ9k6LcYsCLQhTToBzUfXFG7KNGw7dA3sAiI/sHXSCPE7ByD00CSUyq6PbDUQm6qAgD6yYDyjLNC70VvIW3nO2zRx+Rdp536fB/9bhShHWF8t/574P/bY1d26X/PtooMr/p/9AAAAABJRU5ErkJggg==",
                symbolSize: 42,

                type: "line",
                yAxisIndex: 1,
                data: lineData,
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    color: {
                      colorStops: [
                        {
                          offset: 0,
                          color: "#821eff"
                        },

                        {
                          offset: 1,
                          color: "#204fff"
                        }
                      ]
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

    async echarts_7() {
      try {
        const res = await Post(Api.GetDistrictSummary, { top: 5 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_7")
          );
          const result = res.result;
          this.DistrictSummary = res.result;
          var dates = [];
          var yData1 = [];
          var yData2 = [];
          for (var i = 0; i < result.length; i++) {
            dates.push(result[i].district);
            yData1.push({
              value: result[i].legalAidCount,
              area: result[i].areaId
            });
            yData2.push({
              value: result[i].peopleMediationCount,
              area: result[i].areaId
            });
          }
          var option = {
            color: ["#F4B960", "#5CB8DD"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              data: ["法律援助", "人民调解"],
              textStyle: {
                color: "rgb(200,200,200)"
              }
            },
            grid: {
              top: 10,
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
              textStyle: {
                color: "#fff"
              }
            },
            xAxis: {
              type: "value",
              boundaryGap: [0, 0.01],

              axisLabel: {
                inside: false,
                textStyle: {
                  color: "#bac0c0",
                  fontWeight: "normal",
                  fontSize: "12"
                },
                interval: 0 //强制显示所有标签
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.1)"
                }
              }
            },
            yAxis: {
              type: "category",
              data: dates,
              inverse: true, //坐标反向
              axisLabel: {
                inside: false,
                textStyle: {
                  color: "#bac0c0",
                  fontWeight: "normal",
                  fontSize: "12"
                },
                interval: 0 //强制显示所有标签
              }
            },
            series: [
              {
                type: "bar"
              },
              {
                name: "法律援助",
                type: "bar",
                data: yData1
              },
              {
                name: "人民调解",
                type: "bar",
                data: yData2
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

    //获取案件统计详情
    async echarts_open(area, name, date) {
      try {
        const res = await Post(Api.GetDetailSummary, {
          tagAreaId: area,
          tagDate: date
        });
        if (res.success) {
          if (this.$refs.chart7_1 && this.$refs.chart7_2) {
            let myChart1 = this.$echarts.init(this.$refs.chart7_1);
            let myChart2 = this.$echarts.init(this.$refs.chart7_2);
            myChart1.clear();
            myChart2.clear();
            const result = res.result;
            var lids = result.legalAids;
            var peoples = result.peopleMediations;
            var legalAid = {
                legendData: [],
                serialData: []
              },
              peopleMediation = {
                legendData: [],
                serialData: []
              };
            for (var i = 0; i < lids.length; i++) {
              legalAid.legendData.push(lids[i].caseName);
              legalAid.serialData.push({
                name: lids[i].caseName,
                value: lids[i].count
              });
            }
            for (var j = 0; j < peoples.length; j++) {
              peopleMediation.legendData.push(peoples[j].caseName);
              peopleMediation.serialData.push({
                name: peoples[j].caseName,
                value: peoples[j].count
              });
            }
            var option = {
              title: {
                text: `法律援助统计-${name}`,
                subtext: "按分类统计",
                x: "center"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: "horizontal",
                show: false,
                bottom: 20,
                data: legalAid.legendData
              },
              series: [
                {
                  name: "类别",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "55%"],
                  data: legalAid.serialData,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            };
            var option2 = {
              title: {
                text: `人民调解统计-${name}`,
                subtext: "按分类统计",
                x: "center"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: "horizontal",
                show: false,
                bottom: 20,
                data: peopleMediation.legendData
              },
              series: [
                {
                  name: "类别",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "55%"],
                  data: peopleMediation.serialData,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            };
            if (lids.length > 0) {
              this.nonData2 = false;
              myChart2.setOption(option);
            } else {
              this.nonData2 = true;
            }
            if (peoples.length > 0) {
              this.nonData1 = false;
              myChart1.setOption(option2);
            } else {
              this.nonData1 = true;
            }
            window.addEventListener("resize", function() {
              myChart1.resize();
              myChart2.resize();
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 社群热词
    async echarts_11() {
      try {
        const res = await Post(Api.GetOnlineQuestionHotWord, { top: 15 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_11")
          );
          // const data = res.result;
          var data = res.result.map(o => {
            return { name: o.name, value: o.count };
          });
          var option = {
            tooltip: {
              show: true
            },
            series: [
              {
                name: "热词分析",
                type: "wordCloud",
                size: ["9%", "99%"],
                sizeRange: [12, 46], //最小文字——最大文字
                // textRotation: [0, 45, 90, -45],
                // rotationRange: [-45, 90],//旋转角度区间
                // rotationStep: 90,//旋转角度间隔
                // shape: 'circle',
                // gridSize: 10,//字符间距
                textPadding: 0,
                autoSize: {
                  enable: true,
                  minSize: 6
                },
                textStyle: {
                  normal: {
                    color: function() {
                      return (
                        "rgb(" +
                        [
                          Math.round(Math.random() * 105) + 150,
                          Math.round(Math.random() * 105) + 150,
                          Math.round(Math.random() * 105) + 150
                        ].join(",") +
                        ")"
                      );
                    }
                  },
                  emphasis: {
                    shadowBlur: 10,
                    shadowColor: "#333"
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
    //根据区域统计上报信息 折线图
    async echarts_8() {
      try {
        const res = await Post(Api.GetInfoCaseSummaryGroupByArea, { type: 0 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_8")
          );
          const result = res.result;
          var xData = [];
          var data = [];
          for (var i = 0; i < result.length; i++) {
            xData.push(result[i].areaName);
            data.push({ value: result[i].count, area: result[i].areaId });
          }
          var option = {
            // backgroundColor: "#141f56",
            tooltip: {
              show: "true",
              trigger: "item",
              backgroundColor: "rgba(0,0,0,0.4)", // 背景
              //padding: [8, 10], //内边距
              extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);", //添加阴影
              formatter: function(params) {
                if (params.seriesName != "") {
                  return params.name + " ：  " + params.value + " 件";
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
                axisTick: { show: false },
                boundaryGap: false,
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
                  //   rotate:50,
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
    //根据区域统计上报信息
    async echarts_12() {
      try {
        const res = await Post(Api.GetInfoCaseSummaryGroupByArea, { type: 0 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_12")
          );
          const result = res.result;
          var yData = [];
          var data = [];
          for (var i = 0; i < result.length; i++) {
            yData.push(result[i].areaName);
            data.push({ value: result[i].count, area: result[i].areaId });
          }
          var option = {
            color: "rgb(230, 94, 70)",
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            grid: {
              top: 10,
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
              textStyle: {
                color: "#fff"
              }
            },
            xAxis: {
              type: "value",
              boundaryGap: [0, 0.01],
              axisLabel: {
                inside: false,
                textStyle: {
                  color: "#bac0c0",
                  fontWeight: "normal",
                  fontSize: "12"
                },
                interval: 0 //强制显示所有标签
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.1)"
                }
              }
            },
            yAxis: {
              type: "category",
              data: yData,
              inverse: true,
              axisLabel: {
                inside: false,
                textStyle: {
                  color: "#bac0c0",
                  fontWeight: "normal",
                  fontSize: "12"
                },
                interval: 0 //强制显示所有标签
              }
            },
            series: [
              {
                type: "bar",
                barWidth: "50%",
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
    //案件当月/全年统计
    async GetDashboardStatisticCount() {
      try {
        const res = await Post(Api.GetDashboardStatisticCount, {});
        if (res.success) {
          this.allCount = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

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

.awardWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 15px; */
}
.award-table {
  width: 40%;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: flex-end;
}
.award-table > div {
  width: 33.3%;
  text-align: center;
  font-size: 14px;
}
.award-table > div > p {
  margin-bottom: 15px;
  text-shadow: 5px 2px 6px rgb(0, 10, 53);
}
.award-table > div > div {
  font-size: 15px;
  font-weight: bolder;
}

.t-low > div {
  height: 35px;
  line-height: 35px;
  background: rgb(41, 87, 255);
}
.t-low p {
  color: rgb(122, 184, 255);
}
.t-high > div {
  height: 60px;
  line-height: 60px;
  background: rgba(230, 96, 19, 0.9);
}
.t-high p {
  color: rgba(252, 154, 97, 0.9);
}
.award-list {
  width: 50%;
  margin: 0 auto;
  /* margin-top: 20px; */
  overflow: hidden;
}
.award-list .list-item {
  margin-top: 12px;
  width: 48%;
  overflow: hidden;
}
.award-list > :nth-child(2n) {
  margin-left: 4%;
}
.award-list .list-item .list-num {
  width: 25px;
  line-height: 25px;
  text-align: center;
  font-size: 13px;
  font-weight: bolder;
  color: rgba(255, 255, 255);
  background: linear-gradient(135deg, transparent 5px, rgba(0, 0, 255, 0.8) 0);
}
.award-list .list-item .list-text {
  width: 80%;
  color: rgb(231, 231, 231);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 23px;
  font-size: 14px;
  font-weight: bolder;
  padding-left: 4px;
  border: 1px solid blue;
}

.cen-tit {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.case-count > div {
  width: 50%;
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
.cmonth p:first-child {
  color: rgb(226, 171, 88);
}
.cyear p:first-child {
  color: rgb(230, 94, 70);
}
.cen-bottom-left {
  width: 25%;
  height: 100%;
}
.cen-bottom-right {
  width: 73%;
  height: 100%;
  margin-left: 2%;
}

.mapwrap {
  width: 100%;
  height: calc(100% - 35px);
}
.map {
  /* width: 45%;
  height: 80%; */
  width: 400px;
  height: 400px;
  top: -25px;
  position: relative;
}
.map > div > img {
  width: 100%;
  /* margin-top: -60px; */
  animation-duration: 3s;
}
.mapcharts {
  width: 50%;
  height: 100%;
}
.backgorundmap {
  position: absolute;
  left: 0;
  top: 0;
}
.streetbox {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 160px;
  height: 70px;
  padding: 8px 10px;
  border: 1px dashed rgb(127, 208, 255);
  border-radius: 5px;
}
.streetname {
  width: 90%;
  color: #fff;
  font-size: 14px;
  padding-bottom: 4px;
  font-weight: 600;
  border-bottom: 1px solid rgb(186, 216, 233);
}
.streetcount {
  color: #fff;
  font-size: 13px;
  margin-top: 4px;
}
.dbox {
  position: absolute;
  /* top: 260px;
  left: 250px; */
}
.dot {
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
}
.brokenline {
  position: absolute;
  top: -120px;
  left: 4px;
}
.streetbox1 {
  position: absolute;
  overflow: hidden;
  top: -120px;
  left: 45px;
  width: 160px;
  height: 85px;
  border: 1px solid rgba(95, 196, 255, 0.7);
  background-color: rgba(0, 225, 255, 0.7);
}
.streetbox1:after,
.streetbox1:before {
    position: absolute;
    content: "";
    width: 20px;
    height: 30px;
}

.streetbox1:before {
    border-left: 2px solid #e1e2e4;
    border-top: 2px solid #e1e2e4;
    left: 0px;
    top: 0px
}

.streetbox1:after {
    border-right: 2px solid #e1e2e4;
    border-bottom: 2px solid #e1e2e4;
    right: 0px;
    bottom: 0px
}
.streetbox1 > div{
  padding: 8px 10px;
}
.rect {
  width: 200px;
  height: 20px;
  border: 1px solid white;
}
</style>
