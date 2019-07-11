<template>
  <div>  
    <el-row :gutter="20">
      <el-col :span="12" class="cards-col">
            <el-card shadow="always" :body-style="{padding: '0px'}" class="cards">
              <div class="grid-content grid-con-1">
                <i class="icon-xs-anjiandangan grid-con-icon"></i>
                <div class="grid-cont-right">
                  <span class="grid-num">{{dashboardReport.totalLegalAidFinishCount}}</span>
                  <span class="per">/</span>
                  <span class="grid-num">{{dashboardReport.totalLegalAidCount}}</span>
                  <div>法律援助统计</div>
                  <el-progress :percentage="totalLegalAidRate" color="#14D3AE" class="progress"></el-progress>
                </div>
              </div>
            </el-card>
            <el-card shadow="always" :body-style="{padding: '0px'}" class="cards">
              <div class="grid-content grid-con-2">
                <i class="icon-xs-anjiandangan grid-con-icon"></i>
                <div class="grid-cont-right">
                  <span class="grid-num">{{dashboardReport.totalPeopleMediationFinishCount}}</span>
                  <span class="per">/</span>
                  <span class="grid-num">{{dashboardReport.totalPeopleMediationCount}}</span>
                  <div>人民调解统计</div>
                  <el-progress :percentage="totalPeopleMediationRate" color="rgb(45, 140, 240)" class="progress"></el-progress>
                </div>
              </div>
            </el-card>
            <el-card shadow="always" :body-style="{padding: '0px'}" class="cards">
              <div class="grid-content grid-con-3">
                <i class="icon-xs-yanqi grid-con-icon"></i>
                <div class="grid-cont-right">
                  <span class="grid-num">{{dashboardReport.totalStudyTime}}</span>
                  <div>监管人员学习时长(分钟)</div>
                </div>
              </div>
            </el-card>
            <el-card shadow="always" :body-style="{padding: '0px'}" class="cards">
              <div class="grid-content grid-con-4">
                <i class="icon-xs-wechat grid-con-icon"></i>
                <div class="grid-cont-right">
                  <span class="grid-num">{{dashboardReport.totalWeiChatGroupCount}}</span>
                  <div>微信群数量</div>
                </div>
              </div>
            </el-card>
      </el-col>
      <el-col :span="12" class="cards-col">       
            <el-card shadow="always" :body-style="{padding: '0px'}" class="cards">
              <div class="grid-content grid-con-4">
                <i class="icon-xs-users grid-con-icon"></i>
                <div class="grid-cont-right">
                  <span class="grid-num">{{dashboardReport.totalUserCount}}</span>
                  <div>用户数</div>
                </div>
              </div>
            </el-card>
            <el-card shadow="always" :body-style="{padding: '0px'}" class="cards">
              <div class="grid-content grid-con-6">
                <i class="icon-xs-people1 grid-con-icon"></i>
                <div class="grid-cont-right">
                  <span class="grid-num">{{XyStatisticsSummary.personCount}}</span>
                  <div>监管人员数</div>
                </div>
              </div>
            </el-card>
            <el-card shadow="always" :body-style="{padding: '0px'}" class="cards">
              <div class="grid-content grid-con-3">
                <i class="icon-xs-book grid-con-icon"></i>
                <div class="grid-cont-right">
                  <span class="grid-num">{{dashboardReport.totalRobKnowledgeCount}}</span>
                  <div>知识库数量</div>
                </div>
              </div>
            </el-card>
            <el-card shadow="always" :body-style="{padding: '0px'}" class="cards">
              <div class="grid-content grid-con-5">
                <i class="icon-xs-huifu grid-con-icon"></i>
                <div class="grid-cont-right">
                  <span class="grid-num">{{dashboardReport.totalAutoReplayCount}}</span>
                  <div>机器人回复数</div>
                </div>
              </div>
            </el-card>
      </el-col>
    </el-row>   

    <el-row :gutter="20">
      <el-col :span="12" class="cards-col">
        <el-card shadow="hover" :body-style="{height: '350px'}">
          <div slot="header" class="clearfix">
            <span>本周案件统计情况</span>
          </div>
          <div id="echarts_GetWeekCaseSummary" class="echarts"></div>
        </el-card>
      </el-col>
      <el-col :span="12" class="cards-col">
        <el-card shadow="hover" :body-style="{height: '350px'}">
          <div slot="header" class="clearfix">
            <span>微信群成员活跃度排行</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="GetTopMostChatGroupMembers">刷新</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="nickName" label="昵称" width="170">
            </el-table-column>
            <el-table-column prop="groupNickName" label="所在群" width="180">
            </el-table-column>
            <el-table-column prop="dayChatCount" label="当天发言数" width="100">
            </el-table-column>
            <el-table-column prop="totalChatCount" label="总发言数" width="100">
            </el-table-column>
            <el-table-column prop="dayAtCount" label="当天@机器人次数" width="140">
            </el-table-column>
            <el-table-column prop="totalAtCount" label="总@机器人次数" width="140">
            </el-table-column>

          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { Post } from "@/api/api";
