<template>
  <div>
    <div class="title">
      <span class="big">设备列表</span>
      <span class="small">管理设备列表</span>
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd('添加设备')" class="btn">添加设备</el-button>
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
          v-model="ruleForm.status"
          @change="getData()"
          placeholder="根据绑定状态搜索"
        >
          <el-option
            v-for="item in deviceStatus"
            :key="item.value"
            :label="item.displayText"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          class="sel"
          clearable
          v-model="ruleForm.onlineStatus"
          @change="getData()"
          placeholder="根据在线状态搜索"
        >
          <el-option
            v-for="item in onLineStatus"
            :key="item.value"
            :label="item.displayText"
            :value="item.value"
          ></el-option>
        </el-select>

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
              <el-dropdown
                trigger="click"
                class="iconSize"
                @click.native="selectRow = scope.row,id = scope.row.id"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="handleEdit('修改')">修改设备</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="handleConfig()">配置参数</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="!scope.row.active" divided>
                    <p @click="handleActive()">激活</p>
                  </el-dropdown-item>
                  <el-dropdown-item :divided="scope.row.active">
                    <p @click="handleDevice('关闭','02')">关机</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="handleDevice('重启','01')">重启</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="handleMsg()">发送短信</p>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="area" label="区域" min-width="120px" sortable="custom"></el-table-column>
          <el-table-column prop="serialNo" label="设备串号" min-width="160px" sortable="custom"></el-table-column>
          <el-table-column prop="businessNo" label="业务编号" min-width="160px" sortable="custom"></el-table-column>
          <el-table-column prop="bat" label="电量" min-width="90px" sortable="custom">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="String(scope.row.bat)"
                placement="right-end"
              >
                <i
                  :class="[scope.row.bat == 101 ?'icon-xs-chongdianzhong chongdian':scope.row.bat == 0 ?'icon-xs-battery-0 text-danger': scope.row.bat <= 20 ?'icon-xs-battery1 text-danger':scope.row.bat > 20 && scope.row.bat <= 50 ?'icon-xs-battery2':scope.row.bat > 50 && scope.row.bat <= 80 ?'icon-xs-battery3':scope.row.bat > 80 && scope.row.bat <= 100 ?'icon-xs-battery-4 full-electric':' ']"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="signal" label="信号强度" min-width="100px" sortable="custom">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="String(scope.row.signal)"
                placement="right-end"
              >
                <i
                  :class="[scope.row.signal <= 20 ?'icon-xs-Signal-':scope.row.signal > 20 && scope.row.signal <= 50 ?'icon-xs-Signal-2':scope.row.signal > 50 && scope.row.signal <= 80 ?'icon-xs-Signal-3':'icon-xs-Signal-1']"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="alarmType" label="报警类型" min-width="150px" sortable="custom">
            <template slot-scope="scope">
              <p>{{alarmType[scope.row.alarmType]}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="locationType" label="定位类型" min-width="140px" sortable="custom">
            <template slot-scope="scope">
              <p>{{locationType[scope.row.locationType]}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="latestAddress"
            label="最后定位地址"
            show-overflow-tooltip
            min-width="160px"
            sortable="custom"
          ></el-table-column>
          <el-table-column prop="active" label="是否激活" min-width="100px" sortable="custom">
            <template slot-scope="scope">
              <p
                :class="[{'text-danger':!scope.row.active},{'text-safe':scope.row.active}]"
              >{{scope.row.active?'已激活':'未激活'}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="deviceStatus" label="绑定状态" min-width="100px" sortable="custom">
            <template slot-scope="scope">
              <p
                :class="[{'text-danger':scope.row.deviceStatus == 3},{'text-safe':scope.row.deviceStatus == 2}]"
              >{{scope.row.deviceStatus == 1?'未绑定':scope.row.deviceStatus == 2?'已绑定':'错误'}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="onlineStatus" label="在线状态" min-width="100px" sortable="custom">
            <template slot-scope="scope">
              <p
                :class="[{'text-danger':scope.row.onlineStatus == 2},{'text-safe':scope.row.onlineStatus == 1}]"
              >{{scope.row.onlineStatus == 1?'在线':'离线'}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="locTime"
            :formatter="formatTableDate"
            label="定位时间"
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
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form ref="creatOrEditForm" :model="editForm" :rules="rules">
        <el-form-item label="设备串号" prop="serialNo">
          <el-input v-model="editForm.serialNo"></el-input>
        </el-form-item>
        <el-form-item label="SIM卡号" prop="simCardNo">
          <el-input v-model="editForm.simCardNo"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-select class="seldialogn" v-model="editForm.area">
            <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch v-model="editForm.allowConnect" active-text="允许连接"></el-switch>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNumbers">
          <el-input v-model="editForm.phoneNumbers"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="emailAddresses">
          <el-input v-model="editForm.emailAddresses"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="CreateOrUpdateDicData('creatOrEditForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="配置参数" :visible.sync="configVisible" width="800px">
      <el-form ref="ConfigForm" :model="configForm" :rules="configrules">
        <el-form-item label="应急电话1" prop="emerPhone1">
          <el-input v-model="configForm.emerPhone1"></el-input>
        </el-form-item>
        <el-form-item label="应急电话2" prop="emerPhone2">
          <el-input v-model="configForm.emerPhone2"></el-input>
        </el-form-item>
        <el-form-item label="监听电话" prop="listenPhone">
          <el-input v-model="configForm.listenPhone"></el-input>
        </el-form-item>
        <el-form-item label="最低报警电量: % (1~100)" prop="lowBatAlarm">
          <el-input v-model="configForm.lowBatAlarm"></el-input>
        </el-form-item>
        <el-form-item label="终端上传数据间隔时间: (分钟)" prop="timeInterval">
          <el-input v-model="configForm.timeInterval"></el-input>
        </el-form-item>
        <el-form-item label="语言" prop="displayLanguage">
          <el-radio v-model="configForm.displayLanguage" :label="1">英文</el-radio>
          <el-radio v-model="configForm.displayLanguage" :label="0">中文</el-radio>
        </el-form-item>
        <el-form-item label="数据发送模式" prop="dataTransferMode">
          <el-radio v-model="configForm.dataTransferMode" :label="1">socket</el-radio>
          <el-radio v-model="configForm.dataTransferMode" :label="2">sms</el-radio>
        </el-form-item>
        <el-form-item label="终端定位模式" prop="locationMode">
          <el-radio v-model="configForm.locationMode" :label="1">wifi-gps-lbs</el-radio>
          <el-radio v-model="configForm.locationMode" :label="2">gps-wifi-lbs</el-radio>
          <el-radio v-model="configForm.locationMode" :label="3">gps-lbs</el-radio>
          <el-radio v-model="configForm.locationMode" :label="4">wifi-lbs</el-radio>
          <el-radio v-model="configForm.locationMode" :label="5">lbs</el-radio>
          <el-radio v-model="configForm.locationMode" :label="6">省电模式</el-radio>
        </el-form-item>
        <el-form-item label="终端连接模式" prop="connectMode">
          <el-radio v-model="configForm.connectMode" :label="16">短连接</el-radio>
          <el-radio v-model="configForm.connectMode" :label="32">长连接</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditConfig('ConfigForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发送消息" :visible.sync="smsVisible" width="600px">
      <el-form ref="contentForm" :model="smsForm" :rules="rulesContent">
        <el-form-item label="短信内容(最多40字符)" prop="content">
          <el-input type="textarea" :rows="2" v-model="smsForm.content" maxlength="40"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="smsVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendSms('contentForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { changeDate, changeDateTime } from "@/utils/date";
import { Post, Get, Delete, Put } from "@/api/api";
export default {
  name: "deviceList",
  data() {
    return {
      path: "ws://sfapi.quickcq.com:8900",
      socket: "",
      titleT: "",
      selectRow: {},
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      addVisible: false,
      configVisible: false,
      smsVisible: false,
      smsForm: {
        content: ""
      },
      ruleForm: {
        filter: "",
        area: "",
        status: "",
        onlineStatus: "",
        sorting: "DateAdded desc",
        maxResultCount: 10,
        skipCount: 0
      },
      id: "",
      editForm: {
        area: "",
        serialNo: "",
        simCardNo: "",
        allowConnect: true,
        phoneNumbers: "",
        emailAddresses: ""
      },
      configForm: {
        serialNo: "",
        emerPhone1: "",
        emerPhone2: "",
        listenPhone: "",
        lowBatAlarm: 0,
        timeInterval: 0,
        displayLanguage: 1,
        dataTransferMode: 1,
        locationMode: 1,
        connectMode: 10
      },
      deviceStatus: [
        { value: 1, displayText: "未绑定" },
        { value: 2, displayText: "已绑定" },
        { value: 3, displayText: "错误" }
      ],
      alarmType: {
        "1": "断带报警",
        "2": "低电报警",
        "3": "断带报警,低电报警"
      },
      locationType: {
        "1": "GPS",
        "2": "基站",
        "3": "WIFI",
        "4": "CDMA基站数据",
        "5": "定位失败",
        "6": "盲区断带报警"
      },
      onLineStatus: [
        { value: 1, displayText: "在线" },
        { value: 2, displayText: "离线" }
      ],
      areas: [{ id: "", name: "" }],
      rules: {
        serialNo: [{ required: true, message: "必填", trigger: "blur" }]
      },
      rulesContent: {
        content: [{ required: true, message: "必填", trigger: "blur" }]
      },
      configrules: {
        lowBatAlarm: [{ required: true, message: "必填", trigger: "blur" }],
        timeInterval: [{ required: true, message: "必填", trigger: "blur" }],
        displayLanguage: [{ required: true, message: "请选择", trigger: "change" }],
        dataTransferMode: [{ required: true, message: "请选择", trigger: "change" }],
        locationMode: [{ required: true, message: "请选择", trigger: "change" }],
        connectMode: [{ required: true, message: "请选择", trigger: "change" }],
      },
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
  mounted() {
    // 初始化socket
    this.init();
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
    },
    smsVisible(curVal) {
      if (!curVal) {
        this.$resetForm(this.$refs["contentForm"]);
      }
    }
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
  },
  methods: {
    init: function() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open: function() {
      console.log("socket连接成功");
    },
    error: function() {
      console.log("连接错误");
    },
    getMessage: function(msg) {
      console.log(msg.data);
    },
    send: function(params) {
      console.log(params);
      this.socket.send(params);
    },
    close: function() {
      console.log("离开");
      console.log("socket已经关闭");
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
    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDateTime(row[column.property]);
      }
    },
    handleSizeChange(val) {
      this.ruleForm.maxResultCount = val;
      this.getData();
    },
    CreateOrUpdateDicData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.titleT == "添加设备") {
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
    EditConfig(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateParameters();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async updateParameters() {
      try {
        const res = await Put(`/api/device/${this.id}/parameters` , this.configForm);
        if (res) {
          this.$message.success('操作成功');
          this.configVisible = false;
          console.log(res);
        }
      } catch (e) {
        console.log(e);
      }
    },
    sendSms(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let instruction = `MSG ${this.selectRow.serialNo}#${this.smsForm.content}`;
          this.send(instruction);
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
        const res = await Post(Api.GetDeviceList, this.ruleForm);
        if (res) {
          this.tableData = res.items;
          this.totalCount = res.totalCount;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async handleConfig(title) {
      this.configVisible = true;
      try {
        const res = await Get(`/api/device/${this.id}/parameters`);
        if (res) {
          this.configForm = res;
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleActive() {
      this.$confirm("确认激活此设备？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ActiveDevice();
        })
        .catch(() => {});
    },
    handleMsg() {
      if (this.selectRow.onlineStatus == 2) {
        this.$message.warning("设备已离线");
        return;
      }
      this.smsVisible = true;
    },
    handleDevice(action, code) {
      if (this.selectRow.onlineStatus == 2) {
        this.$message.warning("设备已离线");
        return;
      }
      this.$confirm(`确认${action}此设备？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let instruction = `CTRL ${this.selectRow.serialNo}#${code}#00`;
          console.log(instruction);
        })
        .catch(() => {});
    },
    async ActiveDevice() {
      try {
        const res = await Put(Api.ActiveDevice + this.id);
        this.$message.success("激活成功");
        this.getData();
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
        const res = await Delete(Api.Device + this.id);
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
        const res = await Get(Api.Device + this.id);
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
        this.areas = res;
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
        const res = await Post(Api.CreateDevice, this.editForm);
        if (res) {
          this.$message.success("操作成功");
          this.getData();
        }
        this.addVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    async Update() {
      try {
        const res = await Put(Api.Device + this.id, this.editForm);
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
    margin-left: 10px;
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
.chongdian {
  font-size: 23px;
}
</style>
