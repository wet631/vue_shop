<template>
  <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
         <el-table-column type="index" label="#"></el-table-column>
         <el-table-column label="权限列表" prop="authName"></el-table-column>
         <el-table-column label="路径" prop="path"></el-table-column>
         <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
          </template>
         </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { rigthsList } from '@/api/rights'
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.rigthsList()
  },
  methods: {
    async rigthsList () {
      const { data: res } = await rigthsList()
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$$message.console.error('获取用户列表失败')
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style>

</style>
