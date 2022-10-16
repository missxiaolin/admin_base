<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="作者：" prop="auth">
        <el-input v-model="form.auth" />
      </el-form-item>
      <el-form-item label="内容：" prop="content">
        <quill-editor
          ref="myQuillEditor"
          v-model="form.content"
          :options="editorOption"
          @change="onEditorChange($event)"
        />
      </el-form-item>
      <el-form-item label="类型：">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">提问</el-radio>
          <el-radio :label="2">文章</el-radio>
          <el-radio :label="3">公告</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否置顶：">
        <el-radio-group v-model="form.is_topping">
          <el-radio :label="2">置顶</el-radio>
          <el-radio :label="1">不置顶</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否精品：">
        <el-radio-group v-model="form.is_boutique">
          <el-radio :label="1">精品</el-radio>
          <el-radio :label="2">非精品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="form.is_del">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="2">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button v-if="!form.id" type="primary" @click="submitForm('ruleForm')">添加文章</el-button>
        <el-button v-else type="primary" @click="submitForm('ruleForm')">修改文章</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import { add } from '@/api/article'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'ArticleAdd',
  components: {
    quillEditor
  },
  data() {
    return {
      form: {
        title: '',
        auth: '',
        content: '',
        type: 3, // 1 提问 2 文章 3 公告
        is_topping: 1,
        is_boutique: 2,
        is_del: 1
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        auth: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
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
      }
    }
  },
  methods: {
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      this.content = html
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
      const res = await add(this.form)
      if (res.code != 200) {
        this.$message(res.msg)
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        onClose: () => {
          this.$router.push({
            path: '/article/list'
          })
        }
      })
    }
  }
}
</script>
