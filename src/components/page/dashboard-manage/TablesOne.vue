<template>
  <div id="zhuang">
    <h3 class="lan">司法矫正总人数</h3>
    <table class="table_box">
      <thead>
        <tr>
          <th>排名</th>
          <th>区域</th>
          <th>人数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.pm" @click="bs" style="cursor: pointer;">
          <td>{{item.pm}}</td>
          <td>{{item.qx}}</td>
          <td>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :color="customColorMethod"
              :percentage="item.rs"
            ></el-progress>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TablesOne",
  data() {
    return {
      //总人数
      tableData: [
        {
          pm: "1",
          qx: "竹山村",
          rs: 98
        },
        {
          pm: "2",
          qx: "刘家沟",
          rs: 78
        },
        {
          pm: "3",
          qx: "三人堡",
          rs: 68
        },
        {
          pm: "4",
          qx: "橡树蓝湾",
          rs: 55
        },
        {
          pm: "5",
          qx: "石船镇",
          rs: 45
        },
        {
          pm: "6",
          qx: "郭家村",
          rs: 32
        },
        {
          pm: "7",
          qx: "田家湾",
          rs: 23
        },
        {
          pm: "8",
          qx: "向家村",
          rs: 15
        },
        {
          pm: "9",
          qx: "双井村",
          rs: 10
        },
        {
          pm: "10",
          qx: "木耳镇",
          rs: 8
        }
      ]
    };
  },
  methods: {
    //进度条
    customColorMethod(percentage) {
      if (percentage < 70) {
        return "#58b2d8";
      } else if (percentage < 70) {
        return "#58b2d8";
      } else {
        return "#5086aa";
      }
    },
    //点击翻转
    bs(index) {
      var zhuang = document.getElementById("zhuang");
      zhuang.setAttribute("class", "box_boxOne_active");
      setTimeout(() => {
        this.$router.push("/bigData/Tables");
      }, "1000");
    }
  }
};
</script>
<style scoped>
/* 翻转 */
/*效果一：360°旋转 修改rotate(旋转度数)*/
/* .box_boxOne {
    
    -webkit-transition: All 0.4s ease-in-out;
    -moz-transition: All 0.4s ease-in-out;
    -o-transition: All 0.4s ease-in-out;
  } */

.box_boxOne_active {
  transition: All 1s ease-in-out;
  transform: rotateY(360deg);
  -webkit-transform: rotateY(360deg);
  -moz-transform: rotateY(360deg);
  -o-transform: rotateY(360deg);
  -ms-transform: rotateY(360deg);
}

div {
  font-size: 1.4rem;
}
.lan {
  color: #377ca8;
}
/* table样式 */
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
  height: 3.4rem;
}
</style>
