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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
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
      <el-table-column label="是否隐藏" prop="id" align="center">
        <template slot-scope="{row}">
          <span v-if="row.is_del == 1">显示</span>
          <span v-if="row.is_del == 2">隐藏</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center" width="360px">
        <template slot-scope="{row}">
          <el-button v-if="row.is_topping == 1" type="primary" @click="articleTopping(row.id, 2)">置顶</el-button>
          <el-button v-if="row.is_topping == 2" type="primary" @click="articleTopping(row.id, 1)">取消置顶</el-button>
          <el-button v-if="row.is_boutique == 2" type="primary" @click="articleBoutique(row.id, 1)">设置精品</el-button>
          <el-button v-if="row.is_boutique == 1" type="primary" @click="articleBoutique(row.id, 2)">取消精品</el-button>
          <el-button v-if="row.is_del == 1" type="primary" @click="articleDel(row.id, 2)">隐藏</el-button>
          <el-button v-if="row.is_del == 2" type="primary" @click="articleDel(row.id, 1)">显示</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="listQuery.pageSize"
      :pager-count="11"
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { fetchList, topping, boutique, del } from '@/api/article'

export default {
  name: 'ArticleList',
  data() {
    return {
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
    }
  }
}
</script>
