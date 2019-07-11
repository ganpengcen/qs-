<template>
  <div>
    <div class="title">
      <span class="big">角色</span>
      <span class="small">使用角色进行权限分组.</span>
    </div>
    <!--表格-->
    <div class="container">
      <el-button type="primary" icon="el-icon-edit" class="new" @click="handleCreate('添加角色')" v-has="'Pages.Administration.Roles.Create'">添加角色</el-button>
      <div class="handle-box">
        <el-select class="select" clearable  v-model="ruleForm.permission" @change="getData()" placeholder="根据权限筛选">
          <el-option v-for="item in permissionList" :key="item.value" :label="item.displayName" :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="tableThCol">
        <el-table :data="data" border style="width: 100%" ref="multipleTable">
          <el-table-column label="操作" width="50" fixed>
            <template slot-scope="scope">
              <el-dropdown trigger="click" class="iconSize">
                <span class="el-dropdown-link">
                  <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-has="'Pages.Administration.Roles.Edit'">
                    <p @click="getEdit(scope.$index, scope.row,'修改角色')" >修改</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="!scope.row.isStatic"  v-has="'Pages.Administration.Roles.Delete'">
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column label="角色名称">
            <template slot-scope="scope">
              <span class="fontS">{{scope.row.displayName}}</span>
              <el-tooltip v-if="scope.row.isStatic" class="itemB" effect="dark" content="不能删除系统角色." placement="top">
                <el-button>系统</el-button>
              </el-tooltip>
              <el-tooltip v-if="scope.row.isDefault" class="itemB itemB1" effect="dark" content="新用户将默认拥有此角色." placement="top">
                <el-button>默认</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" :formatter="formatTableDate" label="创建时间">
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :title="dialogTitle" :visible.sync="editOrCreateVisible" width="600px" @close="resetForm('editOrCreateForm')">
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色属性" name="first">
            <el-form :model="editForm.role" :rules="rules" ref="editOrCreateForm">
              <el-form-item label="角色名称" prop="displayName">
                <el-input v-model="editForm.role.displayName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-switch v-model="editForm.role.isDefault" active-text="默认"></el-switch>
                <p>新用户将默认拥有此角色.</p>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="权限" name="second">
            <el-form>
              <el-tree :data="editForm.permissions" check-strictly ref="tree" node-key="name" :props="defaultProps" default-expand-all show-checkbox>
              </el-tree>
              <!-- <el-tree :data="editForm.permissions" check-strictly ref="tree" node-key="name" :props="defaultProps" default-expand-all show-checkbox>
                <span class="treeFont" slot-scope="{ node, data }">
                  ({{data.name}})
                  <span>{{ node.label }}</span>
                </span>
              </el-tree> -->
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelForm('editOrCreateForm')">取 消</el-button>
          <el-button type="primary" @click="creatOrEdit('editOrCreateForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Post, PostNoData } from "@/api/api";
import { changeDate } from "@/utils/date";
export default {
  name: "roles",
  data() {
    return {
      key: "",
      dialogTitle: "",
      editInfo: {},
      editForm: {
        role: {
          id: null,
          displayName: null,
          isDefault: false
        },
        grantedPermissionNames: [],
        permissions: []
      },
      activeName: "first",
      id: "",
      roleList: [], //角色
      permissionList: [],
      tableData: [],
      ruleForm: {
        permission: ""
      },
      defaultProps: {
        children: "child",
        label: "displayName"
      },
      editOrCreateVisible: false,
      rules: {
        displayName: [{ required: true, message: "必填", trigger: "change" }]
      }
    };
  },
  watch: {},
  components: {},
  created() {
    this.getData();
    this.getAllPermissions();
  },
  computed: {
    data() {
      return this.tableData;
    }
  },
  methods: {
    // 提交表单
    creatOrEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let form = {};
          form.role = this.editForm.role;
          form.grantedPermissionNames = this.$refs.tree.getCheckedKeys();
          this.createOrUpdateRole(form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 更新角色
    async createOrUpdateRole(form) {
      let url = "/api/services/app/role/CreateOrUpdateRole";
      try {
        const res = await Post(url, form);
        if (res.success) {
          this.getData();
          this.editOrCreateVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 获取角色编辑信息
    async getRoleForEdit() {
      let url = "/api/services/app/role/GetRoleForEditEx";
      try {
        const res = await Post(url, { id: this.id });
        if (res.success) {
          this.editForm = res.result;
          this.$refs.tree.setCheckedKeys(this.editForm.grantedPermissionNames);
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
    // 点击删除
    handleDelete(index, row) {
      this.id = row.id;
      this.$confirm("是否确认删除角色 " + row.displayName + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteRole();
        })
        .catch(() => {});
    },
    // 删除
    async deleteRole() {
      let url = "/api/services/app/role/DeleteRole";
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
      this.dialogTitle = title;
      this.id = row.id;
      this.editOrCreateVisible = true;
      this.getRoleForEdit();
    },
    handleCreate(title) {
      this.dialogTitle = title;
      this.id = "";
      this.editOrCreateVisible = true;
      this.getRoleForEdit();
    },
    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDate(row[column.property]);
      }
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val; //页数
      this.getData();
    },
    // 获取列表数据
    async getData() {
      let url = "/api/services/app/role/GetRoles";
      try {
        const res = await Post(url, this.ruleForm);
        if (res.success) {
          this.tableData = res.result.items;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
<style>
.el-button + .el-tooltip {
  margin-left: 0;
}
.handle-box {
  margin-bottom: 20px;
}
</style>

<style scoped lang="less">
.itemB {
  margin-left: 4px;
  padding: 4px 6px;
  background: #659be0;
  color: #fff;
  font-weight: bolder;
}
.itemB1 {
  background: #bac3d0;
}
.fontS {
  font-size: 15px;
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
.container {
  position: relative;
  .new {
    position: absolute;
    top: 10px;
    right: 10px;
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
    margin-right: 34%;
  }
}

.collapse {
  border: 0;
}
</style>
