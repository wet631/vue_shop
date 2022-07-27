<template>
<div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
          <el-col>
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <el-table :data="rolesList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom' , index === 0 ? 'bdtop' : '','vcenter'] "  v-for="(item1,index) in scope.row.children" :key="item1.id">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二三级的权限 -->
                <el-col :span="19">
                  <el-row :class="[index2 === 0 ? '' : 'bdtop','vcenter'] "  v-for="(item2,index2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>

                <pre>
                  <!-- {{scope.row}} -->
                  <!-- {{scope.row.children}} -->
                </pre>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="400px">
            <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-edit" @click="showSetRightDialog(scope.row)" >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="showSetRightDialogVisible"
  width="50%" @close="setRightDialogClosed">
  <!-- 树形控件 -->
  <el-tree :data="rightsList" :props="treeProps"  show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import { getRolesList, deleteRoles, ShowRigthsList, RigthsRoles } from '@/api/Roles'
export default {
  data () {
    return {
      rolesList: [],
      // 控制权限分配对话框的显示与隐藏
      showSetRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中id值的节点
      defKeys: [],
      // 当前即将分配权限的id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有的角色列表
    async getRolesList () {
      const { data: res } = await getRolesList()
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    // 根据id删除对应的权限
    async removeRightById (role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => console.log(err))

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认了删除')

      const { data: res } = await deleteRoles(role.id, rightId)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.info('删除权限失败')
      }
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 递归获取三级节点
      this.getLeafList(role, this.defKeys)
      this.showSetRightDialogVisible = true
      // 获取所有权限的数据
      const { data: res } = await ShowRigthsList()
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.info('获取权限数据失败')
      }
      // 获取到的权限数据
      this.rightsList = res.data
    },
    // 通过递归获取到三级节点下面所有的权限的id 并保存到key
    // 不包含children 就说明是三级节点
    getLeafList (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafList(item, arr)
      })
    },
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const key = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(key)
      const idStr = key.join(',')
      // console.log(idStr)
      // const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
      //   rids: idStr
      // })
      const { data: res } = await RigthsRoles(this.roleId, idStr)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.info('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.showSetRightDialogVisible = false
    }

  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
