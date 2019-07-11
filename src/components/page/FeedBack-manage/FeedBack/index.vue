<template>
  <div>
    <div class="title">
      <span class="big">意见反馈</span>
      <span class="small">查看意见反馈</span>
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
                  <el-dropdown-item>
                    <p @click="handleView(scope.row)">查看</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="handleDelete(scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名字" sortable='custom'>
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" sortable='custom'>
          </el-table-column>
          <el-table-column prop="creationTime" :formatter="formatTableDate" label="创建时间" sortable='custom' width="140px">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" :current-page.sync="cur_page" :page-sizes="[10,25,50,100,250,300]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 新建 -->
    <el-dialog title="意见反馈" :visible.sync="createOrEditVisible" width="600px">
      <el-form ref="CreateForm" :model="dialogForm" :rules="rules">
        <el-form-item label="名字" prop="name">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="dialogForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="反馈内容" prop="content">
          <el-input type="textarea" :rows="10" v-model="dialogForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createOrEditVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { changeDate } from "@/utils/date";
import { DatePicker } from "@/utils/config";
import { Post } from "@/api/api";
export default {
  name: "FeedBack",
  data() {
    return {
      isdisabled: true,
      viewResult: {
        question: "",
        answer: ""
      },
      rules: {
        keyWord: [{ required: true, message: "必填", trigger: "blur" }],
        response: [{ required: true, message: "必填", trigger: "blur" }]
      },
      titleT: "",
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      is_search: false,
      createOrEditVisible: false,
      ruleForm: {
        filter: "",
        sorting: "",
        maxResultCount: 10,
        skipCount: 0
      },
      id: "",
      dialogForm: {
        keyWord: "",
        response: ""
      }
    };
  },
  created() {
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
    createOrEditVisible(curVal) {
      if (!curVal) {
        this.$resetForm(this.$refs['CreateForm']);
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
    handleSizeChange(val) {
      this.ruleForm.maxResultCount = val;
      this.getData();
    },
    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDate(row[column.property]);
      }
    },
    //新建
    handleView(row) {
      this.GetFeedBack(row);
      this.createOrEditVisible = true;
    },
    async CreateOrEditArea(url) {
      try {
        const res = await Post(url, this.dialogForm);
        if (res.success) {
          this.getData();
          this.$message.success("创建成功");
          this.createOrEditVisible = false;
          this.dialogForm = {
            name: ""
          };
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取表格数据
    async getData() {
      let url = "/api/services/app/feedBack/GetFeedBackList";
      this.ruleForm.skipCount =
        (this.cur_page - 1) * this.ruleForm.maxResultCount;
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
    handleDelete(row) {
      this.$confirm("该意见反馈将被删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteRow();
        })
        .catch(() => {});
    },
    async deleteRow() {
      let url = "/api/services/app/feedBack/DeleteFeedBack";
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
    // 查看
    async GetFeedBack(row) {
      let url = "/api/services/app/feedBack/GetFeedBack";
      try {
        const res = await Post(url, { id: row.id });
        if (res.success) {
          this.dialogForm = res.result;
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

.handle-select {
  width: 120px;
}

.handle-input {
  width: 350px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.text-danger {
  color: #ed6b75;
}
.sel {
  width: 350px;
}
</style>
