<template>
  <div class="common_content body">
    <nav-header></nav-header>
    <div class="contents_boxs">
      <div class="zhifa_box">
        <div class="map_MXbox">
          <!-- 地图 -->
          <div id="allmap" class="map_box"></div>
          <!-- 搜索框 -->
          <div class="search_box">
            <el-select v-model="value" filterable placeholder="请输入人名或下拉选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div class="icons_box">
              <i class="el-icon-search"></i>
            </div>
          </div>
          <!-- 搜索框 -->
        </div>
        <div class="xinxi_box">
          <div class="one_box">
            <div class="jiben_box">
              <h3 class="title_text">基本信息</h3>
              <div class="info_box">
                <div>
                  <span>姓名：</span>
                  <span>王立</span>
                </div>
                <div>
                  <span>电话：</span>
                  <span>13011234567</span>
                </div>
              </div>
              <div class="info_box">
                <div>
                  <span>性别：</span>
                  <span>男</span>
                </div>
                <div>
                  <span>开始矫正时间：</span>
                  <span>2019年4月11日</span>
                </div>
              </div>
              <div class="info_box">
                <div>
                  <span>年龄：</span>
                  <span>48岁</span>
                </div>
                <div>
                  <span>结束矫正时间：</span>
                  <span>2019年10月11日</span>
                </div>
              </div>
              <div class="info_box">
                <div>
                  <span>地址：</span>
                  <span>渝北区三人堡丁家村223号</span>
                </div>
              </div>
            </div>
          </div>
          <div class="two_box">
            <h3 class="title_text">学习/服务/报警</h3>
            <div id="table">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="date" label="类别"></el-table-column>
                <el-table-column prop="shijian" label="时间"></el-table-column>
                <el-table-column prop="address" label="内容/类型"></el-table-column>
                <el-table-column prop="time" label="时长"></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="three_box">
            <h3 class="title_text">轨迹点</h3>
            <div>
              <div id="table">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column prop="date" label="时间"></el-table-column>
                  <el-table-column prop="zuobiao" label="地址（坐标）"></el-table-column>
                  <el-table-column prop="time" label="停留时长"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Correct",
    data() {
      return {
        //基本信息
        form: {},
        //学习
        tableData: [{
            date: "学习",
            shijian: "6月16日19:11",
            name: "6月16日19:11",
            zuobiao: "竹山村（198.34，134.31）",
            address: "全国扫黑除恶专项斗争自2018年",
            time: "31min"
          },
          {
            date: "服务",
            shijian: "6月16日19:11",
            name: "王小虎",
            zuobiao: "竹山村（198.34，134.31）",
            address: "上海市普陀区金沙江路 1517 弄",
            time: "31min"
          },
          {
            date: "警报",
            shijian: "6月16日19:11",
            name: "王小虎",
            zuobiao: "竹山村（198.34，134.31）",
            address: "上海市普陀区金沙江路 1519 弄",
            time: "31min"
          }
        ],
        //   搜索
        options: [{
            value: "选项1",
            label: "张三"
          },
          {
            value: "选项2",
            label: "李四"
          },
          {
            value: "选项3",
            label: "王五"
          },
          {
            value: "选项4",
            label: "张无忌"
          },
        ],
        value: ""
      };
    },
    created() {

    },
    mounted() {
      this.map();
    },

    methods: {
      //百度地图
      map() {
        var map = new BMap.Map("allmap"); //new 一个地图对象
        var point = new BMap.Point(121.770944, 31.107101); //设置地图的中心点
        var zoom = 16; //设置地图的等级
        map.centerAndZoom("重庆", zoom); // 在地图中显示
        map.enableScrollWheelZoom(); //启用滚轮放大缩小
        map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
        var geoc = new BMap.Geocoder();

        // 添加带有定位的导航控件
        var navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_TOP_LEFT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          enableGeolocation: true
        });
        map.addControl(navigationControl);
        //     // 添加定位控件
        var geolocationControl = new BMap.GeolocationControl();

        geolocationControl.addEventListener("locationSuccess", function (e) {
          // 定位成功事件
          var address = "";
          address += e.addressComponent.province;
          address += e.addressComponent.city;
          address += e.addressComponent.district;
          address += e.addressComponent.street;
          address += e.addressComponent.streetNumber;
          alert("当前定位地址为：" + address);
        });
        geolocationControl.addEventListener("locationError", function (e) {
          // 定位失败事件
          alert(e.message);
        });

        map.addControl(geolocationControl);

        map.addEventListener("click", function (e) {
          //给地图添加点击事件
          map.clearOverlays();
          console.log(e);
          var lng = e.point.lng;
          var lat = e.point.lat;
          //创建标注位置
          var pt = new BMap.Point(lng, lat);
          var myIcon = new BMap.Icon(
            "/static/img/dashboard/address.png",
            new BMap.Size(100, 100)
          );
          var marker2 = new BMap.Marker(pt, {
            icon: myIcon
          }); // 创建标注
          map.addOverlay(marker2); // 将标注添加到地图中
          //alert(e.point.lng + "," + e.point.lat);
          geoc.getLocation(pt, function (rs) {
            var addComp = rs.address;
            alert("当前位置是:" + addComp);
            console.log(rs);
          });
          marker2.enableDragging(); //可拖拽
        });
      }
    }
  };

