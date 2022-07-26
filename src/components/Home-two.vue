<template>
    <el-container class="home-container">
<!--      头部区域-->
      <el-header>
        <div>
          <img src="@/assets/heima.png">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
<!--      页面主体区域-->
      <el-container>
<!--        侧边栏-->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            :default-active="activePath"
            router
            :collapse-transition="false"
            :collapse="isCollapse"
            unique-opened
            background-color="#373D41"
            text-color="#fff"
            active-text-color="skyblue">
<!--            一级菜单-->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
<!--              二级菜单  侧边栏路由的改造-->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
<!--        右侧内容区-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import { Message } from 'element-ui'

export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-User',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return Message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100vh;
}
.el-header{
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
    div{
      display: flex;
      align-items: center;
      span{
margin-left: 15px;
      }
    }
}
.el-aside{
  background-color: #373D41;
  .el-menu{
      border-right:none
  }
}
.el-main{
  background-color: #EAEDF1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #373D41;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
cursor: pointer;
}
</style>
