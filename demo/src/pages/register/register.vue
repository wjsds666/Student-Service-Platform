<template>
  <div class="register-container">
    <div class="form-card">
      <form @submit.prevent="register">
        <div class="input-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="registerForm.email" placeholder="请输入邮箱" required />
        </div>
        <div class="input-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="registerForm.userName" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="registerForm.password" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="submit-button">注册</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Register', // 组件名称
  data() {
    return {
      // 定义注册表单的数据对象
      registerForm: {
        email: '',    // 邮箱
        userName: '', // 用户名
        password: ''  // 密码
      }
    };
  },
  methods: {
    // 注册方法
    register() {
      // 在这里添加注册逻辑，例如发送请求到后端API
      console.log('注册信息:', this.registerForm);
      // 可以在这里进行表单验证，如果需要的话
      // 如果注册成功，可以重置表单或者跳转到其他页面
      // this.$router.push({ name: 'Home' }); // 例如使用路由跳转到主页
    }
  }
};
</script>
<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.form-card {
  width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #2c3e50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #34495e;
}
</style>