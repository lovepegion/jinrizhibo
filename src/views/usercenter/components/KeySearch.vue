<template>
  <div class="search-content">
      <div class="search-input">
        <div class="search-wrapper" style="width: 700px;">
          <a-auto-complete class="search" v-model="searchKey" @search="onSearch" style="width: 100%;">
            <template slot="dataSource">
              <a-select-option v-for="item in dataSource" :key="item.title" :title="item.title" @click="changeKeyword(item.title)">
                {{ item.title }}
              </a-select-option>
            </template>
          </a-auto-complete>
          <a-button
            class="search-btn"
            size="large"
            type="primary"
            @click="showSearchList"
          >
            <a-icon type="search" />
          </a-button>
          <!-- 添加成热搜词 -->
          <a-button class="addtohot" @click="onAddKeyWord">添加热搜</a-button>
        </div>
        <div class="hot-serach" v-show="hotSearchs.length > 0">
          <ul class="hot-serach-list">
            <li class="hot-serach-item hot-serach-item-title" style="cursor: default;"><img :src="hot" alt="hot" class="hot-icon" /> 热搜：</li>
            <li v-for="item in hotSearchs" :key="item.id" class="hot-serach-item" :title="item.keyword" @click="toSearch(item.keyword)"><span class="hotword">{{ item.keyword }}<span v-if="isDeleting" class="deletebutton" @click="deleteKeyword($event, item.id)">x</span></span></li>
          </ul>
          <a-button v-if="!isDeleting" @click="isDeleting=true" class="deletechange">删除热搜</a-button>
          <a-button v-else @click="isDeleting=false" class="deletechange">完成删除</a-button>
        </div>
      </div>
    </div>
</template>

<script>
import lodash_debounce from 'lodash.debounce'
import { getProductTitleByKeyWord } from '@/api/make'
import { addKeyWord, getKeyWord, removeKeyWord } from '@/api/update'
import hot from '@/assets/icon/hot.png'
export default {
  name: 'KeySearch',
  data () {
    return {
      isDeleting: false, // 正在删除热搜字
      hotSearchs: [],
      dataSource: [],
      searchKey: '',
      hot
    }
  },
  mounted () {
    this._getHotSearchData()
  },
  methods: {
    // 删除热搜词
    async deleteKeyword (event, id) {
      const key = 'updatable'
      this.$message.loading({ content: '删除...', key })
      event.stopPropagation()
      const res = await removeKeyWord(id)
      if (res.message && res.message.message === 'success') {
        this._getHotSearchData()
        this.$message.success({ content: '删除成功!', key, duration: 1})
      }
    },
    // 获取热搜词
    async _getHotSearchData() {
      const res = await getKeyWord()
      if (res.message && res.message.code === 0) {
        this.hotSearchs = res.data.list
      }
    },
    // 添加热搜词
    /* async onAddKeyWord () {
      const res = await addKeyWord(this.searchKey)
      if (res.message && res.message.message === 'success') {
        this._getHotSearchData()
      }
      this.searchKey = ''
    }, */
    /* async onAddKeyWord () {
      const hide = this.$message.loading('添加中..', 0)
      const res = await addKeyWord(this.searchKey)
      if (res.message && res.message.message === 'success') {
        this._getHotSearchData()
        setTimeout(hide, 300)
      }
      this.searchKey = ''
    }, */
    async onAddKeyWord () {
      const key = 'updatable'
      this.$message.loading({ content: '添加中...', key })
      const res = await addKeyWord(this.searchKey)
      if (res.message && res.message.message === 'success') {
        this._getHotSearchData()
        this.$message.success({ content: '添加成功!', key, duration: 1})
      }
      this.searchKey = ''
    },
    async toSearch(keyword) {
      this.searchKey = keyword
      /* this._addHotSearchData(id)
      window.open(`/product/detail/${id}`, '_blank') */
      const res = await getProductTitleByKeyWord({
        pageNumber: 1,
        pageSize: 100,
        keyWord: keyword.trim(),
      })
      if (res.message && res.message.code === 0) {
        this.dataSource = []
        this.dataSource = [...res.data.list]
      }
      this.showSearchList()
    },
    showSearchList () {
      this.$emit('getSearchList', { idLists: this.dataSource, inputSearchKey: this.searchKey })
    },
    // 12月3日添加-补全关键词
    changeKeyword (newKey) {
      this.keyword = newKey
      getProductTitleByKeyWord({
        pageNumber: 1,
        pageSize: 100,
        keyWord: newKey.trim(),
      }).then(res => {
        if (res.message && res.message.code === 0) {
          this.dataSource = []
          this.dataSource = [...res.data.list]
        }
      })
    },
    onSearch(val) {
      // console.log('onSearch')
      this.dataSource = []
      this.searchKey = val
      this._getProductTitleByKeyWord()
      // this.$emit('doSearch', this.searchKeyword)
    },
    _getProductTitleByKeyWord: lodash_debounce(function() {
      const params = {
        pageNumber: 1,
        pageSize: 100,
        keyWord: this.searchKey.trim(),
      }
      // console.log('paramskey', params.keyWord)
      getProductTitleByKeyWord(params).then(res => {
        // console.log('keysearch', res)
        if (res.message && res.message.code === 0) {
          this.dataSource = []
          this.dataSource = [...res.data.list]
        }
      })
    }, 300)
  }
}
</script>

