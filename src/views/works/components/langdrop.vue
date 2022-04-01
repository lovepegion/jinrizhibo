<template>
  <a-tree-select
    show-search
    style="width: 100%"
    v-model="choosedLangs"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择语言"
    allow-clear
    multiple
    tree-default-expand-all
    :treeDefaultExpandAll="false"
    @change="onChange"
    @search="onSearch"
    @select="onSelect"
  >
    <a-tree-select-node title="中文" :selectable="false">
      <a-tree-select-node v-for="item in chinese" :key="item" :value="item" :title="item" />
    </a-tree-select-node>
    <a-tree-select-node v-for="item in langs" :key="item" :value="item" :title="item"></a-tree-select-node>
  </a-tree-select>
</template>

<script>
export default {
  name: 'Langdrop',
  data() {
    return {
      choosedLangs: [], // 选择的语言
      chinese: ['普通话', '台湾话', '东北话', '四川话', '陕西话', '广东话', '湖南话', '河南话', '山东话', '湖北话', '安徽合肥话', '内蒙古方言'],
      langs: ['英语', '日语', '俄语', '德语', '法语', '韩语',  '泰语', '印地语', '意大利语', '西班牙语']
    }
  },
  watch: {
    // 判断选择语言的数量
    choosedLangs (newVal) {
      if (newVal.length > 3) {
        this.$nextTick(() => {
          this.choosedLangs.pop()
        })
      }
    }
  },
  methods: {
    onChange() {
      this.$emit('getSelectedLangs', this.choosedLangs, this.chinese)
    },
    onSearch() {},
    onSelect() {}
  },
};
</script>
