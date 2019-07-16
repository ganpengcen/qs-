<template>
  <div class="upper">
    <div class="title">
      <span class="big">行为轨迹</span>
      <span class="small">查看人员的行为轨迹</span>
      <el-button type="text text-margin" @click="btnStart">开始</el-button>
      <el-button type="text" @click="btnPause">暂停</el-button>
      <el-button type="text" @click="btnStop">停止</el-button>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-date-picker
          v-model="dateArr"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
        ></el-date-picker> -->
        <el-date-picker v-model="form.trackDate" type="date" placeholder="请选择日期" >
        </el-date-picker>
        <el-select
          style="width:230px"
          v-model="areaId"
          placeholder="请选择区域"
          clearable
          @change="GetPersonByArea()"
        >
          <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          style="width:230px"
          v-show="areaId"
          v-model="form.entityName"
          placeholder="请选择监控对象"
          clearable
        >
          <el-option
            v-for="item in personList"
            :key="item.deviceNo"
            :label="item.name"
            :value="item.deviceNo"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="TrackingLine()">查询</el-button>
      </div>
      <div class="mapbox">
        <!-- 地图 -->
        <div class="trackingmap">
          <div id="allmap" ref="allmap" :style="height"></div>
        </div>
        <div class="gpsinfo">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
            </div>
            <div class="basebox">
              <ul>
                <li>姓名：王力</li>
                <li>性别：男</li>
                <li>年龄：48岁</li>
                <li>地址：渝北区三人堡丁家村23号</li>
              </ul>
              <ul>
                <li>电话：13182019139</li>
                <li>开始矫正时间：2019年4月11日</li>
                <li>结束矫正时间：2019年10月11日</li>
              </ul>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { changeDate, changeDateTime } from "@/utils/date";