<style scoped lang="less">
.search-content {
    background-color: #2e2985;
    color: #fff;
    border-radius: 20px;
    width: 790px;
    height: 60px;
    margin: 20px auto;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    .search-input {
      width: 700px;
      // 12月1日修改
      .search-wrapper {
        margin-top: 10px;
        display: flex;
        // padding-right: 50px;
        .search {
          width: 100%;
          box-sizing: border-box;
        }
        .search-btn {
          height: 33px;
          margin-left: -10px;
          border-radius: 1px 16px 16px 1px;
          z-index: 2;
        }
        .addtohot {
          margin-left: 4px;
          color: black;
          font-size: 14px;
        }
      }
      .ant-input {
        height: 40px;
      }
      .search.ant-select-auto-complete .ant-select-selection--single {
        height: 40px;
        margin-right: -46px;
      }
      .ant-select-combobox .ant-select-search--inline {
        height: 40px;
      }
      .search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input:not(:last-child) {
        padding-right: 62px;
      }
      .search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .search-item {
        display: flex;
      }
      .search-item-desc {
        flex: auto;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .search-item-count {
        flex: none;
      }
    }
    .header-logo {
      width: 307px;
      height: 70px;
      margin-bottom: 61px;
    }
    .hot-serach {
      margin-top: 10px;
      display: flex;
      position: relative;
      .hot-icon {
        width: 24px;
        height: 24px;
        margin-right: 4px;
      }
      .hot-serach-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        word-break: break-all;
        width: 80%;
        .hot-serach-item {
          display: flex;
          align-items: center;
          margin-right: 10px;
          margin-bottom: 10px;
          .hotword {
            padding: 4px;
            background-color: #ccc;
            color: rgb(82, 79, 79);
            position: relative;
            cursor: default;
            &:hover {
              color: black;
              background-color: rgb(197, 194, 194);
            }
            .deletebutton {
              width: 15px;
              height: 15px;
              border-radius: 50%;
              background-color: red;
              cursor: pointer;
              font-size: 12px;
              line-height: 15px;
              color: #fff;
              position: absolute;
              top: -5px;
              right: -5px;
            }
          }
          /* &:hover {
            color: #ccc;
          } */
        }
        .hot-serach-item-title {
          &:hover {
            color: #fff;
          }
        }
      }
      .deletechange {
        position: absolute;
        top: -5px;
        right: 0;
      }
    }
  }
</style>