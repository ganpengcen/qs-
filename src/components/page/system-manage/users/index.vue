<template>
  <div>
    <div class="title">
      <span class="big">用户</span>
      <span class="small">管理用户及权限.</span>
      <el-button type="primary" icon="el-icon-edit" class="btn" @click="handleCreate('添加用户')" v-has="'Pages.Administration.Users.Create'">添加用户</el-button>
      <!-- 导入excel组件 -->
      <excel class="btn" :url='Users' :form='{}' :source="'导出到Excel'"></excel>
    </div>
    <!--表格-->
    <div class="container">
      <div class="handle-box">
        <el-input v-model="ruleForm.filter" placeholder="筛选关键词" class="handle-input" @keyup.enter.native="getData"></el-input>
        <el-button type="primary" @click="getData()">搜索</el-button>
      </div>
      <el-collapse class="collapse">
        <el-collapse-item title="显示高级过滤">
          <div class="form-box">
            <el-select class="select" clearable v-model="ruleForm.permission" @change="getData()" placeholder="根据权限筛选">
              <el-option v-for="item in permissionList" :key="item.value" :label="item.displayName" :value="item.name">
              </el-option>
            </el-select>
            <el-select class="select" clearable v-model="ruleForm.role" @change="getData()" placeholder="根据角色筛选">
              <el-option v-for="item in roleList" :key="item.value" :label="item.displayText" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="tableThCol">
        <el-table :data="data" border stripe style="width: 100%" ref="multipleTable" @sort-change='sortChange'>
          <el-table-column label="操作" width="50" fixed>
            <template slot-scope="scope">
              <el-dropdown trigger="click" class="iconSize">
                <span class="el-dropdown-link">
                  <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-has="'Pages.Administration.Users.Edit'">
                    <p @click="getEdit(scope.$index, scope.row,'修改用户 - ')">修改</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="addPic(scope.row.id)">照片</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-has="'Pages.Administration.Users.ChangePermissions'">
                    <p @click="getPermission(scope.$index, scope.row,'权限 - ')">权限</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-has="'Pages.Administration.Users.Delete'">
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="用户名" sortable='custom' width="150">
          </el-table-column>
          <el-table-column prop="name" label="名字" sortable='custom' width="150">
          </el-table-column>
          <el-table-column prop="regionId" label="所属区域" sortable='custom' width="100">
          </el-table-column>
          <el-table-column label="角色">
            <template slot-scope="scope">
              <span v-for="(role,index) in scope.row.roles" :key="index">{{role.roleName}}，</span>
            </template>
          </el-table-column>
          <el-table-column prop="emailAddress" sortable='custom' label="邮箱地址">
          </el-table-column>
          <el-table-column prop="isEmailConfirmed" :formatter="judgeEmail" sortable='custom' label="邮箱地址验认" width="130">
          </el-table-column>
          <el-table-column prop="isActive" :formatter="judgeActive" label="激活" sortable='custom' width="80">
          </el-table-column>
          <el-table-column prop="lastLoginTime" :formatter="formatTableDate" sortable='custom' label="上次登录时间">
          </el-table-column>
          <el-table-column prop="creationTime" :formatter="formatTableDate" sortable='custom' label="创建时间">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" :current-page.sync="cur_page" :page-sizes="[10,25,50,100,250,300]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
      <el-dialog :title="dialogTitle" :visible.sync="editOrCreateVisible" width="600px" @close="resetForm('editOrCreateForm')">
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户信息" name="first">
            <el-form :model="editForm.user" :rules="rules" ref="editOrCreateForm">
              <div class="headl">
                <el-form-item class="itemL">
                  <img src="static/img/head.png" class="user-avator" alt="">
                </el-form-item>
                <el-form-item label="名字" class="itemR" prop="name">
                  <el-input v-model="editForm.user.name"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="邮箱地址" prop="emailAddress">
                <el-input v-model="editForm.user.emailAddress"></el-input>
              </el-form-item>
              <el-form-item label="电话号码" prop="phoneNumber">
                <el-input v-model="editForm.user.phoneNumber"></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="editForm.user.userName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="editForm.user.password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码（核对）" prop="passwordRepeat">
                <el-input type="password" v-model="editForm.user.passwordRepeat" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-select class="seldialog userType" v-model="editForm.user.userType" placeholder="用户类型">
                  <el-option v-for="item in usersType" :key="item.key" :label="item.value" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" v-if="editForm.user.userType == 1">
                <el-select class="seldialog" multiple v-model="editForm.user.skillType" placeholder="选择擅长领域">
                  <el-option v-for="item in skills" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select class="seldialog" v-model="editForm.user.regionId" placeholder="选择区域">
                  <el-option v-for="item in districts" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="角色" name="second">
            <el-form>
              <el-form-item v-for="(item,index) in editInfo.roles" :key="index">
                <el-switch v-model="item.isAssigned" :active-text="item.roleDisplayName"></el-switch>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelForm('editOrCreateForm')">取 消</el-button>
          <el-button type="primary" @click="creatOrEdit('editOrCreateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="dialogTitle1" :visible.sync="permissionVisible" width="600px">
        <el-form>
          <el-tree :data="UpdatePForm.permissions" check-strictly ref="tree" node-key="name" :props="defaultProps" default-expand-all show-checkbox>
          </el-tree>
          <!-- <el-tree :data="UpdatePForm.permissions" check-strictly ref="tree" node-key="name" :props="defaultProps" default-expand-all show-checkbox>
            <span class="treeFont" slot-scope="{ node, data }">
              ({{data.name}})
              <span>{{ node.label }}</span>
            </span>
          </el-tree> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-tooltip effect="dark" content="重置用户权限后，用户仅拥有所属角色包含的权限，为用户直接指定的权限将取消." placement="top">
            <el-button class="resetBtn" @click="resetUserSpecificPermissions()">重置直接指定权限</el-button>
          </el-tooltip>
          <el-button @click="permissionVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUserPermissions()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改头像" :visible.sync="picVisible" width="600px">
        <el-form>
          <el-form-item>
            <div class="file-box">
              <input type="file" accept="image/*" @change='onUpload($event,"/Profile/UploadAvatar")' ref="fileArticle">
            </div>
            <p>只能选择3mb内的JPG/JPEG/PNG图片作为封面.</p>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="picVisible = false">取 消</el-button>
          <el-button type="primary" @click="UpdateAvatar">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { Post, PostNoData, Postfile } from "@/api/api";
