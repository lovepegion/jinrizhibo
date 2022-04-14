<template>
  <header class="main-header">
    <div class="header-content">
      <img :src="logo" alt="logo" class="header-logo">
      <!-- plus0_天气预报 -->
      <div class="plus0_bordcast">
        <Bordcast></Bordcast>
      </div>
      <div class="header-right">
        <common-header-right />
      </div>
      <!-- plus0_天气预报 -->
      <!-- <div class="plus0_tianqi">
        <Bordcast></Bordcast>
      </div> -->
    </div>
    <div class="search-content">
      <div class="search-input">
        <img :src="logo2" alt="logo" class="header-logo">
        <div class="search-wrapper" style="width: 700px;">
          <!-- 12月1日修改 -->
          <a-auto-complete class="search" v-model="searchKey" @select="onSelect" @search="onSearch" style="width: 100%;">
          <!-- <a-auto-complete class="search" @select="onSelect" style="width: 100%;"> -->
            <template slot="dataSource">
              <a-select-option v-for="item in dataSource" :key="item.title" :title="item.title" @click="changeKeyword(item.title)">
                {{ item.title }}
              </a-select-option>
            </template>
            <!-- <a-input v-model="searchKeyword">
              <a-button
                slot="suffix"
                style="margin-right: -12px"
                class="search-btn"
                size="large"
                type="primary"
                @click="showSearchList"
              >
                <a-icon type="search" />
              </a-button>
            </a-input> -->
          </a-auto-complete>
          <a-button
            class="search-btn"
            size="large"
            type="primary"
            @click="showSearchList"
          >
            <a-icon type="search" />
          </a-button>
        </div>
        <div class="hot-serach" v-show="hotSearchs.length > 0">
          <ul class="hot-serach-list">
            <li class="hot-serach-item hot-serach-item-title" style="cursor: default;"><img :src="hot" alt="hot" class="hot-icon" /> 热搜：</li>
            <li v-for="item in hotSearchs" :key="item.id" class="hot-serach-item" :title="item.keyword" @click="toSearch(item.keyword)">{{ item.keyword }}</li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import Bordcast from '@/components/utils/Bordcast.vue'
import logo from '@/assets/image/logo-white.png'
import logo2 from '@/assets/image/logo-text-white.png'
import hot from '@/assets/icon/hot.png'
import CommonHeaderRight from '../common/HeaderRight.vue'
import { getProductTitleByKeyWord, addHotSearchData } from '@/api/make'
import lodash_debounce from 'lodash.debounce'
export default {
  name: 'MainHeader',
  components: {
    CommonHeaderRight,
    Bordcast
  },
  props: {
    hotSearchs: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      logo,
      logo2,
      hot,
      searchKey: '',
      dataSource: [],
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  methods: {
    // 12月3日添加-补全关键词
    changeKeyword (newKey) {
      this.searchKey = newKey
      this._getProductTitleByKeyWord()
    },
    // 12月1日添加-返回搜索结果的id列表
    showSearchList () {
      this.$emit('getSearchList', { idLists: this.dataSource, inputSearchKey: this.searchKey })
    },
    toAddProduct() {
      this.$router.push('/product/make')
    },
    onSelect(val) {
      console.log('val', val)
    },
    onSearch(val) {
      console.log('onSearch')
      this.dataSource = []
      this.searchKey = val
      this._getProductTitleByKeyWord()
      // this.$emit('doSearch', this.searchKeyword)
    },
    logOut() {
      this.$store.commit('LOG_OUT', {})
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
    _getProductTitleByKeyWord: lodash_debounce(function() {
      const params = {
        pageNumber: 1,
        pageSize: 100,
        keyWord: this.searchKey.trim(),
      }
      console.log('paramskey', params.keyWord)
      getProductTitleByKeyWord(params).then(res => {
        console.log('keysearch', res)
        if (res.message && res.message.code === 0) {
          this.dataSource = []
          this.dataSource = [...res.data.list]
        }
      })
    }, 300),
    _addHotSearchData(id) {
      // const formData = new FormData()
      // formData.append('id	', id)
      const param = `?id=${id}`
      addHotSearchData(param)
    },
  }
}
</script>

<style lang="less">
.main-header {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 570px;
  background: url('../../assets/image/main-header.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 0px 2px 8px 0px rgba(42, 0, 1, 0.08);
  color: #fff;
  .header-content {
    flex: 0 0 auto;
    width: 1200px;
    height: 100px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    // plus0_天气预报
    .plus0_bordcast {
      position: absolute;
      top: 38px;
      left: 310px;
    }
    .header-logo {
      width: 210px;
      height: 64px;
    }
    .header-right {
      display: flex;
      align-items: center;
    }
  }
  .search-content {
    width: 1200px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    .search-input {
      width: 700px;
      // 12月1日修改
      .search-wrapper {
        display: flex;
        // padding-right: 50px;
        .search {
          width: 100%;
          box-sizing: border-box;
        }
        .search-btn {
          border-radius: 1px 16px 16px 1px;
          z-index: 2;
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
      margin-top: 20px;
      display: flex;
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
        .hot-serach-item {
          display: flex;
          align-items: center;
          margin-right: 20px;
          margin-bottom: 10px;
          cursor: pointer;
          &:hover {
            color: #ccc;
          }
        }
        .hot-serach-item-title {
          &:hover {
            color: #fff;
          }
        }
      }
    }
  }
}
.ant-select-dropdown {
  border-radius: 2px;
}
// plus0_天气预报
/* .plus0_tianqi {
  position: absolute;
  top: 41px;
  right: -20px;
} */
</style>