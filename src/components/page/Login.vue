<template>
  <div class="login-wrap">
    <div class="ms-title">锡山区司法局智慧法务系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username" class="loginInput">
          <el-input v-model="ruleForm.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="loginInput">
          <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>

      </el-form>
    </div>
    <div class="ms-tip">
      <p>{{year}} © 锡山区司法局.</p>
      <p>技术支持：{{this.$company}}</p>
    </div>

  </div>
</template>

<script>
import router, { DynamicRoutes } from "@/router/index";
import { Post, PostNoData } from "@/api/api";
import { getToken, setToken, removeToken } from "@/utils/auth";
export default {
  data: function() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      year:0,
      company:config.company
    };
  },
  created(){
    var myDate = new Date();
    this.year = myDate.getFullYear();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("Login", this.ruleForm)
            .then(() => {
              if (getToken()) {
                //location.reload();
                localStorage.setItem("ms_username", this.ruleForm.username);
                // this.getUserPermissionsForEdit();
                 router.push("/dashboard");
              } else {
                this.$message.error("用户名或密码无效！");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取用户权限列表
    async getUserPermissionsForEdit() {
      let url = "/api/services/app/user/GetUserPermissionNames";
      try {
        const res = await Post(url, {});
        if (res.success) {
          let perList = res.result;
          let flag = false;
          for (let i = 0; i < perList.length; i++) {
            if (perList[i] == "Pages.Tenant.Dashboard") {
              flag = true;
              break;
            }
          }
          if (flag) {
            router.push("/dashboard");
          } else {
            router.push("/welcome");
          }
          localStorage.setItem("Permission-List", perList);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}
.ms-tip {
  position: absolute;
  top: 60%;
  width: 100%;
  font-size: 12px;
  margin-top: 20px;
  text-align: center;
  color: #fff;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
.loginInput {
  margin-bottom: 18px;
}
</style>
