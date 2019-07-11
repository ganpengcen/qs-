<template>
  <div id="all">
    <el-input type="text" id="suggestId" name="address_detail" placeholder="请输入地址" v-model="address_detail" class="input_style"></el-input>
    <div id="allmap"></div>
  </div>
</template>
<script>
export default {
  name: "searchMap",
  data() {
    return {
      address_detail: null, //详细地址
      userlocation: { lng: "", lat: "" },
      lat: null,
      lng: null
    };
  },
  props: {
    latp: {
      type: Number,
      required: true
    },
    lngp: {
      type: Number,
      required: true
    }
  },
  watch: {
    latp: function(newVal, oldVal) {
      this.lat = newVal;
    },
    lngp: function(newVal, oldVal) {
      this.lng = newVal;
      this.searchMap();
    }
  },
  methods: {
    searchMap() {
      var th = this;
      // 创建Map实例
      var map = new BMap.Map("allmap");
      // 初始化地图,设置中心点坐标，
      if (!this.lng) {//区分是否有默认位置
         var point = new BMap.Point(120.383022, 31.551985);      
      } else {
        var point = new BMap.Point(this.lng, this.lat);
        map.addOverlay(new BMap.Marker(point));
      }     
      map.centerAndZoom(point, 15);
      // map.enableScrollWheelZoom();
      var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: map
      });
      var myValue;
      ac.addEventListener("onconfirm", e => {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        this.address_detail = myValue;

        setPlace();
      });
      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          map.centerAndZoom(th.userlocation, 18);
          th.$emit("sendP", th.userlocation, th.address_detail);
          map.addOverlay(new BMap.Marker(th.userlocation)); //添加标注
        }
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    },
    clearT(){
      this.address_detail = "";
    }
  }
};
</script>
<style>
.tangram-suggestion {
  z-index: 9999;
}
</style>
<style scoped>
#allmap {
  width: 100%;
  height: 250px;
}
</style>