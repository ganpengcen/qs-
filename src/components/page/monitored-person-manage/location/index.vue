<template>
  <div class="upper">
    <div class="title">
      <span class="big">人员定位</span>
      <span class="small">查看人员的定位数据，注：定位时间会有一些的延迟</span>
    </div>
    <div class="container">
      <div class="handle-box">
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
      form: {
        entityName: "",
        trackDate: new Date(),
        isProcessed: false
      },
      vehicles: [],
      vehiclesArr: [],
      date: "", //日期
      opts: {
        width: 200, // 信息窗口宽度
        height: 105, // 信息窗口高度
        title: "查看人员最新位置", // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
      },
      geoc: null,
      height: {
        height: ""
      },
      isActive: -1
    };
  },
  watch: {
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
     addMarker(p, data) {
      var marker = new BMap.Marker(p);
      marker.addEventListener("click", e => {
        this.openInfo(data, p);
      });
      this.maps.addOverlay(marker);
    },

    openInfo(content, p) {
      var geoc = new BMap.Geocoder();
      geoc.getLocation(p, rs => {
        var contentInfo =
          '<div style="margin:0;font-size:13px;line-height:20px;padding:2px;">车牌：' +
          content.license_plate +
          "<br/>地址：" +
          rs.address +
          "<br/>时间：" +
          content.equipment_time +
          "</div>";
        var infoWindow = new BMap.InfoWindow(contentInfo, this.opts); // 创建信息窗口对象
        this.maps.openInfoWindow(infoWindow, p); //开启信息窗口
      });
    },
    async TrackingTime() {
      let map = this.maps;
      this.maps.clearOverlays(); //清除点
      try {
        const res = await Post(Api.TrackingTime, this.form);
          if (res) {
            var pointArr = [];
            var datas = res;
            for (var i = 0; i < datas.length; i++) {
              var p = new BMap.Point(datas[i].longitude, datas[i].latitude);
              pointArr.push(p);
              this.addMarker(p, datas[i]);
            }
            this.maps.setViewport(pointArr);
          }
      } catch (e) {
        console.log(e);
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
  width: 100%;
}

</style>
