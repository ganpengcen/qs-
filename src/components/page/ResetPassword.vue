<template>
    <div class="login-wrap">
        <div class="ms-title">修改密码</div>
        <div class="ms-login">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="rulesPswForm" label-width="0px" class="demo-ruleForm">
                <p class="tip">请输入新密码.</p>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item  prop="passwordRepeat">
                    <el-input type="password" v-model="ruleForm.passwordRepeat" auto-complete="off" placeholder="密码（核对）"></el-input>
                </el-form-item>
                 <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login, logout1, getUserInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
export default {
  data: function() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("最少要输入6个字符"));
      } else {
        if (this.ruleForm.passwordRepeat !== "") {
          this.$refs.rulesPswForm.validateField("passwordRepeat");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        passwordRepeat: "",
        password: ""
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        passwordRepeat: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
         
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.tip {
  font-size: 13px;
  color: #666;
  padding: 0 0 10px 0;
}
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
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
