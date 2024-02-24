<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="height: 48px; padding: 10px" bordered>
      <div style="display: flex">
        <n-h3 style="flex: 1">待出库列表 ({{ 24 }})</n-h3>
        <div>
          <n-tag :bordered="false" type="warning" round>
            <template #icon>
              <n-icon :component="Forklift" />
            </template>
            <span>4号叉车</span>
          </n-tag>
        </div>
      </div>
    </n-layout-header>
    <n-layout position="absolute" style="top: 48px" has-sider>
      <n-layout-sider content-style="padding: 10px;" :native-scrollbar="false" bordered>
        <template v-for="item in 24" :key="item">
          <n-card
            :class="[{ 'tab-item': currentItem === item }]"
            :title="`出库指令单: ${item}`"
            size="small"
            style="margin-bottom: 6px"
            @click="setCurrentItem(item)"
          >
          </n-card>
        </template>
      </n-layout-sider>
      <n-layout content-style="padding: 10px;" :native-scrollbar="false">
        <OrderDetail :order-no="currentItem" />
      </n-layout>
    </n-layout>
  </n-layout>
</template>
<script setup>
import { ref } from "vue";
import {
  NButton,
  NCard,
  NIcon,
  NH3,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NTag,
} from "naive-ui";
import { Forklift } from "@vicons/tabler";
import OrderDetail from "./OrderDetail.vue";

const currentItem = ref(null);

function setCurrentItem(item) {
  currentItem.value = item;
}
</script>

<style lang="less" scope>
.tab-item {
  box-sizing: border-box;
  border: 1px solid #309bff !important;
  box-shadow: 0 0 0 3px rgba(63, 114, 255, 0.3);
}
</style>