import { DatePicker } from "@/utils/config";
import { Post, Get, Delete, Put } from "@/api/api";
import BMap from "BMap";
export default {
  name: "gpsTracking",
  data() {
    return {
      dateArr: [],
      areas: [],
      personList: [],
      areaId: "",
      pickerOptions2: DatePicker,
      vechile: {
        filter: "",
        sorting: "",
        maxResultCount: 10,
        skipCount: 0
      },
      form: {
        entityName: "",
        trackDate: new Date(),
        isProcessed: false
      },
      vehicles: [],
      vehiclesArr: [],
      date: "", //日期
      lushu: null,
      height: {
        height: ""
      },
      isActive: -1
    };
  },
  watch: {
    // dateArr: {
    //   handler(val, oldVal) {
    //     if (val == null) {
    //       this.ruleForm.beginTime = "";
    //       this.ruleForm.endTime = "";
    //     } else {
    //       this.ruleForm.beginTime = val[0];
    //       this.ruleForm.endTime = val[1];
    //     }
    //   },
    //   deep: true
    // }
  },
  created() {
    this.hh();
    this.GetAllArea();
    this.end = new Date();
    this.start = new Date();
    this.start.setTime(this.start.getTime() - 3600 * 1000 * 24 * 30);
    this.dateArr = [this.start, this.end];
  },
  mounted() {
    this.initMap();
    const that = this;
    window.onresize = function temp() {
      that.hh();
    };
  },
  methods: {
    async TrackingLine() {
      try {
        const res = await Post(Api.TrackingLine, this.form);
        if (res) {
        }
        this.addVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    // 获取区域列表
    async GetAllArea() {
      try {
        const res = await Get(Api.GetAllArea, {});
        this.areas = res;
      } catch (e) {
        console.log(e);
      }
    },
    async GetPersonByArea() {
      try {
        const res = await Get(Api.GetPersonByArea + this.areaId);
        this.personList = res;
      } catch (e) {
        console.log(e);
      }
    },
    checkItem(index, num, date) {
      this.isActive = index; // 点击列表改变样式
      this.getGpsTracking(num, date);
    },
    // 地图
    initMap() {
      var map = new BMap.Map(this.$refs.allmap); // 创建Map实例
      this.maps = map;
      var point = new BMap.Point(120.3643, 31.596037);
      var geoc = new BMap.Geocoder();
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(); //启用滚轮放大缩小
    },
    // 获取车牌数据
    async getVehicles() {
      let url = "/api/services/app/vehicle/GetVehicles";
      try {
        const res = await Post(url, this.vechile);
        this.vehicles = res.result.items;
        for (let i = 0; i < this.vehicles.length; i++) {
          this.vehiclesArr.push(this.vehicles[i].number);
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取车辆轨迹
    async getGpsTracking(vNumbers, date) {
      let url = "/api/services/app/vehicle/GetHaihuiGpsTracking";
      let data = { number: vNumbers, date: date };
      try {
        if (!date) {
          this.$message.warning("请选择日期");
        } else {
          const res = await Post(url, data);
          const resp = res.result;
          if (res.success) {
            if (resp.status == "success") {
              if (resp.data) {
                var pointArr = [];
                for (var i = 0; i < resp.data.length; i++) {
                  pointArr.push(
                    new BMap.Point(
                      resp.data[i].longitude,
                      resp.data[i].latitude
                    )
                  );
                }
                this.initLushu(pointArr); //初始化路书
                var line = new BMap.Polyline(pointArr, {
                  strokeColor: "#0000FF"
                });
                if (this.maps) {
                  this.maps.clearOverlays();
                  this.maps.addOverlay(line);
                  this.maps.setViewport(line.getPath());
                  //地图上显示起点和终点
                  if (pointArr.length > 0) {
                    var start = pointArr[0];
                    var end = pointArr[pointArr.length - 1];
                    var stIcon = new BMap.Icon(
                      "static/img/icon_st.png",
                      new BMap.Size(30, 36)
                    );
                    var endIcon = new BMap.Icon(
                      "static/img/icon_en.png",
                      new BMap.Size(30, 36)
                    );
                    this.displaySpecialPoint(start, stIcon, resp.data[0]);
                    this.displaySpecialPoint(
                      end,
                      endIcon,
                      resp.data[resp.data.length - 1]
                    );
                  }
                  this.maps.setViewport(pointArr);
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    //初始化Lushu
    initLushu(points, e) {
      this.lushu = new BMapLib.LuShu(this.maps, points, {
        defaultContent: "", //"从天安门到百度大厦"
        autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
        icon: new BMap.Icon(
          "http://lbsyun.baidu.com/jsdemo/img/car.png",
          new BMap.Size(52, 26),
          { anchor: new BMap.Size(27, 13) }
        ),
        speed: 4500,
        enableRotation: true, //是否设置marker随着道路的走向进行旋转
        landmarkPois: [
          {
            lng: 116.315391,
            lat: 39.964429,
            html:
              '高速公路收费<div><img src="http://map.baidu.com/img/logo-map.gif"/></div>',
            pauseTime: 5
          }
        ]
      });
    },
    displaySpecialPoint(point, icon, info) {
      var marker = new BMap.Marker(point, { icon: icon });
      marker.setTop(true);
      this.maps.addOverlay(marker);
      this.addClickHandler(marker, info);
    },
    // 点击起点终点
    addClickHandler(marker, info) {
      marker.addEventListener("click", e => {
        // this.openInfoWindow(e, info);
      });
    },
    btnStop() {
      if (this.lushu) {
        this.lushu.stop();
      }
    },
    btnStart() {
      if (this.lushu) {
        this.lushu.start();
      }
    },
    btnPause() {
      if (this.lushu) {
        this.lushu.pause();
      }
    },
    // 地图自适应高度
    hh() {
      this.height.height = window.innerHeight - 260 + "px";
    }
  }
};
</script>

<style lang="less">
.input-class {
  .el-input__inner {
    box-shadow: 0;
    border: 0;
    // width: 60px;
  }
}
</style>
<style scoped lang="less">
.active {
  background-color: #e6e6e6;
}
.context-menu {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  border-radius: 4px;
  overflow: hidden;
  width: 125px;
  .own-header {
    padding: 8px 15px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
  }
  .item {
    margin-bottom: 0;
  }
  .text.item {
    width: 125px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    color: #666666;
  }
  .text.item:hover {
    background-color: #f4f4f5;
  }
}

.text {
  font-size: 14px;
}
.text-margin {
  margin-left: 10px;
}
.item {
  margin-bottom: 18px;
}
.main-body {
  display: flex;
  justify-content: space-around;
}

.box-card {
  width: 100%;
}

.upper {
  overflow: hidden;
}
.title {
  margin-bottom: 8px;
  overflow: hidden;
  .big {
    line-height: 30px;
    font-size: 21px;
    color: #333;
    margin-right: 10px;
    float: left;
  }
  .small {
    line-height: 30px;
    font-size: 13px;
    color: #666;
    float: left;
  }
  .btn {
    float: right;
  }
}

.handle-row {
  margin-top: 30px;
}
.formWidth {
  width: 62%;
}
#allmap {
  width: 100%;
  height: 600px;
}
#allmap2 {
  width: 100%;
  height: 600px;
}
.marL {
  margin-left: 20px;
}
.mapbox {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.trackingmap {
  width: 55%;
}
.gpsinfo {
  width: 40%;
}
.basebox {
  display: flex;
  justify-content: space-between;
}
.basebox > ul > li {
  font-size: 13px;
  line-height: 35px;
}
</style>
