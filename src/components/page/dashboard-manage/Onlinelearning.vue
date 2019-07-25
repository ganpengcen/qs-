<template>
  <div class="common_content body" ref="dashboard">
    <nav-header v-if="true"></nav-header>
    <el-main>
      <el-row>
        <el-col :span="24"  style="padding: 0px 20px;">
          <div class="study_box" >
            <ul class="title_box">
              <li @click="$router.push({path:'/Onlinelearning'})">教育学习时长</li>
              <li @click="$router.push({path:'/Learningtime'})" style="color:#50b9e6;">社区服务时长</li>
            </ul>
            <el-col :span="12">
              <div class="learnbox" style="position:relative;">
                <div class="linepst"></div>
                <p>学习时长</p>
                <div class="tablebox">
                  <table class="table1" style=" overflow: auto;">
                    <thead>
                      <tr>
                        <td>排名</td>
                        <td>区域</td>
                        <td>时长</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in studytime" :key="index">
                        <td>{{studytime[index].ranking}}</td>
                        <td>{{studytime[index].region}}</td>
                        <td>{{studytime[index].duration}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>


              </div>
            </el-col>
            <el-col :span="12">
              <div class="learnbox">
                <p>完成情况</p>
                <div class="tablebox">
                  <table class="table2" style=" overflow: hidden;">
                    <thead>
                      <tr>
                        <td>排名</td>
                        <td>区域</td>
                        <td style="width:25%;">百分比</td>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(item,info) in performance" :key="item.info">
                        <td>{{performance[info].ranking}}</td>
                        <td>{{performance[info].region}}</td>
                        <td style="text-align:left;width:40%;">
                          <!-- <span>{{performance[info].percent}}%</span> -->
                          <el-progress :percentage="performance[info].percent" :text-inside="false" :stroke-width="18"
                            style="dispay:inline-block;width:70%"></el-progress>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>

              </div>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        activeName: "first",
        //学习时长数据
        studytime: [{
            "ranking": "1",
            "region": "竹山村",
            'duration': "1小时"
          },
          {
            'ranking': "2",
            'region': "刘家沟",
            'duration': "124小时"
          },
          {
            'ranking': "3",
            'region': "三人堡",
            'duration': "124小时"
          },
          {
            'ranking': "4",
            'region': "橡树蓝湾",
            'duration': "14小时"
          },
          {
            'ranking': "5",
            'region': "石船镇",
            'duration': "124小时"
          },
          {
            'ranking': "6",
            'region': "三人堡",
            'duration': "14小时"
          },
          {
            'ranking': "7",
            'region': "郭家湾",
            'duration': "127小时"
          },
          {
            'ranking': "8",
            'region': "向阳村",
            'duration': "126小时"
          },
          {
            'ranking': "9",
            'region': "双井村",
            'duration': "124小时"
          },
          {
            'ranking': "10",
            'region': "木耳镇",
            'duration': "124小时"
          },
          {
            'ranking': "11",
            'region': "木耳镇",
            'duration': "124小时"
          }
        ],
        performance: [{
            'ranking': "1",
            'region': "竹山村",
            'percent': 99.3
          },
          {
            'ranking': "2",
            'region': "刘家沟",
            'percent': 99
          },
          {
            'ranking': "3",
            'region': "三人堡",
            'percent': 96.9
          },
          {
            'ranking': "4",
            'region': "橡树蓝湾",
            'percent': 94.6
          },
          {
            'ranking': "5",
            'region': "石船镇",
            'percent': 90.5
          },
          {
            'ranking': "6",
            'region': "三人堡",
            'percent': 87.9
          },
          {
            'ranking': "7",
            'region': "郭家湾",
            'percent': 80.8
          },
          {
            'ranking': "8",
            'region': "向阳村",
            'percent': 79.9
          },
          {
            'ranking': "9",
            'region': "双井村",
            'percent': 78.4
          },
          {
            'ranking': "10",
            'region': "木耳镇",
            'percent': 67.9
          },
          {
            'ranking': "11",
            'region': "木耳镇",
            'percent': 67.9
          }
        ]
      };
    },
    mounted() {
      this.circulation();
      // console.log(this.studytime);
    },
    created() {
            
    },
    methods: {
      handleClick(tab, event) {
        console.log("", tab, event);
      },
      //表中数据轮播
      circulation() {
        var timer = setInterval(() => {
          this.studytime.push(this.studytime[0]);
          this.performance.push(this.performance[0]);
          this.studytime.shift();
          this.performance.shift();
          // console.log(this.performance[info].percent)

        }, 1000)
      },

    }
  };

</script>
<style>
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter,
  .slide-fade-leave-to

  /* .slide-fade-leave-active for below version 2.1.8 */
    {
    transform: translateX(10px);
    opacity: 0;
  }

</style>


<style scoped>
  @import "../../../../static/css/table.css";
  div{
    font-size: 1.333rem;
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
    background: url(/static/img/dashboard/study1.png) no-repeat;
    background-size: 100% 100%;
    margin: 2.55vw 0;
  }

  .lBorder {
    position: relative;
    width: 70%;
    height: 50px;
    border: 1px solid #57c2eb;
    text-align: center;
    line-height: 50px;
    color: white;
    font-size: 24px;
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
    font-size: 2rem;
    font-weight: 500;
    padding-left: 13%;
    box-sizing: border-box;
  }

  .learnbox td {
    width: 30%;
    line-height: 3.333rem;
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
    box-sizing: border-box
  }

  .tablebox,
  tbody {
    height: 41.75rem;
     overflow: hidden;
  }

  .linepst {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0.2rem;
    height: 100%;
    background: url(/static/img/dashboard/study4.png) no-repeat center;
    background-size: cover;
  }

</style>
