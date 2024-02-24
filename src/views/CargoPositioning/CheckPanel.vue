<template>
  <div class="check-panel">
    <n-layout style="height: 100%" has-sider>
      <n-layout-sider
        width="60px"
        content-style="padding: 4px;"
        :native-scrollbar="false"
        bordered
      >
        <template v-for="item in 24" :key="item">
          <div :class="['sider-item']">{{ charactersArray[item - 1] }}</div>
        </template>
      </n-layout-sider>
      <n-layout content-style="padding: 4px;" :native-scrollbar="false">
        <n-data-table size="small" :columns="columns" :data="data" :max-height="160" />
      </n-layout>
    </n-layout>
  </div>
</template>
<script setup>
import { h, ref } from "vue";
import { NCheckbox, NDataTable, NSwitch, NLayout, NLayoutSider } from "naive-ui";
const charactersArray = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const data = ref([
  {
    vat: "DF-24000381",
    no: "20230316001",
    qty: 20,
    position: "A-1-1",
  },
  {
    vat: "DF-24000381",
    no: "20230316002",
    qty: 20,
    position: "A-1-1",
  },
  {
    vat: "DF-24000381",
    no: "20230316003",
    qty: 20,
    position: "A-1-2",
  },
  {
    vat: "DF-24000381",
    no: "20230316004",
    qty: 20,
    position: "A-1-3",
  },
  {
    vat: "DF-24000381",
    no: "20230316005",
    qty: 20,
    position: "A-1-3",
  },
  {
    vat: "DF-24000381",
    no: "20230316006",
    qty: 20,
    position: "A-1-2",
  },
  {
    vat: "DF-24000381",
    no: "20230316007",
    qty: 20,
    position: "A-1-2",
  },
]);
const columns = ref([
  //   {
  //     title: "缸号",
  //     key: "vat",
  //   },
  {
    title: "布票号",
    key: "no",
  },
  {
    title: "数量",
    key: "qty",
    width: 60,
  },
  {
    title: "货位号",
    key: "position",
    width: 60,
  },
  {
    title: "状态",
    key: "isChecked",
    width: 60,
    render(row, index) {
      return h(NCheckbox, {
        value: row.isChecked,
        size: "large",
        onUpdateChecked(v) {
          data.value[index].isChecked = v;
        },
      });
    },
  },
]);
</script>
<style lang="less" scoped>
.check-panel {
  position: fixed;
  top: 70px;
  left: 10px;
  width: 450px;
  height: 210px;
  // background-color: rgba(255, 255, 255, 0.3);
  // backdrop-filter: blur(8px);
  border-radius: 8px;
  box-sizing: border-box;
  // outline: 1px solid #f1f1f1;
  z-index: 1;
  overflow: hidden;
}

.sider-item {
  box-sizing: border-box;
  padding: 0 4px;
  margin-bottom: 4px;
  border-radius: 4px;
  border: 1px solid #f1f1f1;
  background-color: #ffffff;
  text-align: center;
}
</style>
