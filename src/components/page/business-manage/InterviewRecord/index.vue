<template>
  <div>
    <div class="title">
      <span class="big">面谈记录</span>
      <span class="small">管理面谈记录</span>
      <!-- v-has="'Pages.Foundations.DicData.Create'" -->
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd('添加记录')" class="btn">添加新记录</el-button>
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
          style="width:230px"
          v-model="ruleForm.areaId"
          placeholder="请选择区域"
          clearable
          @change="GetPersonByAreafilter()"
        >
          <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          style="width:230px"
          v-show="ruleForm.areaId"
          v-model="ruleForm.personId"
          placeholder="请选择监控对象"
          clearable
          @change="getData()"
        >
          <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
                    <p @click="handleDetails()">查看详情</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.status == 1">
                    <p @click="handleEditTalk()">修改约谈</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.status == 1">
                    <p @click="talkVisible = true">执行约谈</p>
                  </el-dropdown-item>
                  
                  <el-dropdown-item>
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="area" label="地区" min-width="120px" sortable="custom"></el-table-column>
          <el-table-column prop="person" label="约谈人" min-width="120px" sortable="custom"></el-table-column>
          <el-table-column
            prop="reason"
            label="理由"
            min-width="180px"
            show-overflow-tooltip
            sortable="custom"
          ></el-table-column>
          <el-table-column prop="address" label="地址" min-width="140px" sortable="custom"></el-table-column>
          <el-table-column prop="status" label="是否处理" min-width="100px" sortable="custom">
            <template slot-scope="scope">
              <p
                :class="[{'text-danger':scope.row.status == 1},{'text-safe':scope.row.status == 2}]"
              >{{scope.row.status == 2?'已处理':'未处理'}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="scheduleTime"
            :formatter="formatTableDate"
            label="日期"
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
    <el-dialog title="添加约谈" :visible.sync="addVisible" width="600px">
      <el-form ref="createForm" :model="addForm" :rules="rules">
        <el-form-item label="选择区域" prop="areaId">
          <el-select
            style="width:100%"
            v-model="addForm.areaId"
            placeholder="请选择区域"
            clearable
            @change="GetPersonByArea()"
          >
            <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>     
        <el-form-item label="约谈人" prop="personId">
          <el-select style="width:100%" v-model="addForm.personId" placeholder="请选择监控对象" clearable>
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="理由" prop="reason">
          <el-input type="textarea" :rows="4" v-model="addForm.reason"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="组织者" prop="organizer">
          <el-input v-model="addForm.organizer"></el-input>
        </el-form-item>
        <el-form-item label="安排日期" prop="scheduleTime">
          <el-date-picker
            style="width:100%"
            v-model="addForm.scheduleTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="CreateTalk('createForm')">确 定</el-button>
      </span>
    </el-dialog>
     <el-dialog title="约谈详情" :visible.sync="detailVisible" width="600px">
      <el-form  :model="detailForm" disabled>     
        <el-form-item label="区域" prop="area">
          <el-input v-model="detailForm.area" ></el-input>
        </el-form-item>
        <el-form-item label="约谈人" prop="person">
          <el-input v-model="detailForm.person"></el-input>
        </el-form-item>
        <el-form-item label="理由" prop="reason">
          <el-input type="textarea" :rows="4" v-model="detailForm.reason"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="detailForm.address"></el-input>
        </el-form-item>
        <el-form-item label="组织者" prop="organizer">
          <el-input v-model="detailForm.organizer"></el-input>
        </el-form-item>
        <el-form-item label="安排日期" prop="scheduleTime">
          <el-date-picker
            style="width:100%"
            v-model="detailForm.scheduleTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改约谈" :visible.sync="editVisible" width="600px">
      <el-form ref="EditForm" :model="editForm" :rules="rules">         
        <el-form-item label="理由" prop="reason">
          <el-input type="textarea" :rows="4" v-model="editForm.reason"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="安排日期" prop="scheduleTime">
          <el-date-picker
            style="width:100%"
            v-model="editForm.scheduleTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="UpdateTalk('EditForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="执行约谈" :visible.sync="talkVisible" width="600px">
      <el-form ref="talkForm" :model="talkForm" :rules="talkrules">
        <el-form-item label="结果" prop="result">
          <el-input type="textarea" :rows="4" v-model="talkForm.result"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="talkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="talkVisible = false">取 消</el-button>
        <el-button type="primary" @click="CreateResult('talkForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { changeDate } from "@/utils/date";
import { Post, Get, Delete, Put } from "@/api/api";
export default {
  name: "InterviewRecord",
  data() {
    return {
      detailForm:{},
      tableData: [],
      areas: [],
      personList: [],
      cur_page: 1,
      totalCount: 0,
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      talkVisible: false,
      ruleForm: {
        areaId: "",
        personId: "",
        filter: "",
        sorting: "scheduleTime desc",
        maxResultCount: 10,
        skipCount: 0
      },
      id: "",
      addForm: {
        areaId: "",
        personId: "",
        reason: "",
        address: "",
        scheduleTime: "",
        organizer: ""
      },
      editForm:{

      },
      talkForm: {
        result: "",
        remark: ""
      },
      rules: {
        reason: [{ required: true, message: "必填", trigger: "blur" }],
        areaId: [{ required: true, message: "请选择", trigger: "change" }],
        personId: [{ required: true, message: "请选择", trigger: "change" }],
        scheduleTime: [{ required: true, message: "请选择", trigger: "change" }]
      },
      talkrules:{
        result: [{ required: true, message: "必填", trigger: "blur" }],
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
        this.$resetForm(this.$refs["createForm"]);
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
    CreateTalk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.Create();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    UpdateTalk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.Update();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    CreateResult(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.ExecutionTalk();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async ExecutionTalk() {
      try {
        const res = await Put(Api.ExecutionTalk + this.id, this.detailForm);
        this.$message.success("操作成功");
        this.getData();
        this.talkVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    // 获取区域列表
    async GetAllArea() {
      try {
        const res = await Get(Api.GetAllArea, {});
        this.areas = res;
      } catch (e) {
        console.log(e);
      }
    },
    async GetPersonByAreafilter() {
      this.ruleForm.personId = ""
      this.getData()
      try {
        const res = await Get(Api.GetPersonByArea + this.ruleForm.areaId);
        this.personList = res;
      } catch (e) {
        console.log(e);
      }
    },
    async GetPersonByArea() {
      this.addForm.personId = "";
      this.getData()
      try {
        const res = await Get(Api.GetPersonByArea + this.addForm.areaId);
        this.personList = res;
      } catch (e) {
        console.log(e);
      }
    },
    // 获取列表数据
    async getData() {
      this.ruleForm.skipCount =
        (this.cur_page - 1) * this.ruleForm.maxResultCount;
      try {
        const res = await Post(Api.GetTalkList, this.ruleForm);
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
        const res = await Delete(Api.Talk + this.id);
        this.$message.success("删除成功");
        this.getData();
      } catch (e) {
        console.log(e);
      }
    },
    // 获取编辑页面
    async handleDetails() {
      try {
        const res = await Get(Api.Talk + this.id);
        if (res) {
          this.detailForm = res;
          this.detailVisible = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async handleEditTalk() {
      this.editVisible = true;
      try {
        const res = await Get(Api.GetTalkForEdit + this.id);
        if (res) {
          this.editForm = res;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //添加
    handleAdd(title) {
      this.$delete(this.detailForm, "id");
      this.addVisible = true;
    },
    async Create() {
      try {
        const res = await Post(Api.CreateTalk, this.detailForm);
        this.$message.success("操作成功");
        this.getData();
        this.addVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    async Update() {
      try {
        const res = await Put(Api.Talk + this.id, this.editForm);
        this.$message.success("操作成功");
        this.getData();
        this.editVisible = false;
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
