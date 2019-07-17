<template>
  <div>
    <div class="title">
      <span class="big">社区矫正人员</span>
      <span class="small">管理社区矫正人员</span>
      <!-- v-has="'Pages.Foundations.DicData.Create'" -->
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd('添加矫正人员')" class="btn">添加矫正人员</el-button>
    </div>
    <!--表格-->
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="ruleForm.filter"
          placeholder="筛选关键词"
          class="handle-input"
          @keyup.enter.native="getData"
        ></el-input>
        <el-select
          class="sel"
          clearable
          v-model="ruleForm.areaId"
          @change="getData()"
          placeholder="根据区域搜索"
        >
          <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
      </div>
      <div class="tableThCol">
        <el-table
          :data="data"
          stripe
          style="width: 100%"
          ref="multipleTable"
          @sort-change="sortChange"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="操作" width="50" fixed>
            <template slot-scope="scope">
              <el-dropdown trigger="click" class="iconSize" @click.native="id = scope.row.id">
                <span class="el-dropdown-link">
                  <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="handleEdit('修改')">修改</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="!scope.row.isBinded">
                    <p @click="bindVisible = true">绑定</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.isBinded">
                    <p @click="Unbind()">解绑</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.isBinded">
                    <p @click="handleMap(scope.row.deviceNo)">创建围栏</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column  prop="isBinded" label="是否绑定"  min-width="100px" sortable="custom">
              <template slot-scope="scope">
               <p :class="[{'text-danger':!scope.row.isBinded},{'text-safe':scope.row.isBinded}]">{{scope.row.isBinded?'已绑定':'未绑定'}}</p>
            </template>
          </el-table-column>          
          <el-table-column prop="areaName" label="区域" min-width="120px" sortable="custom"></el-table-column>
          <el-table-column prop="name" label="姓名" min-width="120px" sortable="custom"></el-table-column>
          <el-table-column prop="gender" label="性别" sortable="custom"></el-table-column>
          <el-table-column prop="phone" label="手机号码" min-width="120px" sortable="custom"></el-table-column>
          <el-table-column prop="identityCard" label="身份证号码" min-width="160px" sortable="custom"></el-table-column>
          <el-table-column
            prop="beginDate"
            :formatter="formatTableDate"
            label="开始日期"
            sortable="custom"
            width="140px"
          ></el-table-column>
          <el-table-column
            prop="endDate"
            :formatter="formatTableDate"
            label="结束日期"
            sortable="custom"
            width="140px"
          ></el-table-column>
          <el-table-column
            prop="dateAdded"
            :formatter="formatTableDate"
            label="创建日期"
            sortable="custom"
            width="140px"
          ></el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          :current-page.sync="cur_page"
          :page-sizes="[10,25,50,100,250,300]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 添加、编辑弹出框 -->
    <el-dialog
      :title="titleT"
      :visible.sync="addVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="creatOrEditForm" :model="editForm" :rules="rules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <el-select class="seldialogn" v-model="editForm.gender" placeholder="请选择性别">
            <el-option
              v-for="item in genderList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="area" label="区域">
          <el-select class="seldialogn" v-model="editForm.area" placeholder="请选择区域">
            <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="editForm.phone" :disabled="titleT!=='添加矫正人员'"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="identityCard">
          <el-input v-model="editForm.identityCard"></el-input>
        </el-form-item>
        <el-form-item label="户籍地" prop="nativePlace">
          <el-input v-model="editForm.nativePlace"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="editForm.emergencyContact"></el-input>
        </el-form-item>
        <el-form-item label="联系人号码" prop="emergencyPhone">
          <el-input v-model="editForm.emergencyPhone"></el-input>
        </el-form-item>
        <el-form-item label="联系人关系" prop="emergencyRelation">
          <el-input v-model="editForm.emergencyRelation"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="矫正类型">
          <el-select class="seldialogn" v-model="editForm.type" placeholder="请选择矫正类型">
            <el-option
              v-for="item in MonitoredTypes"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="矫正开始时间" prop="beginDate">
          <el-date-picker
            style="width:100%"
            v-model="editForm.beginDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="矫正结束时间" prop="endDate">
          <el-date-picker
            style="width:100%"
            v-model="editForm.endDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="4" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="CreateOrUpdateDicData('creatOrEditForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="绑定设备" :visible.sync="bindVisible" width="600px">
      <el-form ref="bindForm" :model="bindForm" :rules="bindRules">
        <el-form-item prop="areaId" label="选择区域">
          <el-select class="seldialogn" @change="GetDevice()" v-model="areaId" placeholder="请选择">
            <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="serialNo" label="选择设备" v-if="areaId != ''">
          <el-select class="seldialogn" v-model="bindForm.serialNo" placeholder="请选择">
            <el-option
              v-for="item in deviceList"
              :key="item.serialNo"
              :label="item.serialNo"
              :value="item.serialNo"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindVisible = false">取 消</el-button>
        <el-button type="primary" @click="BindDevice('bindForm')">确 定</el-button>
      </span>
    </el-dialog>

    <div class="geoFence" v-show="geoFenceVisible">
      <div class="el-dialog">
        <div class="geoform">
        <p>创建围栏</p>
        <el-form  :inline="true"  class="demo-form-inline" :model="form">
          <el-form-item label="围栏名称(必填)">
            <el-input  v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="圆心坐标" v-show="form.fenceType==1">
            <el-input v-model="coordinate" disabled></el-input>
          </el-form-item>
          <el-form-item label="围栏半径" v-show="form.fenceType==1">
            <el-input  v-model="form.radius" placeholder="0-5000米" disabled></el-input>
          </el-form-item>
           <el-form-item label="偏移距离" v-show="form.fenceType==3">
            <el-input-number v-model="form.offset" :min="0" label></el-input-number>
          </el-form-item>
          <el-form-item label="围栏去噪参数">
            <el-input  v-model="form.denoise"></el-input>
          </el-form-item>
        </el-form>
        </div>
      
        <div id="allmap" ref="allmap" style="height:600px"></div>
        <div class="el-dialog__footer">
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="save(form)">保存</el-button>
            <el-button type="success" @click="clearAll">清空&重画</el-button>
            <el-button @click="geoFenceVisible = false">取 消</el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { changeDate } from "@/utils/date";
import { DatePicker } from "@/utils/config";
import { Post, Get, Delete, Put } from "@/api/api";
export default {
  name: "MonitoredPersonList",
  data() {
    return {
      titleT: "",
      maps: {},
      form: {
        denoise: "0", //去噪参数
        entityName: "", //监控对象
        fenceType: "", //围栏形状
        name: "", //围栏名称
        district: "", //行政区域
        vertexes: "", //线形数据
        offset: "" //偏移距离
      },
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
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      addVisible: false,
      bindVisible: false,
      geoFenceVisible: false,
      pickerOptions2: DatePicker,
      ruleForm: {
        filter: "",
        areaId: "",
        sorting: "DateAdded desc",
        maxResultCount: 10,
        skipCount: 0
      },
      id: "",
      genderList: [
        {
          id: 1,
          name: "男"
        },
        {
          id: 0,
          name: "女"
        }
      ],
      editForm: {
        name: "",
        gender: 1,
        area: "",
        phone: "",
        identityCard: "",
        avatar: "",
        type: "",
        beginDate: "",
        endDate: "",
        address: "",
        nativePlace: "",
        emergencyContact: "",
        emergencyPhone: "",
        emergencyRelation: "",
        remark: ""
      },
      bindForm: {
        serialNo: "",
        personId: ""
      },
      areaId: "",
      MonitoredTypes: [],
      deviceList: [],
      types: [
        { value: 1, displayText: "未绑定" },
        { value: 2, displayText: "已绑定" },
        { value: 3, displayText: "错误" }
      ],
      areas: [{ id: "", name: "" }],
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        gender: [{ required: true, message: "请选择", trigger: "change" }],
        area: [{ required: true, message: "请选择", trigger: "change" }],
        phone: [{ required: true, message: "必填", trigger: "blur" },
         {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: '手机号码格式有误',
            trigger: 'blur'
          }],
        identityCard: [{ required: true, message: "必填", trigger: "blur" },
         {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }
        ],
        address: [{ required: true, message: "必填", trigger: "blur" }],
        nativePlace: [{ required: true, message: "必填", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "change" }],
        beginDate: [{ required: true, message: "请选择", trigger: "change" }],
        endDate: [{ required: true, message: "请选择", trigger: "change" }]
      },
      bindRules: {
        serialNo: [{ required: true, message: "请选择", trigger: "change" }]
      }
    
    };
  },
  mounted() {},
  updated() {},
  created() {
    this.getDicType(1);
    this.GetAllArea();
    this.getData();
    this.end = new Date();
    this.start = new Date();
    this.start.setTime(this.start.getTime() - 3600 * 1000 * 24 * 183);
    this.dateArr = [this.start, this.end];
  },
  computed: {
    data() {
      return this.tableData;
    },
     coordinate() {
      if (!(this.form.lng && this.form.lat)) {
        return null;
      } else {
        return this.form.lng + "," + this.form.lat;
      }
    },
  },
  watch: {
    cur_page(curVal, oldVal) {
      this.cur_page = curVal; //页数
      this.getData();
    },
    dateArr: {
      handler(val, oldVal) {
        if (val == null) {
          this.ruleForm.beginDate = "";
          this.ruleForm.beginDate = "";
        } else {
          this.ruleForm.endDate = val[0];
          this.ruleForm.endDate = val[1];
        }
      },
      deep: true
    },
    addVisible(curVal) {
      if (!curVal) {
        this.$resetForm(this.$refs["creatOrEditForm"]);
      }
    },
    geoFenceVisible(curVal) {
      if (curVal) {
        this.initMap();
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        this.drawingManager.addEventListener(
          "overlaycomplete",
          this.overlaycomplete
        );
      }
    }
  },
  methods: {
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
          path.push(new BMap.Point(point[0], point[1]));
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
          drawingModes: ["circle", "polygon", "polyline"]
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
      this.form.fenceType = "";
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
          this.CreateFence(fenceObj);       
      } else {
        this.$message.warning("未发现围栏数据，请确认您是否已经画图了？");
      }
    },
    async CreateFence(fence) {
      try {
        const res = await Post(Api.CreateFence, fence);
        if (res) {
          this.getData();
          this.$message.success("创建成功");
          this.geoFenceVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    overlaycomplete(e) {
      switch (e.drawingMode) {
        case "circle":
          this.form.fenceType = 1;
          break;
        case "polygon":
          this.form.fenceType = 2;
          break;
        case "polyline":
          this.form.fenceType = 3;
          break;
        default:
          break;
      }
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

          this.$set(this.editForm, "radius", radius);
          this.$set(this.editForm, "lng", circlePoint.lng);
          this.$set(this.editForm, "lat", circlePoint.lat);
        }
      }
    },
    // 表格排序
    sortChange: function(column) {
      if (column.order == null) {
        this.ruleForm.sorting = "";
      } else if (column.order == "ascending") {
        this.ruleForm.sorting = `${column.prop} ASC`;
      } else {
        this.ruleForm.sorting = `${column.prop} DESC`;
      }
      this.getData();
    },
    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDate(row[column.property]);
      }
    },
    handleSizeChange(val) {
      this.ruleForm.maxResultCount = val;
      this.getData();
    },
    CreateOrUpdateDicData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.titleT == "添加矫正人员") {
            this.Create();
          } else {
            this.Update();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    BindDevice(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.areaId == "") {
            this.$message.warning("请选择区域");
            return;
          }
          this.bind();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取列表数据
    async getData() {
      this.ruleForm.skipCount =
        (this.cur_page - 1) * this.ruleForm.maxResultCount;
      try {
        const res = await Post(Api.GetPersonList, this.ruleForm);
        if (res) {
          this.tableData = res.items;
          this.totalCount = res.totalCount;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 点击删除
    handleDelete(index, row) {
      this.$confirm("该条数据将被删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delTemplateMsg();
        })
        .catch(() => {});
    },
    async delTemplateMsg() {
      try {
        const res = await Delete(Api.Person + this.id);
        this.$message.success("删除成功");
        this.getData();
      } catch (e) {
        // this.$message.error("删除失败");
        console.log(e);
      }
    },
    Unbind() {
      this.$confirm("确定对该人员设备进行解绑操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.unbindPerson();
        })
        .catch(() => {});
    },
    async unbindPerson() {
      try {
        const res = await Put(Api.Unbind + this.id);
        this.$message.success("解绑成功");
        this.getData();
      } catch (e) {
        console.log(e);
      }
    },
    handleMap(deviceNo) {
      this.geoFenceVisible = true;
      this.form.entityName = deviceNo;
    },
    // 获取编辑页面
    async handleEdit(title) {
      this.addVisible = true;
      this.titleT = title;
      try {
        const res = await Get(Api.Person + this.id);
        if (res) {
          this.editForm = res;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async GetAllArea() {
      try {
        const res = await Get(Api.GetAllArea, {});
        this.areas = res;
      } catch (e) {
        console.log(e);
      }
    },
    async GetDevice() {
      this.bindForm.serialNo = "";
      try {
        const res = await Get(Api.GetDevice + this.areaId);
        this.deviceList = res;
      } catch (e) {
        console.log(e);
      }
    },
    async getDicType(type) {
      try {
        const res = await Get(Api.DicData + type);
        this.MonitoredTypes = res;
      } catch (e) {
        console.log(e);
      }
    },
    //添加
    handleAdd(title) {
      this.$delete(this.editForm, "id");
      this.titleT = title;
      this.addVisible = true;
    },
    async Create() {
      try {
        const res = await Post(Api.CreatePerson, this.editForm);
        this.$message.success("操作成功");
        this.getData();
        this.addVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    async Update() {
      try {
        const res = await Put(Api.Person + this.id, this.editForm);
        this.$message.success("操作成功");
        this.getData();
        this.addVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    async bind() {
      this.bindForm.personId = this.id;
      try {
        const res = await Post(Api.BindDevice, this.bindForm);
        this.$message.success("操作成功");
        this.getData();
        this.bindVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    
  }
};
</script>

<style scoped lang="less">
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
.handle-box {
  margin-bottom: 20px;
}
/*修改下拉菜单宽度*/
.select {
  width: 320px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.geoform {
  padding: 0 0 0 20px;
}
.geoform > p {
  font-size: 19px;
}
.geoFence {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2026;
}
.geoFence > div {
  width: 1300px;
  padding: 20px 20px 0 20px;
  margin-top: 15vh;
}
</style>
