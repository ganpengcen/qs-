<template>
  <div>
    <div class="title">
      <span class="big">字典数据</span>
      <span class="small">管理字典数据</span>
      <!-- v-has="'Pages.Foundations.DicData.Create'" -->
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd('添加字典数据')" class="btn">添加字典数据</el-button>
    </div>
    <!--表格-->
    <div class="container">
      <div class="handle-box">
        <el-input v-model="ruleForm.filter" placeholder="筛选关键词" class="handle-input" @keyup.enter.native="getData"></el-input>
        <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
      </div>
      <el-collapse class="collapse">
        <el-collapse-item title="显示高级过滤">
          <div>
            <el-select class="sel" v-model="ruleForm.type" @change="getData()" placeholder="根据数据类型搜索">
              <el-option v-for="item in types" :key="item.value" :label="item.displayText" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
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
                    <p @click="handleEdit('修改')">修改</p>
                  </el-dropdown-item>
                  <!-- v-has="'Pages.Foundations.DicData.Delete'" -->
                  <el-dropdown-item>
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="key" label="键值" width="100px" sortable='custom'>
          </el-table-column>
          <el-table-column prop="value" label="内容" sortable='custom'>
          </el-table-column>
          <el-table-column prop="typeText" label="类型" sortable='custom'>
          </el-table-column>
          <el-table-column prop="extendData" label="备注" sortable='custom'>
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
        <el-form-item v-show="titleT=='添加字典数据'" prop="type">
          <el-select class="seldialogn" v-model="editForm.type" placeholder="选择数据类型">
            <el-option v-for="item in types" :key="item.value" :label="item.displayText" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="键值" prop="key">
          <el-input v-model="editForm.key"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="value">
          <el-input v-model="editForm.value"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="extendData">
          <el-input v-model="editForm.extendData"></el-input>
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
import { Post } from "@/api/api";
export default {
  name: "dicData",
  data() {
    return {
      titleT: "",
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      select_cate: "",
      del_list: [],
      is_search: false,
      addVisible: false,
      ruleForm: {
        filter: "",
        sorting: "",
        maxResultCount: 10,
        skipCount: 0,
        type: ""
      },
      id: "",
      editForm: {
        key: "",
        value: "",
        extendData: "",
        type: ""
      },
      types:[],
      rules: {
        key: [{ required: true, message: "必填", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  created() {
    this.GetDicList();
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
         this.$resetForm(this.$refs['creatOrEditForm'])
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
    CreateOrUpdateDicData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.titleT == "添加字典数据") {
            let url = "/api/services/app/dicData/Create";
            this.CreateOrUpdate(url);
          } else {
            let url = "/api/services/app/dicData/Update";
            this.CreateOrUpdate(url);
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
      let url = "/api/services/app/dicData/GetDatas";
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
      this.$confirm("该数据字典将被删除", "提示", {
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
      let url = "/api/services/app/dicData/Delete";
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
    async handleEdit(title) {
      this.addVisible = true;
      this.titleT = title;
      let url = "/api/services/app/dicData/GetById";
      try {
        const res = await Post(url, { id: this.id });
        if (res.success) {
          this.editForm = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取分类
    async GetDicList() {
      let url = "/api/services/app/dicData/GetDicList";
      try {
        const res = await Post(url, {});
        if (res.success) {
          this.types = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //添加
    handleAdd(title) {
      this.$delete(this.editForm, "id");
      this.editForm.type = "";
      this.titleT = title;
      this.addVisible = true;
    },
    // 添加或编辑
    async CreateOrUpdate(url) {
      try {
        const res = await Post(url, this.editForm);
        if (res.success) {
          this.$message.success("操作成功");
          this.getData();
        }
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
