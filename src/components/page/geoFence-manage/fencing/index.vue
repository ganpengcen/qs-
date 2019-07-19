<template>
  <div class="upper">
    <div class="title">
      <span class="big">修改地理围栏参数</span>
    </div>
    <div class="notice" v-show="noticeVisible">
      <span @click="noticeClick">x</span>
      <h5>友情提示</h5>
      <p>1:选择完围栏类型之后请在左边地图进行画图</p>
      <p>2:对于圆形围栏，画完之后系统自动收笔，对于多边形和线形围栏如果想要结束画图，则在终点双击鼠标左键</p>
      <p>3:点击清空&重画可以进行重新画图</p>
    </div>
    <el-col :span="18">
      <div class="container" style="padding:15px;margin-right:20px">
        <div id="allmap" ref="allmap" style="height:600px"></div>
      </div>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>围栏属性</span>
        </div>
        <!-- 添加 -->
        <el-form label-position="top" label-width="120px" :model="form" >
          <el-form-item label="选择区域" v-show="!id">
            <el-select
              style="width:100%"
              v-model="areaId"
              placeholder="请选择区域"
              clearable
              @change="GetPersonByArea()"
            >
              <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监控对象(必选)" v-show="!id">
            <el-select style="width:100%"  v-model="form.entityName" placeholder="请选择监控对象" clearable>
              <el-option
                v-for="item in personList"
                :key="item.deviceNo"
                :label="item.name"
                :value="item.deviceNo"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="监控对象" v-show="id">
            <el-input v-model="form.entityName" disabled></el-input>
          </el-form-item>
          <el-form-item label="围栏名称(必填)">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="围栏类型(必填)">
            <el-select
              :disabled="id ? true: false"
              v-model="form.fenceType"
              filterable
              placeholder="请选择"
              @change="changePageControl(form.fenceType)"
              style="width:100%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="圆心坐标" v-show="form.fenceType==1">
            <el-input v-model="coordinate" disabled></el-input>
          </el-form-item>
          <el-form-item label="围栏半径" v-show="form.fenceType==1">
            <el-input v-model="form.radius" placeholder="0-5000米" disabled></el-input>
          </el-form-item>
          <el-form-item label="行政区域" v-show="form.fenceType==4">
            <el-input v-model="form.district" @keyup.enter.native="getBoundary(form.district)"></el-input>
          </el-form-item>
          <el-form-item label="偏移距离" v-show="form.fenceType==3">
            <el-input-number v-model="form.offset" :min="0" label></el-input-number>
          </el-form-item>
          <el-form-item label="围栏去噪参数">
            <el-input v-model="form.denoise"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="save(form)">保存</el-button>
            <el-button type="success" @click="clearAll">清空&重画</el-button>
            <el-button type="primary"  v-show="id" @click="goBack">返回</el-button>
          </el-form-item>
        </el-form>
       
       
      </el-card>
    </el-col>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { Post, Get, Delete, Put } from "@/api/api";
