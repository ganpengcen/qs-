<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <!-- :is-active="sidebar.opened" -->
    <div class="collapse-btn" @click="toggleSideBar">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo"><img src="static/img/logo.png" alt="">
      <span>司法矫正智能监管平台</span>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator"><img src="static/img/img.jpg"></div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="editPsw">修改密码</el-dropdown-item>
            <!-- <el-dropdown-item command="editPic">修改头像</el-dropdown-item> -->
            <el-dropdown-item command="loginout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog title="修改密码" :visible.sync="editPswVisible" width="600px">
      <el-form ref="ruleFormPSW" :model="ruleFormPSW" :rules="rules2">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input type="password" v-model="ruleFormPSW.currentPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="ruleFormPSW.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码(核对)" prop="newPasswordRepeat">
          <el-input type="password" v-model="ruleFormPSW.newPasswordRepeat"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPswVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleFormPSW')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog title="修改头像" :visible.sync="editImgVisible" width="600px">
      <el-upload class="avatar-uploader" action="http://sifa.xsfgxh.com/Profile/UploadProfilePicture" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editImgVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleFormPSW')">确 定</el-button>
      </span>
    </el-dialog> -->

  </div>
</template>
<script>
import { Post } from "@/api/api";
import { mapGetters } from "vuex";
import bus from "../common/bus";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码最少6个字符"));
      } else if (value.length > 10) {
        callback(new Error("密码最多10个字符"));
      } else {
        if (this.ruleFormPSW.newPasswordRepeat !== "") {
          this.$refs.ruleFormPSW.validateField("newPasswordRepeat");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleFormPSW.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      collapse: false,
      fullscreen: false,
      editPswVisible: false,
      editImgVisible: false,
      name: "admin",
      message: 2,
      imageUrl: "",
      ruleFormPSW: {
        newPassword: "",
        newPasswordRepeat: "",
        currentPassword: ""
      },
      rules2: {
        currentPassword: [{ required: true, message: "必填", trigger: "blur" }],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        newPasswordRepeat: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  watch: {
    editPswVisible(curVal) {
      if (!curVal) {
        this.$resetForm(this.$refs["ruleFormPSW"]);
      }
    }
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    },
    ...mapGetters(["sidebar"])
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ChangePassword();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async ChangePassword() {
      let url = "/api/services/app/profile/ChangePassword";
      try {
        const res = await Post(url, this.ruleFormPSW);
        if (res.success) {
          this.$message.success("修改成功");
          this.editPswVisible = false;
        }
      } catch (e) {
        this.$message.error(e.data.error.message);
      }
    },
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
        window.location.reload();
        this.$store
          .dispatch("LogOut")
          .then(() => {
            localStorage.removeItem("ms_username");
            this.$router.push("/login");
          })
          .catch(err => {
            console.log(err);
          });
      } else if (command == "editPsw") {
        this.editPswVisible = true;
      } else if (command == "editPic") {
        this.editImgVisible = true;
      }
    },

    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      //this.collapseChage();
      this.toggleSideBar();
    }
  }
};
</script>
<style scoped lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.hamburger-container {
  line-height: 58px;
  height: 50px;
  float: left;
  padding: 0 10px;
}
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  line-height: 70px;
  font-size: 25px;
  img {
    width: 55px;
    vertical-align: middle;
    margin-right: 15px;
  }
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
