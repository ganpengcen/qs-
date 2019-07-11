<template>
  <div class="right">
    <div class="mapCard">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>文档图片</span>
        </div>
        <!-- 轮播图 -->
        <div class="block fontAlign">
          <el-carousel v-if="beforeImages.length!=0" trigger="click" height="150px">
            <el-carousel-item v-for="item in beforeImages" :key="item">
              <img :src="item" alt="" class="caeousel-img" @click="getImg(item)">
            </el-carousel-item>
          </el-carousel>
          <img v-else src="static/img/before.png" alt="" style="width:100%">
          <el-carousel v-if="afterImages.length!=0" trigger="click" height="150px">
            <el-carousel-item v-for="item in afterImages" :key="item">
              <img :src="item" alt="" class="caeousel-img" @click="getImg(item)">
            </el-carousel-item>
          </el-carousel>
          <img v-else src="static/img/after.png" alt="" style="width:100%">
        </div>
      </el-card>
    </div>
    <div class="mapCard">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>位置地图</span>
        </div>
        <div id="allmap" ref="allmap"></div>
      </el-card>
    </div>
    <el-dialog title="大图" :visible.sync="imgVisible" class="bigImg">
      <img :src="img" alt="">
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "picMap",
  data() {
    return {
      map: null,
      beforeImages: "",
      afterImages: "",
      img: "",
      imgVisible: false,
      afterVisible: false
    };
  },
  methods: {
    // 地图定位
    initMap() {
      let map = new BMap.Map(this.$refs.allmap); // 创建Map实例
      this.map = map;
      var point = new BMap.Point(120.383022, 31.551985);
      this.map.centerAndZoom(point, 12);
      this.map.enableScrollWheelZoom(); //启用滚轮放大缩小
    },
    // 编写自定义函数,创建标注
    addMarker(lng, lat) {
      this.map.clearOverlays(); //清除点
      var point = new BMap.Point(lng, lat);
      var marker = new BMap.Marker(point);
      this.map.addOverlay(marker);
      //  this.map.setViewport(point);
    },
    getImage(before, after) {
      this.beforeImages = before;
      this.afterImages = after;
    },
    getImg(img) {
      this.img = img;
      this.imgVisible = true;
    }
  }
};
</script>

<style lang="less" >

/* 大图 */
.bigImg .el-dialog__body {
  text-align: center;
  img {
    max-width: 100%;
  }
}

.el-message-box {
  width: 50%;
}
.mapCard .el-card__header {
  padding: 8px 12px;
  font-size: 14px;
}
.mapCard .el-card__body {
  padding: 0;
}
</style>

<style scoped lang="less">
.fontAlign {
  text-align: center;
  img {
    @media screen and (max-width: 1266px) {
      height: 150px;
    }
  }
}
.right {
  float: left;
  margin-left: 10px;
  width: 15%;
  @media screen and (max-width: 1266px) {
    width: 100%;
  }
}
#allmap {
  width: 100%;
  height: 250px;
}
</style>
