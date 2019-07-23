<template>
  <!--公告-->
  <div class="upper">
    <div class="title">
      <span class="big">地理围栏列表</span>
      <span class="small">管理地理围栏</span>
      <el-button class="btn" type="primary" icon="el-icon-edit" @click="handleCreate()" >创建围栏</el-button>
    </div>
    <div class="container formWidth">
      <!-- 顶部筛选 -->
      <div class="handle-box">
        <el-input v-model="ruleForm.filter" placeholder="关键字查询" class="handle-input"></el-input>
        <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="围栏列表" name="first">
          <div class="tableThCol">
            <el-table :data="data"  stripe style="width: 100%"  @sort-change='sortChange'>
              <el-table-column label="操作" width="60" fixed>
                <template slot-scope="scope">
                  <el-dropdown trigger="click" class="iconSize" @click.native="id = scope.row.id">
                    <span class="el-dropdown-link">
                      <i class="el-icon-menu"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <span @click="goToEdit">修改</span>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <span @click="handleDelete(scope.$index, scope.row)">删除</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="围栏名称" sortable='custom' min-width="120">
              </el-table-column>
              <el-table-column prop="entityName" label="监控设备" sortable='custom' min-width="120">
              </el-table-column>
              <el-table-column prop="fenceId" label="围栏Id" width="180" sortable='custom' min-width="100">
              </el-table-column>
              <el-table-column :formatter="getType" label="围栏类型" sortable='custom' min-width="180">
              </el-table-column>
              <el-table-column prop="dateAdded" :formatter="formatTableDate" label="创建时间" sortable='custom' min-width="150">
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination">
            <el-pagination @size-change="handleSizeChange" :current-page.sync="cur_page" :page-sizes="[10,25,50,100,250,300]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
          </div>
        </el-tab-pane>
        
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { Post, Get, Delete, Put} from "@/api/api";
import { changeDate,changeDateTime } from "@/utils/date";
import searchMap from "@/components/common/searchMap";
export default {
  name: "listItem",
  data() {
    return {
      dialogTitle: "", //弹框标题
      id: "",
      d: { skipCount: 0 },
      activeName: "first",
      cur_page: 1,
      totalCount: 0,
      tableData: [],
      ruleForm: {
        filter:"",
        sorting: "DateAdded desc",
        maxResultCount: 10,
        skipCount: 0
      },
      categorys: [],
      edit: {
        notice: {
          id: "",
          title: "",
          content: ""
        }
      }
    };
  },
  components: {
    searchMap
  },
  created() {
    this.getData();
    // this.getCategoryList();
  },
  computed: {
    data() {
      return this.tableData;
    },
    fenceType(){
    
    }
  },
  watch: {
    cur_page(curVal, oldVal) {
      this.cur_page = curVal; //页数
      this.getData();
    },
    addVisible(curVal) {
      if (!curVal) {
         this.$resetForm(this.$refs['creatOrEditForm'])
      }
    }
  },
  mounted() {},
  methods: {
    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDateTime(row[column.property]);
      }
    },
    getType(data){
      return  (data.fenceType == 1) ? "圆形":((data.fenceType == 2) ? '多边形':(data.fenceType == 3) ? '线形':'行政区域')
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
    handleSizeChange(val) {
      this.ruleForm.maxResultCount = val;
      this.getData();
    },
    // 获取表格数据
    async getData() {
      this.ruleForm.skipCount =
        (this.cur_page - 1) * this.ruleForm.maxResultCount;
      try {
        const res = await Post(Api.GetFenceList, this.ruleForm);
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
      this.$confirm("是否确认删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteRow();
        })
        .catch(() => {});
    },
    // 删除
    async deleteRow() {
      try {
        const res = await Delete(Api.Fence + this.id);
        this.$message.success("删除成功");
        this.getData();
      } catch (e) {
        console.log(e);
      }
    },

    handleCreate(title) {
     this.$router.push('/geoFence/fencing/');
    },
    // 跳转至编辑页面
    goToEdit() {
      this.$router.push( { name: 'fencing', params: { id: this.id }});
    }
     
  }
};
</script>

<style scoped lang="less" >
.list-group-item > .badge {
  float: right;
}
.badge {
  font-size: 11px !important;
  height: 18px;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0 10px 0 0;
  cursor: pointer;
}

.list-group-item {
  position: relative;
  display: block;
  padding-left: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
}
.list-group {
  margin-bottom: 20px;
  padding-left: 0;
  list-style-type: disc;
}
.pic {
  width: 40%;
}
.upper {
  overflow: hidden;
}
.container {
  float: left;
  position: relative;
  .new {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

.handle-row {
  margin-top: 30px;
}
.formWidth {
  width: 95%;
}
/*修改下拉菜单宽度*/
.select {
  width: 120px;
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
.handle-box {
  margin-bottom: 10px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
</style>
