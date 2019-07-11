<template>
  <div>
    <div class="title">
      <span class="big">文章列表</span>
      <span class="small">管理文章数据</span>
      <el-button type="primary" class="btn" icon="el-icon-edit" @click="handleAdd('新建文章')" v-has="'Pages.Article.Create'">新建文章</el-button>
    </div>
    <!--表格-->
    <div class="container">
      <div class="handle-box">
        <el-input v-model="formData.filter" placeholder="筛选关键词" class="handle-input" @keyup.enter.native="getData"></el-input>
        <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
      </div>
      <el-collapse class="collapse">
        <el-collapse-item title="显示高级过滤">
          <div>
            <el-select style="width:400px" clearable v-model="formData.articleCategoryId" @change="getData()" placeholder="根据分类搜索">
              <el-option v-for="item in categorieList" :key="item.id" :label="item.fullName" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="tableThCol">
        <el-table :data="data" border stripe style="width: 100%" ref="multipleTable" @sort-change='sortChange'>
          <el-table-column label="操作" width="50" fixed>
            <template slot-scope="scope">
              <el-dropdown trigger="click" class="iconSize" @click.native="id =scope.row.id">
                <span class="el-dropdown-link">
                  <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-has="'Pages.Article.Edit'">
                    <p @click="handleEdit('编辑文章')">编辑</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-has="'Pages.Article.Delete'">
                    <p @click="handleDelete(scope.$index, scope.row)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" sortable='custom'>
          </el-table-column>
          <el-table-column prop="categoryName" label="分类名称" sortable='custom' width="330">
          </el-table-column>
          <el-table-column :formatter="judge" prop="topMost" label="置顶" sortable='custom' width="80">
          </el-table-column>
          <el-table-column prop="author" label="作者" sortable='custom' width="120">
          </el-table-column>
          <el-table-column prop="readCount" label="阅读次数" sortable='custom' width="120">
          </el-table-column>
          <el-table-column prop="creationTime" :formatter="formatTableDate" label="创建日期" sortable='custom' width="120">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" :current-page.sync="cur_page" :page-sizes="[10,25,50,100,250,300]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 新建文章 -->
    <el-dialog :title="titleT" :visible.sync="createArticleVisible" width="1100px" :close-on-click-modal='false'>
      <el-form ref="CreateForm" :model="articleForm" :rules="rulesArticle">
        <el-form-item label="" prop="categoryId">
          <el-select class="seldialogn" v-model="articleForm.categoryId" placeholder="选择分类">
            <el-option v-for="item in categorieList" :key="item.id" :label="item.fullName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
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
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Api from "@/kites/api";
import UE from "@/components/common/ue.vue";
import { quillEditor } from "vue-quill-editor";
import { changeDate } from "@/utils/date";
import { Post, PostNoData, Postfile } from "@/api/api";
export default {
  name: "articleList",
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      editorOption: {
        placeholder: "请输入"
      },
      rulesArticle: {
        categoryId: [{ required: true, message: "请选择", trigger: "change" }],
        title: [{ required: true, message: "必填", trigger: "blur" }],
        customTime: [{ required: true, message: "请选择", trigger: "change" }]
      },
      titleT: "",
      tableData: [],
      cur_page: 1,
      totalCount: 0, //车辆数量
      select_cate: "",
      del_list: [],
      is_search: false,
      createArticleVisible: false,
      formData: {
        articleCategoryId: "",
        filter: "",
        sorting: "",
        maxResultCount: 10,
        skipCount: 0
      },
      categorieList: [],
      id: "",
      articleForm: {
        categoryId: "",
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
      defaultMsg: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      }
    };
  },
  created() {
    this.getData();
    this.getCategories();
    this.articleForm.customTime = new Date();
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
    createArticleVisible(curVal) {
      if (!curVal) {      
        this.$resetForm(this.$refs["CreateForm"]);
        this.defaultMsg = " ";
      }
    }
  },
  components: {
    quillEditor,
    UE
  },
  methods: {
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
    getUEContent() {
      let content = this.$refs.ue.getUEContent();
    },
    // 表格排序
    sortChange: function(column) {
       if (column.order == null) {
        this.formData.sorting = "";
      } else if (column.order == "ascending") {
        this.formData.sorting = `${column.prop} ASC`;
      } else {
        this.formData.sorting = `${column.prop} DESC`;
      }
      this.getData();
    },
    handleSizeChange(val) {
      this.formData.maxResultCount = val;
      this.getData();
    },
    // 清空表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    formatTableDate(row, column) {
      if (row[column.property] !== null) {
        return changeDate(row[column.property]);
      }
    },
    createArticle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.articleForm.content = this.$refs.ue.getUEContent();
          if (this.articleForm.content == "") {
            this.$message.warning("请编辑文章！");
            return;
          }
          if (this.titleT == "新建文章") {
            this.$delete(this.articleForm, "id");
            this.CreateArticle();
          } else {
            this.$set(this.articleForm, "id", this.id);
            this.UpdateArticle();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async CreateArticle() {
      try {
        const res = await Post(Api.CreateArticle, this.articleForm);
        if (res.success) {
          this.getData();
          this.$message.success("创建成功");
          this.createArticleVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async UpdateArticle() {
      try {
        const res = await Post(Api.UpdateArticle, this.articleForm);
        if (res.success) {
          this.getData();
          this.$message.success("更新成功");
          this.createArticleVisible = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取表格数据
    async getData() {
      let url = "/api/services/app/article/GetArticles";
      this.formData.skipCount =
        (this.cur_page - 1) * this.formData.maxResultCount;
      try {
        const res = await Post(url, this.formData);
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
      this.id = row.id;
      this.$confirm("是否确认删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = { id: this.id };
          this.deleteArticle(data);
        })
        .catch(() => {});
    },
    //  获取分类
    async getCategories() {
      let url = "/api/services/app/article/GetCurrentUserArticleCategories";
      try {
        const res = await Post(url, {});
        if (res.success) {
          this.categorieList = res.result;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteArticle(data) {
      let url = "/api/services/app/article/DeleteArticle";
      try {
        const res = await Post(url, data);
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
      this.createArticleVisible = true;
      this.titleT = title;
      let url = "/api/services/app/article/GetArticle";
      try {
        const res = await Post(url, { id: this.id });
        if (res.success) {
          this.articleForm = res.result;
          this.defaultMsg = this.articleForm.content;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //新建文章
    handleAdd(title) {
      this.titleT = title;
      this.createArticleVisible = true;
    },
    // 添加或编辑
    async CreateOrEditVehicle() {
      let url = "/api/services/app/vehicle/CreateOrEditVehicle";
      try {
        const res = await Post(url, this.articleForm);
        if (res.success) {
          this.$message.success("操作成功");
          this.getData();
        }
        this.createArticleVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    judge(data) {
      return data.topMost ? "是" : " ";
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
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
</style>