</script>
<style>
  #table .el-table__row,
  #table .el-table tr {
    background-color: transparent;
    color: #fff;
  }

  #table .el-table th {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
  }

  #table .el-table--border::after,
  #table .el-table--group::after,
  #table .el-table::before {
    content: "";
    position: absolute;
    background-color: rgba(0, 0, 0, 0);
    z-index: 1;
  }

  #table .el-table,
  #table .el-table__expanded-cell {
    background-color: transparent;
  }

  #table .el-table td,
  #table .el-table th.is-leaf {
    border-bottom: none;
  }

  #table .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: rgba(0, 0, 0, 0);
  }

  #table .el-table .cell {
    -webkit-box-sizing: border-box !important;
    box-sizing: border-box !important;
    white-space: normal !important;
    word-break: break-all !important;
    /* line-height: 23px !important; */
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
  }

</style>
<style scoped>
  .body {
    background: radial-gradient(rgb(46, 105, 175), rgb(12, 33, 66) 70%) no-repeat center !important;

  }
  div {
      font-size: 1.4rem;
  }
  span, p, li {
      font-size: 16px;
  }

  .zhifa_box {
    display: flex;
  }

  /* 搜索 */
  .search_box {
    display: flex;
    align-items: center;
    position: absolute;
    top: 4rem;
    left: 10.5rem;
    background: #57c2eb;
    box-shadow: darkgrey 0px 0px 30px 5px;
  }

  .icons_box {
    display: flex;
    width: 50px;
    height: 40px;
    line-height: 40px;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
  }

  /* table样式 */
  /* 滚动条样式 */
  .table_box {
    max-height: 150px;
    overflow: auto !important;
  }

  .table_box {
    width: 100%;
    color: #fff;
  }

  .table_box td,
  th {
    width: 30%;
    text-align: center;
  }

  .table_box tr {
    line-height: 35px;
  }

  .content_xq {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 地图 */
  .map_box {
    min-height: calc(100vh - 200px);
    font-size: 14px;
    color: #606266;
  }

  /* 头部 */

  .lBorder {
    position: relative;
    width: 70%;
    height: 50px;
    border: 1px solid #57c2eb;
    text-align: center;
    line-height: 50px;
    color: white;
    font-size: 15rem;
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
    /* font-size: 32px; */
    font-size: 25rem;
    margin: 0 0;
    color: white;
  }

  .backIMG {
    background: url(/static/img//dashboardPath58.png) no-repeat center;
    background-size: 100% 100%;
  }

  /* 内容 */
  .el-form-item__label {
    color: #fff !important;
  }

  .info_box {
    display: flex;
    justify-content: space-between;
    color: #fff;
    margin: 5px 0;
    padding: 0 20px;
  }

  .baise {
    color: #fff;
  }

  .jiben_box {
    padding: 20px 40px;
  }

  .title_text {
    color: #4cabd5;
  }

  .one_box {
    background: url(/static/img/dashboard/study2222.png) no-repeat;
    background-size: 100% 100%;
  }

  .map_MXbox {
    position: relative;
    background: url(/static/img/dashboard/study222.png) no-repeat;
    background-size: 100% 100%;
    padding: 3.1rem;
    width: 60%;
  }

  .xinxi_box {
    width: 35%;
    margin-left: 5%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .contents_boxs {
    margin: 10px 0;
    padding: 0 20px;
    overflow: auto;
  }

  .two_box {
    background: url(/static/img/dashboard/study2201.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0;
    padding: 10px 40px;
  }

  .three_box {
    background: url(/static/img/dashboard/study2212.png) no-repeat;
    background-size: 100% 100%;
    padding:10px 40px;
    /* max-height: 275px; */
  }


</style>
