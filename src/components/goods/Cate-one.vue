<template>
  <div>
    <!-- 面包屑 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>商品管理</el-breadcrumb-item>
     <el-breadcrumb-item>商品分类</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- 卡片视图区域 -->
   <el-card>
    <el-row>
      <el-col>
        <el-button  class="addBtn" type="primary" @click="showAdd">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
  <tree-table :data="cateList"  :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
    <!-- 是否有效 -->
    <template slot='isOk' slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:skyblue"></i>
         <i class="el-icon-erroe" v-else style="color:red"></i>
    </template>
    <template slot="order" slot-scope="scope">
      <el-tag size="small" type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
      <el-tag type="success" size="small" v-else-if="scope.row.cat_level === 1">二级</el-tag>
      <el-tag type="warning" size="small" v-else>三级</el-tag>
    </template>
    <template slot="opt" slot-scope="">
      <el-button type="primary" icon="el-icon-edit" size="small" >编辑</el-button>
      <el-button type="danger" icon="el-icon-delete"  size="small">删除</el-button>
    </template>
  </tree-table>
    <!-- 分页区域 -->
     <el-pagination
     class="treeTable"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </el-card>

   <!-- 添加分类的对话框 -->
   <el-dialog
   @close="addCateDialogClosed"
  title="添加分类"
  :visible.sync="addCateDialogShow"
  width="50%">
  <el-form :model="addCateForm" :rules="addCaterules" ref="addCateForm" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
    <el-form-item label="父级分类">
      <el-cascader
      clearable
      change-on-select
    v-model="selectKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parentCateChange"></el-cascader>
  </el-form-item>
  </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { categoriesList, getParentCateList, addCateList } from '@/api/categories'
export default {
  data () {
    return {
      // 选中父级分类的id数组
      selectKeys: {

      },
      // 联级的父对象
      parentCateList: [],
      // 指定链接的选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addCateForm: {
        cat_name: '',
        cat_id: '',
        cat_level: 0
      },
      addCaterules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      addCateDialogShow: false,
      // 总条数
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的列表数据
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ]
    }
  },
  created () {
    this.categoriesList()
  },
  methods: {
    // 获取数据
    async categoriesList () {
      const { data } = await categoriesList(this.queryInfo)
      // console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.cateList = data.data.result
      this.total = data.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.categoriesList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.categoriesList()
    },
    // 添加分类
    showAdd () {
      this.getParentCateList()
      this.addCateDialogShow = true
    },
    async getParentCateList () {
      const { data } = await getParentCateList({ params: { type: 2 } })
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = data.data
    },
    // 选择项变化触这个
    parentCateChange () {
      if (this.selectKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        // 当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    async addCate () {
      try {
        this.$refs.addCateForm.validate()
        const { data } = await addCateList(this.addCateForm)
        console.log(data)
        this.$message.success('添加分类成功')
        this.categoriesList()
        this.addCateDialogShow = false
      } catch (e) {
        console.log(e)
        this.$message.error('添加分类失败')
      }
    },
    // 监听对话框的关闭事件
    addCateDialogClosed () {
      this.$refs.addCateForm.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
.addBtn{
  margin-bottom: 15px;
}
</style>
