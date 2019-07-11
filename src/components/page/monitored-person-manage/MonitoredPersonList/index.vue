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
        <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
      </div>
      <el-collapse class="collapse">
        <el-collapse-item title="显示高级过滤">
          <div>
            <el-select
              class="sel"
              clearable
              v-model="ruleForm.type"
              @change="getData()"
              placeholder="根据状态搜索"
            >
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.displayText"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              class="sel"
              clearable
              v-model="ruleForm.areaId"
              @change="getData()"
              placeholder="根据区域搜索"
            >
              <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
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
          <el-table-column prop="name" label="姓名" min-width="120px" sortable="custom"></el-table-column>
          <el-table-column  prop="gender" label="性别" sortable="custom"></el-table-column>
          <el-table-column prop="phone" label="手机号码" min-width="120px" sortable="custom"></el-table-column>
          <el-table-column prop="identityCard" label="身份证号码" min-width="160px" sortable="custom"></el-table-column>
          <el-table-column prop="areaName" label="地区" min-width="120px" sortable="custom"></el-table-column>
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
            label="添加日期"
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
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      addVisible: false,
      pickerOptions2: DatePicker,
      ruleForm: {
        filter: "",
        areaId: "",
        sorting: "DateAdded desc",
        maxResultCount: 10,
        skipCount: 0
      },
      id: "",
      MonitoredTypes: [
        {
          key: "JZ-001",
          value: "缓刑"
        },
        {
          key: "JZ-002",
          value: "假释"
        },
        {
          key: "JZ-003",
          value: "暂予监外执行"
        }
      ],
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
        phone: [{ required: true, message: "必填", trigger: "blur" }],
        identityCard: [{ required: true, message: "必填", trigger: "blur" }],
        address: [{ required: true, message: "必填", trigger: "blur" }],
        nativePlace: [{ required: true, message: "必填", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "change" }],
        beginDate: [{ required: true, message: "请选择", trigger: "change" }],
        endDate: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  created() {
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
    }
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
        if (res.length !== 0) {
          this.areas = res;
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
    isactive(data) {
      return data.active ? "已激活" : "未激活";
    },
    isonline(data) {
      return data.onlineStatus == 1 ? "在线" : "离线";
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