import excel from "@/components/common/excel";
import { changeDate } from "@/utils/date";
export default {
  name: "users",
  data() {
    var validatePass = (rule, value, callback) => {
      let password = this.editForm.user.password;
      if (value === "" || value == null || password == undefined) {
        callback();
      } else if (value.length < 6) {
        callback(new Error("最少要输入6个字符"));
      } else {
        if (this.editForm.user.passwordRepeat !== "") {
          this.$refs.editOrCreateForm.validateField("passwordRepeat");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      let password = this.editForm.user.password;
      if (password == null || password == "" || password == undefined) {
        if (value !== this.editForm.user.password && value) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      } else {
        if (value !== this.editForm.user.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      }
    };
    return {
      dialogTitle: "", //新建或修改
      dialogTitle1: "", //权限
      Users:Api.GetUsersToExcel,
      editInfo: {},
      editForm: {
        user: {
          id: null,
          name: null,
          // surname: null,
          userName: null,
          emailAddress: null,
          phoneNumber: null,
          passwordRepeat: null,
          password: null,
          // isActive: true,
          shouldChangePasswordOnNextLogin: false,
          isTwoFactorEnabled: false,
          userType: "",
          regionId: "", //区域
          skillType: []
          // isLockoutEnabled: true
        },
        assignedRoleNames: [],
        // sendActivationEmail: null,
        // setRandomPassword: null
        // isAddByAdmin: true
      },
      // 更新用户权限
      UpdatePForm: {
        grantedPermissionNames: [],
        permissions: []
      },
      activeName: "first",
      id: "",
      roleList: [], //角色
      permissionList: [],
      tableData: [],
      cur_page: 1,
      totalCount: 0,
      ruleForm: {
        filter: "",
        permission: "",
        role: "",
        sorting: "",
        maxResultCount: 10,
        skipCount: 0
      },
      permissionVisible: false,
      editOrCreateVisible: false,
      picVisible: false,
      defaultProps: {
        children: "children",
        label: "displayName"
      },
      districts: [], //区域
      usersType: [],
      skills: [],
      avatarForm: {
        id: "",
        fileName: ""
      },
      rules: {
        name: [{ required: true, message: "必填", trigger: "change" }],
        emailAddress: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        userName: [
          { required: true, message: "请填写用户名", trigger: "change" }
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        passwordRepeat: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  watch: {
    cur_page(curVal, oldVal) {
      this.cur_page = curVal; //页数
      this.getData();
    },
    editOrCreateVisible(curVal) {
      if (!curVal) {
        this.activeName = "first";
      }
    }
  },
  components: {
    excel
  },
  created() {
    this.getData();
    this.getAllPermissions();
    this.getRoleCombobox();
    this.GetDistricts();
    this.GetUsersType();
    this.getSkills();
  },
  computed: {
    data() {
      return this.tableData;
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
    // 提交表单
    creatOrEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createOrUpdateUser();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addPic(id) {
      this.avatarForm.id = id;
      this.picVisible = true;
    },
    async onUpload(event, url) {
      let fileData = event.target.files[0];
      const isJPG = fileData.type === "image/jpeg";
      const isJPEG = fileData.type === "image/JPEG";
      const isPNG = fileData.type === "image/png";
      const isLt2M = fileData.size / 1024 / 1024 < 3;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传图片必须是JPG/JPEG/PNG 格式!");
        this.$refs.file.value = "";
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 3MB!");
        this.$refs.file.value = "";
        return false;
      }
      let param = new FormData(); // 创建form对象
      param.append("file", fileData);
      try {
        const res = await Postfile(url, param);
        if (res.success) {
          this.avatarForm.fileName = res.result.fileName;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 上传照片
    async UpdateAvatar() {
      let url = "/api/services/app/profile/UpdateAvatar";
      try {
        const res = await Post(url, this.avatarForm);
        if (res.success) {
          this.$message.success("操作成功");
          this.getData();
          this.picVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 更新用户权限
    async updateUserPermissions() {
      let form = {};
      form.id = this.id;
      form.grantedPermissionNames = this.$refs.tree.getCheckedKeys();
      let url = "/api/services/app/user/UpdateUserPermissions";
      try {
        const res = await Post(url, form);
        if (res.success) {
          this.$message.success("操作成功");
          this.getData();
          this.permissionVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 重置直接指定权限
    async resetUserSpecificPermissions() {
      let form = { id: this.id };
      let url = "/api/services/app/user/ResetUserSpecificPermissions";
      try {
        const res = await Post(url, form);
        if (res.success) {
          this.$message.success("重置成功");
          this.permissionVisible = false;
          this.getUserPermissionsForEdit();
          this.permissionVisible = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async createOrUpdateUser() {
      let arr = [];
      for (let i in this.editInfo.roles) {
        if (this.editInfo.roles[i].isAssigned) {
          arr.push(this.editInfo.roles[i].roleName);
        }
      }
      this.editForm.assignedRoleNames = arr;
      this.editForm.user.skillType = this.editForm.user.skillType.join();
      let url = "/api/services/app/user/CreateOrUpdateUser";
      try {
        const res = await Post(url, this.editForm);
        if (res.success) {
          this.getData();
          this.editOrCreateVisible = false;
        }
      } catch (e) {
        this.editForm.user.skillType = this.editForm.user.skillType.split(',');
        this.$message.error(e.data.error.message);
      }
    },
    // 点击删除
    handleDelete(index, row) {
      this.id = row.id;
      this.$confirm("是否确认删除用户 " + row.name + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteCase();
        })
        .catch(() => {});
    },
    // 删除
    async deleteCase() {
      let url = "/api/services/app/user/DeleteUser";
      try {
        const res = await Post(url, { id: this.id });
        if (res.success == true) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getData();
        } else {
          this.$message.error("删除失败");
        }
      } catch (e) {
        console.log(e);
      }
    },
    cancelForm(formName) {
      this.resetForm(formName);
      this.editOrCreateVisible = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getEdit(index, row, title) {
      this.dialogTitle = title + row.userName;
      this.id = row.id;
      this.editOrCreateVisible = true;
      this.getUserForEdit("edit");
    },
    // 点击权限
    getPermission(index, row, title) {
      this.dialogTitle1 = title + row.userName;
      this.id = row.id;
      this.permissionVisible = true;
      this.getUserPermissionsForEdit();
    },
    handleCreate(title) {
      this.dialogTitle = title;
      this.id = "";
      this.editOrCreateVisible = true;
      this.getUserForEdit("creat");
    },
    // 处理表格内的布尔值
    judgeEmail(data) {
      return data.isEmailConfirmed ? "是" : "否";
    },
    judgeActive(data) {
      return data.isActive ? "是" : "否";
    },
    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDate(row[column.property]);
      }
    },
    // 获取列表数据
    async getData() {
      this.ruleForm.skipCount =
        (this.cur_page - 1) * this.ruleForm.maxResultCount;
      this.ruleForm.filter = this.ruleForm.filter.trim();    
      let url = "/api/services/app/user/GetUsers";
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

    // 获取角色 （select)
    async getRoleCombobox() {
      let url = "/api/services/app/role/GetRoleCombobox";
      try {
        const res = await Post(url, { id: 0 });
        if (res.success) {
          this.roleList = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 获取用户权限列表
    async getUserPermissionsForEdit() {
      let url = "/api/services/app/user/GetUserPermissionsForEdit";
      try {
        const res = await Post(url, { id: this.id });
        if (res.success) {
          this.UpdatePForm = res.result;
          this.UpdatePForm.permissions = this.getTrees(
            this.UpdatePForm.permissions,
            null
          );
          this.$refs.tree.setCheckedKeys(
            this.UpdatePForm.grantedPermissionNames
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取用户编辑信息
    async getUserForEdit(param) {
      let url = "/api/services/app/user/GetUserForEdit";
      try {
        const res = await Post(url, { id: this.id });
        if (res.success) {
          this.editInfo = res.result;
          this.editForm.user = res.result.user;
          if (this.editForm.user.skillType) {
            let strs = new Array();
            strs = this.editForm.user.skillType.split(",");
            this.editForm.user.skillType = strs;
          }else{
            this.editForm.user.skillType = []
          }
          let arr = [];
          for (let i = 0; i < this.editInfo.roles.length; i++) {
            if (this.editInfo.roles[i].isAssigned) {
              arr.push(this.editInfo.roles[i].roleName);
            }
          }
          this.editForm.assignedRoleNames = arr;
          if (param == "creat") {
             this.editForm.user.skillType = []
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取区域列表
    async GetDistricts() {
      try {
        const res = await Post(Api.GetDistricts, {});
        if (res.success) {
          this.districts = res.result.items;
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 获取用户类别
    async GetUsersType() {
      try {
        const res = await Post(Api.GetUsersType, {});
        if (res.success) {
          this.usersType = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 获取删除领域
    async getSkills() {
      try {
        const res = await Post(Api.GetSelectionDatasByType, { type: 5 });
        if (res.success) {
          this.skills = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取用户权限列表
    async getAllPermissions() {
      let url = "/api/services/app/permission/GetAllPermissions";
      try {
        const res = await PostNoData(url);
        if (res.success) {
          this.permissionList = res.result.items;
          // 处理带横线的选项
          for (var i in this.permissionList) {
            var line = "";
            for (var j = 0; j < this.permissionList[i].level; j++) {
              line += "--";
            }
            var oldName = this.permissionList[i].displayName;
            this.permissionList[i].displayName = line + oldName;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    getTrees(list, parentId) {
      let items = {};
      // 获取每个节点的直属子节点
      for (let i = 0; i < list.length; i++) {
        let key = list[i].parentName;
        if (items[key]) {
          items[key].push(list[i]);
        } else {
          items[key] = [];
          items[key].push(list[i]);
        }
      }
      return this.formatTree(items, parentId);
    },

    /**
     * 利用递归格式化每个节点
     */
    formatTree(items, parentId) {
      let result = [];
      if (!items[parentId]) {
        return result;
      }
      for (let t in items[parentId]) {
        items[parentId][t].children = this.formatTree(
          items,
          items[parentId][t].name
        );
        result.push(items[parentId][t]);
      }
      return result;
    }
  }
};
</script>


<style scoped lang="less">
.xs-psw {
  padding-bottom: 10px;
}
.resetBtn {
  margin-right: 50%;
}
.headl {
  margin-top: 10px;
  overflow: hidden;
  .itemL {
    float: left;
    width: 30%;
    padding: 20px 0 0 20px;
  }
  .itemR {
    float: left;
  }
}
.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.handle-input {
  width: 300px;
  display: inline-block;
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
    margin-left: 8px;
  }
}
.handle-box {
  margin-bottom: 10px;
}
.userType {
  margin-top: 10px;
}
</style>
