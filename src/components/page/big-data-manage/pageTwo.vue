<template>
  <div class="wrap">
    <div class="data">
      <div class="data-title">
        <div class="title-center">锡山区智慧法务系统大数据分析</div>

        <div class="nav-btn">
          <div class="skew boxstyle unactive fl">
            <div class="skew-main" @click="gotoHome">首 页</div>
          </div>
          <div class="skew boxstyle btnactive fl">
            <div class="skew-main" @click="gotoSecond">法律咨询</div>
          </div>
          <div class="skew boxstyle unactive fl">
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
              <div class="titleBigData">咨询热词分析</div>
              <div id="echarts_hot" class="charts"></div>
            </div>
            <div class="top-bottom boxstyle">
              <div class="titleBigData">公共服务机构问题统计</div>
              <div id="echarts_9" class="charts"></div>
            </div>
          </div>
          <div ref="qWarp" class="left-bottom boxstyle">
            <div class="titleBigData">实时咨询问题</div>
            <div class="l-wrap">
              <ul id="qList" class="question-list">
                <li v-for='(item,index) in OnlineQuestion' :key="index">
                  <p>{{item.userName}}</p>
                  <p class="question">{{item.question}}</p>
                  <p class="date">{{item.creationTime | datas}}</p>
                </li>
              </ul>
            </div>

          </div>
        </div>
        <div class="con-center con-center2  fl">

          <div class="cen-top cen-top2 boxstyle">
            <div class="titleBigData">在线法律咨询总量分析</div>
            <div id="echarts_onlineCount" class="charts"></div>
          </div>

          <div class="cen-center clearfix">
            <div class="cen-center-left boxstyle fl">
              <div class="titleBigData">咨询年龄段分析</div>
              <div id="echarts_ages" class="charts"></div>
            </div>
            <div class="cen-center-right boxstyle fl">
              <div class="titleBigData">咨询性别分析</div>
              <div id="echarts_sex" class="charts"></div>
            </div>
          </div>
          <div class="cen-bottom boxstyle">
            <div class="titleBigData">进驻律师列表</div>
            <!-- <p class="Agency" v-if="agencyMembers[0].serviceAgencyName">{{agencyMembers[0].serviceAgencyName}}</p> -->
            <p class="Agency">{{AgencyName}}</p>
            <div class="avatar-list">
              <div v-for="(item,index) in agencyMembers" :key="index" class="outside">
                <span  v-if="item.avatar">
                 <img :src="item.avatar" class="avatar">
                </span>
              </div>
            </div>
            <p class="Agency" v-if="agencyMembers.length==0">暂无人员信息</p>

          </div>
        </div>
        <div class="con-third fl boxstyle">
          <div class="titleBigData">在线法律咨询回复统计</div>
          <ul class="rank animated bounceInDown">
            <li>
              <span>排名</span>
              <span>姓名</span>
              <span>数量</span>
            </li>
            <li v-for="(item,i) in answerRank" :key="i" :class="{'top-three':i<=2}">
              <span v-if="i<=2" class="rankNumber">
                <i class="icon-xs-king" :class="i==0 ? 'rank-first' : i==1 ? 'rank-second' : 'rank-third'"></i>
                <span>{{item.order}}</span>
              </span>
              <span v-else>{{item.order}}</span>
              <span>{{item.name}}</span>
              <span>{{item.count}}</span>
            </li>
          </ul>
      

        </div>
        <div class="con-right con-right2 fr">
          <div class="right-top1 boxstyle">
            <div class="titleBigData">当前活跃律师</div>
            <div class="activeLvs clearfix">
              <el-carousel indicator-position="none">
                <el-carousel-item v-for="(item,index) in OnlineLawyer" :key="index">
                  <div class="activeAvatar fl">
                    <img :src="item.images" alt="">
                  </div>
                  <div class="avatarInfo fl">
                    <h1>{{item.name}}</h1>
                    <div class="miaos" v-html="text[index]">
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="right-top2 boxstyle">
            <div class="titleBigData">公共服务机构</div>
            <div class="entity-services">
              <i class="icon-xs-falvfuwuzhongxin"></i>
              <span class="services-count">{{allCount.publicLegalServiceCenter}}</span>
              <span class="services-text">
                公共法律服务中心
              </span>
            </div>
            <div class="entity-services">
              <i class="icon-xs-community-station"></i>
              <span class="services-count">{{allCount.villageStation}}</span>
              <span class="services-text">
                村社区司法行政服务站
              </span>
            </div>
            <div class="entity-services">
              <i class="icon-xs-lawfirm"></i>
              <span class="services-count">{{allCount.lawFirm}}</span>
              <span class="services-text">
                律师事务所
              </span>
            </div>
            <div class="entity-services">
              <i class="icon-xs-jicengfalvfuwusuo"></i>
              <span class="services-count">{{allCount.grassrootsLegalService}}</span>
              <span class="services-text">
                基层法律服务所
              </span>
            </div>
            <div class="entity-services">
              <i class="icon-xs-renmintiaojie_fuzhi"></i>
              <span class="services-count">{{allCount.peopleMediation}}</span>
              <span class="services-text">
                人民调解委员会
              </span>
            </div>
          </div>
          <div class="right-center boxstyle">
            <div class="titleBigData">咨询类型占比</div>
            <div id="echarts_10" class="charts"></div>
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
  name: "pageTwo",
  data() {
    return {
      dashboardSummary: {}, //工作台信息
      animate: false,
      AgencyName: "", //事务所名字
      OnlineQuestion: [],
      serviceAgencies: [], //机构
      agencyMembers: [{ serviceAgencyName: "" }], //成员
      i: 0, //律师
      allCount: {},
      answerRank: [],
      OnlineLawyer: [], //当前活跃律师
      text: ["", "", "", "", ""],
      timer: null,     
      iconplay:false
    };
  },
  created() {
    // this.OnlineLawyerNowSummary(); //当前活跃律师
    // this.GetDashboardSummary(); //工作台信息
    // this.OnlineQuestionNowTop5(); //实时咨询
    // this.GetDashboardStatisticCount();
    // this.LawyerAnswerRank(); //律师回复排行
  },
  mounted() {
    // this.GetServiceAgencies();
    // this.echarts_onlineCount(); //在线法律咨询总量分析
    // this.echarts_9(); // 公共服务机构问题统计
    // this.echarts_10(); //咨询类型占比
    // this.echarts_ages(); //年龄分布
    // this.echarts_sex(); //性别
    // this.echarts_hot(); //咨询热词
    // this.openTimer();
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
        this.gotoThree()
      }, 30000)
      this.$once('hook:beforeDestroy', () => {
        clearTimeout(this.timer)
      })
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
    },
    // 律师回复排行
    async LawyerAnswerRank() {
      try {
        const res = await Post(Api.LawyerAnswerRank, { top: 20 });
        if (res.success) {
          this.answerRank = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },

    rollText() {
      let list = document.getElementById("qList");
      if (list) {
        var timer = setInterval(() => {
          list.style.top = list.offsetTop - 1 + "px";
          if (list.offsetTop < -list.clientHeight + 1) {
            // clearInterval(timer);
            list.style.top = 177 + "px";
          }
        }, 90);
      }
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    // 公共服务机构问题统计
    async echarts_9() {
      try {
        const res = await Post(Api.PublicServiceQuestionSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_9")
          );
          const result = res.result;
          var xData = [];
          var data1 = []; //已回答
          var data2 = []; //未回答
          for (var i = 0; i < result.length; i++) {
            xData.push(result[i].month);
            data1.push(result[i].answeredCount);
            data2.push(result[i].nonAnsweredCount);
          }
          var option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
              }
            },

            legend: {
              data: ["未回答", "已回答", "总回答"],
              textStyle: {
                color: "rgba(200,200,200)"
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              borderWidth: 0,
              containLabel: true,
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
                  rotate: 25
                },
                data: xData
              }
            ],
            yAxis: [
              {
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
              }
            ],
            series: [
              {
                name: "已回答",
                type: "bar",
                stack: "公共服务机构问题统计",
                barWidth: "50%",
                color: "#3366ff",
                data: data1
              },
              {
                name: "未回答",
                type: "bar",
                stack: "公共服务机构问题统计",
                barWidth: "50%",
                color: "#E23FA1",
                data: data2
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
    // 咨询类型占比
    async echarts_10() {
      try {
        const res = await Post(Api.OnlineQuestionSummary, { top: 3 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_10")
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
                name: "咨询类型占比",
                type: "pie",
                color: ["#ff6633", "#72AB89", "#9A75E1"],
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
    async echarts_ages() {
      try {
        const res = await Post(Api.OnlineQuestionAgeSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_ages")
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
                name: "咨询年龄段",
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
    async echarts_sex() {
      try {
        const res = await Post(Api.OnlineQuestionSexSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_sex")
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
                name: "咨询性别占比",
                type: "pie",
                color: ["#4F94CD", "#CD5555"],
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
    // 咨询热词
    async echarts_hot() {
      try {
        const res = await Post(Api.GetOnlineQuestionHotWord, { top: 15 });
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_hot")
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
    // 在线法律咨询总量分析
    async echarts_onlineCount() {
      try {
        const res = await Post(Api.OnlineQuestionYearMonthTotalSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_onlineCount")
          );
          const result = res.result;
          var xData = [];
          var nowYear = [];
          var lastYear = [];
          for (var i = 0; i < result.length; i++) {
            xData.push(result[i].month);
            nowYear.push(result[i].nowYearMonthTotal);
            lastYear.push(result[i].lastYearMonthTotal);
          }

          var option = {
            color: ["#E6941A", "#e5323e"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              data: ["当期", "同期"],
              textStyle: {
                color: "rgb(200,200,200)"
              }
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                axisTick: { show: false },
                data: xData,
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
                name: "当期",
                type: "bar",
                barWidth: "35%",
                barGap: 0,
                data: nowYear
              },

              {
                name: "同期",
                type: "bar",
                barWidth: "35%",
                data: lastYear
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
    },
    //当前活跃律师
    async OnlineLawyerNowSummary() {
      try {
        const res = await Post(Api.OnlineLawyerNowSummary, { top: 5 });
        if (res.success) {
          this.OnlineLawyer = res.result;
          for (var i = 0; i < this.OnlineLawyer.length; i++) {
            let skillDetails = this.OnlineLawyer[i].skillDetails;
            for (var j = 0; j < skillDetails.length; j++) {
              let c = this.OnlineLawyer[i].skillDetails.substr(j, 1);
              if (c == "\n") this.text[i] = this.text[i] + "</br>";
              else if (c != "\r") this.text[i] = this.text[i] + c;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
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
    // 获取公共服务机构
    async GetServiceAgencies() {
      try {
        const res = await Post(Api.GetServiceAgencies, {
          type: "1",
          skipCount: 0,
          maxResultCount: 10
        });
        if (res.success) {
          this.serviceAgencies = res.result.items;
          this.AgencyName = this.serviceAgencies[this.i].name;
          this.GetServiceAgencyMembers(this.serviceAgencies[0].id);
          var time = setInterval(() => {
            this.i++;
            this.AgencyName = this.serviceAgencies[this.i].name;
            this.GetServiceAgencyMembers(this.serviceAgencies[this.i].id);
            if (this.i >= this.serviceAgencies.length - 1) {
              // clearInterval(time);
              this.i = 0;
            }
          }, 5000);
          this.$once("hook:beforeDestroy", () => {
            clearInterval(time);
          });
        }
      } catch (e) {
        console.log(e);
      }
    },

    async GetServiceAgencyMembers(id) {
      try {
        const res = await Post(Api.GetServiceAgencyMembers, {
          id: id,
          skipCount: 0,
          maxResultCount: 28,
          key: ""
        });
        if (res.success) {
          this.agencyMembers = res.result.items;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 实时问题咨询top5
    async OnlineQuestionNowTop5(id) {
      try {
        const res = await Post(Api.OnlineQuestionNowTop5, {
          top: 5
        });
        if (res.success) {
          this.OnlineQuestion = res.result.items;

          this.rollText();
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
.cen-bottom {
  overflow: hidden;
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

.avatar-list {
  text-align: center;
  overflow: hidden;
  margin-top: 10px;
}

.outside {
  float: left;
  margin-left: 2.2%;
  margin-bottom: 8px;
  width: 11.5%;
}
.avatar {
  width: 100%;
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
.activeAvatar {
  width: 27%;
}
.activeAvatar > img {
  width: 100%;
}
</style>