export default {
  name: "fencing",
  data() {
    return {
      areaId: "",
      maps: {},
      drawingManager: {}, //鼠标绘制工具
      currentOverlay: {},
      styleOptions: {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.6, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid" //边线的样式，solid或dashed。
      },
      overlays: [],
      form: {
        denoise: "0", //去噪参数
        entityName: "", //监控对象
        fenceType: "", //围栏形状
        name: "", //围栏名称
        district: "", //行政区域
        vertexes: "", //线形数据
        offset: "" //偏移距离
      },
      options: [
        {
          value: 0,
          label: "请选择"
        },
        {
          value: 1,
          label: "圆形围栏"
        },
        {
          value: 2,
          label: "多边形围栏"
        },
        {
          value: 3,
          label: "线形围栏"
        },
        {
          value: 4,
          label: "行政区域围栏"
        }
      ],
      id: "",
      areas: [],
      personList: [],
      noticeVisible: true
    };
  },
  mounted() {
    this.initMap();
  },
  created() {
    this.id = this.$route.params.id;
    if (this.id) {
      this.GetFenceDetails();
    }
    this.GetAllArea();
  },
  updated() {
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    this.drawingManager.addEventListener(
      "overlaycomplete",
      this.overlaycomplete
    );
  },
  computed: {
    coordinate() {
      if (!(this.form.lng && this.form.lat)) {
        return null;
      } else {
        return this.form.lng + "," + this.form.lat;
      }
    },
 
  },
  watch: {},
  methods: {
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
      this.form.entityName = "";
      try {
        const res = await Get(Api.GetPersonByArea + this.areaId);
        this.personList = res;
      } catch (e) {
        console.log(e);
      }
    },
    async GetFenceDetails() {
      try {
        const res = await Get(Api.Fence + this.id);
        this.form = res;
        this.changePageControl(this.form.fenceType);
        this.drawingOverlayEdit(this.form);
      } catch (e) {
        console.log(e);
      }
    },
    //编辑模式的时候画图
    drawingOverlayEdit(data) {
      var overlay;
      if (data.fenceType == 1) {
        overlay = new BMap.Circle(
          new BMap.Point(data.lng, data.lat),
          data.radius,
          this.styleOptions
        );
      } else if (data.fenceType == 2) {
        var path = [];
        var pointsArray = data.vertexes.split(";");
        for (var i = 0; i < pointsArray.length; i++) {
          var point = pointsArray[i].split(",");
          path.push(new BMap.Point(point[1], point[0]));
        }
        overlay = new BMap.Polygon(path, this.styleOptions);
      } else if (data.fenceType == 3) {
        var path = [];
        var pointsArray = data.vertexes.split(";");
        for (var i = 0; i < pointsArray.length; i++) {
          var point = pointsArray[i].split(",");
          path.push(new BMap.Point(point[1],point[0]));
        }
        overlay = new BMap.Polyline(path, this.styleOptions);
      } else if (data.fenceType == 4) {
        this.getBoundary(data.district);
      }
      if (overlay && data.fenceType != 4) {
        this.maps.clearOverlays();
        this.maps.addOverlay(overlay);
        this.overlays.push(overlay);
        this.currentOverlay = overlay;
        overlay.enableEditing();
        this.maps.setViewport(overlay.getPath());
      }
    },

    initMap() {
      var map = new BMap.Map(this.$refs.allmap); // 创建Map实例
      this.maps = map;
      map.addControl(new BMap.NavigationControl());
      var point = new BMap.Point(120.302717, 31.58251);
      map.centerAndZoom(point, 16);
      map.enableScrollWheelZoom(); //启用滚轮放大缩小
      //实例化鼠标绘制工具
      this.drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
          offset: new BMap.Size(5, 5), //偏离值
          drawingModes: [] //留一个拖拽
        },
        circleOptions: this.styleOptions, //圆的样式
        polylineOptions: this.styleOptions, //线的样式
        polygonOptions: this.styleOptions //多边形的样式
      });
    },
    //检索行政区域
    getBoundary(dictrict) {
      var bdary = new BMap.Boundary();
      if (dictrict) {
        bdary.get(dictrict, rs => {
          //获取行政区域
          this.maps.clearOverlays(); //清除地图覆盖物
          var count = rs.boundaries.length; //行政区域的点有多少个
          if (count === 0) {
            this.$message.error("未能获取当前输入行政区域");
            return;
          } else if (count > 1) {
            this.$message.warning("您所检索的行政区域大于1个，请更换关键字");
            return;
          }
          var pointArray = [];
          var ply = new BMap.Polygon(rs.boundaries[0], this.styleOptions); //建立多边形覆盖物
          this.maps.addOverlay(ply); //添加覆盖物
          this.overlays.push(ply);
          this.currentOverlay = ply;
          pointArray = pointArray.concat(ply.getPath());
          this.maps.setViewport(pointArray); //调整视野
        });
      }
    },
    // 清空
    clearAll() {
      for (var i = 0; i < this.overlays.length; i++) {
        this.maps.removeOverlay(this.overlays[i]);
      }
      this.overlays.length = 0;
    },
    changePageControl(fenceType) {
      this.clearAll();
      switch (fenceType) {
        case 1:
          this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
          this.drawingManager.open();
          break;
        case 2:
          this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
          this.drawingManager.open();
          break;
        case 3:
          this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
          this.drawingManager.open();
          break;
        default:
          break;
      }
    },
    save(fenceObj) {
      // let fenceObj = this.form;
      let currentOverlay = this.currentOverlay;
      if (!fenceObj.name) {
        this.$message.warning("请输入围栏名称");
        return;
      }
      if (this.currentOverlay) {
        //圆形
        if (fenceObj.fenceType == 1) {
          fenceObj.radius = currentOverlay.getRadius();
          fenceObj.lng = currentOverlay.getCenter().lng;
          fenceObj.lat = currentOverlay.getCenter().lat;
        } else if (fenceObj.fenceType == 2 || fenceObj.fenceType == 3) {
          //多边形
          var path = currentOverlay.getPath();
          var vertexes = "";
          for (var i = 0; i < path.length; i++) {
            vertexes += path[i].lat + "," + path[i].lng + ";";
          }
          vertexes = vertexes.substring(0, vertexes.length - 1);
          fenceObj.vertexes = vertexes;
        }
        if (this.id) {
          this.EditFence(fenceObj);
        } else {
          this.CreateFence(fenceObj);
        }
      } else {
        this.$message.warning("未发现围栏数据，请确认您是否已经画图了？");
      }
    },
    async CreateFence(fence) {
      try {
        const res = await Post(Api.CreateFence, fence);
        if (res) {
          this.clearAll();
          this.$message.success("创建成功");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async EditFence(fence) {
      try {
        const res = await Put(Api.Fence + this.id, fence);
        this.$message.success("修改成功");
        this.$router.go(-1);
      } catch (e) {
        console.log(e);
      }
    },

    goBack() {
      this.$router.go(-1);
    },
    overlaycomplete(e) {
      this.overlays.push(e.overlay);
      this.currentOverlay = e.overlay;
      e.overlay.enableEditing();
      this.drawingManager.close();
      //根据不同类型的图形设置页面的控件内容
      this.setControlContent();
    },
    //画图完之后获取图形对象
    setControlContent() {
      var drawingMode = this.drawingManager.getDrawingMode();
      if (this.currentOverlay) {
        //设置圆形的圆心坐标和半径的值
        if (drawingMode == BMAP_DRAWING_CIRCLE) {
          var circlePoint = this.currentOverlay.getCenter();
          var radius = this.currentOverlay.getRadius();
          this.$set(this.form, "radius", radius);
          this.$set(this.form, "lng", circlePoint.lng);
          this.$set(this.form, "lat", circlePoint.lat);
        }
      }
    },
    noticeClick() {
      this.noticeVisible = false;
    }
  }
};
</script>

<style lang="less" >
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
}
.notice {
  position: relative;
  width: 99.5%;
  border-radius: 5px;
  padding: 10px 0 5px 10px;
  margin-bottom: 10px;
  background-color: #409eff;
  color: #fff;
  span {
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
  }
  p {
    font-size: 14px;
    line-height: 25px;
  }
}
</style>
