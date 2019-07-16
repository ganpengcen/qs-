<template>
  <div>
    <div class="title">
      <span class="big">区域管理员</span>
      <span class="small">区域管理员维护</span>
      <!-- v-has="'Pages.Foundations.DicData.Create'" -->
      <el-button
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd('添加区域管理员')"
        class="btn"
      >添加区域管理员</el-button>
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
          v-model="ruleForm.area"
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
                  <el-dropdown-item>
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编号" sortable="custom" min-width="140px"></el-table-column>
          <el-table-column prop="name" label="名字" sortable="custom" min-width="140px"></el-table-column>
          <el-table-column prop="area" label="区域" sortable="custom" min-width="140px"></el-table-column>
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
    <el-dialog :title="titleT" :visible.sync="addVisible" width="600px">
      <el-form ref="creatOrEditForm" :model="editForm" :rules="rules">
        <el-form-item label="编号" prop="code">
          <el-input v-model="editForm.code"></el-input>
        </el-form-item>
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
        <el-form-item label="用户名" prop="userName" v-if="titleT == '添加区域管理员'">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码（至少包含一个数字，至少6个字符）" prop="password" v-if="titleT == '添加区域管理员'">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="areaId" label="区域">
          <el-select class="seldialogn" v-model="editForm.areaId" placeholder="请选择区域">
            <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="CreateOrUpdate('creatOrEditForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { changeDate } from "@/utils/date";
import { Post, Get, Delete, Put } from "@/api/api";
export default {
  name: "AreaAdmin",
  data() {
    var validatePass = (rule, value, callback) => {
      let password = this.editForm.password;
      if (value === "" || value == null || password == undefined) {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("最少要输入6个字符"));
      }else{
        callback();
      }
    };

    return {
      titleT: "",
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      addVisible: false,
      areas: [],
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
      ruleForm: {
        filter: "",
        area: "",
        sorting: "DateAdded desc",
        maxResultCount: 10,
        skipCount: 0
      },
      id: "",
      editForm: {
        code: "",
        userName: "",
        password: "",
        name: "",
        gender: 1,
        areaId: "",
        phoneNumber: ""
      },
      rules: {
        areaId: [{ required: true, message: "请选择", trigger: "change" }],
        code: [{ required: true, message: "必填", trigger: "blur" }],
        name: [{ required: true, message: "必填", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        userName: [{ required: true, message: "必填", trigger: "blur" }]
      }
    };
  },
  created() {
    this.GetAllArea();
    this.getData();
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
    async GetAllArea() {
      try {
        const res = await Get(Api.GetAllArea, {});
        this.areas = res;
      } catch (e) {
        console.log(e);
      }
    },
    CreateOrUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.titleT == "添加区域管理员") {
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
    // 获取列表数据
    async getData() {
      this.ruleForm.skipCount =
        (this.cur_page - 1) * this.ruleForm.maxResultCount;
      try {
        const res = await Post(Api.GetAreaAdminList, this.ruleForm);
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
        const res = await Delete(Api.AreaAdmin + this.id);
        this.$message.success("删除成功");
        this.getData();
      } catch (e) {
        console.log(e);
      }
    },
    // 获取编辑页面
    async handleEdit(title) {
      this.addVisible = true;
      this.titleT = title;
      try {
        const res = await Get(Api.AreaAdmin + this.id);
        if (res) {
          this.editForm = res;
        }
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
        const res = await Post(Api.CreateAreaAdmin, this.editForm);
        this.$message.success("操作成功");
        this.getData();
        this.addVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    async Update() {
      try {
        const res = await Put(Api.AreaAdmin + this.id, this.editForm);
        this.$message.success("操作成功");
        this.getData();
        this.addVisible = false;
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
