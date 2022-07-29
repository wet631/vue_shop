<template>
  <div>
 <!-- 面包屑 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>用户管理</el-breadcrumb-item>
     <el-breadcrumb-item>用户列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
  <el-alert
  :closable="false"
    title="注意：只允许为第三级分类设置相关参数！"
    type="warning"
    show-icon>
  </el-alert>

  <el-row class="cat_opt">
    <el-col>
      <span>选择商品分类:</span>
       <el-cascader
    v-model="selectCateList"
    :props="cateProps"
    :options="categoriesList"
    @change="handleChange"></el-cascader>
    </el-col>
  </el-row>
   <el-tabs v-model="activeName" @tab-click="handleTabClick" >
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size="mini" :disabled="isBtndisabled" @click="addDialogVisible = true">添加参数</el-button>
      <el-table :data="manyTabData" stripe border>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.attr_vals" :key='index' closable>{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
           <template v-slot="{row}">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(row.attr_id)"
                  >删除</el-button
                >
              </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" size="mini" :disabled="isBtndisabled" @click="addDialogVisible = true">添加属性</el-button>
      <el-table :data="onlyTabData" stripe border>
        <!-- 展开行 -->
        <el-table-column type="expand">
         <template slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.attr_vals" :key='index' closable>{{item}}</el-tag>
              <!-- 输入文本框 -->
              <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(row.attr_id)"
                  >删除</el-button
                >
              </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="showEditDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { categoriesList, cateIdList, AddcateIdList } from '@/api/params'

export default {
  data () {
    return {
      // 点击修改的对话显示
      showEditDialogVisible: false,
      // 添加表单的验证规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      // 添加表单的数据对象
      addForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      // 添加表单的数据对象
      editForm: {
      },
      // 动态对话框的显示与隐藏
      addDialogVisible: false,
      // 动态表格
      manyTabData: [],
      // 静态表格
      onlyTabData: [],
      activeName: 'many',
      // 级联选择框双向绑定的数组
      selectCateList: [],
      // 商品分类列表
      categoriesList: [],
      // 级联选择器配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.CateList()
  },
  methods: {
    async CateList () {
      const { data } = await categoriesList()
      // console.log(data)
      if (data.meta.status !== 200) {
        return this.$$message.error('获取商品分类数据失败')
      }
      this.categoriesList = data.data
    },
    //  选择框发生变化
    handleChange () {
      this.getParamsData()
    },
    // 点击事件的处理函数
    handleTabClick () {
      // console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData () {
      if (this.selectCateList.length !== 3) {
        this.selectCateList = []
        return
      }
      // console.log(this.selectCateList)
      // 根据所选择的分类的id获取到对应的参数
      try {
        const { data } = await cateIdList(this.cateId, { sel: this.activeName })
        // console.log(data)
        if (this.activeName === 'many') {
          this.manyTabData = data.data
        } else {
          this.onlyTabData = data.data
        }
        data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputValue = false
          // 文本框中输入的值
          item.inputValue = ''
        })
        // this.$message.success('获取参数成功')
      } catch (e) {
        console.log(e)
        this.$message.error('获取参数失败')
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数或者属性
    async addParams () {
      try {
        const { data } = await AddcateIdList(this.cateId, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(data)
        this.$message.success('创建成功')
        this.addDialogVisible = false
        this.getParamsData()
      } catch (e) {
        console.log(e)
        this.$message.error('创建失败')
      }
    },

    // 监听编辑对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑框的展示
    // async showEditDialog (attrid) {
    //   const { data } = await editcateIdList(this.cateId, attrid, {
    //     attr_sel: this.activeName
    //   })
    //   console.log(data)
    //   if (data.meta.status !== 200) {
    //     return this.$message.error('获取参数列表失败')
    //   }
    //   this.editForm = data.data
    //   this.showEditDialogVisible = true
    // },
    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeTabsName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    // 编辑确定的时候
    editParams () {
      this.$refs.editFormRef.validate()
    },
    async removeParams () {
      const confirmresult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmresult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 删除的业务逻辑
    },
    // 文本框失去焦点
    handleInputConfirm () {
      console.log('ok')
    },
    // 点击按钮输入文本框
    showInput (row) {
      row.inputVisible = true
    }
  },
  computed: {
    // 没有选中三级就禁用
    isBtndisabled () {
      if (this.selectCateList.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId () {
      if (this.selectCateList.length === 3) {
        return this.selectCateList[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin-top: 15px;
}
.el-tag{
  margin: 15px;
}
.input-new-tag{
  width: 120px;
}
</style>
