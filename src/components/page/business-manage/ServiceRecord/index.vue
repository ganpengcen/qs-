<template>
  <div>
    <div class="title">
      <span class="big">社区服务记录</span>
      <span class="small">查看编辑社区服务记录</span>
      <excel class="btn" :url="ServiceRecord" :form='excelForm' :source="'导出到Excel'"></excel>
    </div>
    <!--表格-->
    <div class="container">
      <div class="handle-box">
        <el-date-picker v-model="dateArr" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
        </el-date-picker>
        <el-input v-model="ruleForm.name" placeholder="检索姓名" class="handle-input" @keyup.enter.native="getData"></el-input>
        <el-select v-model="ruleForm.areaId" placeholder="请选择区域" clearable @change="getData()" v-has="'Pages.XiangYang.ServiceRecord.SearchArea'">
          <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
      </div>
      <div class="tableThCol">
        <el-table :data="data" stripe style="width: 100%" ref="multipleTable" @sort-change='sortChange' >
          <el-table-column label="操作" width="50" fixed>
            <template slot-scope="scope">
              <el-dropdown trigger="click" class="iconSize" @click.native="id = scope.row.id">
                <span class="el-dropdown-link">
                  <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- v-has="'Pages.XiangYang.ServiceRecord.Edit'" -->
                  <el-dropdown-item>
                    <p @click="handleEdit('编辑社区服务记录')">修改</p>
                  </el-dropdown-item>        
                  <!-- v-has="'Pages.XiangYang.ServiceRecord.Delete'" -->
                  <el-dropdown-item>
                    <p @click="handleDelete()">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>

          <el-table-column prop="areaName" label="区域名称" sortable='custom' min-width="100px">
          </el-table-column>
          <el-table-column prop="name" label="名字" sortable='custom'>
          </el-table-column>
          <el-table-column :formatter="jtype" prop="type" label="服务方式" sortable='custom' width="100px">
          </el-table-column>
          <el-table-column prop="orgization" label="组织者/见证者" sortable='custom' width="140px">
          </el-table-column>
          <el-table-column prop="studyTime" label="活动时长(分钟)" sortable='custom' width="140px">
          </el-table-column>
          <el-table-column prop="content" label="活动内容" sortable='custom' width="180px" show-overflow-tooltip min-width="180px">
          </el-table-column>
          <el-table-column prop="lng" label="经度" sortable='custom' width="120px">
          </el-table-column>
          <el-table-column prop="lat" label="维度" sortable='custom' width="120px">
          </el-table-column>
          <el-table-column prop="location" label="位置" sortable='custom' width="180px">
          </el-table-column>
           <el-table-column prop="photo" label="照片" sortable='custom' width="90px">
            <template slot-scope="scope" >
              <img @click="openPic(scope.row.photo)" :src="`${Host}/${scope.row.photo}`" alt="" style="width: 50px">
            </template>
          </el-table-column>
          <el-table-column prop="photoTime" :formatter="formatTableDate" label="拍照时间" sortable='custom' width="140px">
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
     <el-dialog title="查看大图" :visible.sync="imgVisible" width="680px">
        <img :src="picUrl" alt="" class='caeousel-img'>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog :title="titleT1" :visible.sync="EditVisible" width="600px">
      <el-form ref="editrForm" :model="editForm" :rules="rules">
        <el-form-item label="服务时长(分钟)" prop="studyTime">
          <el-input v-model="editForm.studyTime"></el-input>
        </el-form-item>
        <el-form-item label="组织者/见证者" prop="orgization">
          <el-input v-model="editForm.orgization"></el-input>
        </el-form-item>
       <el-form-item label="活动内容" prop="content">
          <el-input type="textarea" v-model="editForm.content"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="createDialog('editrForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Api from "@/kites/api";
