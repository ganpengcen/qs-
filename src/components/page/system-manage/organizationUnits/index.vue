<template>
  <!--组织架构单元-->
  <div class="upper">
    <div class="title">
      <span class="big">组织架构单元</span>
      <span class="small">使用组织架构单元去管理用户和实体</span>
    </div>
    <!-- 取消默认右键事件 -->
    <el-row oncontextmenu="self.event.returnValue=false">
      <el-col :span="12">
        <el-card class="box-card box1">
          <div slot="header" class="clearfix">
            <span>组织架构树</span>
            <el-button icon="el-icon-plus" style="float: right" type="info" plain round @click="handleOrg('添加顶级单元')" v-has="'Pages.Administration.OrganizationUnits.ManageOrganizationTree'" >添加顶级单元</el-button>
          </div>
          <el-tree :data="organizationUnits" :props="defaultProps" @node-contextmenu="rightClick" default-expand-all @node-click="handleNodeClick">
            <span class="treeFont" slot-scope="{ node, data }">
              <!-- ({{data.memberCount}}) -->
              <span><i class="icon-xs-wenjian"></i>{{ node.label }}({{data.memberCount}})</span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户：{{organizationName}}({{totalCount}})</span>
            <el-button icon="el-icon-plus" style="float: right" type="info" plain round @click="findUser()" v-show="canAdd"  v-has="'Pages.Administration.OrganizationUnits.ManageMembers'">添加成员</el-button>
          </div>
          <el-table :data="data" style="width: 100%">
             <el-table-column label="操作" width="60" fixed >
              <template slot-scope="scope">
                <el-dropdown trigger="click" class="iconSize" v-has="'Pages.Administration.OrganizationUnits.ManageMembers'">
                  <span class="el-dropdown-link">
                    <i class="el-icon-menu"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column label="姓名" >
              <template slot-scope="scope">
                <p>{{scope.row.surname}}{{scope.row.name}}</p>
              </template>
            </el-table-column>       
            <el-table-column prop="addedTime" :formatter="formatTableDate" label="创建时间">
            </el-table-column>
           
          </el-table>
          <div class="pagination">
            <el-pagination @size-change="handleSizeChange" :current-page.sync="cur_page" :page-sizes="[10,25,50,100,250,300]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 右键菜单 -->
    <el-card id="hr-OMS-contextmenu" v-show='isShow' @click.native='isShow=false' class="hr-OMS-contextmenu">
      <div class="text item" @click="editOrg()" v-has="'Pages.Administration.OrganizationUnits.ManageOrganizationTree'">修改</div>
      <div class="text item" @click="handleOrg('添加组织架构单元')"  v-has="'Pages.Administration.OrganizationUnits.ManageOrganizationTree'">添加子类</div>
      <div class="text item" @click="findUser()" v-has="'Pages.Administration.OrganizationUnits.ManageMembers'" >添加成员</div>
      <div class="text item" @click="handleDeleteOrg()"  v-has="'Pages.Administration.OrganizationUnits.ManageOrganizationTree'">删除</div>
    </el-card>
    <!--添加 -->
    <el-dialog :title="dialogTitle" :visible.sync="addVisible" width="35%">
      <el-form ref="addTree" :model="orgChForm" :rules="rules">
        <el-form-item label="名字" prop="displayName">
          <el-input v-model="orgChForm.displayName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTree('addTree')">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" width="35%">
      <el-form ref="editree" :model="updateOrgForm" :rules="rules">
        <el-form-item label="名字" prop="displayName">
          <el-input v-model="updateOrgForm.displayName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrganizationUnit('editree')">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加成员 -->
    <el-dialog title="添加成员" :visible.sync="createVisible" width="800px">
      <el-form label-width="90px" ref="Verify">
        <el-input v-model="findUserForm.filter" placeholder="筛选关键词" class="handle-input" @keyup.enter.native="findUser"></el-input>
        <el-button type="primary" icon="search" @click="findUser()">搜索</el-button>
      </el-form>
      <el-table :data="user" tooltip-effect="dark" style="width: 100%" @cell-click="cellClick">
        <el-table-column prop="name" label="姓名">
        </el-table-column>
      </el-table>
     <div class="pagination">
            <el-pagination @size-change="handleSizeChange1" :current-page.sync="cur_page1" :page-sizes="[10,25,50,100,250,300]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount1">
            </el-pagination>
          </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/kites/api";
