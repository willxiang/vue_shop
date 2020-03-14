<template>
        <el-container class="home-container">
        <!--头部-->
        <el-header>
            <div>
                <img class="home_logo" src="../assets/biaoqing.png" alt="">
                <span>XX 后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>

        <!--侧边栏与主体内容-->
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!--侧边栏-->
                <el-menu 
                background-color="#333744" 
                text-color="#fff" 
                active-text-color="#409EFF" 
                router unique-opened :collapse="isCollapse" 
                :collapse-transition="false"
                :default-active="activePath"
                >
                    <!--一级菜单-->
                    <el-submenu :index="item.id+ ''" v-for="item in menulist" :key="item.id">
                        <!--一级菜单 模板区-->
                        <template slot="title">
                            <!--图标-->
                            <!-- <i class="el-icon-location"></i> -->
                            <i :class="icons[item.id]"></i>

                            <!--文本-->
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级子菜单-->
                        <el-menu-item :index="'/'+ subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+ subItem.path)">
                            <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <!--主体-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menulist: [],
      icons: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(this.menulist)
    },
    toggleCollapse() {
      /* 展开，隐藏侧边栏 */
      this.isCollapse = !this.isCollapse
    },
    /* 保存链接的激活状态 */
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none; /* 修复侧边栏边框没对齐 */
    }
}

.el-main {
    background-color: #eaedf1;
}
.home_logo{
    height: 61px;
    width: 56px;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