import excel from "@/components/common/excel";
import { changeDate,changeDateTime } from "@/utils/date";
import { DatePicker } from "@/utils/config";
import { Post, Get, Delete, Put} from "@/api/api";
export default {
  name: "xyServiceRecord",
  data() {
    return {
      picUrl:"",
      ServiceRecord:Api.GetServiceRecordToExcel,
      imgVisible:false,
      isdisabled: true,
      dateArr: [],
      isExpireList: [
        { id: "", name: "全部选择" },
        { id: true, name: "已到期" },
        { id: false, name: "未到期" }
      ],
      viewResult: {
        question: "",
        answer: ""
      },
      pickerOptions2: DatePicker,
      rules: {
        studyTime: [{ required: true, message: "必填", trigger: "blur" }],
        content: [{ required: true, message: "必填", trigger: "blur" }],
        orgization: [{ required: true, message: "必填", trigger: "blur" }],
      },
    
      titleT1: "",
      tableData: [],
      roleList: [],
      types: [],
      areas: [],
      cur_page: 1,
      totalCount: 0,
      EditVisible: false,
      ruleForm: {
        beginTime: "",
        endTime: "",
        name: "",
        areaId: "",
        sorting: "DateAdded desc",
        maxResultCount: 10,
        skipCount: 0
      },
      id: "",
      editForm: {      
      },
      Host:this.$host
    };
  },
  created() {
    this.getData();
    this.GetAllArea();
    this.end = new Date();
    this.start = new Date();
    this.start.setTime(this.start.getTime() - 3600 * 1000 * 24 * 30);
    this.dateArr = [this.start, this.end];
  },
  computed: {
    data() {
      return this.tableData;
    },
    excelForm() {
      return {
        beginTime: this.ruleForm.beginTime,
        endTime: this.ruleForm.endTime,
        name: this.ruleForm.name,
        areaId: this.ruleForm.areaId
      };
    }
  },
  components: {
    excel
  },
  watch: {
    cur_page(curVal, oldVal) {
      this.cur_page = curVal; //页数
      this.getData();
    },
    dateArr: {
      handler(val, oldVal) {
        if (val == null) {
          this.ruleForm.beginTime = "";
          this.ruleForm.endTime = "";
        } else {
          this.ruleForm.beginTime = val[0];
          this.ruleForm.endTime = val[1];
        }
      },
      deep: true
    },
     EditVisible(curVal) {
      if (!curVal) {
        this.$resetForm(this.$refs['editrForm']);
      }
    } 
  },

  methods: {
    // 表格排序
    sortChange: function(column) {
      if (column.order == "ascending") {
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
    openPic(url){ 
      this.picUrl = `${this.Host}/${url}`;
      this.imgVisible = true;
    },
    // 获取编辑页面
    async handleEdit(title) {
      this.EditVisible = true;
      this.titleT1 = title;
      try {
        const res = await Get(Api.ServiceRecord + this.id);
        if (res) {
          this.editForm = res;
        }
      } catch (e) {
        console.log(e);
      }
    },
    createDialog(formName, title) {
      this.$refs[formName].validate(valid => {
        if (valid) {         
            this.UpdateServiceRecord();        
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    async UpdateServiceRecord() {
      try {
        let url =
          "/api/services/app/serviceRecord/UpdateServiceRecord";
        const res = await Post(url, this.editForm);
        if (res) {
          this.getData();
          this.$message("修改成功");
          this.EditVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取表格数据
    async getData() {
      this.ruleForm.skipCount =
        (this.cur_page - 1) * this.ruleForm.maxResultCount;
      try {
        const res = await Post(Api.GetServiceRecordList, this.ruleForm);
        if (res) {
          this.tableData = res.items;
          this.totalCount = res.totalCount;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 点击删除
    handleDelete() {
      this.$confirm("您确定要删除该学习记录吗？", "提示", {
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
      try {
        const res = await Delete(Api.ServiceRecord + this.id);
        this.$message.success("删除成功");
        this.getData();
      } catch (e) {
        console.log(e);
      }
    },

    jtype(data) {
      return data.type == "1" ? "集中劳动" : "公益服务";
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
    margin-left: 10px;
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
