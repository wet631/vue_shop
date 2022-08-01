<template>
<div>
    <!-- 面包屑 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>订单管理</el-breadcrumb-item>
     <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 卡片区域 -->
   <el-card>
    <el-row>
      <el-col :span="8">
    <el-input placeholder="请输入内容">
    <el-button slot="append" icon="el-icon-search">
    </el-button>
  </el-input>
      </el-col>
    </el-row>
    <!-- 订单列表数据 -->
    <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column  label="订单编号" prop="order_number"></el-table-column>
        <el-table-column  label="订单价格" prop="order_price"></el-table-column>
        <el-table-column  label="是否付款" prop="pay_status">
          <template v-slot="{row}">
              <el-tag type="success" v-if="row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
         <el-table-column  label="是否发货" prop="is_send">
          <template v-slot="{row}">
               {{row.is_send}}
          </template>
         </el-table-column>
         <el-table-column label="下单时间" prop="create_time">
         <template v-slot="{row}">
            {{row.create_time | dataFormat}}
         </template>
         </el-table-column>
         <el-table-column label="操作">
          <template v-slot="{}">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBOx"></el-button>
             <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
         </el-table-column>
    </el-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 400]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

   </el-card>
   <!-- 修改地址 -->
  <el-dialog title="修改地址" :visible.sync="addressdialogVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
    v-model="addressForm.address1"
    :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
  title="物流进度"
  :visible.sync="ProgressdialogVisible"
  width="50%">
  <span>这是一段信息</span>
</el-dialog>

</div>
</template>

<script>
import cityData from './citydata'
import { orderList, kuaidi } from '@/api/order'
export default {
  data () {
    return {
      ProgressList: [],
      ProgressdialogVisible: false,
      cityData,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      ordersList: [],
      addressdialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择'
          }
        ],
        address2: [
          {
            required: true,
            message: '请输入'
          }
        ]
      }
    }
  },
  created () {
    this.orderList()
  },
  methods: {
    async orderList () {
      try {
        const { data } = await orderList(this.queryInfo)
        console.log(data)
        this.total = data.data.total
        this.ordersList = data.data.goods
      } catch (e) {
        console.log(e)
        this.$$message.error('获取订单列表失败')
      }
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.orderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.orderList()
    },
    // 展示修改地址
    showBOx () {
      this.addressdialogVisible = true
    },
    addressDialogClosed () {
      this.addressFormRef.resetField()
    },
    // 展示物流信息
    async showProgressBox () {
      const { data } = await kuaidi(1106975712662)
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.ProgressList = data.data
      this.ProgressdialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
