<template>
  <div>
    <!-- 面包屑 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图 -->
<el-card>

  <!-- 搜索区域 -->
  <el-row :gutter="20">
    <el-col :span="8">
       <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
      </el-input>
    </el-col>
    <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true"> 添加用户</el-button>
    </el-col>
  </el-row>

  <!-- 用户列表区域 -->
  <el-table :data="userList" border stripe>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="姓名"  prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态">
        <template slot-scope="scope">
          <!-- slot-scope接收当前作用域的数据 -->
            <!-- {{scope.row}}可以获取到本行的所有数据 -->
            <el-switch
                v-model="scope.row.mg_state" @change="userStatuChange(scope.row)">
            </el-switch>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <!-- slot-scope接收当前作用域的数据 -->
            <!-- {{scope.row}}可以获取到本行的所有数据 -->
            <!-- {{scope.row}} -->
<!--          编辑-->
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
<!--          删除-->
           <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
<!--          分配-->
           <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
    </el-tooltip>
        </template>
    </el-table-column>
  </el-table>

  <!-- 分页符号 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 添加用户的对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">
  <!-- 内容主体区域 -->
<el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"    type="password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!--修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
         <el-form-item label="用户名" disabled>
           <el-input v-model="editForm.username"></el-input>
         </el-form-item>
          <el-form-item label="邮箱" prop="email" >
           <el-input v-model="editForm.email"></el-input>
         </el-form-item>
          <el-form-item label="手机号" prop="mobile">
           <el-input v-model="editForm.mobile"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false" >取消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->

<el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%" @close="setRoleDialogClosed">
 <div>
  <p>当前的用户：{{userInfo.username}}</p>
  <p>当前的角色：{{userInfo.role_name}}</p>
  <p>
      <el-select v-model="selectRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </p>
 </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoleInfo">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import { getUserList, getUserState, addUser, EditUser, EditUserInfo, deleteUserInfo, getRightsRolesList, userRolesList } from '@/api/user'
export default {
  data () {
    // 验证邮箱的规则
    // const checkEmail = (rule, value, cb) => {
    //   const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //   if (regEmail.test(value)) {
    //     return cb()
    //   }
    //   cb(new Error('请输入合法的邮箱'))
    // }
    //  验证手机号的规则
    // const checkMobile = (rule, value, cb) => {
    //   const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
    //   if (regMobile.test(value)) {
    //     return cb()
    //   }
    //   cb(new Error('请输入合法的手机号'))
    // }
    return {
      // 分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectRoleId: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      userList: [],
      total: 0,
      // 控制修改用户对话框的显示
      editDialogVisible: false,
      // 查询用户信息对象
      editForm: {},
      // 添加用户表单数据
      addForm: {
        username: '给乐乐征个婚',
        password: '123123132',
        email: '123@qq.com',
        mobile: '13868644301'
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符之间0',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6-15个字符之间',
            trigger: 'blur'
          }

        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            // validator: checkEmail,
            pattern: /^\w+@\w+(\.\w+)+$/,
            trigger: 'blur',
            message: '邮箱格式不正确'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            // validator: checkMobile,
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur',
            message: '手机号格式不正确'
          }
        ]
      },
      // 修改表单的验证规则
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            pattern: /^\w+@\w+(\.\w+)+$/,
            trigger: 'blur',
            message: '邮箱格式不正确'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur',
            message: '手机号格式不正确'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const res = await getUserList(this.queryInfo)
      // console.log(res)
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.data.users
      // console.log(this.userList)
      this.total = res.data.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听state状态的改变
    async userStatuChange (userInfo) {
      // console.log(userInfo)
      const res = await getUserState(userInfo)
      // console.log(res)
      if (res.data.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('获取用户信息失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户框的关闭事件 清除内容
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定 添加新用户 进行表单的预校验
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await addUser(this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 编辑用户
    async showEditDialog (id) {
      this.editDialogVisible = true
      // console.log(id)
      const { data: res } = await EditUser(id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await EditUserInfo(this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        this.$message.success('更新用户信息成功')
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
      })
    },
    // 删除用户
    async  removeUserById (id) {
      // console.log(id)
      // 弹框询问用户是否永久删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => console.log(err))
      // console.log(confirmResult)
      // 确认>>  comfirom
      // 取消>> cancel
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      }
      const { data: res } = await deleteUserInfo(id)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 在展示对话框的之前 获取所有角色的列表
      const { data } = await getRightsRolesList()
      // console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = data.data
      console.log(this.rolesList)
      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async setRoleInfo () {
      // 用户没有选择新的角色
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      console.log(this.userInfo.id)
      console.log(this.selectRoleId)
      // 更新角色
      const { data } = await userRolesList(this.userInfo.id, this.selectRoleId)
      // console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('更新用户角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // // 监听分配角色对话框的关闭事件
    setRoleDialogClosed () {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style>

</style>
