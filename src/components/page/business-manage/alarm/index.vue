<template>
  <div>
    <div class="title">
      <span class="big">警报</span>
      <span class="small">警报</span>
    </div>
    <!--表格-->
    <div class="container">
      <div class="handle-box">
        <el-input v-model="ruleForm.filter" placeholder="筛选关键词" class="handle-input" @keyup.enter.native="getData"></el-input>
        <el-select class="sel" v-model="ruleForm.alarmType" @change="getData()" placeholder="根据警报类型搜索">
              <el-option v-for="item in types" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
        <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
      </div>
      <div class="tableThCol">
        <el-table :data="data" stripe style="width: 100%" ref="multipleTable" @sort-change='sortChange'>
          <el-table-column label="操作" width="50" fixed>
            <template slot-scope="scope">
              <el-dropdown trigger="click" class="iconSize" @click.native="id = scope.row.id">
                <span class="el-dropdown-link">
                  <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="handleEdit()">详情</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="processVisible = true">处理</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="personName" label="人员" min-width="120px" sortable='custom'>
          </el-table-column>
          <el-table-column prop="longitude" label="经度" min-width="100px" sortable='custom'>
          </el-table-column>
          <el-table-column prop="latitude" label="纬度" min-width="100px"  sortable='custom'>
          </el-table-column>
          <el-table-column prop="radius" label="范围"  min-width="110px"  sortable='custom'>
          </el-table-column>
          <el-table-column prop="address" label="地址"  min-width="110px"  sortable='custom'>
          </el-table-column>
          <el-table-column prop="processed" label="是否处理"  min-width="110px"  sortable='custom'>
          </el-table-column>
          <el-table-column prop="locTime" :formatter="formatTableDate" label="时间" sortable='custom' width="140px">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" :current-page.sync="cur_page" :page-sizes="[10,25,50,100,250,300]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 添加、编辑弹出框 -->
    <el-dialog title="警报详情" :visible.sync="addVisible" width="600px">
      <el-form ref="creatOrEditForm" :model="editForm" disabled>
        <el-form-item label="人员" prop="personName">
          <el-input v-model="editForm.personName"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="editForm.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="editForm.latitude"></el-input>
        </el-form-item>
        <el-form-item label="范围" prop="radius">
          <el-input v-model="editForm.radius"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="是否处理" prop="processed">
          <el-input v-model="editForm.processed"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="locTime">
          <el-input v-model="editForm.locTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
      </span>
    </el-dialog>

   <el-dialog title="处理报警" :visible.sync="processVisible" :close-on-click-modal="false" width="600px">
      <el-form ref="processForm" :model="processForm" :rules="processRules">
        <el-form-item label="处理结果" prop="processResult">
          <el-input type="textarea" :rows="4"  v-model="processForm.processResult"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processVisible = false">取 消</el-button>
        <el-button type="primary" @click="ProcessResult('processForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Api from "@/kites/api";
import { changeDate,changeDateTime } from "@/utils/date";
import { Post, Get, Delete, Put } from "@/api/api";
export default {
  name: "alarm",
  data() {
    return {
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      addVisible: false,
      processVisible: false,
      ruleForm: {
        filter: "",
        sorting: "locTime desc",
        maxResultCount: 10,
        skipCount: 0,
        alarmType: ""
      },
      id: "",
      editForm: {
       
      },
      processForm:{
       processResult:''
      },
      types:[{key:1,value:'出围栏'},{key:2,value:'入围栏'},{key:3,value:'设备被损坏'},{key:4,value:'低电量'},{key:5,value:'设备关机'}],
      rules: {
        key: [{ required: true, message: "必填", trigger: "blur" }],
        value: [{ required: true, message: "必填", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "change" }]
      },
      processRules: {
        processResult: [{ required: true, message: "必填", trigger: "blur" }]
      },
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
    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDateTime(row[column.property]);
      }
    },
    ProcessResult(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.AlarmProcess()
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
        const res = await Post(Api.GetAlarmList, this.ruleForm);
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
      try {
        const res = await Delete(Api.Alarm + this.id);     
        this.$message.success("删除成功");
        this.getData();     
      } catch (e) {
        console.log(e);
      }
    },
    // 获取编辑页面
    async handleEdit() {
      this.addVisible = true;
      try {
        const res = await Get(Api.Alarm + this.id);
        if (res) {
          this.editForm = res;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async AlarmProcess() {
      try {
        const res = await Put(Api.AlarmProcess,this.processForm);
        this.$message.success("操作成功");
        this.getData();
        this.processVisible = false;
        
      } catch (e) {
        console.log(e);
      }
    },

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
