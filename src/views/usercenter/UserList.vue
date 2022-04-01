<template>
  <a-table class="listTable" :columns="columns" :data-source="data" size="small" :loading="loading" :pagination="{pageSize:8}">
    <template slot="action" slot-scope="row">
      <button v-if="row['delFlag']==2" @click="banUser(row, 0)" style="backgroundColor:red;border:1px solid yellow;color:yellow">解禁</button>
      <button slot="action" slot-scope="row" v-else @click="banUser(row, 2)">禁用</button>
    </template>
    <div slot="headImage" slot-scope="row" style="padding:0;maxWidth:80px"><img :src="'/webfile'+row.headImage" alt="头像" style="maxHeight:40px;maxWith:84px"></div>
    <div slot="companyLicense" slot-scope="row" style="padding:0;maxWidth:100px">
      <a :href="row.companyLicense?'/webfile'+row.companyLicense : ''" target="_blank"><img :src="row.companyLicense?'/webfile'+row.companyLicense : ''" style="maxHeight:40px;maxWith:84px"></a>
    </div>
  </a-table>
</template>

<script>
import { getAllUser, updateUserStatus } from '@/api/user'
const columns = [
  { title: '用户名', width: 100, dataIndex: 'nickname', key: 'name', ellipsis: true },
  { title: '头像', width: 100, key: 'avatar', scopedSlots: { customRender: 'headImage' } },
  { title: '手机号', dataIndex: 'phoneNumber', key: '1', width: 120, ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', key: '2', width: 100 },
  { title: '更新时间', dataIndex: 'updateTime', key: '3', width: 100 },
  { title: '单位', dataIndex: 'company', key: '4', width: 100, ellipsis: true },
  { title: '公司执照', key: '7', width: 100, scopedSlots: { customRender: 'companyLicense' }  },
  { title: '审核状态', dataIndex: 'checkStatus', key: '5', width: 100, sorter: (a, b) => (b.checkFlag - a.checkFlag) },
  { title: '个人简介', dataIndex: 'description', key: '6', width: 100, ellipsis: true },
  {
    title: '操作',
    key: 'operation',
    width: 80,
    scopedSlots: { customRender: 'action' },
  }
]

export default {
  data() {
    return {
      data: [],
      loading: false,
      columns
    }
  },
  mounted () {
    this._getAllUser()
  },
  methods: {
    async _getAllUser () {
      this.loading = true
      const { data } = await getAllUser()
      this.loading = false
      console.log('alluserres', data)
      data.map(item => {
        let checkStatus = ''
        if (item.checkFlag === '3') checkStatus = '审核通过'
        else if (item.checkFlag === '1') checkStatus = '待审核'
        else if (item.checkFlag === '2') checkStatus = '审核未通过'
        else if (item.checkFlag === '4') checkStatus = '待重新审核'
        else checkStatus = ''
        let createTime = new Date(item.createDate).toLocaleDateString()
        let updateTime = new Date(item.updateDate).toLocaleDateString()
        this.data.push({...item, key: item.id, checkStatus, createTime, updateTime})
      })
    },
    /* handleTableChange () {
      this.data = this.data.sort((a, b) => (b.checkFlag - a.checkFlag))
      console.log(this.data)
    }, */
    async banUser (user, status) {
      let tempUserStatus = user.delFlag
      user.delFlag = status
      const res = await updateUserStatus({
        id: user.id,
        status
      })
      if (res && res.message && res.message.message && res.message.message === 'success') this.$message.success('操作成功')
      else {
        this.$message.success('操作失败' + res.message.message)
        user.delFlag = tempUserStatus
      }
    }
  }
}
</script>

<style>
  .listTable {
    max-width: 926px;
  }
</style>