import router from "../../router";
export default {
  name: "dashboard",
  data() {
    return {
      name: localStorage.getItem("ms_username"),
      dashboardReport: {}, //工作台数据
      tableData: [],
      XyStatisticsSummary: {}
    };
  },
  computed: {
    totalLegalAidRate() {
      let finishCount = this.dashboardReport.totalLegalAidFinishCount;
      let totalCount = this.dashboardReport.totalLegalAidCount;
      if (finishCount && totalCount) {
        let num = finishCount / totalCount * 100;
        return Number(num.toFixed(0));
      } else {
        return 0;
      }
    },
    totalPeopleMediationRate() {
      let finishCount = this.dashboardReport.totalPeopleMediationFinishCount;
      let totalCount = this.dashboardReport.totalPeopleMediationCount;
      if (finishCount && totalCount) {
        let num = finishCount / totalCount * 100;
        return Number(num.toFixed(0));
      } else {
        return 0;
      }
    }
  },
  activated() {
    this.GetDashboardSummary(); //工作台信息
    this.GetWeekCaseSummary();
    this.GetTopMostChatGroupMembers();
    this.GetXyStatisticsSummary();
  },
  created() {
    this.GetDashboardSummary(); //工作台信息
    this.GetWeekCaseSummary();
    this.GetTopMostChatGroupMembers();
    this.GetXyStatisticsSummary();
  },
  methods: {
    //工作台信息
    async GetDashboardSummary() {
      try {
        const res = await Post(Api.GetDashboardSummary, {});
        if (res.success) {
          this.dashboardReport = res.result;
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
    // echart
    async GetWeekCaseSummary() {
      try {
        const res = await Post(Api.GetWeekCaseSummary, {});
        if (res.success) {
          let myChart = this.$echarts.init(
            document.getElementById("echarts_GetWeekCaseSummary")
          );
          const result = res.result;
          var xData = [];
          var people = [];
          var legalAid = [];
          for (var i = 0; i < result.length; i++) {
            xData.push(result[i].date);
            people.push(result[i].peopleMediationCount);
            legalAid.push(result[i].legalAidCount);
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
              data: ["人民调解", "法律援助"],
              textStyle: {
                color: "rgb(200,200,200)"
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              borderWidth: 0,
              containLabel: true
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
                    color: "rgb(200,200,200)"
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
                    color: "rgb(200,200,200)"
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "rgba(200,200,200,0.5)"
                  }
                }
              }
            ],
            series: [
              {
                name: "人民调解",
                type: "bar",
                barWidth: "35%",
                barGap: 0,
                data: people
              },

              {
                name: "法律援助",
                type: "bar",
                barWidth: "35%",
                data: legalAid
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
    // 活跃
    async GetTopMostChatGroupMembers() {
      try {
        const res = await Post(Api.GetTopMostChatGroupMembers, { top: 5 });
        if (res.success) {
          this.tableData = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>


<style scoped lang="less">
.echarts {
  height: 100%;
}
.cards {
  width: 48%;
  display: inline-block;
  margin-left: 8px;
  margin-bottom: 15px;
  @media screen and (max-width: 1493px) {
    width: 98%;
  }
}
.cards-col {
 @media screen and (max-width: 800px) {
    width: 100%;
  }
}

.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}
.per {
  font-size: 30px;
  padding: 0 8px;
}
.progress {
  margin-top: 10px;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}
/* 法律援助 */
.grid-con-1 .grid-con-icon {
  background: #14d3ae;
}

.grid-con-1 .grid-num {
  color: #14d3ae;
}
/* 人民调解 */
.grid-con-2 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}
/* 综合执法 */
.grid-con-4 .grid-con-icon {
  background: #454e77;
}

.grid-con-4 .grid-num {
  color: #454e77;
}
/* 车辆 */
.grid-con-5 .grid-con-icon {
  background: #5c9bd1;
}

.grid-con-5 .grid-num {
  color: #5c9bd1;
}
/* 基础部件 */
.grid-con-6 .grid-con-icon {
  background: #8f5f69;
}

.grid-con-6 .grid-num {
  color: #8f5f69;
}
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
</style>
