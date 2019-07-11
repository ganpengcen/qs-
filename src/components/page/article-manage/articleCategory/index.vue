<template>
  <!--文章分类 -->
  <div class="upper">
    <div class="title">
      <span class="big">文章分类</span>
      <span class="small">通过文章分类来管理各个菜单模块</span>
    </div>
    <!-- 取消默认右键事件 -->
    <el-row oncontextmenu="self.event.returnValue=false">
      <el-col :span="12">
        <el-card class="box-card box1">
          <div slot="header" class="clearfix">
            <span>文章分类树</span>
            <el-button icon="el-icon-plus" style="float: right" type="info" plain round @click="handleOrg('添加顶级单元')" v-has="'Pages.Article.Category.ManageTree'">添加顶级单元</el-button>
          </div>
          <el-tree :data="organizationUnits" :props="defaultProps" @node-contextmenu="rightClick" default-expand-all @node-click="handleNodeClick">
            <span class="treeFont" slot-scope="{ node, data }">
              <!-- ({{data.memberCount}}) -->
              <span>
                <i class="icon-xs-wenjian"></i>{{ node.label }}({{data.memberCount}})</span>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>管理员：{{organizationName}}({{totalCount}})</span>
            <el-button icon="el-icon-plus" style="float: right" type="info" plain round @click="findUser()" v-show="canAdd" v-has="'Pages.Article.Category.ManageMembers'">添加管理员</el-button>
          </div>
          <el-table :data="data" style="width: 100%">
            <el-table-column label="操作" width="60" fixed>
              <template slot-scope="scope">
                <el-dropdown trigger="click" class="iconSize" v-has="'Pages.Article.Category.ManageMembers'">
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
            <el-table-column label="姓名">
              <template slot-scope="scope">
                <p>{{scope.row.surname}}{{scope.row.name}}</p>
              </template>
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
      <div class="text item" @click="handleOrg('修改')" v-has="'Pages.Article.Category.ManageTree'">修改</div>
      <div class="text item" @click="handleOrg('添加文章分类')" v-has="'Pages.Article.Category.ManageTree'">添加子类</div>
      <div class="text item" @click="findUser()" v-has="'Pages.Article.Category.ManageMembers'">添加管理员</div>
      <div class="text item" @click="createArticleVisible=true" v-has="'Pages.Article.Category.ManageTree'">新建文章</div>
      <div class="text item" @click="handleDeleteOrg()" v-has="'Pages.Article.Category.ManageTree'">删除</div>
    </el-card>

    <!--修改、添加 -->
    <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="500px">
      <el-form ref="editOrCreateForm" :model="orgChForm" :rules="rules">
        <el-form-item prop="coverThumbMiddle">
          <p class="preview" v-show="orgChForm.coverThumbMiddle">
            <img :src="orgChForm.coverThumbMiddle" alt="">
          </p>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="orgChForm.name"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="orgChForm.displayName"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="subTitle">
          <el-input v-model="orgChForm.subTitle"></el-input>
        </el-form-item>
        <el-form-item label="Url" prop="url">
          <el-input v-model="orgChForm.url"></el-input>
        </el-form-item>
        <el-form-item label="显示序号" prop="displayOrder">
          <el-input v-model="orgChForm.displayOrder"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="orgChForm.displayType" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch v-model="orgChForm.isShowNav" active-text="是否导航显示"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-switch v-model="orgChForm.topMost" active-text="是否置顶"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-switch v-model="orgChForm.isSingleArticle" active-text="单文章显示"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-switch v-model="orgChForm.isForm" active-text="是否表单"></el-switch>
        </el-form-item>
        <el-form-item>
          <div class="file-box">
            <input type="file" accept="image/*" @change='onUpload($event,"/Upload/UploadImage")' ref="file">
          </div>
          <p>只能选择3mb内的JPG/JPEG/PNG图片作为封面.</p>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="creatOrEdit('editOrCreateForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新建文章 -->
    <el-dialog title="新建文章" :visible.sync="createArticleVisible" width="1100px">
      <el-form ref="CreateForm" :model="articleForm" :rules="rulesArticle">
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="articleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="articleForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="友情链接" prop="friendlyUrl">
          <el-input v-model="articleForm.friendlyUrl"></el-input>
        </el-form-item>
        <el-form-item label="显示序号" prop="displayOrder">
          <el-input v-model="articleForm.displayOrder"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="customTime">
          <el-date-picker style="width:100%" v-model="articleForm.customTime" type="date" :picker-options="pickerOptions1" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item prop="content">
          <quill-editor ref="myTextEditor" v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item> -->

        <div>
          <UE :defaultMsg="defaultMsg" :config="config" ref="ue"></UE>
        </div>
        <el-form-item>
          <el-switch v-model="articleForm.topMost" active-text="是否置顶"></el-switch>
        </el-form-item>
        <el-form-item>
          <div class="file-box">
            <input type="file" accept="image/*" @change='onUpload($event,"/api/file/Avatar")' ref="fileArticle">
          </div>
          <p>只能选择3mb内的JPG/JPEG/PNG图片作为封面.</p>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="createArticleVisible = false">取 消</el-button>
        <el-button type="primary" @click="createArticle('CreateForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加成员 -->
    <el-dialog title="选择一个用户" :visible.sync="createVisible" width="40%">
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
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import UE from "@/components/common/ue.vue";
import getToken from "@/utils/auth";
import Api from "@/kites/api";
import { Post, PostNoData, Postfile } from "@/api/api";
import { changeDate } from "@/utils/date";
export default {
  name: "articleCategory",
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      canAdd: false,
      editorOption: {
        placeholder: "请输入"
      },
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        displayName: [{ required: true, message: "必填", trigger: "blur" }]
      },
      rulesArticle: {
        title: [{ required: true, message: "必填", trigger: "blur" }],
        customTime: [{ required: true, message: "请选择", trigger: "change" }]
      },
      articleForm: {
        categoryId: null,
        title: "",
        content: "",
        keywords: "",
        description: "",
        friendlyUrl: "",
        topMost: false,
        needLogin: true,
        cover: "",
        displayOrder: 0,
        customTime: ""
      },
      dialogImageUrl: "",
      options: [
        {
          value: 0,
          label: "普通"
        },
        {
          value: 1,
          label: "列表"
        },
        {
          value: 2,
          label: "图形"
        }
      ],
      totalCount: 0,
      totalCount1: 0,
      cur_page: 1,
      cur_page1: 1,
      treeId: null,
      memberCount: [], //人数
      classP: false, //控制指针class
      displayName: "",
      dialogTitle: "",
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
      // 子类
      orgChForm1: {
        parentId: "",
        displayName: ""
      },
      orgChForm: {
        name: "",
        displayName: "",
        subTitle: "",
        displayType: 0,
        url: "",
        parentId: 0,
        cover: "",
        displayOrder: 0,
        isShowNav: false,
        topMost: false,
        isForm: false,
        isSingleArticle: false
      },
      // 查询成员用于添加
      findUserForm: {
        id: "",
        filter: "",
        maxResultCount: 10,
        skipCount: 0
      },
      // 添加成员
      adduserForm: {
        articleCategoryId: "",
        userId: ""
      },
      // 移除成员
      removeUserFrom: {
        articleCategoryId: "",
        userId: null
      },
      isShow: false,
      editVisible: false,
      createArticleVisible: false,
      createVisible: false,

      defaultMsg: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      }
    };
  },
  components: {
    quillEditor,
    UE
  },
  created() {
    this.getCategories();
    this.articleForm.customTime = new Date();
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
      this.getCategoryUsers();
    },
    cur_page1(curVal, oldVal) {
      this.cur_page1 = curVal; //页数
      this.findUser();
    },
    editVisible(curVal) {
      if (!curVal) {
        this.$refs.file.value = "";
        this.$resetForm(this.$refs["editOrCreateForm"]);
      }
    },
    createArticleVisible(curVal) {
      if (!curVal) {      
        this.$resetForm(this.$refs["CreateForm"]);
        this.defaultMsg = " ";
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.userForm.maxResultCount = val;
      this.getCategoryUsers();
    },
    handleSizeChange1(val) {
      this.findUserForm.maxResultCount = val;
      this.findUser();
    },
    loadNode(node, resolve) {
      console.log(node);
    },

    getUEContent() {
      let content = this.$refs.ue.getUEContent();
    },

    // 上传文件
    async onUpload(event, url) {
      // let url = "/Upload/UploadImage";
      console.log(url);
      let fileData = event.target.files[0];
      console.log(fileData);
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
          if (url == "/Upload/UploadImage") {
            this.orgChForm.cover = res.result.fileName;
          } else if (url == "/api/file/Avatar") {
            this.articleForm.cover = res.result.filePath;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    //  查找人员
    async findUser() {
      this.findUserForm.skipCount =
        (this.cur_page1 - 1) * this.findUserForm.maxResultCount;
      let url = "/api/services/app/article/FindUsers";
      try {
        this.createVisible = true;
        this.findUserForm.id = this.treeId;
        const res = await Post(url, this.findUserForm);
        if (res.success) {
          this.userData = res.result.items;
          this.totalCount1 = res.result.totalCount;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除树节点
    async deleteCategory() {
      let url = "/api/services/app/article/DeleteCategory";
      try {
        const res = await Post(url, { id: this.treeId });
        if (res.success) {
          this.$message.success("删除成功");
          this.getCategories();
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleDeleteOrg() {
      this.$confirm("确认删除节点'" + this.displayName + "'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteCategory();
        })
        .catch(() => {});
    },

    // 删除表格内用户
    async deleteUser() {
      let url = "/api/services/app/article/RemoveUserFromCategory";
      try {
        const res = await Post(url, this.removeUserFrom);
        if (res.success) {
          this.$message.success("删除成功");
          this.getCategories();
          this.getCategoryUsers();
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
        .catch(() => {});
    },
    // 点击添加人员
    async cellClick(row) {
      try {
        this.adduserForm.userId = row.value;
        this.adduserForm.articleCategoryId = this.treeId;
        let url = "/api/services/app/article/IsInCategory";
        const res = await Post(url, this.adduserForm);
        if (res.success) {
          if (res.result) {
            this.$message.warning("该用户已存在");
            this.createVisible = false;
          } else {
            let url = "/api/services/app/article/AddUserToCategory";
            const res = await Post(url, this.adduserForm);
            if (res.success) {
              this.$message.success("添加成功");
              this.getCategories();
              this.getCategoryUsers();
              this.createVisible = false;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    //  点击显示审核窗口
    handleOrg(title) {
      if (title == "修改") {
        title = "修改：" + this.displayName;
        this.dialogTitle = title;
        this.GetArticleCategoryForEdit();
      } else {
        this.dialogTitle = title;
      }
      this.editVisible = true;
    },
    //  获取修改详情
    async GetArticleCategoryForEdit() {
      let url = "/api/services/app/article/GetArticleCategoryForEdit";
      try {
        const res = await Post(url, { id: this.treeId });
        if (res.success) {
          this.orgChForm = res.result;
          if (this.orgChForm.coverThumbMiddle !== null) {
            let imgurl = this.orgChForm.coverThumbMiddle.replace(
              /~/,
              this.$host
            );
            this.orgChForm.coverThumbMiddle = imgurl;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    //   获取组织架构
    async getCategories() {
      try {
        const res = await PostNoData(Api.GetCategories);
        if (res.success) {
          this.organizationUnits = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //   获取组织下的人员
    async getCategoryUsers() {
      this.userForm.skipCount =
        (this.cur_page - 1) * this.userForm.maxResultCount;
      try {
        const res = await Post(Api.GetCategoryUsers, this.userForm);
        if (res.success) {
          this.tableData = res.result.items;
          this.totalCount = res.result.totalCount;
        }
      } catch (e) {
        console.log(e);
      }
    },
    creatOrEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.UpdateCategory();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createArticle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.articleForm.content = this.$refs.ue.getUEContent();
          if (this.articleForm.content == "") {
            this.$message.warning("请编辑文章！");
            return;
          }
          console.log(this.articleForm)
          this.CreateArticle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async CreateArticle() {
      try {
        this.articleForm.categoryId = this.treeId;
        const res = await Post(Api.CreateArticle, this.articleForm);
        if (res.success) {
          this.$message.success("创建成功");
          this.createArticleVisible = false;
          this.$router.push("/article/articleList");
        }
      } catch (e) {
        console.log(e);
      }
    },

    //   修改组织架构树
    async UpdateCategory() {
      try {
        if (this.dialogTitle == "添加文章分类") {
          this.orgChForm.parentId = this.treeId;
          const res = await Post(Api.CreateArticleCategory, this.orgChForm);
          if (res.success) {
            this.getCategories();
            this.editVisible = false;
          }
        } else if (this.dialogTitle == "添加顶级单元") {
          this.orgChForm.parentId = "";
          const res = await Post(Api.CreateArticleCategory, this.orgChForm);
          if (res.success) {
            this.getCategories();
            this.editVisible = false;
          }
        } else {
          this.$set(this.orgChForm, "id", this.treeId);
          const res = await Post(Api.UpdateArticleCategory, this.orgChForm);
          if (res.success) {
            this.$delete(this.orgChForm, "id");
            this.getCategories();
            this.editVisible = false;
          }
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
      this.removeUserFrom.articleCategoryId = data.id;
      this.getCategoryUsers();
    },

    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDate(row[column.property]);
      }
    },
    // tree右键事件
    rightClick(event, object, value, element) {
      this.treeId = object.id;
      this.displayName = object.displayName;
      this.isShow = true;
      this.userForm.id = object.id;
      this.removeUserFrom.articleCategoryId = object.id;
      let menu = document.querySelector("#hr-OMS-contextmenu");
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = "250px";
      if (document.body.clientHeight - event.clientY < 160) {
        menu.style.top = event.clientY - 190 + "px";
      } else {
        menu.style.top = event.clientY + 10 + "px";
      }
    }
  }
};
</script>

<style>
</style>
<style lang="less" >
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
.preview {
  width: 150px;
  margin: 0 auto;
  border: 1px solid rgb(201, 201, 201);
  border-radius: 5px;
  img {
    width: 100%;
  }
}
</style>
