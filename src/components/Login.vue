<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>

      <!--登录表单区域-->
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>

        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>

        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: { /* https://element.eleme.cn/#/zh-CN/component/form 表单验证 */
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    /* 重置表单 */
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      /* 登录前验证表单 */
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return

        /* 此时result 是axios封装后的对象，其中data是服务器返回的具体数据 */
        // const result = await this.$http.post('login', this.loginForm)
        // console.log(result)

        /* 使用这种方法可以直接获取data */
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 保存token
        window.sessionStorage.setItem('token', res.data.token)

        // 跳转页面
        this.$router.push('/home')
      })
    }
  }
}

</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 100px;
    width: 100px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

.btns{
  display:flex;
  justify-content: flex-end;
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

}
</style>
