<template>
<div class="list-container" style="position:relative">
  <a-table
    :columns="columns"
    :data-source="list"
    :rowKey="record => record.id"
    :pagination="{total: total}"
    @change="onTableChange"
  >
    <span slot="amount" slot-scope="detail">{{detail.split('，')[2]}}</span>
    <span slot="chargeType" slot-scope="detail">{{detail.split('，')[0]}}</span>
    <span slot="numbers" slot-scope="detail">{{detail.split('，')[1]}}</span>
    <template slot="payStatus" slot-scope="payStatus">
      <a-tag v-if="payStatus==='YZF'" :key="payStatus" color="green">成功</a-tag>
      <a-tag v-else :key="payStatus" color="volcano">失败</a-tag>
    </template>
  </a-table>
  <div class="search-byuser">
    <a-cascader :options="userListCascader" :show-search="{ onFilter }" @change="onSelectChange" placeholder="选择或输入要查询的用户" />
    <a-button type="primary" @click="onChargelistByid()">查询订单</a-button>
  </div>
</div>
</template>

<script>
import { getAllPayRecharge, getUserPayRecharge } from '@/api/weixinpay.js'
import { getAllUser } from '@/api/user'
const listForm = [
  {
    id: '1',
    nickName: '',
    detail: ' , , ',
    payStatus: 'DFK',
    createDate: ''
  }
]

export default {
  name: 'Charge',
	data() {
		return {
      searchFlag: 'all', //单独查询，还是全部查询，用于控制分页api
      userList: [], //用户列表
      selectedUserId: '', //选择的要查询的用户
      userListCascader: [], //用户列表
			list: [...listForm],	//	充值记录
      pageNumber: 1,
      pageSize: 10,
      total: 10
		}
	},
  computed: {
    columns () {
      return [
        { title: '序号', key: 'indexnumber', customRender: (text, record, index) => (this.pageNumber - 1) * this.pageSize +  index + 1 },
        { title: '用户', dataIndex: 'nickName', key: 'nickName' },
        { title: '金额', scopedSlots: { customRender: 'amount' }, dataIndex: 'detail', key: 'amount' },
        { title: '状态', scopedSlots: { customRender: 'payStatus' }, dataIndex: 'payStatus', key: 'payStatus' },
        { title: '类型', scopedSlots: { customRender: 'chargeType' }, dataIndex: 'detail', key: 'chargeType' },
        { title: '次数/月数', scopedSlots: { customRender: 'numbers' },  dataIndex: 'detail', key: 'numbers' },
        { title: '时间', dataIndex: 'createDate', key: 'createDate' }
      ]
    }
  },
  methods: {
    async onGetAllPayRecharge () {
      const res = await getAllPayRecharge({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        payStatus: 'YZF'
      })
      this.list = res.data.list
      this.total = res.data.total
      console.log('listres', res)
    },
    async onGetUserPayRecharge () {
      const res = await getUserPayRecharge({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        userId: this.selectedUserId,
        payStatus: 'YZF'
      })
      this.list = res.data.list
      this.total = res.data.total
      console.log('listres', res)
    },
    onTableChange (pagination) {
      this.pageNumber = pagination.current
      if (this.searchFlag === 'all') this.onGetAllPayRecharge()
      else this.onGetUserPayRecharge()
    },
    getUserlistCascader (data) {
      data.forEach(item => {
        let tempObj = {label: item.nickname, value: item.id}
        this.userListCascader.push(tempObj)
      })
      console.log('this.uerlistcassca', this.userListCascader)
    },
    onSelectChange (value, selectedOptions) {
      this.selectedUserId = value[0]
    },
    onFilter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    onChargelistByid () {
      let res
      if (this.selectedUserId) {
        this.onGetUserPayRecharge()
        this.searchFlag = 'single'
      }
      else {
        this.onGetAllPayRecharge()
        this.searchFlag = 'all'
      }
    }
  },
  mounted () {
    this.onGetAllPayRecharge()
    getAllUser().then(res => {
      this.userList = res.data
      this.getUserlistCascader(res.data)
    })
  }
}
</script>

<style scoped lang="less">
.list-container {
  width: 100%;
  min-height: 280px;
  .search-byuser {
    position: absolute;
    bottom: 15px;
    left: 10px;
  }
}
</style>