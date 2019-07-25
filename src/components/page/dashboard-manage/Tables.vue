<template>
  <div class="body">
       <h3 class="lan">司法矫正总人数</h3>
    <table class="table_box">
      <thead>
        <tr>
          <th>姓名</th>
          <th>性别</th>
          <th>年龄</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in tableData1" :key="index" @click="goCorrect" style="cursor: pointer;">
          <td>{{item.pm}}</td>
          <td>{{item.qx}}</td>
          <td>{{item.rs}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'Tables',
    data() {
      return {
        //总人数
        tableData1: [{
            pm: '张三',
            qx: '男',
            rs: 18,
          }, {
            pm: '张三',
            qx: '男',
            rs: 18,
          }, {
            pm: '李四',
            qx: '女',
            rs: 23,
          }, {
            pm: '王五',
            qx: '女',
            rs: 25,
          },
          {
            pm: '石大',
            qx: '男',
            rs: 30,
          },
          {
            pm: '舒安峰',
            qx: '女',
            rs: 28,
          },
          {
            pm: '主是',
            qx: '男',
            rs: 35,
          },
          {
            pm: '谷歌',
            qx: '女',
            rs:43,
          },
          {
            pm: '郭凯天',
            qx: '男',
            rs: 56,
          },
          {
            pm: '史蒂夫',
            qx: '男',
            rs: 22,
          },
        ]
      }
    },
    methods:{
        goCorrect(){
            this.$router.push('/Correct');
        }
    }
  }

</script>
<style scoped>
.lan {
    color: #377ca8;
  }
div {
  font-size: 1.4rem;
}
  .table_box {
    width: 100%;
    color: #Fff;
  }

  .table_box td,
  th {
    width: 30%;
    text-align: center;
  }

  .table_box tr {
    line-height: 3.4rem;
  }

</style>
