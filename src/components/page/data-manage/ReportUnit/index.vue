<template>
  <div>
    <div class="title">
      <span class="big">上报单位</span>
      <span class="small">管理上报单位</span>
      <!-- v-has="'Pages.Foundations.DicData.Create'" -->
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd('添加上报单位')" class="btn">添加上报单位</el-button>
    </div>
    <!--表格-->
    <div class="container">
      <div class="handle-box">
        <el-input v-model="ruleForm.filter" placeholder="筛选关键词" class="handle-input" @keyup.enter.native="getData"></el-input>
        <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
      </div>
      <div class="tableThCol">
        <el-table :data="data" border stripe style="width: 100%" ref="multipleTable" @sort-change='sortChange'>
          <el-table-column label="操作" width="50" fixed>
            <template slot-scope="scope">
              <el-dropdown trigger="click" class="iconSize" @click.native="id = scope.row.id">
                <span class="el-dropdown-link">
                  <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- v-has="'Pages.Foundations.DicData.Edit'" -->
                  <el-dropdown-item>
                    <p @click="handleEdit(scope.row)">修改</p>
                  </el-dropdown-item>
                  <!-- v-has="'Pages.Foundations.DicData.Delete'" -->
                  <el-dropdown-item>
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="distinctId" label="区域" sortable='custom'>
          </el-table-column>
          <el-table-column prop="name" label="名字" sortable='custom'>
          </el-table-column>
          <el-table-column prop="creationTime" :formatter="formatTableDate" label="创建日期" sortable='custom'>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" :current-page.sync="cur_page" :page-sizes="[10,25,50,100,250,300]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <!-- 添加、编辑弹出框 -->
    <el-dialog :title="titleT" :visible.sync="addVisible" width="600px">
      <el-form ref="creatOrEditForm" :model="editForm" :rules="rules">
        <el-form-item prop="distinctId">
          <el-select class="seldialogn" v-model="editForm.distinctId" placeholder="请选择区域">
            <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="createDialog('creatOrEditForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Api from "@/kites/api";
import { changeDate } from "@/utils/date";
import { Post } from "@/api/api";
export default {
  name: "ReportUnit",
  data() {
    return {
      titleT: "",
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      select_cate: "",
      areas: [],
      del_list: [],
      is_search: false,
      addVisible: false,
      ruleForm: {
        filter: "",
        sorting: "",
        maxResultCount: 10,
        skipCount: 0
      },
      id: "",
      editForm: {
        distinctId: "",
        name: ""
      },
      rules: {
        distinctId: [{ required: true, message: "请选择", trigger: "change" }],
        name: [{ required: true, message: "必填", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getData();
    this.GetAllAreas();
  },
  computed: {
    data() {
      return this.tableData;
    }
  },
  watch: {
    cur_page(curVal, oldVal) {
      this.cur_page = curVal; //页数
      this.getData();
    },
    addVisible(curVal) {
      if (!curVal) {
        this.$delete(this.editForm, "id");
        this.$resetForm(this.$refs["creatOrEditForm"]);
      }
    }
  },
  methods: {
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
    createDialog(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.CreateOrUpdate();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取区域列表
    async GetAllAreas() {
      try {
        const res = await Post(Api.GetDistricts, {});
        if (res.success) {
          this.areas = res.result.items;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取列表数据
    async getData() {
      this.ruleForm.skipCount =
        (this.cur_page - 1) * this.ruleForm.maxResultCount;
      let url = "/api/services/app/reportUnit/GetReportUnits";
      try {
        const res = await Post(url, this.ruleForm);
        if (res.success) {
          this.tableData = res.result.items;
          this.totalCount = res.result.totalCount;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 点击删除
    handleDelete(index, row) {
      this.$confirm(`上报单位 '${row.name}' 将被删除`, "提示", {
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
      let url = "/api/services/app/reportUnit/Delete";
      try {
        const res = await Post(url, { id: this.id });
        if (res.success) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error("删除失败");
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取编辑页面
    async handleEdit(row) {
      this.addVisible = true;
      this.titleT = "修改上报单位";
      let url = "/api/services/app/reportUnit/GetReportUnitDetails";
      try {
        const res = await Post(url, { id: this.id });
        if (res.success) {
          this.editForm = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },

    //添加
    handleAdd(title) {
      this.editForm.name = "";
      this.editForm.distinctId = "";
      this.titleT = title;
      this.addVisible = true;
    },
    // 添加或编辑
    async CreateOrUpdate() {
      try {
        if (this.titleT == "添加上报单位") {
          let url = "/api/services/app/reportUnit/CreateReportUnit";
          const res = await Post(url, this.editForm);
          if (res.success) {
            this.$message.success("添加成功");
            this.getData();
            this.addVisible = false;
          }
        } else {
          let url = "/api/services/app/reportUnit/UpdateReportUnit";
          const res = await Post(url, this.editForm);
          if (res.success) {
            this.$message.success("修改成功");
            this.getData();
            this.addVisible = false;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
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
</style>
