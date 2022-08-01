<template>
  <div>
    <!-- 面包屑 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>商品管理</el-breadcrumb-item>
     <el-breadcrumb-item>添加商品</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 卡片视图 -->
   <el-card>
    <!-- 提示区域 -->
    <el-alert
    title="消息提示的文案"
    type="info"
    center
    show-icon
    closable>
  </el-alert>
  <!-- 步骤条 -->
  <el-steps :space="300" :active="activeIndex-0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<!-- tab区域 -->
<el-form :model="addForm" :rules="AddRules" ref="addruleForm" label-width="100px" label-position="top">
 <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabclicked">
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品信息" prop="goods_name">
          <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
     <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addForm.goods_price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addForm.goods_weight" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="addForm.goods_number" type="number"></el-input>
      </el-form-item>
       <el-form-item label="商品分类">
          <el-cascader
    v-model="addForm.goods_cat"
    :options="cateList"
    expand-trigger="hover"
    :props="cateProps"
    @change="handleChange">
    </el-cascader>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
      <el-form-item :label="item.attr_name" v-for="item in manyTabDate" :key="item.attr_id">
        <!-- 复选框 -->
        <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
       <el-form-item :label="item.attr_name" v-for="item in onlyTabList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
      <el-upload
            action="http://liufusong.top:8899/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess">
            <el-button size="small" type="primary" >点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
      <!-- 富文本剪辑器 -->
       <quill-editor v-model="addForm.goods_introduce"></quill-editor>
       <el-button type="primary" class="btn" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
</el-form>

   </el-card>

<el-dialog

  title="图片预览"
  :visible.sync="picdialogVisible"
  width="50%">
  <img :src="previewPath" alt="" class="previewImg">
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { getCateList, getCAtegoriesList, getJtaiList } from '@/api/add'
export default {
  data () {
    return {

      picdialogVisible: false,
      previewPath: '',
      // 动态参数列表数据
      manyTabDate: [],
      // 获取静态属性
      onlyTabList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cateList: [],
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        // 商品所属的分类数组
        goods_number: '',
        goods_cat: [],
        pics: [],
        // 商品详情
        goods_introduce: ''
      },
      AddRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ]
      },
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      try {
        const { data } = await getCateList()
        // console.log(data)
        this.cateList = data.data
        // this.$message.success('获取商品分类成功')
      } catch (e) {
        // console.log(e)
        this.$message.error('获取商品分类失败')
      }
    },
    // 变化触发
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabclicked () {
      // 访问动态参数
      if (this.activeIndex === '1') {
        try {
          const { data } = await getCAtegoriesList(this.cateId, { sel: 'many' })
          console.log(data)
          data.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTabDate = data.data
        } catch (e) {
          console.log(e)
          this.$message.error('获取商品参数失败')
        }
        // 获取静态属性
      } else if (this.activeIndex === '2') {
        const { data } = await getJtaiList(this.cateId, { sel: 'only' })
        // console.log(data.data)
        if (data.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        this.onlyTabList = data.data
      }
    },
    // 处理图片预览
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.picdialogVisible = true
    },
    // 移除图片
    handleRemove (file) {
      console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听图片上传成功
    handleSuccess (response) {
      console.log(response)
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加业务逻辑
    // async add () {
    //   this.$refs.addruleForm.validate()
    //   await this.$message.error('请填写必要的表单项')
    //   const form = _.cloneDeep(this.addForm)
    //   form.goods_cat = form.goods_cat.join(',')
    //   // 处理动态参数
    //   this.manyTableData.forEach(item => {
    //     const newInfo = {
    //       attr_id: item.attr_id,
    //       attr_value: item.attr_vals.join(' ')
    //     }
    //     this.addForm.attrs.push(newInfo)
    //   })
    //   // 处理静态属性
    //   this.onlyTableData.forEach(item => {
    //     const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
    //     this.addForm.attrs.push(newInfo)
    //   })
    //   form.attrs = this.addForm.attrs
    //   // console.log(form)
    //   try {
    //     const { data } = await addgoodsList(form)
    //     console.log(data)
    //     this.$message.success('添加商品成功')
    //   } catch (e) {
    //     console.log(e)
    //     this.$message.error('添加商品失败')
    //   }
    // }
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.previewImg{
  width: 100%;
}
.btn{
  margin-top: 15px;
}
</style>