import { Post,PostNoData } from "@/api/api";
import { changeDate } from "@/utils/date";
export default {
  name: "organizationUnits",
  data() {
    return {
      canAdd:false,
      totalCount: 0,
      totalCount1: 0,//添加成员
      cur_page:1,
      cur_page1:1,
      treeId: null,
      memberCount: [], //人数
      classP: false, //控制指针class
      displayName: "",
      dialogTitle: "",
      editTitle: "",
      organizationUnits: [],
      organizationName: "",
      tableData: [],
      userData: [],
      defaultProps: {
        children: "children",
        label: "displayName"
      },
      userForm: {
        id: 0,
        sorting: "",
        maxResultCount: 10,
        skipCount: 0
      },
      // 修改组织架构树
      updateOrgForm: {
        id: 0,
        displayName: ""
      },
      // 子类
      orgChForm: {
        parentId: "",
        displayName: ""
      },
      // 查询成员用于添加
      findUserForm: {
        filter: "",
        maxResultCount: 10,
        skipCount: 0
      },
      // 添加成员
      adduserForm: {
        organizationUnitId: "",
        userId: ""
      },
      // 移除成员
      removeUserFrom: {
        organizationUnitId: "",
        userId: null
      },
      isShow: false,
      editVisible: false,
      createVisible: false,
      addVisible:false,
      rules: {
        displayName: [{ required: true, message: "必填", trigger: "blur" }]
      }
    };
  },
  components: {},
  created() {
    // this.getOrganization();
  },
  updated() {},
  computed: {
    data() {
      return this.tableData;
    },
    user() {
      return this.userData;
    }
  },
  watch: {
    cur_page(curVal, oldVal) {
      this.cur_page = curVal; //页数
      this.getOrganizationUnitUsers();
    },
    cur_page1(curVal, oldVal) {
      this.cur_page1 = curVal; //页数
      this.findUser();
    },
     editVisible(curVal) {
      if (!curVal) {
        this.$resetForm(this.$refs["editree"]);
      }
    },
    addVisible(curVal) {
      if (!curVal) {
        this.$resetForm(this.$refs["addTree"]);
      }
    },
    createVisible(curVal) {
      if (!curVal) {
        this.findUserForm.filter = "";
      }
    },
  },
  methods: {
    handleSizeChange(val) {
      this.userForm.maxResultCount = val;
      this.getOrganizationUnitUsers();
    },
    handleSizeChange1(val) {
      this.findUserForm.maxResultCount = val;
      this.findUser();
    },
       // 清空表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    // 删除树节点
    async deleteOrganizationUnit() {
      let url = "/api/services/app/organizationUnit/DeleteOrganizationUnit"
      try {
        const res = await Post(url,{ id: this.treeId });
        if (res.success) {
          this.$message.success("删除成功");
          this.getOrganization();
        }
      } catch (e) {
        console.log(e);
      }
    },
      handleDeleteOrg() {
      this.$confirm("确认删除节点'"+this.displayName+"'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteOrganizationUnit();
        })
        .catch(() => {
        
        });
    },

    // 删除表格内用户
    async deleteUser() {
      let url = "/api/services/app/organizationUnit/RemoveUserFromOrganizationUnit"
      try {
        const res = await Post(url,this.removeUserFrom);
        if (res.success) {
          this.$message.success("删除成功");
          this.getOrganization();
          this.getOrganizationUnitUsers();
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleDelete(index, row) {
      this.removeUserFrom.userId = row.id;
      this.$confirm("确认删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteUser();
        })
        .catch(() => {
        
        });
    },
    // 点击添加人员
    async cellClick(row) {
      try {
        this.adduserForm.userId = row.value;
        this.adduserForm.organizationUnitId = this.treeId;
        let url = "/api/services/app/organizationUnit/IsInOrganizationUnit"
        const res = await Post(url,this.adduserForm);
        if (res.success) {
          if (res.result) {
            this.$message.warning("该用户已存在");
            this.createVisible = false;
          } else {
            let url = "/api/services/app/organizationUnit/AddUserToOrganizationUnit"
            const res = await Post(url,this.adduserForm);
            if (res.success) {
              this.$message.success("添加成功");
              this.getOrganization();
              this.getOrganizationUnitUsers();
              this.createVisible = false;
            }
          }
        }
      } catch (e) {
        console.log(e);
        this.$message.error("请选择组织架构");
      }
    },
      editOrg() {
      this.editTitle = "修改：" + this.displayName;
      this.updateOrgForm.displayName = this.displayName;
      this.editVisible = true;
    },
    handleOrg(title) {
      this.dialogTitle = title;
      this.addVisible = true;
    },
    //  查找人员
    async findUser() {
       this.findUserForm.skipCount = (this.cur_page1 - 1) * this.findUserForm.maxResultCount;
       let url = "/api/services/app/commonLookup/FindUsers"
      try {
        this.createVisible = true;
        if (this.findUserForm.organizationUnitId==null) {
          this.findUserForm.organizationUnitId=this.treeId;
        }
        const res = await Post(url,this.findUserForm);
        if (res.success) {
          this.userData = res.result.items;
           this.totalCount1 = res.result.totalCount;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //   获取组织架构
    async getOrganization() {
      try {
        const res = await PostNoData(Api.GetOrganizationUnitTree);
        if (res.success) {
          this.organizationUnits = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //   获取组织下的人员
    async getOrganizationUnitUsers() {
       this.userForm.skipCount = (this.cur_page - 1) * this.userForm.maxResultCount;
      try {
        const res = await Post(Api.GetOrganizationUnitUsers,this.userForm);
        if (res.success) {
          this.tableData = res.result.items;
          this.totalCount = res.result.totalCount;
        }
      } catch (e) {
        console.log(e);
      }
    },
     //   添加树
    createTree(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogTitle == "添加组织架构单元") {
            this.orgChForm.parentId = this.treeId;
          } else {
            this.orgChForm.parentId = "";
          }
          this.CreateOrganizationUnit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //   添加树节点
    async CreateOrganizationUnit() {
      try {
        const res = await Post(Api.CreateOrganizationUnit, this.orgChForm);
        if (res.success) {
          this.getOrganization();
          this.addVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
     // 修改树
    editOrganizationUnit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateOrgForm.id = this.treeId;
          this.UpdateOrganizationUnit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async UpdateOrganizationUnit() {
      try {
        const res = await Post(Api.UpdateOrganizationUnit, this.updateOrgForm);
        if (res.success) {
          this.getOrganization();
          this.editVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 点击树节点
    handleNodeClick(data) {
     this.treeId = data.id;
      this.isShow = false;
      this.canAdd = true;
      this.organizationName = data.displayName;
      this.userForm.id = data.id;
      this.removeUserFrom.organizationUnitId = data.id;
      this.getOrganizationUnitUsers();
    },

     formatTableDate(row, column) {
       if(row[column.property]!==null){
        return changeDate(row[column.property]);
       }
     },
    // tree右键事件
    rightClick(event, object, value, element) {
      this.treeId = object.id;
      this.displayName = object.displayName;  
        this.isShow = true;
        let menu = document.querySelector("#hr-OMS-contextmenu");
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = "250px";
        if(document.body.clientHeight - event.clientY <150 ){
         menu.style.top = event.clientY - 144 + "px";
      }else{
        menu.style.top = event.clientY + 10 + "px";
      }   
      
    }

  }
};
</script>


<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  padding: "0px";
}
.box1 {
  margin-right: 20px;
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
  .small{
    line-height: 30px;
    font-size: 13px;
    color: #666;
    float: left;
  }
  .btn{
    float: right;
  }
}


.handle-input {
  width: 300px;
  display: inline-block;
}
.hr-OMS-contextmenu {
  position: fixed;
  .el-card__body {
    padding: 0;
  }
  .item {
    margin-bottom: 0;
  }
  .text.item {
    width: 110px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    color: #666666;
  }
  .text.item:hover {
    background-color: #f4f4f5;
  }
}
</style>
