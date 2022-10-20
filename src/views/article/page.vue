<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.is_topping" placeholder="是否置顶" style="width: 120px" class="filter-item">
        <el-option v-for="item in toppingOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.is_boutique" placeholder="是否精品" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in boutiqueOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.is_del" placeholder="是否隐藏" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in delOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="activeData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="id" align="center">
        <template slot-scope="{row}">
          <span v-if="row.type == 1">问题</span>
          <span v-if="row.type == 2">文章</span>
          <span v-if="row.type == 3">公告</span>
        </template>
      </el-table-column>
      <el-table-column label="回复" prop="id" align="center">
        <template slot-scope="{row}">
          <span v-if="row.type == 1">
            <p v-for="(item, index) in row.comments" :key="index">
              <span v-html="item.text"></span>
            </p>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.auth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center" width="370px">
        <template slot-scope="{row}">
          <el-button v-if="row.is_topping == 1" size="mini" type="primary" @click="articleTopping(row.id, 2)">置顶
          </el-button>
          <el-button v-if="row.is_topping == 2" size="mini" type="primary" @click="articleTopping(row.id, 1)">取消置顶
          </el-button>
          <el-button v-if="row.is_boutique == 2" size="mini" type="primary" @click="articleBoutique(row.id, 1)">设置精品
          </el-button>
          <el-button v-if="row.is_boutique == 1" size="mini" type="primary" @click="articleBoutique(row.id, 2)">取消精品
          </el-button>

          <!-- <el-button v-if="row.is_del == 1" size="mini" type="primary" @click="articleDel(row.id, 2)">隐藏</el-button>
          <el-button v-if="row.is_del == 2" size="mini" type="primary" @click="articleDel(row.id, 1)">显示</el-button> -->
          <el-button size="mini" type="primary" @click="articleUpdate(row.id)">修改</el-button>
          <el-button v-if="row.type == 1" size="mini" type="primary" @click="showDialog(row.id)">回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :page-size="listQuery.pageSize" :pager-count="11" layout="prev, pager, next" :total="total"
      @current-change="handleCurrentChange" />

    <el-dialog :visible.sync="dialogPvVisible" title="回复提问">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="内容：" prop="content">
          <quill-editor ref="myQuillEditor" v-model="form.content" :options="editorOption"
            @change="onEditorChange($event)" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, topping, boutique, del, commentAdd } from '@/api/article'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'ArticleList',
  components: {
    quillEditor
  },
  data() {
    return {
      dialogPvVisible: false,
      form: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      // 富文本编辑器配置
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ['blockquote', 'code-block'], // 引用  代码块
            [{ header: 1 }, { header: 2 }], // 1、2 级标题
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ direction: 'rtl' }], // 文本方向
            [{ size: ['12', '14', '16', '18', '20', '22', '24', '28', '32', '36'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            // [{ font: ['songti'] }], // 字体种类
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除文本格式
            ['image', 'link'] // 链接、图片、视频
          ]
        },
        placeholder: '请输入正文'
      },
      listQuery: {
        title: '',
        page: 1,
        pageSize: 30,
        is_topping: null,
        is_boutique: null,
        is_del: null
      },
      toppingOptions: [{
        label: '不置顶',
        value: 1
      }, {
        label: '置顶',
        value: 2
      }],
      boutiqueOptions: [{
        label: '精品',
        value: 1
      }, {
        label: '不是精品',
        value: 2
      }],
      delOptions: [{
        label: '显示',
        value: 1
      }, {
        label: '隐藏',
        value: 2
      }],
      activeData: [],
      listLoading: true,
      total: undefined
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const res = await fetchList(this.listQuery)
      this.listLoading = false
      this.activeData = res.data.activeData
      this.total = res.data.count
    },
    // 搜索
    handleFilter() {
      this.init()
    },
    // 创建文章
    handleCreate() {
      this.$router.push({
        path: '/article/add'
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.init()
    },
    // 是否删除
    async articleDel(id, status) {
      await del({
        id,
        is_del: status
      })
      this.init()
    },
    // 是否置顶
    async articleTopping(id, status) {
      await topping({
        id,
        is_topping: status
      })
      this.init()
    },
    // 是否精品
    async articleBoutique(id, status) {
      await boutique({
        id,
        is_boutique: status
      })
      this.init()
    },
    articleUpdate(id) {
      this.$router.push({
        path: '/article/add',
        query: {
          id
        }
      })
    },
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      this.content = html
    },
    showDialog(id) {
      this.dialogPvVisible = true
      this.form.id = id
      this.form.content = ''
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.articleAdd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async articleAdd() {
      let res = await commentAdd(this.form)
      if (res.code != 200) {
        this.$message.error(res.msg)
        return
      }
      this.dialogPvVisible = false
      this.form.id = ''
    }
  }
}
</script>
